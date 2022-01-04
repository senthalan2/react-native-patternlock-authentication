import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

import { getCorrectPatterninArray } from './Helpers';
import PatternLockAuthentication from './PatternLockAuthentication';

const { width, height } = Dimensions.get('window');
const PATTERN_CONTAINER_HEIGHT = height / 2;
const PATTERN_CONTAINER_WIDTH = width;
const PATTERN_DIMENSION = 3;

const PatternLock = ({
  containerDimension = PATTERN_DIMENSION,
  containerWidth = PATTERN_CONTAINER_WIDTH,
  containerHeight = PATTERN_CONTAINER_HEIGHT,
  correctPattern = '1234',
  onPatternMatch,
  onWrongPattern,
  dotRadius = 10,
  snapDotRadius = 20,
  wrongPatternColor = 'red',
  correctPatternColor = 'green',
  dotsColor = 'blue',
  snapDuration = 100,
  wrongPatternDelayTime = 1000,
  correctPatternDelayTime = 1000,
  lineStrokeWidth = 6,
  activeLineColor = 'blue',
  showErrorMessage = true,
  correctPatternMessage = 'Pattern Matched',
  correctPatternMessageColor = 'green',
  messageAfterWrongPattern = 'Draw Correct Pattern',
  wrongPatternDelayDurationMessage = 'Wrong Pattern.Try Again.',
  messageTextColor = 'red',
  isGoneCorrectPattern = true,
  movingLineColor = 'blue',
}) => {
  // const onWrongPattern = () => {};
  // const onPatternMatch = () => {};

  //[1,2,3,4] => "1,2,3,4"

  useEffect(() => {
    // console.log([1, 2, 3, 4].toString().replaceAll(',', ''), 'JJJJJJ');
  }, []);

  return (
    <View style={styles.container}>
      <PatternLockAuthentication
        containerDimension={containerDimension}
        containerWidth={containerWidth}
        containerHeight={containerHeight}
        correctPattern={getCorrectPatterninArray(correctPattern)}
        onPatternMatch={onPatternMatch}
        onWrongPattern={onWrongPattern}
        dotRadius={dotRadius}
        snapDotRadius={snapDotRadius}
        wrongPatternColor={wrongPatternColor}
        correctPatternColor={correctPatternColor}
        dotsColor={dotsColor}
        snapDuration={snapDuration}
        isGoneCorrectPattern={isGoneCorrectPattern}
        wrongPatternDelayTime={wrongPatternDelayTime}
        correctPatternDelayTime={correctPatternDelayTime}
        lineStrokeWidth={lineStrokeWidth}
        activeLineColor={activeLineColor}
        showErrorMessage={showErrorMessage}
        correctPatternMessage={correctPatternMessage}
        correctPatternMessageColor={correctPatternMessageColor}
        messageAfterWrongPattern={messageAfterWrongPattern}
        wrongPatternDelayDurationMessage={wrongPatternDelayDurationMessage}
        messageTextColor={messageTextColor}
        movingLineColor={movingLineColor}
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
