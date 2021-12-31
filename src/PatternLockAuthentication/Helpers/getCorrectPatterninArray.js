const getSinglePatternObjectValue = value => {
  switch (parseInt(value)) {
    case 0:
      return {x: 0, y: 0};
    case 1:
      return {x: 1, y: 0};
    case 2:
      return {x: 2, y: 0};
    case 3:
      return {x: 0, y: 1};
    case 4:
      return {x: 1, y: 1};
    case 5:
      return {x: 2, y: 1};
    case 6:
      return {x: 0, y: 2};
    case 7:
      return {x: 1, y: 2};
    case 8:
      return {x: 2, y: 2};
    default:
      return null;
  }
};

export const getCorrectPatterninArray = pattern => {
  let result = Array.from(pattern).map((value, index) => {
    return getSinglePatternObjectValue(parseInt(value));
  });
  return result;
};
