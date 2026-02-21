import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder,
  Vibration,
  Dimensions,
  StyleProp,
  ViewStyle,
  TextStyle,
  ColorValue,
} from 'react-native';

import Svg, { Line, Circle } from 'react-native-svg';

import {
  populateDotsCoordinate,
  getDotIndex,
  getIntermediateDotIndexes,
  getCorrectPatterninString,
  getCorrectPatterninArray,
} from './Helpers';
import { PatternProcess } from './PatternProcess';

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
  processName: PatternProcess;
  isChangePattern: boolean;
  showHintMessage: boolean;
  dotRadius: number;
  dotsColor: ColorValue;
  movingLineColor: ColorValue;
  snapDotRadius: number;
  lineStrokeWidth: number;
  activeLineColor: ColorValue;
  wrongPatternColor: ColorValue;
  snapDuration: number;
  connectedDotsColor: ColorValue;
  correctPatternColor: ColorValue;
  minPatternLength: number;
  newPatternConfirmationMessage: string;
  wrongPatternDelayTime: number;
  correctPatternMessage: string;
  correctPatternDelayTime: number;
  correctPatternDelayDurationMessage: string;
  iswrongPatternCountLimited: boolean;
  totalWrongPatternCount: number;
  wrongPatternDelayDurationMessage: string;
  minPatternLengthErrorMessage: string;
  wrongPatternMessage: string;
  changePatternFirstMessage: string;
  changePatternDelayTime: number;
  changePatternSecondMessage: string;
  isEnableHeadingText: boolean;
  enableDotsJoinViration: boolean;
  vibrationPattern: number[];
  headingText: string;
  enablePatternNotSameCondition: boolean;
  patternTotalCountReachedErrorMessage: string;
  newPatternDelayDurationMessage: string;
  newPatternMatchedMessage: string;
  newPatternDelayTime: number;
  patternCountLimitedErrorMessage: string;
  samePatternMatchedMessage: string;
  hintTextStyle?: StyleProp<TextStyle>;
  headingTextStyle?: StyleProp<TextStyle>;
  hintTextContainerStyle?: StyleProp<ViewStyle>;
  onPatternMatch?: (pattern: Coordinate[]) => void;
  onWrongPattern?: (pattern: Coordinate[], remainingCount: number) => void;
  onPatternMatchAfterDelay?: (pattern: Coordinate[]) => void;
  onWrongPatternAfterDelay?: (
    pattern: Coordinate[],
    remainingCount: number
  ) => void;
}

interface State {
  activeDotCoordinate: Coordinate | null | undefined;
  initialGestureCoordinate: Coordinate | null | undefined;
  pattern: Array<Coordinate>;
  correctPattern: Array<Coordinate> | null;
  showError: boolean;
  showHint: boolean;
  hintText: String;
  matched: boolean;
  changePatternConfirm: boolean;
  processName: PatternProcess;
}

export default class FeaturedPatternLock extends React.Component<Props, State> {
  private _panResponder: any;
  private _activeLine: Line | null = null;
  private _dots: Coordinate[] = [];
  private _dotNodes: Array<Circle | null> = [];
  private _mappedDotsIndex: Coordinate[] = [];
  private _snapAnimatedValues: Animated.Value[] = [];
  private _resetTimeout?: NodeJS.Timeout;
  private _patternMatchedTimeout?: NodeJS.Timeout;

  static defaultProps: Partial<Props> = {
    containerDimension: 3,
    containerWidth: width,
    containerHeight: height / 2,
    processName: PatternProcess.NEW_PATTERN,
    isChangePattern: false,
    enableDotsJoinViration: false,
    showHintMessage: false,
    dotRadius: 10,
    vibrationPattern: [0, 200],
    dotsColor: 'red',
    movingLineColor: 'blue',
    snapDotRadius: 15,
    lineStrokeWidth: 6,
    activeLineColor: 'blue',
    wrongPatternColor: 'red',
    snapDuration: 100,
    connectedDotsColor: 'blue',
    correctPatternColor: 'green',
    minPatternLength: 3,
    newPatternConfirmationMessage: '',
    wrongPatternDelayTime: 1000,
    correctPatternMessage: '',
    correctPatternDelayTime: 1000,
    correctPatternDelayDurationMessage: '',
    iswrongPatternCountLimited: false,
    totalWrongPatternCount: 0,
    wrongPatternDelayDurationMessage: '',
    minPatternLengthErrorMessage: '',
    wrongPatternMessage: '',
    changePatternFirstMessage: '',
    changePatternDelayTime: 1000,
    changePatternSecondMessage: '',
    isEnableHeadingText: false,
    headingText: '',
    enablePatternNotSameCondition: true,
    patternTotalCountReachedErrorMessage: '',
    newPatternDelayDurationMessage: '',
    newPatternMatchedMessage: '',
    newPatternDelayTime: 1000,
    patternCountLimitedErrorMessage: '',
    samePatternMatchedMessage: '',
    hintTextStyle: { color: 'blue' },
    headingTextStyle: { color: 'blue' },
    hintTextContainerStyle: {
      alignItems: 'center',
    },
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      initialGestureCoordinate: null,
      activeDotCoordinate: null,
      pattern: [],
      correctPattern: this.props.correctPattern
        ? getCorrectPatterninArray(this.props.correctPattern)
        : null,
      showError: false,
      showHint: false,
      hintText: '',
      matched: false,
      changePatternConfirm: false,
      processName: this.props.processName,
    };

