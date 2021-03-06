const DEFAULT_HIT_SLOP = 25;
export default function getDotIndex(
  gestureCoordinate,
  dots,
  hitSlop = DEFAULT_HIT_SLOP,
) {
  let dotIndex;
  let {x, y} = gestureCoordinate;
  for (let i = 0; i < dots.length; i++) {
    let {x: dotX, y: dotY} = dots[i];
    if (
      dotX + hitSlop >= x &&
      dotX - hitSlop <= x &&
      dotY + hitSlop >= y &&
      dotY - hitSlop <= y
    ) {
      dotIndex = i;
      break;
    }
  }
  return dotIndex;
}
