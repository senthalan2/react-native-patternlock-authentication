import * as React from 'react';

import { Dimensions, StyleSheet, View } from 'react-native';
import {
  FeaturedPatternLock,
  NormalPatternLock,
  PatternProcess,
} from 'react-native-patternlock-authentication';

const { width, height } = Dimensions.get('window');
const PATTERN_CONTAINER_HEIGHT = height / 2;
const PATTERN_CONTAINER_WIDTH = width;
const PATTERN_DIMENSION = 3;
const CORRECT_UNLOCK_PATTERN = '0123';

export default function App() {
  const onPatternMatch = () => {
    console.log('onPatternMatch');
  };

  const onWrongPattern = () => {
    console.log('onWrongPattern');
  };

  const onPatternMatchAfterDelay = () => {
    console.log('onPatternMatchAfterDelay');
  };

  const onWrongPatternAfterDelay = () => {
    console.log('onWrongPatternAfterDelay');
  };

  return (
    <View style={styles.container}>
      {/* <FeaturedPatternLock
        onPatternMatch={onPatternMatch}
        onWrongPattern={onWrongPattern}
        isChangePattern={false}
        processName={PatternProcess.NEW_PATTERN}
      /> */}

      <NormalPatternLock
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
      />
    </View>
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
