type Coordinate = {
  x: number;
  y: number;
};

const DEFAULT_HIT_SLOP = 25;
export default function getDotIndex(
  gestureCoordinate: Coordinate,
  dots: Coordinate[],
  hitSlop = DEFAULT_HIT_SLOP
) {
  let dotIndex;
  let { x, y } = gestureCoordinate;
  for (let i = 0; i < dots.length; i++) {
    // @ts-ignore
    let { x: dotX, y: dotY } = dots[i];
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
