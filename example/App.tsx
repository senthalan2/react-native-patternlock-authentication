import * as React from 'react';

import { StyleSheet, View, Text, Dimensions } from 'react-native';
import {
  FeaturedPatternLock,
  GeneralPatternLock,
  PatternCoordinate,
  PatternHelpers,
  PatternProcess,
} from 'react-native-patternlock-authentication';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const PATTERN_CONTAINER_HEIGHT = height / 2;
const PATTERN_CONTAINER_WIDTH = width;
const PATTERN_DIMENSION = 3;
const CORRECT_UNLOCK_PATTERN = '0123';

export default function App() {
  const [hint, sethint] = React.useState('Current Pattern is "0123"');

  const onPatternMatch = (pattern: PatternCoordinate[]) => {
    console.log(
      'Pattern Matched',
      PatternHelpers.getCorrectPatterninString(pattern),
    );
    sethint('Pattern Matched');
  };

  const onWrongPattern = () => {
    sethint('Wrong Pattern.Try Again.');
  };

  const onPatternMatchAfterDelay = () => {
    sethint('Unlocked');
  };

  const onWrongPatternAfterDelay = () => {
    sethint(`Current Pattern is "${CORRECT_UNLOCK_PATTERN}"`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <FeaturedPatternLock
        containerDimension={PATTERN_DIMENSION}
        containerWidth={PATTERN_CONTAINER_WIDTH}
        containerHeight={PATTERN_CONTAINER_HEIGHT}
        correctPattern={'1573'}
        processName={PatternProcess.CONFIRM_PATTERN}
        isChangePattern={false}
        showHintMessage={true}
        dotRadius={10}
        dotsColor={'blue'}
        movingLineColor={'blue'}
        snapDotRadius={15}
        lineStrokeWidth={6}
        activeLineColor={'blue'}
        wrongPatternColor={'red'}
        snapDuration={100}
        connectedDotsColor={'blue'}
        correctPatternColor={'green'}
        minPatternLength={4}
        newPatternConfirmationMessage={'Enter New Pattern again to Confirm'}
        wrongPatternDelayTime={1000}
        correctPatternMessage={'Unlocked Successfully.'}
        correctPatternDelayTime={1000}
        correctPatternDelayDurationMessage={'Pattern Matched'}
        // iswrongPatternCountLimited = {false}
        // totalWrongPatternCount = {}
        wrongPatternDelayDurationMessage={'Wrong Pattern. Try Again.'}
        minPatternLengthErrorMessage={
          'Pattern Length should be greater than 3 '
        }
        wrongPatternMessage={'Re-Draw Your Pattern.'}
        changePatternFirstMessage={'Enter Your New Pattern'}
        changePatternDelayTime={1000}
        changePatternSecondMessage={'Enter New Pattern again to Confirm'}
        isEnableHeadingText={true}
        enableDotsJoinViration={false}
        // vibrationPattern = {}
        headingText={'Confirm Pattern'}
        enablePatternNotSameCondition={true}
        // patternTotalCountReachedErrorMessage = {}
        newPatternDelayDurationMessage={'Pattern Matched'}
        newPatternMatchedMessage={'Unlocked Successfully.'}
        newPatternDelayTime={1000}
        // patternCountLimitedErrorMessage = {}
        samePatternMatchedMessage={
          'New Pattern should be different from Previous Pattern'
        }
        hintTextStyle={{
          textAlign: 'center',
          color: 'red',
          fontSize: 14,
        }}
        headingTextStyle={{
          textAlign: 'center',
          color: 'blue',
          fontSize: 16,
          marginVertical: 30,
        }}
        hintTextContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 10,
        }}
        onPatternMatch={onPatternMatch}
        onWrongPatternAfterDelay={onWrongPatternAfterDelay}
        onPatternMatchAfterDelay={onPatternMatchAfterDelay}
        onWrongPattern={onWrongPattern}
      /> */}
      <Text
        style={{
          fontSize: 16,
          color: 'blue',
          textAlign: 'center',
          alignSelf: 'center',
          marginVertical: 20,
        }}
      >
        Confirm Pattern
      </Text>
      <GeneralPatternLock
        containerDimension={PATTERN_DIMENSION}
        containerWidth={PATTERN_CONTAINER_WIDTH}
        containerHeight={PATTERN_CONTAINER_HEIGHT}
        correctPattern={CORRECT_UNLOCK_PATTERN}
        dotsAndLineColor="blue"
        wrongPatternDelayTime={1000}
        correctPatternDelayTime={1000}
        defaultDotRadius={10}
        snapDotRadius={15}
        snapDuration={100}
        lineStrokeWidth={5}
        wrongPatternColor="red"
        matchedPatternColor="green"
        onPatternMatch={onPatternMatch}
        onWrongPatternAfterDelay={onWrongPatternAfterDelay}
        onPatternMatchAfterDelay={onPatternMatchAfterDelay}
        onWrongPattern={onWrongPattern}
        enableHint={true}
        hint={hint}
        hintContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 10,
        }}
        hintTextStyle={{ textAlign: 'center', color: 'red', fontSize: 14 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
