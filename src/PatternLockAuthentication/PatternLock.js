import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

import { getCorrectPatterninArray } from './Helpers';
import PatternLockAuthentication from './PatternLockAuthentication';

const { width, height } = Dimensions.get('window');

const PatternLock = ({
  PatternContainerHeight = height,
  patternContainerWidth = width,
  PatternDimension = 3,
  onPatternMatch,
  onWrongPattern,
  correctPattern,
  patternMatchedDelayTime,
  wrongPatternDelayTime,
}) => {
  const PATTERN_CONTAINER_HEIGHT = height / 2;
  const PATTERN_CONTAINER_WIDTH = width;
  const PATTERN_DIMENSION = 3;

  // const onWrongPattern = () => {};
  // const onPatternMatch = () => {};

  return (
    <View style={styles.container}>
      <PatternLockAuthentication
        containerDimension={PATTERN_DIMENSION}
        containerWidth={PATTERN_CONTAINER_WIDTH}
        containerHeight={PATTERN_CONTAINER_HEIGHT}
        correctPattern={getCorrectPatterninArray('1234')}
        processName={'confirm_pattern'}
        isChangePattern={false}
        onPatternMatch={onPatternMatch}
        onWrongPattern={onWrongPattern}
      />
    </View>
  );
};

export default PatternLock;

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