    let { containerDimension, containerWidth, containerHeight } = this.props;

    let { screenCoordinates, mappedIndex } = populateDotsCoordinate(
      containerDimension,
      containerWidth,
      containerHeight
    );
    this._dots = screenCoordinates;
    this._mappedDotsIndex = mappedIndex;
    this._dotNodes = [];

    var WRONGPATTERN_TOTAL_COUNT = this.props.totalWrongPatternCount;

    this._snapAnimatedValues = this._dots.map((dot, index) => {
      let animatedValue = new Animated.Value(this.props.dotRadius);
      animatedValue.addListener(({ value }) => {
        let dotNode = this._dotNodes[index];
        dotNode && dotNode.setNativeProps({ r: value.toString() });
      });
      return animatedValue;
    });

    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: () => !this.state.showError,

      onPanResponderGrant: (e) => {
        let { locationX, locationY } = e.nativeEvent;

        let activeDotIndex = getDotIndex(
          { x: locationX, y: locationY },
          this._dots
        );

        if (this.props.enableDotsJoinViration) {
          Vibration.cancel();
        }

        if (activeDotIndex != null) {
          if (this.props.enableDotsJoinViration) {
            Vibration.vibrate(this.props.vibrationPattern);
          }
          let activeDotCoordinate = this._dots[activeDotIndex];
          let firstDot = this._mappedDotsIndex[activeDotIndex];
          let dotWillSnap = this._snapAnimatedValues[activeDotIndex];
          this.setState(
            {
              activeDotCoordinate,
              initialGestureCoordinate: activeDotCoordinate,
              pattern: [firstDot],
              matched: false,
            },
            () => {
              this._snapDot(dotWillSnap);
            }
          );
        }
      },
      onPanResponderMove: (e, gestureState) => {
        let { dx, dy } = gestureState;
        let { initialGestureCoordinate, activeDotCoordinate, pattern } =
          this.state;

        if (activeDotCoordinate == null || initialGestureCoordinate == null) {
          return;
        }

        let endGestureX = initialGestureCoordinate.x + dx;
        let endGestureY = initialGestureCoordinate.y + dy;

        let matchedDotIndex = getDotIndex(
          { x: endGestureX, y: endGestureY },
          this._dots
        );

        let matchedDot =
          matchedDotIndex != null && this._mappedDotsIndex[matchedDotIndex];

        if (
          matchedDotIndex != null &&
          matchedDot &&
          !this._isAlreadyInPattern(matchedDot)
        ) {
          let newPattern = {
            x: matchedDot.x,
            y: matchedDot.y,
          };

          let intermediateDotIndexes: number[] = [];
          if (this.props.enableDotsJoinViration) {
            Vibration.vibrate(this.props.vibrationPattern);
          }
          if (pattern.length > 0) {
            intermediateDotIndexes = getIntermediateDotIndexes(
              pattern[pattern.length - 1],
              newPattern,
              this.props.containerDimension
            );
          }

          let filteredIntermediateDotIndexes = intermediateDotIndexes.filter(
            (index) => !this._isAlreadyInPattern(this._mappedDotsIndex[index])
          );

          filteredIntermediateDotIndexes.forEach((index) => {
            let mappedDot = this._mappedDotsIndex[index];
            pattern.push({ x: mappedDot.x, y: mappedDot.y });
          });

          pattern.push(newPattern);

          let animateIndexes = [
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
          this._activeLine &&
            this._activeLine.setNativeProps({
              x2: endGestureX.toString(),
              y2: endGestureY.toString(),
            });
        }
      },
      onPanResponderRelease: () => {
        let { pattern, processName } = this.state;
        if (pattern.length) {
          if (processName === PatternProcess.CONFIRM_PATTERN) {
            if (this._isPatternMatched(pattern)) {
              if (!this.props.isChangePattern) {
                WRONGPATTERN_TOTAL_COUNT = this.props.totalWrongPatternCount;
                this.setState(
                  {
                    initialGestureCoordinate: null,
                    activeDotCoordinate: null,
                    matched: true,
                    showError: true,
                    showHint: true,
                    hintText: this.props.correctPatternDelayDurationMessage,
                  },
                  () => {
                    this.props.onPatternMatch?.(pattern);
                    this._patternMatchedTimeout = setTimeout(() => {
                      this.setState({
                        showHint: true,
                        showError: false,
                        hintText: this.props.correctPatternMessage,
                        matched: false,
                        pattern: [],
                      });

                      if (this.props.onPatternMatchAfterDelay) {
                        this.props.onPatternMatchAfterDelay(pattern);
                      }
                    }, this.props.correctPatternDelayTime);
                  }
                );
              } else {
                this.setState(
                  {
                    initialGestureCoordinate: null,
                    activeDotCoordinate: null,
                    matched: true,
                    showError: true,
                    showHint: false,
                    hintText: '',
                  },
                  () => {
                    if (this.state.changePatternConfirm) {
                      this.props.onPatternMatch?.(pattern);
                    }

                    this.setState({
                      showHint: true,
                      hintText: this.props.correctPatternDelayDurationMessage,
                      matched: true,
                    });
                    this._patternMatchedTimeout = setTimeout(
                      () => {
                        this.setState(
                          {
                            showHint: true,
                            processName: this.state.changePatternConfirm
                              ? PatternProcess.CONFIRM_PATTERN
                              : PatternProcess.NEW_PATTERN,
                            hintText: this.state.changePatternConfirm
                              ? this.props.changePatternSecondMessage
                              : this.props.changePatternFirstMessage,
                            showError: false,
                            matched: false,
                            pattern: [],
                          },
                          () => {
                            if (this.state.changePatternConfirm) {
                              if (this.props.onPatternMatchAfterDelay) {
                                this.props.onPatternMatchAfterDelay(pattern);
                              }
                            }
                          }
                        );
                      },
                      this.state.changePatternConfirm
                        ? this.props.correctPatternDelayTime
                        : this.props.changePatternDelayTime
                    );
                  }
                );
              }
            } else {
              if (!this.props.isChangePattern) {
                this.setState(
                  {
                    initialGestureCoordinate: null,
                    activeDotCoordinate: null,
                    showError: true,
                    matched: false,
                  },
                  () => {
                    if (pattern.length >= this.props.minPatternLength) {
                      if (this.props.iswrongPatternCountLimited) {
                        if (WRONGPATTERN_TOTAL_COUNT > 0) {
                          WRONGPATTERN_TOTAL_COUNT =
                            WRONGPATTERN_TOTAL_COUNT - 1;
                        } else {
                          WRONGPATTERN_TOTAL_COUNT = 0;
                        }
                      }
                    }

                    this.setState({
                      showHint: true,
                      hintText:
                        pattern.length >= this.props.minPatternLength
                          ? this.props.iswrongPatternCountLimited
                            ? WRONGPATTERN_TOTAL_COUNT > 0
                              ? this.props.patternCountLimitedErrorMessage
                              : this.props.patternTotalCountReachedErrorMessage
                            : this.props.wrongPatternDelayDurationMessage
                          : this.props.minPatternLengthErrorMessage,
                    });
                    if (this.props.onWrongPattern) {
                      this.props.onWrongPattern(
                        pattern,
                        WRONGPATTERN_TOTAL_COUNT
                      );
                    }

                    this._resetTimeout = setTimeout(() => {
                      this.setState(
                        {
                          showHint: true,
                          hintText: this.props.iswrongPatternCountLimited
                            ? WRONGPATTERN_TOTAL_COUNT > 0
                              ? this.props.patternCountLimitedErrorMessage
                              : this.props.patternTotalCountReachedErrorMessage
                            : this.props.wrongPatternMessage,
                          showError: false,
                          pattern: [],
                        },
                        () => {
                          if (this.props.onWrongPatternAfterDelay) {
                            this.props.onWrongPatternAfterDelay(
                              pattern,
                              WRONGPATTERN_TOTAL_COUNT
                            );
                          }
                        }
                      );
                    }, this.props.wrongPatternDelayTime);
                  }
                );
              } else {
                this.setState(
                  {
                    initialGestureCoordinate: null,
                    activeDotCoordinate: null,
                    showError: true,
                    matched: false,
                  },
                  () => {
                    this.setState({
                      showHint: true,
                      hintText:
                        pattern.length >= this.props.minPatternLength
                          ? this.props.wrongPatternDelayDurationMessage
                          : this.props.minPatternLengthErrorMessage,
                    });
                    this._resetTimeout = setTimeout(() => {
                      this.setState({
                        showHint: true,
                        hintText: this.state.changePatternConfirm
                          ? this.props.newPatternConfirmationMessage
                          : this.props.wrongPatternMessage,
                        showError: false,
                        pattern: [],
                      });
                    }, this.props.wrongPatternDelayTime);
                  }
                );
              }
            }
          } else if (processName === PatternProcess.NEW_PATTERN) {
            if (!this.props.isChangePattern) {
              if (pattern.length < this.props.minPatternLength) {
                this.setState(
                  {
                    initialGestureCoordinate: null,
                    activeDotCoordinate: null,
                    showError: true,
                    matched: false,
                  },
                  () => {
                    this.setState({
                      showHint: true,
                      hintText: this.props.minPatternLengthErrorMessage,
                    });
                    this._resetTimeout = setTimeout(() => {
                      this.setState({
                        showHint: true,
                        hintText: this.props.wrongPatternMessage,
                        showError: false,
                        pattern: [],
                      });
                    }, this.props.wrongPatternDelayTime);
                  }
                );
              } else {
                this.setState(
                  {
                    correctPattern: pattern,
                    showError: true,
                    showHint: true,
                    hintText: this.props.correctPatternDelayDurationMessage,
                    initialGestureCoordinate: null,
                    activeDotCoordinate: null,
                    matched: true,
                  },
                  () => {
                    this._patternMatchedTimeout = setTimeout(() => {
                      this.setState({
                        showHint: true,
                        processName: PatternProcess.CONFIRM_PATTERN,
                        hintText: this.props.newPatternConfirmationMessage,
                        showError: false,
                        matched: false,
                        pattern: [],
                      });
                    }, this.props.correctPatternDelayTime);
                  }
                );
              }
            } else {
              if (
                (this.props.enablePatternNotSameCondition &&
                  this.props.correctPattern ===
                    getCorrectPatterninString(pattern)) ||
                pattern.length < this.props.minPatternLength
              ) {
                this.setState(
                  {
                    initialGestureCoordinate: null,
                    activeDotCoordinate: null,
                    showError: true,
                    matched: false,
                  },
                  () => {
                    this.setState({
                      showHint: true,
                      hintText:
                        pattern.length < this.props.minPatternLength
                          ? this.props.minPatternLengthErrorMessage
                          : this.props.samePatternMatchedMessage,
                    });
                    this._resetTimeout = setTimeout(() => {
                      this.setState({
                        showHint: true,
                        hintText: this.props.wrongPatternMessage,
                        showError: false,
                        pattern: [],
                      });
                    }, this.props.wrongPatternDelayTime);
                  }
                );
              } else {
                this.setState(
                  {
                    initialGestureCoordinate: null,
                    activeDotCoordinate: null,
                    matched: true,
                    showError: true,
                    showHint: true,
                    hintText: this.props.newPatternDelayDurationMessage,
                  },
                  () => {
                    this._patternMatchedTimeout = setTimeout(() => {
                      this.setState({
                        correctPattern: pattern,
                        showHint: true,
                        processName: PatternProcess.CONFIRM_PATTERN,
                        hintText: this.props.newPatternMatchedMessage,
                        showError: false,
                        changePatternConfirm: true,
                        matched: false,
                        pattern: [],
                      });
                    }, this.props.newPatternDelayTime);
                  }
                );
              }
            }
          }
        }
      },
    });
  }

  componentWillUnmount() {
    clearTimeout(this._resetTimeout);
    clearTimeout(this._patternMatchedTimeout);
  }

  render() {
    let { containerHeight, containerWidth } = this.props;
    let {
      activeDotCoordinate,
      pattern,
      showError,
      showHint,
      matched,
      hintText,
      processName,
    } = this.state;
    let message;
    let headingText;
    if (showHint) {
      message = hintText;
    } else {
      message = '';
    }

    if (processName === PatternProcess.CONFIRM_PATTERN) {
      headingText = this.props.headingText
        ? this.props.headingText
        : 'Confirm Pattern';
    } else if (processName === PatternProcess.NEW_PATTERN) {
      headingText = this.props.headingText
        ? this.props.headingText
        : 'Set New Pattern';
    }

    return (
      <>
        {this.props.isEnableHeadingText && (
          <Text style={this.props.headingTextStyle}>{headingText}</Text>
        )}
        <View style={styles.container}>
          {this.props.showHintMessage && (
            <View style={this.props.hintTextContainerStyle}>
              <Text style={this.props.hintTextStyle}>{message}</Text>
            </View>
          )}
          <Animated.View {...this._panResponder.panHandlers}>
            <Svg height={containerHeight} width={containerWidth}>
              {this._dots.map((dot, i) => {
                let mappedDot = this._mappedDotsIndex[i];
                let isIncludedInPattern = pattern.find(
                  (dot) => dot.x === mappedDot.x && dot.y === mappedDot.y
                );
                return (
                  <Circle
                    // @ts-ignore
                    ref={(circle) => (this._dotNodes[i] = circle)}
                    key={i}
                    cx={dot.x}
                    cy={dot.y}
                    r={this.props.dotRadius}
                    fill={
                      (isIncludedInPattern &&
                        matched &&
                        this.props.correctPatternColor) ||
                      (showError &&
                        isIncludedInPattern &&
                        this.props.wrongPatternColor) ||
                      (isIncludedInPattern && this.props.connectedDotsColor) ||
                      this.props.dotsColor
                    }
                  />
                );
              })}
              {pattern.map((startCoordinate, index) => {
                if (index === pattern.length - 1) {
                  return;
                }
                let startIndex = this._mappedDotsIndex.findIndex((dot) => {
                  return (
                    dot.x === startCoordinate.x && dot.y === startCoordinate.y
                  );
                });
                let endCoordinate = pattern[index + 1];
                let endIndex = this._mappedDotsIndex.findIndex((dot) => {
                  return dot.x === endCoordinate.x && dot.y === endCoordinate.y;
                });

                if (startIndex < 0 || endIndex < 0) {
                  return;
                }

                let actualStartDot = this._dots[startIndex];
                let actualEndDot = this._dots[endIndex];

                return (
                  <Line
                    key={`fixedLine${index}`}
                    x1={actualStartDot.x}
                    y1={actualStartDot.y}
                    x2={actualEndDot.x}
                    y2={actualEndDot.y}
                    stroke={
                      matched
                        ? this.props.correctPatternColor
                        : showError
                          ? this.props.wrongPatternColor
                          : this.props.activeLineColor
                    }
                    strokeWidth={this.props.lineStrokeWidth.toString()}
                  />
                );
              })}
              {activeDotCoordinate ? (
                <Line
                  // @ts-ignore
                  ref={(component) => (this._activeLine = component)}
                  x1={activeDotCoordinate.x}
                  y1={activeDotCoordinate.y}
                  x2={activeDotCoordinate.x}
                  y2={activeDotCoordinate.y}
                  stroke={this.props.movingLineColor}
                  strokeWidth={this.props.lineStrokeWidth.toString()}
                />
              ) : null}
            </Svg>
          </Animated.View>
        </View>
      </>
    );
  }

  _isAlreadyInPattern({ x, y }: Coordinate) {
    let { pattern } = this.state;
    return pattern.find((dot) => {
      return dot.x === x && dot.y === y;
    }) == null
      ? false
      : true;
  }

  _isPatternMatched(currentPattern: Array<Coordinate>) {
    let { correctPattern } = this.state;
    if (currentPattern.length !== correctPattern?.length) {
      return false;
    }
    let matched = true;
    for (let index = 0; index < currentPattern.length; index++) {
      let correctDot = correctPattern[index];
      let currentDot = currentPattern[index];
      if (correctDot.x !== currentDot.x || correctDot.y !== currentDot.y) {
        matched = false;
        break;
      }
    }
    return matched;
  }

  _snapDot(animatedValue: Animated.Value) {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: this.props.snapDotRadius,
        duration: this.props.snapDuration,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: this.props.dotRadius,
        duration: this.props.snapDuration,
        useNativeDriver: true,
      }),
    ]).start();
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintContainer: {
    alignItems: 'center',
    marginTop: 30,
    flexWrap: 'wrap',
  },
  hintText: {
    color: 'red',
    textAlign: 'center',
  },
  textStyle: {
    color: '#000000',
    fontSize: 16,
    alignSelf: 'center',
  },
});
