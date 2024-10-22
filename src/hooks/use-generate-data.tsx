import { useCallback, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function useGenerateData({
  numBars,
  minValue,
  maxValue,
  updateIsSorting,
  resetData,
}: {
  numBars: number;
  minValue: number;
  maxValue: number;
  updateIsSorting: (newState: "idle" | "playing" | "paused") => void;
  resetData: () => void;
}) {
  const [data, setData] = useState<{ id: string; value: number }[]>([]);
  const sortGeneratorRef = useRef<Generator | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const generateData = useCallback(
    (sortOrder: string) => {
      // Component-specific reset logic
      resetData();

      // Common reset logic
      updateIsSorting("idle");
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      switch (sortOrder) {
        case "random":
          setData(generateRandomData(numBars, minValue, maxValue));
          break;
        case "almostSortedAscending":
          setData(
            generateAlmostSortedAscendingData(numBars, minValue, maxValue)
          );
          break;
        case "almostSortedDescending":
          setData(
            generateAlmostSortedDescendingData(numBars, minValue, maxValue)
          );
          break;
        case "sortedAscending":
          setData(generatedSortedAscendingData(numBars, minValue, maxValue));
          break;
        case "sortedDescending":
          setData(generatedSortedDescendingData(numBars, minValue, maxValue));
          break;
        default:
          setData(generateRandomData(numBars, minValue, maxValue));
          break;
      }
      sortGeneratorRef.current = null;
    },
    [numBars, minValue, maxValue, resetData]
  );

  return {
    data,
    setData,
    sortGeneratorRef,
    animationFrameId,
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
