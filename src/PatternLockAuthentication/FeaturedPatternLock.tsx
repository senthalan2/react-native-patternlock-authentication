import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder,
  Vibration,
  Dimensions,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
  type ColorValue,
  type GestureResponderEvent,
  type PanResponderGestureState,
  type PanResponderInstance,
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

/**
 * Represents a coordinate point with x and y values
 */
export type Coordinate = {
  x: number;
  y: number;
};

/**
 * Hint messages for different pattern flow steps and events
 * Provides separate, meaningful messages for each specific scenario
 */
interface HintMessages {
  // Confirm Pattern Flow - Simple
  confirmPatternMismatchImmediate?: string;
  confirmPatternMismatchAfterDelay?: string;
  confirmPatternMatchedImmediate?: string;
  confirmPatternMatchedAfterDelay?: string;
  confirmPatternTooShortError?: string;

  // Confirm Pattern Flow - Error with attempts limit
  confirmPatternAttemptsExhausted?: string;
  confirmPatternLimitedWarningImmediate?: string;
  confirmPatternLimitedWarningAfterDelay?: string;

  // New Pattern Flow - Set
  setPatternTooShortError?: string;
  setPatternTooShortAfterDelay?: string;
  setPatternSuccessImmediate?: string;

  // New Pattern Flow - Confirm
  confirmNewPatternInstruction?: string;

  // Change Pattern Flow - Confirm Current
  changeConfirmCurrentMismatchImmediate?: string;
  changeConfirmCurrentMismatchAfterDelay?: string;
  changeConfirmCurrentMatchedImmediate?: string;
  changeConfirmCurrentTooShortError?: string;

  // Change Pattern Flow - Set New
  changeSetNewPatternInstruction?: string;
  changeSetNewPatternSameAsOldError?: string;
  changeSetNewPatternSameAsOldAfterDelay?: string;
  changeSetNewPatternSuccessImmediate?: string;

  // Change Pattern Flow - Confirm New
  changeConfirmNewPatternInstruction?: string;
}

/**
 * Props for FeaturedPatternLock component
 */
interface Props {
  // Container configuration
  containerDimension: number;
  containerWidth: number;
  containerHeight: number;

  // Pattern configuration
  correctPattern: string;
  minPatternLength: number;
  processName: PatternProcess;

  // Flow control
  isChangePattern: boolean;
  enablePatternNotSameCondition: boolean;

  // Visual configuration
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

  // Timing configuration
  wrongPatternDelayTime: number;
  correctPatternDelayTime: number;
  changePatternDelayTime: number;
  newPatternDelayTime: number;

  // Hint and message configuration
  showHintMessage: boolean;
  hintMessages?: HintMessages;

  // Error/attempt limiting
  isWrongPatternCountLimited?: boolean;
  totalWrongPatternCount?: number;

  // Heading configuration
  isEnableHeadingText: boolean;
  headingText: string;

  // Vibration configuration
  enableDotsJoinVibration: boolean;
  vibrationPattern: number[];

  // Styling
  hintTextStyle?: StyleProp<TextStyle>;
  headingTextStyle?: StyleProp<TextStyle>;
  hintTextContainerStyle?: StyleProp<ViewStyle>;

  // Callbacks
  onPatternMatch?: (pattern: Coordinate[]) => void;
  onWrongPattern?: (pattern: Coordinate[], remainingCount: number) => void;
  onPatternMatchAfterDelay?: (pattern: Coordinate[]) => void;
  onWrongPatternAfterDelay?: (
    pattern: Coordinate[],
    remainingCount: number
  ) => void;
}

interface State {
  activeDotCoordinate: Coordinate | null;
  initialGestureCoordinate: Coordinate | null;
  pattern: Coordinate[];
  correctPattern: Coordinate[] | null;
  showError: boolean;
  showHint: boolean;
  hintText: string;
  matched: boolean;
  changePatternConfirm: boolean;
  processName: PatternProcess;
  wrongPatternCount: number;
}

