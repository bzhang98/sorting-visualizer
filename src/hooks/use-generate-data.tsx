import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import DataElement from "@/types/DataElement";
import { useAppContext } from "@/context/app-context";

export default function useGenerateData({
  generateSteps,
}: {
  generateSteps: (array: DataElement[]) => any;
}) {
  const {
    totalReset,
    setData,
    setSteps,
    numBars,
    minValue,
    maxValue,
    sortOrder,
    setSortingState,
  } = useAppContext();

  const generateData = useCallback(() => {
    // Common reset logic
    setSortingState("idle");
    totalReset();
    console.log(sortOrder);

    switch (sortOrder) {
      case "random": {
        const data = generateRandomData(numBars, minValue, maxValue);
        setData(data);
        setSteps(generateSteps(data));
        break;
      }

      case "almostSortedAscending": {
        const data = generateAlmostSortedAscendingData(
          numBars,
          minValue,
          maxValue
        );
        setData(data);
        setSteps(generateSteps(data));
        break;
      }
      case "almostSortedDescending": {
        const data = generateAlmostSortedDescendingData(
          numBars,
          minValue,
          maxValue
        );
        setData(data);
        setSteps(generateSteps(data));
        break;
      }
      case "sortedAscending": {
        const data = generatedSortedAscendingData(numBars, minValue, maxValue);
        setData(data);
        setSteps(generateSteps(data));
        break;
      }
      case "sortedDescending": {
        const data = generatedSortedDescendingData(numBars, minValue, maxValue);
        setData(data);
        setSteps(generateSteps(data));
        break;
      }
      default: {
        const data = generateRandomData(numBars, minValue, maxValue);
        setData(data);
        setSteps(generateSteps(data));
        break;
      }
    }
  }, [setSortingState, setData, sortOrder, numBars, minValue, maxValue]);

  return {
    generateData,
  };
}

function generateRandomData(
  numBars: number,
  minValue: number,
  maxValue: number
) {
  return Array.from({ length: numBars }, () => ({
    id: uuidv4(),
    value: Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue,
  }));
}

function generateAlmostSortedAscendingData(
  numBars: number,
  minValue: number,
  maxValue: number
) {
  const sortedArray = Array.from({ length: numBars }, () => ({
    id: uuidv4(),
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
    id: uuidv4(),
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
    id: uuidv4(),
    value: Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue,
  })).sort((a, b) => a.value - b.value);
}

function generatedSortedDescendingData(
  numBars: number,
  minValue: number,
  maxValue: number
) {
  return Array.from({ length: numBars }, () => ({
    id: uuidv4(),
    value: Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue,
  })).sort((a, b) => b.value - a.value);
}
