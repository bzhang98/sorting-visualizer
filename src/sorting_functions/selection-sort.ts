function selectionSort(arr: number[]): number[] {
  for (let i = 0; i < arr.length; i++) {
    let minIndex = i;

    for (let j = i + 1; j < arr.length; j++) {
      minIndex = arr[j] < arr[minIndex] ? j : minIndex;
    }

    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
  }
  return arr;
}

export default selectionSort;