export default class FeaturedPatternLock extends React.Component<Props, State> {
  private _panResponder!: PanResponderInstance;
  private _activeLine: Line | null = null;
  private _dots: Coordinate[] = [];
  private _dotNodes: Array<Circle | null> = [];
  private _mappedDotsIndex: Coordinate[] = [];
  private _snapAnimatedValues: Animated.Value[] = [];
  private _resetTimeout?: ReturnType<typeof setTimeout>;
  private _patternMatchedTimeout?: ReturnType<typeof setTimeout>;
  private _wrongPatternCount: number = 0;

  static defaultProps: Partial<Props> = {
    containerDimension: 3,
    containerWidth: width,
    containerHeight: height / 2,
    processName: PatternProcess.NEW_PATTERN,
    isChangePattern: false,
    enableDotsJoinVibration: false,
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
    wrongPatternDelayTime: 1000,
    correctPatternDelayTime: 1000,
    changePatternDelayTime: 1000,
    newPatternDelayTime: 1000,
    isWrongPatternCountLimited: false,
    totalWrongPatternCount: 0,
    isEnableHeadingText: false,
    headingText: '',
    enablePatternNotSameCondition: true,
    hintMessages: {},
    hintTextStyle: { color: 'blue' },
    headingTextStyle: { color: 'blue' },
    hintTextContainerStyle: {
      alignItems: 'center',
    },
  };

  constructor(props: Props) {
    super(props);

    this._wrongPatternCount = props.totalWrongPatternCount || 0;

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
      wrongPatternCount: 0,
    };

    const { containerDimension, containerWidth, containerHeight } = this.props;

    const { screenCoordinates, mappedIndex } = populateDotsCoordinate(
      containerDimension,
      containerWidth,
      containerHeight
    );

    this._dots = screenCoordinates;
    this._mappedDotsIndex = mappedIndex;
    this._dotNodes = [];
    this._wrongPatternCount = this.props.totalWrongPatternCount ?? 0;

