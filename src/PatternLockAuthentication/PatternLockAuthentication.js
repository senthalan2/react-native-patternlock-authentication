// @flow

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder,
  Alert,
} from 'react-native';
import Svg, { Line, Circle } from 'react-native-svg';

import {
  populateDotsCoordinate,
  getDotIndex,
  getIntermediateDotIndexes,
} from './Helpers';

type Coordinate = {
  x: Number,
  y: Number,
};

type Props = {
  containerDimension: Number,
  containerWidth: Number,
  containerHeight: Number,
  correctPattern: Array<Coordinate>,
  hint: String,
  dotRadius: Number,
  snapDotRadius: Number,
  snapDuration: Number,
  lineStrokeWidth: Number,
  wrongPatternDelayTime: Number,
  correctPatternDelayTime: Number,
  wrongPatternColor: String,
  correctPatternColor: String,
  activeLineColor: String,
  movingLineColor: String,
  dotsColor: String,
  isGoneCorrectPattern: Boolean,
  messageAfterWrongPattern: String,
  showErrorMessage: Boolean,
  messageTextColor: String,
  correctPatternMessage: String,
  correctPatternMessageColor: String,
  wrongPatternDelayDurationMessage: String,
  onPatternMatch: () => Boolean,
};

type State = {
  activeDotCoordinate: ?Coordinate,
  initialGestureCoordinate: ?Coordinate,
  pattern: Array<Coordinate>,
  showError: boolean,
  disableTouch: boolean,
  showHint: boolean,
  matched: Boolean,
  showWrongPatternDelayDurationMessage: Boolean,
  showMessageAfterWrongPattern: Boolean,
  isWrongPattern: Boolean,
  messageColor: String,
};

// const DEFAULT_DOT_RADIUS = 10;
// const SNAP_DOT_RADIUS = 20;
// const SNAP_DURATION = 100;

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

  constructor() {
    super(...arguments);
    this.state = {
      initialGestureCoordinate: null,
      activeDotCoordinate: null,
      pattern: [],
      showError: false,
      disableTouch: false,
      showHint: false,
      showWrongPatternDelayDurationMessage: false,
      showMessageAfterWrongPattern: false,
      isWrongPattern: false,
      messageColor: 'white',
      matched: false,
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

    this._snapAnimatedValues = this._dots.map((dot, index) => {
      let animatedValue = new Animated.Value(this.props.dotRadius);
      animatedValue.addListener(({ value }) => {
        let dotNode = this._dotNodes[index];
        dotNode && dotNode.setNativeProps({ r: value.toString() });
      });
      return animatedValue;
    });

    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => !this.state.disableTouch,
      onMoveShouldSetPanResponderCapture: () => !this.state.disableTouch,

      onPanResponderGrant: (e) => {
        let { locationX, locationY } = e.nativeEvent;

        let activeDotIndex = getDotIndex(
          { x: locationX, y: locationY },
          this._dots
        );

        if (activeDotIndex != null) {
          let activeDotCoordinate = this._dots[activeDotIndex];
          let firstDot = this._mappedDotsIndex[activeDotIndex];
          let dotWillSnap = this._snapAnimatedValues[activeDotIndex];
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
        let { pattern } = this.state;
        if (pattern.length) {
          if (this._isPatternMatched(pattern)) {
            this.setState(
              {
                initialGestureCoordinate: null,
                activeDotCoordinate: null,
                isWrongPattern: false,
                disableTouch: true,
                matched: true,
                messageColor: this.props.correctPatternMessageColor,
              },
              () => {
                this._patternMatchedTimeout = setTimeout(() => {
                  this.setState({
                    disableTouch: false,
                    matched: false,
                  });

                  if (this.props.isGoneCorrectPattern) {
                    this.setState({
                      showHint: false,
                      pattern: [],
                    });
                  }

                  this.props.onPatternMatch;
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
                showHint: false,
                isWrongPattern: true,
                showWrongPatternDelayDurationMessage: true,
                showMessageAfterWrongPattern: false,
                messageColor: this.props.wrongPatternColor,
              },
              () => {
                this._resetTimeout = setTimeout(() => {
                  this.setState({
                    showHint: false,
                    showError: false,
                    disableTouch: false,
                    pattern: [],
                    showWrongPatternDelayDurationMessage: false,
                    showMessageAfterWrongPattern: true,
                  });
                }, this.props.wrongPatternDelayTime);
              }
            );
          }
        }
      },
    });
  }

  componentWillUnmount() {
    clearTimeout(this._resetTimeout);
  }

  render() {
    let { containerHeight, containerWidth, hint } = this.props;
    let {
      initialGestureCoordinate,
      activeDotCoordinate,
      pattern,
      showError,
      showWrongPatternDelayDurationMessage,
      showMessageAfterWrongPattern,
      showHint,
      messageColor,
      isWrongPattern,
      matched,
    } = this.state;
    let message;
    // if (showHint) {
    //   message = `hint: ${hint}`;
    // } else
    if (this.props.showErrorMessage) {
      if (isWrongPattern) {
        if (showWrongPatternDelayDurationMessage) {
          message = this.props.wrongPatternDelayDurationMessage;
        } else if (showMessageAfterWrongPattern) {
          message = this.props.messageAfterWrongPattern;
        }
      } else if (matched) {
        message = this.props.correctPatternMessage;
      } else {
        message = '';
      }
    }
    return (
      <View style={styles.container}>
        {this.props.showErrorMessage && (
          <View style={styles.hintContainer}>
            <Text
              style={[
                styles.hintText,
                {
                  color: messageColor,
                },
              ]}
            >
              {message}
            </Text>
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
                  ref={(circle) => (this._dotNodes[i] = circle)}
                  key={i}
                  cx={dot.x}
                  cy={dot.y}
                  r={this.props.dotRadius}
                  fill={
                    (showError &&
                      isIncludedInPattern &&
                      this.props.wrongPatternColor) ||
                    (matched &&
                      isIncludedInPattern &&
                      this.props.correctPatternColor) ||
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
                    showError
                      ? this.props.wrongPatternColor
                      : matched
                      ? this.props.correctPatternColor
                      : this.props.activeLineColor
                  }
                  strokeWidth={this.props.lineStrokeWidth}
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
                stroke={this.props.movingLineColor}
                strokeWidth={this.props.lineStrokeWidth}
              />
            ) : null}
          </Svg>
        </Animated.View>
      </View>
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
    let { correctPattern } = this.props;
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
    // flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintContainer: {
    alignItems: 'center',
    paddingBottom: 10,
    height: 20,
    flexWrap: 'wrap',
  },
  hintText: {
    color: 'red',
    textAlign: 'center',
  },
});
