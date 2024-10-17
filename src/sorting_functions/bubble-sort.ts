function bubbleSort(array: number[]): number[] {
  const arrayCopy = [...array];
  for (let i = 0; i < arrayCopy.length; i++) {
    for (let j = 0; j < arrayCopy.length - i; j++) {
      if (arrayCopy[j] > arrayCopy[j + 1]) {
        [arrayCopy[j], arrayCopy[j + 1]] = [arrayCopy[j + 1], arrayCopy[j]];
      }
    }
  }
  return arrayCopy;
}

export default bubbleSort;
