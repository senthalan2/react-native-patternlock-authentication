import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder,
  Dimensions,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
  type GestureResponderEvent,
  type PanResponderGestureState,
  type ColorValue,
} from 'react-native';

import Svg, { Line, Circle } from 'react-native-svg';

import {
  populateDotsCoordinate,
  getDotIndex,
  getIntermediateDotIndexes,
  getCorrectPatterninArray,
} from './Helpers';

const { width, height } = Dimensions.get('window');

type Coordinate = {
  x: number;
  y: number;
};

interface Props {
  containerDimension: number;
  containerWidth: number;
  containerHeight: number;
  correctPattern: string;
  wrongPatternDelayTime: number;
  correctPatternDelayTime: number;
  dotsAndLineColor: ColorValue;
  wrongPatternColor: ColorValue;
  lineStrokeWidth: number;
  defaultDotRadius: number;
  snapDotRadius: number;
  snapDuration: number;
  enableHint: boolean;
  hint: string;
  hintContainerStyle?: StyleProp<ViewStyle>;
  hintTextStyle?: StyleProp<TextStyle>;
  matchedPatternColor: ColorValue;
  onPatternMatch?: (pattern: Coordinate[]) => void;
  onWrongPattern?: (pattern: Coordinate[]) => void;
  onPatternMatchAfterDelay?: (pattern: Coordinate[]) => void;
  onWrongPatternAfterDelay?: (pattern: Coordinate[]) => void;
}

interface State {
  activeDotCoordinate: Coordinate | null | undefined;
  initialGestureCoordinate: Coordinate | null | undefined;
  pattern: (Coordinate | undefined)[];
  showError: boolean;
  disableTouch: boolean;
  matched: boolean;
}

export default class GeneralPatternLock extends React.Component<Props, State> {
  private _panResponder: any;
  private _activeLine: Line | null = null;
  private _dots: Coordinate[] = [];
  private _dotNodes: Array<Circle | null> = [];
  private _mappedDotsIndex: Coordinate[] = [];
  private _snapAnimatedValues: Animated.Value[] = [];
  private _resetTimeout?: NodeJS.Timeout;

  static defaultProps: Partial<Props> = {
    containerDimension: 3,
    containerWidth: width,
    containerHeight: height / 2,
    enableHint: false,
    hint: '',
    wrongPatternDelayTime: 1000,
    correctPatternDelayTime: 0,
    dotsAndLineColor: 'blue',
    wrongPatternColor: 'red',
    lineStrokeWidth: 5,
    defaultDotRadius: 6,
    snapDotRadius: 10,
    snapDuration: 100,
    matchedPatternColor: 'green',
    hintTextStyle: { color: '#000000' },
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      initialGestureCoordinate: null,
      activeDotCoordinate: null,
      pattern: [],
      showError: false,
      disableTouch: false,
      matched: false,
    };

    const { containerDimension, containerWidth, containerHeight } = props;

    const { screenCoordinates, mappedIndex } = populateDotsCoordinate(
      containerDimension,
      containerWidth,
      containerHeight
    );

    this._dots = screenCoordinates;
    this._mappedDotsIndex = mappedIndex;

    this._snapAnimatedValues = this._dots.map((_, index) => {
      const animatedValue = new Animated.Value(props.defaultDotRadius);

      animatedValue.addListener(({ value }) => {
        const dotNode = this._dotNodes[index];
        dotNode?.setNativeProps({ r: value.toString() });
      });

      return animatedValue;
    });

    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: () => !this.state.disableTouch,

      onPanResponderGrant: (e: GestureResponderEvent) => {
        const { locationX, locationY } = e.nativeEvent;

        const activeDotIndex = getDotIndex(
          { x: locationX, y: locationY },
          this._dots
        );

        if (activeDotIndex != null) {
          const activeDotCoordinate = this._dots[activeDotIndex];
          const firstDot = this._mappedDotsIndex[activeDotIndex];
          const dotWillSnap = this._snapAnimatedValues[activeDotIndex];

          this.setState(
            {
              activeDotCoordinate,
              initialGestureCoordinate: activeDotCoordinate,
              pattern: [firstDot],
            },
            () => {
              this._snapDot(dotWillSnap);
            }
          );
        }
      },

