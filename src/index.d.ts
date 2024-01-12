import { StyleProp, ViewStyle, TextStyle } from 'react-native'
declare module "react-native-patternlock-authentication" {

    export interface GeneralPatternLockProps {
        containerDimension?: number,
        containerWidth?: number,
        containerHeight?: number,
        correctPattern: string,
        wrongPatternDelayTime?: number,
        correctPatternDelayTime?: number,
        dotsAndLineColor?: string,
        wrongPatternColor?: string,
        lineStrokeWidth?: number,
        defaultDotRadius?: number,
        snapDotRadius?: number,
        snapDuration?: number,
        enableHint?: boolean,
        hint?: string,
        hintContainerStyle?: StyleProp<ViewStyle>,
        hintTextStyle?: StyleProp<TextStyle>,
        matchedPatternColor?: string,
        onPatternMatchAfterDelay?: () => void,
        onWrongPatternAfterDelay?: () => void,
        onWrongPattern?: () => void,
        onPatternMatch: () => void,
    }

    export interface FeaturedPatternLockProps {
        containerDimension?: number,
        containerWidth?: number,
        containerHeight?: number,
        correctPattern: string,
        processName?: 'confirm_pattern' | 'set_pattern',
        isChangePattern?: boolean,
        showHintMessage?: boolean,
        dotRadius?: number,
        dotsColor?: string,
        movingLineColor?: string,
        snapDotRadius?: number,
        lineStrokeWidth?: number,
        activeLineColor?: string,
        wrongPatternColor?: string,
        snapDuration?: number,
        connectedDotsColor?: string,
        correctPatternColor?: string,
        minPatternLength?: number,
        newPatternConfirmationMessage?: string,
        wrongPatternDelayTime?: number,
        correctPatternMessage?: string,
        correctPatternDelayTime?: number,
        correctPatternDelayDurationMessage?: string,
        iswrongPatternCountLimited?: boolean,
        totalWrongPatternCount?: number,
        wrongPatternDelayDurationMessage?: string,
        minPatternLengthErrorMessage?: string,
        wrongPatternMessage?: string,
        changePatternFirstMessage?: string,
        changePatternDelayTime?: number,
        changePatternSecondMessage?: string,
        isEnableHeadingText?: boolean,
        enableDotsJoinViration?: boolean,
        vibrationPattern?: number[],
        headingText?: string,
        enablePatternNotSameCondition?: boolean,
        patternTotalCountReachedErrorMessage?: string,
        newPatternDelayDurationMessage?: string,
        newPatternMatchedMessage?: string,
        newPatternDelayTime?: number,
        patternCountLimitedErrorMessage?: string,
        samePatternMatchedMessage?: string,
        hintTextStyle?: StyleProp<TextStyle>,
        headingTextStyle?: StyleProp<TextStyle>,
        hintTextContainerStyle?: StyleProp<ViewStyle>,
        onPatternMatch: () => void,
        onWrongPattern?: () => void,
        onPatternMatchAfterDelay?: () => void,
        onWrongPatternAfterDelay?: () => void,
    }

    export type PatternProcessProps = {
        CONFIRM_PATTERN: 'confirm_pattern',
        NEW_PATTERN: 'set_pattern',
    }

    declare const GeneralPatternLock: React.SFC<GeneralPatternLockProps>;
    declare const FeaturedPatternLock: React.SFC<FeaturedPatternLockProps>;
    declare const PatternProcess: PatternProcessProps

    export const { FeaturedPatternLock, GeneralPatternLock, PatternProcess }

}