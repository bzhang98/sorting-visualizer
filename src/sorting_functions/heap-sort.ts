function percolate(arr: number[], index: number, heapSize: number) {
  let largestIndex = index;
  let leftChildIndex = 2 * index + 1;
  let rightChildIndex = 2 * index + 2;

  if (leftChildIndex >= heapSize) {
    return;
  }

  if (leftChildIndex < heapSize && arr[leftChildIndex] > arr[largestIndex]) {
    largestIndex = leftChildIndex;
  }

  if (rightChildIndex < heapSize && arr[rightChildIndex] > arr[largestIndex]) {
    largestIndex = rightChildIndex;
  }

  if (largestIndex !== index) {
    [arr[index], arr[largestIndex]] = [arr[largestIndex], arr[index]];
    percolate(arr, largestIndex, heapSize);
  }
}

function heapifyArray(arr: number[]) {
  const lastIndexWithChildren = Math.floor(arr.length / 2) - 1;
  for (let i = lastIndexWithChildren; i >= 0; i--) {
    percolate(arr, i, arr.length);
  }
}

function heapSort(arr: number[]): number[] {
  const arrCopy = [...arr];
  heapifyArray(arrCopy);

  for (let i = arr.length - 1; i >= 0; i--) {
    [arrCopy[0], arrCopy[i]] = [arrCopy[i], arrCopy[0]];
    percolate(arrCopy, 0, i);
  }

  return arrCopy;
}

export default heapSort;
