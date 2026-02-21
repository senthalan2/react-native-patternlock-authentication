import { StyleProp, ViewStyle, TextStyle, ColorValue } from 'react-native'
declare module "react-native-patternlock-authentication" {

    export type PatternCoordinate = {
        x: number;
        y: number;
    };

    export enum PatternProcess {
        CONFIRM_PATTERN = 'confirm_pattern',
        NEW_PATTERN = 'set_pattern',
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
        containerDimension?: number;
        containerWidth?: number;
        containerHeight?: number;
        correctPattern?: string;
        processName?: PatternProcess;
        isChangePattern?: boolean;
        showHintMessage?: boolean;
        dotRadius?: number;
        dotsColor?: ColorValue;
        movingLineColor?: ColorValue;
        snapDotRadius?: number;
        lineStrokeWidth?: number;
        activeLineColor?: ColorValue;
        wrongPatternColor?: ColorValue;
        snapDuration?: number;
        connectedDotsColor?: ColorValue
        correctPatternColor?: ColorValue
        minPatternLength?: number;
        newPatternConfirmationMessage?: string;
        wrongPatternDelayTime?: number;
        correctPatternMessage?: string;
        correctPatternDelayTime?: number;
        correctPatternDelayDurationMessage?: string;
        iswrongPatternCountLimited?: boolean;
        totalWrongPatternCount?: number;
        wrongPatternDelayDurationMessage?: string;
        minPatternLengthErrorMessage?: string;
        wrongPatternMessage?: string;
        changePatternFirstMessage?: string;
        changePatternDelayTime?: number;
        changePatternSecondMessage?: string;
        isEnableHeadingText?: boolean;
        enableDotsJoinViration?: boolean;
        vibrationPattern?: number[];
        headingText?: string;
        enablePatternNotSameCondition?: boolean;
        patternTotalCountReachedErrorMessage?: string;
        newPatternDelayDurationMessage?: string;
        newPatternMatchedMessage?: string;
        newPatternDelayTime?: number;
        patternCountLimitedErrorMessage?: string;
        samePatternMatchedMessage?: string;
        hintTextStyle?: StyleProp<TextStyle>;
        headingTextStyle?: StyleProp<TextStyle>;
        hintTextContainerStyle?: StyleProp<ViewStyle>;
        onPatternMatch?: (pattern: PatternCoordinate[]) => void;
        onWrongPattern?: (pattern: PatternCoordinate[], remainingCount: number) => void;
        onPatternMatchAfterDelay?: (pattern: PatternCoordinate[]) => void;
        onWrongPatternAfterDelay?: (
            pattern: PatternCoordinate[],
            remainingCount: number,
        ) => void;
    }
    export interface PatternHelpersProps {
        getCorrectPatterninArray: (pattern: string) => PatternCoordinate[]
        getCorrectPatterninString: (pattern: PatternCoordinate[]) => string
    }


    export const FeaturedPatternLock: React.FC<FeaturedPatternLockProps>;
    export const GeneralPatternLock: React.FC<GeneralPatternLockProps>;
    export const PatternHelpers: PatternHelpersProps

}