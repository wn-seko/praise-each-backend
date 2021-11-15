export const intersection = <T>(
  array1: T[],
  array2: T[],
  iterator?: (item: T) => unknown,
): T[] => {
  const mapFunc = iterator ? iterator : (item: unknown) => item
  return array1.filter((value) => array2.map(mapFunc).includes(mapFunc(value)))
}
