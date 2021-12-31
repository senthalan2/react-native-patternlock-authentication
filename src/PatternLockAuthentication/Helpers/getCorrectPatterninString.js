const getSinglePatternStringValue = value => {
  switch (value) {
    case JSON.stringify({x: 0, y: 0}):
      return '0';
    case JSON.stringify({x: 1, y: 0}):
      return '1';
    case JSON.stringify({x: 2, y: 0}):
      return '2';
    case JSON.stringify({x: 0, y: 1}):
      return '3';
    case JSON.stringify({x: 1, y: 1}):
      return '4';
    case JSON.stringify({x: 2, y: 1}):
      return '5';
    case JSON.stringify({x: 0, y: 2}):
      return '6';
    case JSON.stringify({x: 1, y: 2}):
      return '7';
    case JSON.stringify({x: 2, y: 2}):
      return '8';
  }
};

export const getCorrectPatterninString = pattern => {
  let result = pattern.map(val => {
    return getSinglePatternStringValue(JSON.stringify(val));
  });
  return result.join('');
};
