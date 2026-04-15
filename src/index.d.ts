import { StyleProp, ViewStyle, TextStyle, ColorValue } from 'react-native';
declare module 'react-native-patternlock-authentication' {
  export type PatternCoordinate = {
    x: number;
    y: number;
  };

  export enum PatternProcess {
    CONFIRM_PATTERN = 'confirm_pattern',
    NEW_PATTERN = 'set_pattern',
  }

  /**
   * Hint messages for different pattern flow steps
   */
  export interface HintMessages {
    confirmPattern?: string;
    newPattern?: string;
    confirmNewPattern?: string;
    wrongPattern?: string;
    minPatternLengthError?: string;
    patternMismatch?: string;
    wrongPatternDelay?: string;
    correctPatternDelay?: string;
    newPatternDelay?: string;
  }

  export interface GeneralPatternLockProps {
    containerDimension?: number;
    containerWidth?: number;
    containerHeight?: number;
    correctPattern?: string;
    wrongPatternDelayTime?: number;
    correctPatternDelayTime?: number;
    dotsAndLineColor?: ColorValue;
    wrongPatternColor?: ColorValue;
    lineStrokeWidth?: number;
    defaultDotRadius?: number;
    snapDotRadius?: number;
    snapDuration?: number;
    enableHint?: boolean;
    hint?: string;
    hintContainerStyle?: StyleProp<ViewStyle>;
    hintTextStyle?: StyleProp<TextStyle>;
    matchedPatternColor?: ColorValue;
    onPatternMatch?: (pattern: PatternCoordinate[]) => void;
    onWrongPattern?: (pattern: PatternCoordinate[]) => void;
    onPatternMatchAfterDelay?: (pattern: PatternCoordinate[]) => void;
    onWrongPatternAfterDelay?: (pattern: PatternCoordinate[]) => void;
  }

  export interface FeaturedPatternLockProps {
    // Container configuration
    containerDimension?: number;
    containerWidth?: number;
    containerHeight?: number;

    // Pattern configuration
    correctPattern?: string;
    minPatternLength?: number;
    processName?: PatternProcess;

    // Flow control
    isChangePattern?: boolean;
    enablePatternNotSameCondition?: boolean;

    // Visual configuration
    dotRadius?: number;
    dotsColor?: ColorValue;
    movingLineColor?: ColorValue;
    snapDotRadius?: number;
    lineStrokeWidth?: number;
    activeLineColor?: ColorValue;
    wrongPatternColor?: ColorValue;
    snapDuration?: number;
    connectedDotsColor?: ColorValue;
    correctPatternColor?: ColorValue;

    // Timing configuration
    wrongPatternDelayTime?: number;
    correctPatternDelayTime?: number;
    changePatternDelayTime?: number;
    newPatternDelayTime?: number;

    // Hint and message configuration
    showHintMessage?: boolean;
    hintMessages?: HintMessages;

    // Deprecated message props (for backward compatibility - prefer hintMessages)
    newPatternConfirmationMessage?: string;
    correctPatternMessage?: string;
    correctPatternDelayDurationMessage?: string;
    wrongPatternDelayDurationMessage?: string;
    minPatternLengthErrorMessage?: string;
    wrongPatternMessage?: string;
    changePatternFirstMessage?: string;
    changePatternSecondMessage?: string;
    patternTotalCountReachedErrorMessage?: string;
    newPatternDelayDurationMessage?: string;
    newPatternMatchedMessage?: string;
    patternCountLimitedErrorMessage?: string;
    samePatternMatchedMessage?: string;

    // Error/attempt limiting
    isWrongPatternCountLimited?: boolean;
    totalWrongPatternCount?: number;

    // Heading configuration
    isEnableHeadingText?: boolean;
    headingText?: string;

    // Vibration configuration
    enableDotsJoinVibration?: boolean;
    vibrationPattern?: number[];

    // Styling
    hintTextStyle?: StyleProp<TextStyle>;
    headingTextStyle?: StyleProp<TextStyle>;
    hintTextContainerStyle?: StyleProp<ViewStyle>;

    // Callbacks
    onPatternMatch?: (pattern: PatternCoordinate[]) => void;
    onWrongPattern?: (
      pattern: PatternCoordinate[],
      remainingCount: number
    ) => void;
    onPatternMatchAfterDelay?: (pattern: PatternCoordinate[]) => void;
    onWrongPatternAfterDelay?: (
      pattern: PatternCoordinate[],
      remainingCount: number
    ) => void;

    // Deprecated props (for backward compatibility)
    /** @deprecated Use `isWrongPatternCountLimited` instead */
    iswrongPatternCountLimited?: boolean;
    /** @deprecated Use `enableDotsJoinVibration` instead */
    enableDotsJoinViration?: boolean;
  }

  export interface PatternHelpersProps {
    getCorrectPatterninArray: (pattern: string) => PatternCoordinate[];
    getCorrectPatterninString: (pattern: PatternCoordinate[]) => string;
  }

  export const FeaturedPatternLock: React.FC<FeaturedPatternLockProps>;
  export const GeneralPatternLock: React.FC<GeneralPatternLockProps>;
  export const PatternHelpers: PatternHelpersProps;
}