    this._snapAnimatedValues = this._dots.map((_dot, index) => {
      const animatedValue = new Animated.Value(this.props.dotRadius);
      animatedValue.addListener(({ value }) => {
        const dotNode = this._dotNodes[index];
        dotNode && dotNode.setNativeProps({ r: value.toString() });
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
      onMoveShouldSetPanResponderCapture: () => !this.state.showError,

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

    if (this.props.enableDotsJoinVibration) {
      Vibration.cancel();
    }

    if (activeDotIndex != null) {
      if (this.props.enableDotsJoinVibration) {
        Vibration.vibrate(this.props.vibrationPattern);
      }

      const activeDotCoordinate = this._dots[activeDotIndex];
      const firstDot = this._mappedDotsIndex[activeDotIndex];
      const dotWillSnap = this._snapAnimatedValues[activeDotIndex];

      this.setState(
        {
          activeDotCoordinate: activeDotCoordinate ?? null,
          initialGestureCoordinate: activeDotCoordinate ?? null,
          pattern: firstDot ? [firstDot] : [],
          matched: false,
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

      if (this.props.enableDotsJoinVibration) {
        Vibration.vibrate(this.props.vibrationPattern);
      }

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
    const { pattern, processName } = this.state;

    if (!pattern.length) {
      return;
    }

    if (processName === PatternProcess.CONFIRM_PATTERN) {
      this._handleConfirmPatternFlow();
    } else if (processName === PatternProcess.NEW_PATTERN) {
      this._handleNewPatternFlow();
    }
  }

  /**
   * Helper to get hint message from hintMessages prop or use default
   */
  private _getHintMessage(
    key: keyof HintMessages,
    defaultMessage: string = ''
  ): string {
    return this.props.hintMessages?.[key] || defaultMessage;
  }

  /**
   * Handle the confirm pattern flow
   */
  private _handleConfirmPatternFlow(): void {
    const { pattern } = this.state;

    if (this._isPatternMatched(pattern)) {
      if (!this.props.isChangePattern) {
        this._handleConfirmPatternSuccess();
      } else {
        this._handleChangePatternConfirmSuccess();
      }
    } else {
      this._handlePatternMismatch();
    }
  }

  /**
   * Handle successful pattern confirmation (simple case)
   */
  private _handleConfirmPatternSuccess(): void {
    const { pattern } = this.state;
    this._wrongPatternCount = this.props.totalWrongPatternCount ?? 0;

    this.setState(
      {
        initialGestureCoordinate: null,
        activeDotCoordinate: null,
        matched: true,
        showError: true,
        showHint: true,
        hintText: this._getHintMessage(
          'confirmPatternMatchedImmediate',
          'Pattern Matched'
        ),
      },
      () => {
        this.props.onPatternMatch?.(pattern);

        this._patternMatchedTimeout = setTimeout(() => {
          this.setState({
            showHint: true,
            showError: false,
            hintText: this._getHintMessage(
              'confirmPatternMatchedAfterDelay',
              'Successfully Confirmed'
            ),
            matched: false,
            pattern: [],
          });

          if (this.props.onPatternMatchAfterDelay) {
            this.props.onPatternMatchAfterDelay(pattern);
          }
        }, this.props.correctPatternDelayTime);
      }
    );
  }

  /**
   * Handle successful pattern confirmation during change pattern flow
   */
  private _handleChangePatternConfirmSuccess(): void {
    const { pattern, changePatternConfirm } = this.state;

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
        if (changePatternConfirm) {
          this.props.onPatternMatch?.(pattern);
        }

        this.setState({
          showHint: true,
          hintText: this._getHintMessage(
            changePatternConfirm
              ? 'changeConfirmCurrentMatchedImmediate'
              : 'confirmPatternMatchedImmediate',
            'Pattern Matched'
          ),
          matched: true,
        });

        this._patternMatchedTimeout = setTimeout(
          () => {
            this.setState(
              {
                showHint: true,
                processName: changePatternConfirm
                  ? PatternProcess.CONFIRM_PATTERN
                  : PatternProcess.NEW_PATTERN,
                hintText: changePatternConfirm
                  ? this._getHintMessage(
                      'changeConfirmNewPatternInstruction',
                      'Now Confirm New Pattern'
                    )
                  : this._getHintMessage(
                      'changeSetNewPatternInstruction',
                      'Set New Pattern'
                    ),
                showError: false,
                matched: false,
                pattern: [],
              },
              () => {
                if (
                  changePatternConfirm &&
                  this.props.onPatternMatchAfterDelay
                ) {
                  this.props.onPatternMatchAfterDelay(pattern);
                }
              }
            );
          },
          changePatternConfirm
            ? this.props.correctPatternDelayTime
            : this.props.changePatternDelayTime
        );
      }
    );
  }

  /**
   * Handle pattern mismatch during confirmation flow
   */
  private _handlePatternMismatch(): void {
    if (!this.props.isChangePattern) {
      this._handleConfirmPatternMismatchSimple();
    } else {
      this._handleConfirmPatternMismatchChange();
    }
  }

  /**
   * Handle pattern mismatch in simple confirm flow
   */
  private _handleConfirmPatternMismatchSimple(): void {
    const { pattern } = this.state;
    const isLongEnough = pattern.length >= this.props.minPatternLength;
    const isLimited = this.props.isWrongPatternCountLimited;

    if (isLongEnough && isLimited && this._wrongPatternCount > 0) {
      this._wrongPatternCount--;
    }

    const hintMessage = isLongEnough
      ? isLimited
        ? this._wrongPatternCount > 0
          ? this._getHintMessage(
              'confirmPatternLimitedWarningImmediate',
              `${this._wrongPatternCount} attempt(s) left`
            )
          : this._getHintMessage(
              'confirmPatternAttemptsExhausted',
              'Too Many Attempts'
            )
        : this._getHintMessage(
            'confirmPatternMismatchImmediate',
            'Pattern Incorrect'
          )
      : this._getHintMessage(
          'confirmPatternTooShortError',
          'Pattern Too Short'
        );

    this.setState(
      {
        initialGestureCoordinate: null,
        activeDotCoordinate: null,
        showError: true,
        matched: false,
        showHint: true,
        hintText: hintMessage,
        wrongPatternCount: this._wrongPatternCount,
      },
      () => {
        if (this.props.onWrongPattern) {
          this.props.onWrongPattern(pattern, this._wrongPatternCount);
        }

        this._resetTimeout = setTimeout(() => {
          this.setState(
            {
              showHint: true,
              hintText: isLimited
                ? this._wrongPatternCount > 0
                  ? this._getHintMessage(
                      'confirmPatternLimitedWarningAfterDelay',
                      `${this._wrongPatternCount} attempt(s) left`
                    )
                  : this._getHintMessage(
                      'confirmPatternAttemptsExhausted',
                      'Try Again Later'
                    )
                : this._getHintMessage(
                    'confirmPatternMismatchAfterDelay',
                    'Try Again'
                  ),
              showError: false,
              pattern: [],
            },
            () => {
              if (this.props.onWrongPatternAfterDelay) {
                this.props.onWrongPatternAfterDelay(
                  pattern,
                  this._wrongPatternCount
                );
              }
            }
          );
        }, this.props.wrongPatternDelayTime);
      }
    );
  }

  /**
   * Handle pattern mismatch in change pattern confirm flow
   */
  private _handleConfirmPatternMismatchChange(): void {
    const { pattern, changePatternConfirm } = this.state;
    const isLongEnough = pattern.length >= this.props.minPatternLength;

    this.setState(
      {
        initialGestureCoordinate: null,
        activeDotCoordinate: null,
        showError: true,
        matched: false,
        showHint: true,
        hintText: isLongEnough
          ? this._getHintMessage(
              'changeConfirmCurrentMismatchImmediate',
              'Pattern Incorrect'
            )
          : this._getHintMessage(
              'changeConfirmCurrentTooShortError',
              'Pattern Too Short'
            ),
      },
      () => {
        this._resetTimeout = setTimeout(() => {
          this.setState({
            showHint: true,
            hintText: changePatternConfirm
              ? this._getHintMessage(
                  'changeConfirmNewPatternInstruction',
                  'Now Confirm New Pattern'
                )
              : this._getHintMessage(
                  'changeConfirmCurrentMismatchAfterDelay',
                  'Try Again'
                ),
            showError: false,
            pattern: [],
          });
        }, this.props.wrongPatternDelayTime);
      }
    );
  }

  /**
   * Handle new pattern flow
   */
  private _handleNewPatternFlow(): void {
    const { pattern } = this.state;

    if (pattern.length < this.props.minPatternLength) {
      this._handleNewPatternTooShort();
    } else if (!this.props.isChangePattern) {
      this._handleNewPatternSet();
    } else {
      this._handleChangePatternSet();
    }
  }

  /**
   * Handle pattern too short in new pattern flow
   */
  private _handleNewPatternTooShort(): void {
    this.setState(
      {
        initialGestureCoordinate: null,
        activeDotCoordinate: null,
        showError: true,
        matched: false,
        showHint: true,
        hintText: this._getHintMessage(
          'setPatternTooShortError',
          'Pattern Too Short'
        ),
      },
      () => {
        this._resetTimeout = setTimeout(() => {
          this.setState({
            showHint: true,
            hintText: this._getHintMessage(
              'setPatternTooShortAfterDelay',
              'Try Again'
            ),
            showError: false,
            pattern: [],
          });
        }, this.props.wrongPatternDelayTime);
      }
    );
  }

  /**
   * Handle new pattern successfully set (simple case)
   */
  private _handleNewPatternSet(): void {
    const { pattern } = this.state;

    this.setState(
      {
        correctPattern: pattern,
        showError: true,
        showHint: true,
        hintText: this._getHintMessage(
          'setPatternSuccessImmediate',
          'Pattern Set'
        ),
        initialGestureCoordinate: null,
        activeDotCoordinate: null,
        matched: true,
      },
      () => {
        this._patternMatchedTimeout = setTimeout(() => {
          this.setState({
            showHint: true,
            processName: PatternProcess.CONFIRM_PATTERN,
            hintText: this._getHintMessage(
              'confirmNewPatternInstruction',
              'Confirm Pattern'
            ),
            showError: false,
            matched: false,
            pattern: [],
          });
        }, this.props.correctPatternDelayTime);
      }
    );
  }

  /**
   * Handle new pattern during change pattern flow
   */
  private _handleChangePatternSet(): void {
    const { pattern } = this.state;
    const currentPatternString = getCorrectPatterninString(pattern);
    const isSameAsOld = this.props.correctPattern === currentPatternString;
    const shouldReject =
      this.props.enablePatternNotSameCondition && isSameAsOld;

    if (shouldReject) {
      this._handleChangePatternRejected();
    } else {
      this._handleChangePatternAccepted();
    }
  }

  /**
   * Handle rejected pattern change (same as old pattern)
   */
  private _handleChangePatternRejected(): void {
    this.setState(
      {
        initialGestureCoordinate: null,
        activeDotCoordinate: null,
        showError: true,
        matched: false,
        showHint: true,
        hintText: this._getHintMessage(
          'changeSetNewPatternSameAsOldError',
          'Same as Current Pattern'
        ),
      },
      () => {
        this._resetTimeout = setTimeout(() => {
          this.setState({
            showHint: true,
            hintText: this._getHintMessage(
              'changeSetNewPatternSameAsOldAfterDelay',
              'Try Different Pattern'
            ),
            showError: false,
            pattern: [],
          });
        }, this.props.wrongPatternDelayTime);
      }
    );
  }

  /**
   * Handle accepted new pattern change
   */
  private _handleChangePatternAccepted(): void {
    const { pattern } = this.state;

    this.setState(
      {
        initialGestureCoordinate: null,
        activeDotCoordinate: null,
        matched: true,
        showError: true,
        showHint: true,
        hintText: this._getHintMessage(
          'changeSetNewPatternSuccessImmediate',
          'Pattern Changed'
        ),
      },
      () => {
        this._patternMatchedTimeout = setTimeout(() => {
          this.setState({
            correctPattern: pattern,
            showHint: true,
            processName: PatternProcess.CONFIRM_PATTERN,
            hintText: this._getHintMessage(
              'changeConfirmNewPatternInstruction',
              'Confirm New Pattern'
            ),
            showError: false,
            changePatternConfirm: true,
            matched: false,
            pattern: [],
          });
        }, this.props.newPatternDelayTime);
      }
    );
  }

  componentWillUnmount(): void {
    if (this._resetTimeout !== undefined) {
      clearTimeout(this._resetTimeout);
    }
    if (this._patternMatchedTimeout !== undefined) {
      clearTimeout(this._patternMatchedTimeout);
    }
  }

  /**
   * Check if a coordinate is already part of the current pattern
   */
  private _isAlreadyInPattern(coordinate: Coordinate | undefined): boolean {
    const { pattern } = this.state;
    return pattern.some(
      (dot) => dot.x === coordinate?.x && dot.y === coordinate?.y
    );
  }

  /**
   * Check if the current pattern matches the correct pattern
   */
  private _isPatternMatched(currentPattern: Coordinate[]): boolean {
    const { correctPattern } = this.state;

    if (!correctPattern || currentPattern.length !== correctPattern.length) {
      return false;
    }

    for (let index = 0; index < currentPattern.length; index++) {
      const correctDot = correctPattern[index];
      const currentDot = currentPattern[index];

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
        toValue: this.props.dotRadius,
        duration: this.props.snapDuration,
        useNativeDriver: false,
      }),
    ]).start();
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
                    r={this.props.dotRadius}
                    fill={
                      isIncludedInPattern && matched
                        ? this.props.correctPatternColor
                        : isIncludedInPattern && showError
                          ? this.props.wrongPatternColor
                          : isIncludedInPattern
                            ? this.props.connectedDotsColor
                            : this.props.dotsColor
                    }
                  />
                );
              })}
              {pattern.map((startCoordinate, index) => {
                if (index === pattern.length - 1) {
                  return null;
                }

                const startIndex = this._mappedDotsIndex.findIndex(
                  (dot) =>
                    dot.x === startCoordinate.x && dot.y === startCoordinate.y
                );

                const endCoordinate = pattern[index + 1];
                if (!endCoordinate) return null;

                const endIndex = this._mappedDotsIndex.findIndex(
                  (dot) =>
                    dot.x === endCoordinate.x && dot.y === endCoordinate.y
                );

                if (startIndex < 0 || endIndex < 0) {
                  return null;
                }

                const actualStartDot = this._dots[startIndex];
                const actualEndDot = this._dots[endIndex];

                if (!actualStartDot || !actualEndDot) {
                  return null;
                }

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
                  stroke={this.props.movingLineColor}
                  strokeWidth={this.props.lineStrokeWidth}
                />
              )}
            </Svg>
          </Animated.View>
        </View>
      </>
    );
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