      onPanResponderMove: (
        _e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        const { dx, dy } = gestureState;
        const { initialGestureCoordinate, activeDotCoordinate, pattern } =
          this.state;

        if (!activeDotCoordinate || !initialGestureCoordinate) {
          return;
        }

        const endGestureX = initialGestureCoordinate.x + dx;
        const endGestureY = initialGestureCoordinate.y + dy;

        const matchedDotIndex = getDotIndex(
          { x: endGestureX, y: endGestureY },
          this._dots
        );

        const matchedDot =
          matchedDotIndex != null && this._mappedDotsIndex[matchedDotIndex];

        if (
          matchedDotIndex != null &&
          matchedDot &&
          !this._isAlreadyInPattern(matchedDot)
        ) {
          const newPattern = {
            x: matchedDot.x,
            y: matchedDot.y,
          };

          let intermediateDotIndexes: number[] = [];

          if (pattern.length > 0) {
            intermediateDotIndexes = getIntermediateDotIndexes(
              pattern[pattern.length - 1],
              newPattern,
              this.props.containerDimension
            );
          }

          const filteredIntermediateDotIndexes = intermediateDotIndexes.filter(
            (index) => !this._isAlreadyInPattern(this._mappedDotsIndex[index])
          );

          filteredIntermediateDotIndexes.forEach((index) => {
            const mappedDot = this._mappedDotsIndex[index];
            if (mappedDot) {
              pattern.push({ x: mappedDot?.x, y: mappedDot?.y });
            }
          });

          pattern.push(newPattern);

          const animateIndexes = [
            ...filteredIntermediateDotIndexes,
            matchedDotIndex,
          ];

          this.setState(
            {
              pattern,
              activeDotCoordinate: this._dots[matchedDotIndex],
            },
            () => {
              if (animateIndexes.length) {
                animateIndexes.forEach((index) => {
                  this._snapDot(this._snapAnimatedValues[index]);
                });
              }
            }
          );
        } else {
          this._activeLine?.setNativeProps({
            x2: endGestureX.toString(),
            y2: endGestureY.toString(),
          });
        }
      },

