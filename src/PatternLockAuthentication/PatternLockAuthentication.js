import React from 'react';
import { StyleSheet, Text, View, Animated, PanResponder } from 'react-native';

import lodash from 'lodash';

import Svg, { Line, Circle } from 'react-native-svg';

import {
  populateDotsCoordinate,
  getDotIndex,
  getIntermediateDotIndexes,
} from './Helpers';
import { getCorrectPatterninString } from './Helpers/getCorrectPatterninString';

type Coordinate = {
  x: number,
  y: number,
};

type Props = {
  containerDimension: number,
  containerWidth: number,
  containerHeight: number,
  correctPattern: Array<Coordinate>,
  hint: string,
  processName: String,
  isChangePattern: boolean,
  onPatternMatch: () => boolean,
  onWrongPattern: () => boolean,
};

type State = {
  activeDotCoordinate: ?Coordinate,
  initialGestureCoordinate: ?Coordinate,
  pattern: Array<Coordinate>,
  correctPattern: Array<Coordinate>,
  showError: boolean,
  showHint: boolean,
  hintText: String,
  matched: boolean,
  changePatternConfirm: boolean,
  processName: String,
};

const PRIMARYCOLOR = 'red';

const DEFAULT_DOT_RADIUS = 10;
const SNAP_DOT_RADIUS = 15;
const SNAP_DURATION = 100;
var WRONGPATTERN_TOTAL_COUNT = 3;

const VIBE_PATTERN = [0, 200];

export default class PatternLockAuthentication extends React.Component<
  Props,
  State
