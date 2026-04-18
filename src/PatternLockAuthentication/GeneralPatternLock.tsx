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
  type PanResponderInstance,
} from 'react-native';

import Svg, { Line, Circle } from 'react-native-svg';

import {
  populateDotsCoordinate,
  getDotIndex,
  getIntermediateDotIndexes,
  getCorrectPatterninArray,
} from './Helpers';

const { width, height } = Dimensions.get('window');

/**
 * Represents a coordinate point with x and y values
 */
export type Coordinate = {
  x: number;
  y: number;
};

/**
 * Props for GeneralPatternLock component
 */
interface Props {
  // Container configuration
  containerDimension: number;
  containerWidth: number;
  containerHeight: number;

  // Pattern configuration
  correctPattern: string;

  // Timing configuration
  wrongPatternDelayTime: number;
  correctPatternDelayTime: number;

  // Visual configuration
  dotsAndLineColor: ColorValue;
  wrongPatternColor: ColorValue;
  lineStrokeWidth: number;
  defaultDotRadius: number;
  snapDotRadius: number;
  snapDuration: number;
  matchedPatternColor: ColorValue;

  // Hint configuration
  enableHint: boolean;
  hint: string;
  hintContainerStyle?: StyleProp<ViewStyle>;
  hintTextStyle?: StyleProp<TextStyle>;

  // Callbacks
  onPatternMatch?: (pattern: Coordinate[]) => void;
  onWrongPattern?: (pattern: Coordinate[]) => void;
  onPatternMatchAfterDelay?: (pattern: Coordinate[]) => void;
  onWrongPatternAfterDelay?: (pattern: Coordinate[]) => void;
}

interface State {
  activeDotCoordinate: Coordinate | null;
  initialGestureCoordinate: Coordinate | null;
  pattern: Coordinate[];
  showError: boolean;
  disableTouch: boolean;
  matched: boolean;
}

export default class GeneralPatternLock extends React.Component<Props, State> {
  private _panResponder!: PanResponderInstance;
  private _activeLine: Line | null = null;
  private _dots: Coordinate[] = [];
  private _dotNodes: Array<Circle | null> = [];
  private _mappedDotsIndex: Coordinate[] = [];
  private _snapAnimatedValues: Animated.Value[] = [];
  private _resetTimeout?: ReturnType<typeof setTimeout>;

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

    this._createPanResponder();
  }

  /**
   * Create and configure the pan responder for gesture handling
   */
  private _createPanResponder(): void {
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: () => !this.state.disableTouch,

      onPanResponderGrant: (e: GestureResponderEvent) => {
        this._handleGestureGrant(e);
      },

      onPanResponderMove: (
        _e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        this._handleGestureMove(gestureState);
      },

      onPanResponderRelease: () => {
        this._handleGestureRelease();
      },
    });
  }

  /**
   * Handle the start of a gesture (finger touches down on a dot)
   */
  private _handleGestureGrant(e: GestureResponderEvent): void {
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
          activeDotCoordinate: activeDotCoordinate ?? null,
          initialGestureCoordinate: activeDotCoordinate ?? null,
          pattern: firstDot ? [firstDot] : [],
        },
        () => {
          this._snapDot(dotWillSnap);
        }
      );
    }
  }

  /**
   * Handle gesture movement to draw the pattern
   * Fixes the line rendering issue by ensuring the line is always visible
   */
  private _handleGestureMove(gestureState: PanResponderGestureState): void {
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
      // Dot matched - add to pattern
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
          pattern.push({ x: mappedDot.x, y: mappedDot.y });
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
          activeDotCoordinate: this._dots[matchedDotIndex] ?? null,
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
      // No dot match - update the active line to follow the finger
      // FIX: Always ensure the line updates correctly
      if (this._activeLine) {
        this._activeLine.setNativeProps({
          x2: endGestureX.toString(),
          y2: endGestureY.toString(),
        });
      }
    }
  }

  /**
   * Handle the end of a gesture (finger lifts up)
   */
  private _handleGestureRelease(): void {
    const { pattern } = this.state;

    if (!pattern.length) return;

    if (this._isPatternMatched(pattern)) {
      this._handlePatternMatch();
    } else {
      this._handlePatternMismatch();
    }
  }

  /**
   * Handle successful pattern match
   */
  private _handlePatternMatch(): void {
    const { pattern } = this.state;

    this.setState(
      {
        initialGestureCoordinate: null,
        activeDotCoordinate: null,
        disableTouch: true,
        matched: true,
      },
      () => {
        if (this.props.onPatternMatch) {
          this.props.onPatternMatch(pattern);
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
                this.props.onPatternMatchAfterDelay(pattern);
              }
            }
          );
        }, this.props.correctPatternDelayTime);
      }
    );
  }

  /**
   * Handle pattern mismatch
   */
  private _handlePatternMismatch(): void {
    const { pattern } = this.state;

    this.setState(
      {
        initialGestureCoordinate: null,
        activeDotCoordinate: null,
        showError: true,
        disableTouch: true,
      },
      () => {
        if (this.props.onWrongPattern) {
          this.props.onWrongPattern(pattern);
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
                this.props.onWrongPatternAfterDelay(pattern);
              }
            }
          );
        }, this.props.wrongPatternDelayTime);
      }
    );
  }

  componentWillUnmount(): void {
    if (this._resetTimeout) {
      clearTimeout(this._resetTimeout);
    }
  }

  /**
   * Check if a coordinate is already part of the current pattern
   */
  private _isAlreadyInPattern(coordinate: Coordinate | undefined): boolean {
    return this.state.pattern.some(
      (dot) => dot.x === coordinate?.x && dot.y === coordinate?.y
    );
  }

  /**
   * Check if the current pattern matches the correct pattern
   */
  private _isPatternMatched(currentPattern: Coordinate[]): boolean {
    const correctPatternArray = getCorrectPatterninArray(
      this.props.correctPattern
    );

    if (currentPattern.length !== correctPatternArray.length) {
      return false;
    }

    for (let i = 0; i < currentPattern.length; i++) {
      const correctDot = correctPatternArray[i];
      const currentDot = currentPattern[i];

      if (
        !correctDot ||
        !currentDot ||
        correctDot.x !== currentDot.x ||
        correctDot.y !== currentDot.y
      ) {
        return false;
      }
    }

    return true;
  }

  /**
   * Animate a dot snap effect
   */
  private _snapDot(animatedValue: Animated.Value | undefined): void {
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
              if (!mappedDot) return null;

              const isIncludedInPattern = pattern.find(
                (d) => d.x === mappedDot.x && d.y === mappedDot.y
              );

              return (
                <Circle
                  ref={(circle) => {
                    this._dotNodes[i] = circle;
                  }}
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
                  dot.x === startCoordinate.x && dot.y === startCoordinate.y
              );

              const endCoordinate = pattern[index + 1];
              if (!endCoordinate) return null;

              const endIndex = this._mappedDotsIndex.findIndex(
                (dot) => dot.x === endCoordinate.x && dot.y === endCoordinate.y
              );

              if (startIndex < 0 || endIndex < 0) return null;

              const actualStartDot = this._dots[startIndex];
              const actualEndDot = this._dots[endIndex];

              if (!actualStartDot || !actualEndDot) return null;

              return (
                <Line
                  key={`fixedLine${index}`}
                  x1={actualStartDot.x}
                  y1={actualStartDot.y}
                  x2={actualEndDot.x}
                  y2={actualEndDot.y}
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
                ref={(component) => {
                  this._activeLine = component;
                }}
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
