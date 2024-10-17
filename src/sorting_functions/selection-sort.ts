function selectionSort(arr: number[]): number[] {
  const arrCopy = [...arr];
  for (let i = 0; i < arrCopy.length; i++) {
    let minIndex = i;

    for (let j = i + 1; j < arrCopy.length; j++) {
      minIndex = arrCopy[j] < arrCopy[minIndex] ? j : minIndex;
    }

    [arrCopy[i], arrCopy[minIndex]] = [arrCopy[minIndex], arrCopy[i]];
  }
  return arrCopy;
}

export default selectionSort;