      onPanResponderRelease: () => {
        const { pattern } = this.state;

        if (!pattern.length) return;

        if (this._isPatternMatched(pattern)) {
          this.setState(
            {
              initialGestureCoordinate: null,
              activeDotCoordinate: null,
              disableTouch: true,
              matched: true,
            },
            () => {
              if (this.props.onPatternMatch) {
                this.props.onPatternMatch(pattern as Coordinate[]);
              }

              this._resetTimeout = setTimeout(() => {
                this.setState(
                  {
                    showError: false,
                    matched: false,
                    disableTouch: false,
                    pattern: [],
                  },
                  () => {
                    if (this.props.onPatternMatchAfterDelay) {
                      this.props.onPatternMatchAfterDelay(
                        pattern as Coordinate[]
                      );
                    }
                  }
                );
              }, this.props.correctPatternDelayTime);
            }
          );
        } else {
          this.setState(
            {
              initialGestureCoordinate: null,
              activeDotCoordinate: null,
              showError: true,
              disableTouch: true,
            },
            () => {
              if (this.props.onWrongPattern) {
                this.props.onWrongPattern(pattern as Coordinate[]);
              }

              this._resetTimeout = setTimeout(() => {
                this.setState(
                  {
                    showError: false,
                    disableTouch: false,
                    pattern: [],
                  },
                  () => {
                    if (this.props.onWrongPatternAfterDelay) {
                      this.props.onWrongPatternAfterDelay(
                        pattern as Coordinate[]
                      );
                    }
                  }
                );
              }, this.props.wrongPatternDelayTime);
            }
          );
        }
      },
    });
  }

  componentWillUnmount() {
    if (this._resetTimeout) {
      clearTimeout(this._resetTimeout);
    }
  }

  private _isAlreadyInPattern(coordinate: Coordinate | undefined) {
    return (
      this.state.pattern.find(
        (dot) => dot?.x === coordinate?.x && dot?.y === coordinate?.y
      ) != null
    );
  }

  private _isPatternMatched(currentPattern: (Coordinate | undefined)[]) {
    const correctPatternArray = getCorrectPatterninArray(
      this.props.correctPattern
    );

    if (currentPattern.length !== correctPatternArray.length) {
      return false;
    }

    for (let i = 0; i < currentPattern.length; i++) {
      const correctDot = correctPatternArray[i];
      const currentDot = currentPattern[i];

      if (correctDot?.x !== currentDot?.x || correctDot?.y !== currentDot?.y) {
        return false;
      }
    }

    return true;
  }

  private _snapDot(animatedValue: Animated.Value | undefined) {
    if (!animatedValue) {
      return;
    }
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: this.props.snapDotRadius,
        duration: this.props.snapDuration,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValue, {
        toValue: this.props.defaultDotRadius,
        duration: this.props.snapDuration,
        useNativeDriver: false,
      }),
    ]).start();
  }

  render() {
    const { containerHeight, containerWidth } = this.props;
    const { activeDotCoordinate, pattern, showError, matched } = this.state;

    return (
      <View style={styles.container}>
        {this.props.enableHint && (
          <View style={this.props.hintContainerStyle}>
            <Text style={this.props.hintTextStyle}>{this.props.hint}</Text>
          </View>
        )}

        <Animated.View {...this._panResponder.panHandlers}>
          <Svg height={containerHeight} width={containerWidth}>
            {this._dots.map((dot, i) => {
              const mappedDot = this._mappedDotsIndex[i];
              const isIncludedInPattern = pattern.find(
                (d) => d?.x === mappedDot?.x && d?.y === mappedDot?.y
              );

              return (
                <Circle
                  // @ts-ignore
                  ref={(circle) => (this._dotNodes[i] = circle)}
                  key={i}
                  cx={dot.x}
                  cy={dot.y}
                  r={this.props.defaultDotRadius}
                  fill={
                    matched && isIncludedInPattern
                      ? this.props.matchedPatternColor
                      : showError && isIncludedInPattern
                        ? this.props.wrongPatternColor
                        : this.props.dotsAndLineColor
                  }
                />
              );
            })}

            {pattern.map((startCoordinate, index) => {
              if (index === pattern.length - 1) return null;

              const startIndex = this._mappedDotsIndex.findIndex(
                (dot) =>
                  dot.x === startCoordinate?.x && dot.y === startCoordinate?.y
              );

              const endCoordinate = pattern[index + 1];

              const endIndex = this._mappedDotsIndex.findIndex(
                (dot) =>
                  dot.x === endCoordinate?.x && dot.y === endCoordinate?.y
              );

              if (startIndex < 0 || endIndex < 0) return null;

              const actualStartDot = this._dots[startIndex];
              const actualEndDot = this._dots[endIndex];

              return (
                <Line
                  key={`fixedLine${index}`}
                  x1={actualStartDot?.x}
                  y1={actualStartDot?.y}
                  x2={actualEndDot?.x}
                  y2={actualEndDot?.y}
                  stroke={
                    matched
                      ? this.props.matchedPatternColor
                      : showError
                        ? this.props.wrongPatternColor
                        : this.props.dotsAndLineColor
                  }
                  strokeWidth={this.props.lineStrokeWidth}
                />
              );
            })}

            {activeDotCoordinate && (
              <Line
                // @ts-ignore
                ref={(component) => (this._activeLine = component)}
                x1={activeDotCoordinate.x}
                y1={activeDotCoordinate.y}
                x2={activeDotCoordinate.x}
                y2={activeDotCoordinate.y}
                stroke={this.props.dotsAndLineColor}
                strokeWidth={this.props.lineStrokeWidth}
              />
            )}
          </Svg>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