> {
  _panResponder: { panHandlers: Object };
  _activeLine: ?Object;
  _dots: Array<Coordinate>;
  _dotNodes: Array<?Object>;
  _mappedDotsIndex: Array<Coordinate>;

  _snapAnimatedValues: Array<Animated.Value>;

  _resetTimeout: number;

  _patternMatchedTimeout: number;

  _isSamePattern: boolean;

  constructor() {
    super(...arguments);
    this.state = {
      initialGestureCoordinate: null,
      activeDotCoordinate: null,
      pattern: [],
      correctPattern: this.props.correctPattern,
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

    WRONGPATTERN_TOTAL_COUNT = 3;

    this._snapAnimatedValues = this._dots.map((dot, index) => {
      let animatedValue = new Animated.Value(DEFAULT_DOT_RADIUS);
      animatedValue.addListener(({ value }) => {
        let dotNode = this._dotNodes[index];
        dotNode && dotNode.setNativeProps({ r: value.toString() });
      });
      return animatedValue;
    });

    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => !this.state.showError,
      onMoveShouldSetPanResponderCapture: () => !this.state.showError,

      onPanResponderGrant: (e) => {
        let { locationX, locationY } = e.nativeEvent;

        let activeDotIndex = getDotIndex(
          { x: locationX, y: locationY },
          this._dots
        );

        // Vibration.cancel();

        if (activeDotIndex != null) {
          // Vibration.vibrate(VIBE_PATTERN);
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

          let intermediateDotIndexes = [];
          // Vibration.vibrate(VIBE_PATTERN);
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
          if (processName === 'confirm_pattern') {
            if (this._isPatternMatched(pattern)) {
              if (!this.props.isChangePattern) {
                WRONGPATTERN_TOTAL_COUNT = 3;
                this.setState(
                  {
                    initialGestureCoordinate: null,
                    activeDotCoordinate: null,
                    matched: true,
                    showError: true,
                    showHint: false,
                    hintText: 'Pattern Matched',
                  },
                  () => {
                    this._patternMatchedTimeout = setTimeout(() => {
                      this.setState({
                        showHint: true,
                        showError: false,
                        matched: false,
                        pattern: [],
                      });
                      this.props.onPatternMatch(pattern);
                    }, 100);
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
                    this.setState({
                      showHint: true,
                      hintText: 'Pattern Matched',
                      matched: true,
                    });
                    this._patternMatchedTimeout = setTimeout(
                      () => {
                        this.setState(
                          {
                            showHint: true,
                            processName: this.state.changePatternConfirm
                              ? 'confirm_pattern'
                              : 'set_pattern',
                            hintText: this.state.changePatternConfirm
                              ? 'Updating Pattern'
                              : 'Draw your New Pattern',
                            showError: false,
                            matched: false,
                            pattern: [],
                          },
                          () => {
                            if (this.state.changePatternConfirm) {
                              this.props.onPatternMatch(pattern);
                            }
                          }
                        );
                      },
                      this.state.changePatternConfirm ? 100 : 1000
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
                    if (pattern.length > 2) {
                      if (WRONGPATTERN_TOTAL_COUNT > 0) {
                        WRONGPATTERN_TOTAL_COUNT = WRONGPATTERN_TOTAL_COUNT - 1;
                      } else {
                        WRONGPATTERN_TOTAL_COUNT = 0;
                      }
                    }

                    this.setState({
                      showHint: true,
                      hintText:
                        pattern.length > 2
                          ? WRONGPATTERN_TOTAL_COUNT > 0
                            ? 'Wrong Pattern.Try Again.'
                            : 'Wrong Pattern'
                          : 'Invalid Pattern.Join Minimum 3 Dots.',
                    });
                    this._resetTimeout = setTimeout(() => {
                      this.setState(
                        {
                          showHint: true,
                          hintText:
                            WRONGPATTERN_TOTAL_COUNT > 1
                              ? 'Remaining ' +
                                WRONGPATTERN_TOTAL_COUNT +
                                ' Attempts'
                              : WRONGPATTERN_TOTAL_COUNT === 1
                              ? 'If this Attempt is Wrong then You will be Logged Out'
                              : 'Logging Out',
                          showError: false,
                          pattern: [],
                        },
                        () => {
                          this.props.onWrongPattern(
                            pattern,
                            WRONGPATTERN_TOTAL_COUNT
                          );
                        }
                      );
                    }, 1000);
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
                        pattern.length > 2
                          ? 'Wrong Pattern.Try Again.'
                          : 'Invalid Pattern.Join Minimum 3 Dots.',
                    });
                    this._resetTimeout = setTimeout(() => {
                      this.setState(
                        {
                          showHint: true,
                          hintText: this.state.changePatternConfirm
                            ? 'Draw your New Pattern Again to Verify'
                            : 'Draw your Current Pattern to Continue',
                          showError: false,
                          pattern: [],
                        },
                        () => {
                          // this.props.onWrongPattern(
                          //   pattern,
                          //   WRONGPATTERN_TOTAL_COUNT,
                          // );
                        }
                      );
                    }, 1000);
                  }
                );
              }
            }
          } else if (processName === 'set_pattern') {
            if (!this.props.isChangePattern) {
              if (pattern.length <= 2) {
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
                      hintText: 'Invalid Pattern.Join Minimum 3 Dots.',
                    });
                    this._resetTimeout = setTimeout(() => {
                      this.setState(
                        {
                          showHint: true,
                          hintText: 'Draw your New Pattern',
                          showError: false,
                          pattern: [],
                        },
                        () => {
                          // this.props.onWrongPattern(
                          //   pattern,
                          //   WRONGPATTERN_TOTAL_COUNT,
                          // );
                        }
                      );
                    }, 1000);
                  }
                );
              } else {
                this.setState(
                  {
                    correctPattern: pattern,
                    showError: true,
                    showHint: true,
                    hintText: 'Pattern Valid',
                    initialGestureCoordinate: null,
                    activeDotCoordinate: null,
                    matched: true,
                  },
                  () => {
                    this._patternMatchedTimeout = setTimeout(() => {
                      this.setState({
                        showHint: true,
                        processName: 'confirm_pattern',
                        hintText: 'Re-Draw Your New Pattern to Confirm',
                        showError: false,
                        matched: false,
                        pattern: [],
                      });
                    }, 1000);
                  }
                );
              }
            } else {
              if (
                lodash.isEqual(this.props.correctPattern, pattern) ||
                pattern.length <= 2
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
                        pattern.length <= 2
                          ? 'Invalid Pattern.Join Minimum 3 Dots.'
                          : 'New Pattern should be Different from Old Pattern',
                    });
                    this._resetTimeout = setTimeout(() => {
                      this.setState(
                        {
                          showHint: true,
                          hintText: 'Draw your New Pattern',
                          showError: false,
                          pattern: [],
                        },
                        () => {
                          // this.props.onWrongPattern(
                          //   pattern,
                          //   WRONGPATTERN_TOTAL_COUNT,
                          // );
                        }
                      );
                    }, 1000);
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
                    hintText: 'Pattern Valid',
                  },
                  () => {
                    this._patternMatchedTimeout = setTimeout(() => {
                      this.setState({
                        correctPattern: pattern,
                        showHint: true,
                        processName: 'confirm_pattern',
                        hintText: 'Re-Draw Your New Pattern to Confirm',
                        showError: false,
                        changePatternConfirm: true,
                        matched: false,
                        pattern: [],
                      });
                    }, 1000);
                  }
                );
              }
            }
            // else if (this.props.isChangePattern) {
            //   if (this._isSamePattern(pattern)) {
            //     this.setState(
            //       {
            //         showHint: true,
            //         hintText: 'Same Pattern not Valid',
            //         showError: false,
            //         pattern: [],
            //       },
            //       () => {
            //         this.props.onWrongPattern(
            //           pattern,
            //           WRONGPATTERN_TOTAL_COUNT,
            //         );
            //       },
            //     );
            //   } else {
            //     this.setState({
            //       correctPattern: pattern,
            //       pattern: [],
            //       showError: false,
            //       processName: 'confirm_pattern',
            //       initialGestureCoordinate: null,
            //       activeDotCoordinate: null,
            //       matched: false,
            //     });
            //   }
            // }
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
      initialGestureCoordinate,
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

    if (processName === 'confirm_pattern') {
      headingText = 'Confirm Pattern';
    } else if (processName === 'set_pattern') {
      headingText = 'Set New Pattern';
    }

    return (
      <>
        <Text style={styles.textStyle}>{headingText}</Text>
        <View style={styles.container}>
          <View style={styles.hintContainer}>
            <Text style={styles.hintText}>{message}</Text>
          </View>
          <Animated.View {...this._panResponder.panHandlers}>
            <Svg height={containerHeight} width={containerWidth}>
              {this._dots.map((dot, i) => {
                let mappedDot = this._mappedDotsIndex[i];
                let isIncludedInPattern = pattern.find(
                  (dot) => dot.x === mappedDot.x && dot.y === mappedDot.y
                );
                return (
                  <Circle
                    ref={(circle) => (this._dotNodes[i] = circle)}
                    key={i}
                    cx={dot.x}
                    cy={dot.y}
                    r={DEFAULT_DOT_RADIUS}
                    fill={
                      (isIncludedInPattern && matched && 'green') ||
                      (showError && isIncludedInPattern && 'red') ||
                      (isIncludedInPattern && PRIMARYCOLOR) ||
                      '#FED2B9'
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
                      matched ? 'green' : showError ? 'red' : PRIMARYCOLOR
                    }
                    strokeWidth="5"
                  />
                );
              })}
              {activeDotCoordinate ? (
                <Line
                  ref={(component) => (this._activeLine = component)}
                  x1={activeDotCoordinate.x}
                  y1={activeDotCoordinate.y}
                  x2={activeDotCoordinate.x}
                  y2={activeDotCoordinate.y}
                  stroke={PRIMARYCOLOR}
                  strokeWidth="5"
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
    if (currentPattern.length !== correctPattern.length) {
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

  _isSamePattern = (pattern: Coordinate) => {
    if (
      lodash.isEqual(
        getCorrectPatterninString(pattern),
        getCorrectPatterninString(this.props.correctPattern)
      )
    ) {
      return true;
    }
    return false;
  };

  _snapDot(animatedValue: Animated.Value) {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: SNAP_DOT_RADIUS,
        duration: SNAP_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: DEFAULT_DOT_RADIUS,
        duration: SNAP_DURATION,
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
  },
});
