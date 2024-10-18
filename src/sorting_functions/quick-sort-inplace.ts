function quickSortInPlace(arr: number[]): number[] {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[arr.length - 1];
  let j = -1;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > pivot) {
      continue;
    }
    j++;
    if (i > j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  arr = quickSortInPlace(arr.slice(0, j)).concat(
    pivot,
    quickSortInPlace(arr.slice(j + 1))
  );

  return arr;
}

export default quickSortInPlace;
