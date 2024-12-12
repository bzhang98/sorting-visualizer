function generateRandomData(
  numBars: number,
  minValue: number,
  maxValue: number
) {
  return Array.from({ length: numBars }, () => ({
    id: crypto.randomUUID(),
    value: Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue,
  }));
}

function generateAlmostSortedAscendingData(
  numBars: number,
  minValue: number,
  maxValue: number
) {
  const sortedArray = Array.from({ length: numBars }, () => ({
    id: crypto.randomUUID(),
    value: Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue,
  })).sort((a, b) => a.value - b.value);

  for (let i = 0; i < numBars; i++) {
    if (Math.random() < 0.3) {
      // 30% chance of perturbation
      const swapIndex = Math.min(
        i + Math.floor(Math.random() * 2) + 1,
        numBars - 1
      );
      [sortedArray[i], sortedArray[swapIndex]] = [
        sortedArray[swapIndex],
        sortedArray[i],
      ];
    }
  }

  return sortedArray;
}

function generateAlmostSortedDescendingData(
  numBars: number,
  minValue: number,
  maxValue: number
) {
  const sortedArray = Array.from({ length: numBars }, () => ({
    id: crypto.randomUUID(),
    value: Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue,
  })).sort((a, b) => b.value - a.value);

  for (let i = 0; i < numBars; i++) {
    if (Math.random() < 0.3) {
      // 30% chance of perturbation
      const swapIndex = Math.min(
        i + Math.floor(Math.random() * 2) + 1,
        numBars - 1
      );
      [sortedArray[i], sortedArray[swapIndex]] = [
        sortedArray[swapIndex],
        sortedArray[i],
      ];
    }
  }

  return sortedArray;
}

function generatedSortedAscendingData(
  numBars: number,
  minValue: number,
  maxValue: number
) {
  return Array.from({ length: numBars }, () => ({
    id: crypto.randomUUID(),
    value: Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue,
  })).sort((a, b) => a.value - b.value);
}

function generatedSortedDescendingData(
  numBars: number,
  minValue: number,
  maxValue: number
) {
  return Array.from({ length: numBars }, () => ({
    id: crypto.randomUUID(),
    value: Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue,
  })).sort((a, b) => b.value - a.value);
}

export {
  generateRandomData,
  generateAlmostSortedAscendingData,
  generateAlmostSortedDescendingData,
  generatedSortedAscendingData,
  generatedSortedDescendingData,
};
