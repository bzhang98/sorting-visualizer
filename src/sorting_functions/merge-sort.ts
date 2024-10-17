function mergeSort(array: number[]): number[] {
  if (array.length <= 1) {
    return array;
  }

  const middle = Math.floor(array.length / 2);
  const left = array.slice(0, middle);
  const right = array.slice(middle);

  return merge(mergeSort(left), mergeSort(right));
}

function merge(left: number[], right: number[]): number[] {
  const mergedArray: number[] = [];
  let leftPointer = 0;
  let rightPointer = 0;

  while (leftPointer < left.length && rightPointer < right.length) {
    if (left[leftPointer] < right[rightPointer]) {
      mergedArray.push(left[leftPointer]);
      leftPointer++;
    } else {
      mergedArray.push(right[rightPointer]);
      rightPointer++;
    }
  }

  mergedArray.push(...left.slice(leftPointer));
  mergedArray.push(...right.slice(rightPointer));

  return mergedArray;
}
export default mergeSort;
