function quickSort(
  arr: number[],
  start = 0,
  end = arr.length - 1
): number[] {
  if (start >= end) {
    return arr;
  }

  const pivotValue = arr[end];
  let j = start - 1;
  for (let i = start; i <= end; i++) {
    if (arr[i] > pivotValue) {
      continue;
    }
    j++;
    if (i > j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  quickSort(arr, start, j - 1);
  quickSort(arr, j + 1, end);

  return arr;
}

export default quickSort;
