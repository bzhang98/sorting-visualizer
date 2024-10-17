function insertionSort(arr: number[]): number[] {
  const arrCopy = [...arr];
  for (let i = 1; i < arrCopy.length; i++) {
    let j = i;
    while (j > 0 && arrCopy[j - 1] > arrCopy[j]) {
      [arrCopy[j - 1], arrCopy[j]] = [arrCopy[j], arrCopy[j - 1]];
      j--;
    }
  }

  return arrCopy;
}

export default insertionSort;
