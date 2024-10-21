import Bars from "./Bars";
import { useState, useCallback, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Description from "./Description";

export default function MergeSort({
  numBars,
  maxValue,
  speed,
}: {
  numBars: number;
  maxValue: number;
  speed: number;
}) {
  const [data, setData] = useState<{ id: string; value: number }[]>([]);

  const [leftIndices, setLeftIndices] = useState<number[]>([]);
  const [rightIndices, setRightIndices] = useState<number[]>([]);

  const SORTING_STATES = {
    PLAYING: "playing",
    PAUSED: "paused",
    STOPPED: "stopped",
  };

  const sortingStateRef = useRef(SORTING_STATES.STOPPED);
  const outerIndexRef = useRef(0);
  const innerIndexRef = useRef<null | number>(null);

  const setSortingState = (state: string) => {
    sortingStateRef.current = state;
  };
  const isPlaying = () => sortingStateRef.current === SORTING_STATES.PLAYING;

  const generateData = useCallback((n: number) => {
    // Reset sorting state
    setSortingState(SORTING_STATES.STOPPED);
    outerIndexRef.current = 0;
    innerIndexRef.current = null;
    setLeftIndices([]);
    setRightIndices([]);

    const newData = Array.from({ length: n }, () => ({
      id: uuidv4(), // Generate a unique ID for each object
      value: Math.floor(Math.random() * maxValue) + 1,
    }));

    setData(newData);
  }, []);

  const startSort = useCallback(async () => {
    if (isPlaying()) return; // Prevent starting if already sorting
    setSortingState(SORTING_STATES.PLAYING);

    let newData = [...data];
    let subarraySize = 1;
    while (subarraySize <= data.length * 2) {
      let left = 0;
      let right = left + subarraySize;

      while (left < data.length) {
        const leftSubarray = newData.slice(left, left + subarraySize);
        const rightSubarray = newData.slice(right, right + subarraySize);

        setLeftIndices(
          Array.from({ length: leftSubarray.length }, (_, i) => left + i)
        );
        setRightIndices(
          Array.from({ length: rightSubarray.length }, (_, i) => right + i)
        );

        await new Promise((resolve) => setTimeout(resolve, 250 / speed));
        const mergedArray = merge(leftSubarray, rightSubarray);
        newData.splice(left, mergedArray.length, ...mergedArray);

        setData([...newData]);
        await new Promise((resolve) => setTimeout(resolve, 250 / speed));

        left += subarraySize * 2;
        right += subarraySize * 2;
        await new Promise((resolve) => setTimeout(resolve, 250 / speed));
      }
      subarraySize *= 2;
    }

    function merge(
      left: { value: number; id: string }[],
      right: { value: number; id: string }[]
    ): { value: number; id: string }[] {
      const mergedArray: { value: number; id: string }[] = [];
      let leftPointer = 0;
      let rightPointer = 0;

      while (leftPointer < left.length && rightPointer < right.length) {
        if (left[leftPointer].value < right[rightPointer].value) {
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

    setLeftIndices([]);
    setRightIndices([]);
    setSortingState(SORTING_STATES.STOPPED);

    // Reset indices after completing the sort
    outerIndexRef.current = 0;
    innerIndexRef.current = null;
  }, [data, sortingStateRef, speed]);

  const pauseSort = useCallback(() => {
    if (isPlaying()) setSortingState(SORTING_STATES.PAUSED);
  }, []);

  useEffect(() => {
    generateData(numBars);
  }, []);

  useEffect(() => {
    generateData(numBars);
  }, [numBars]);

  return (
    <>
      <h1 className="text-4xl text-center font-bold mt-8">Merge Sort</h1>
      <Bars
        data={data}
        maxValue={maxValue}
        comparedIndices={leftIndices}
        numBars={numBars}
        highlightedIndices={rightIndices}
        speed={speed}
        generateData={generateData}
        startSort={startSort}
        pauseSort={pauseSort}
      />
      <Description description={description} />
    </>
  );
}

const description = {
  description:
    "Merge Sort is a divide-and-conquer comparison sorting algorithm. It works by recursively splitting the input list into smaller sublists until each sublist contains a single element. It then merges these sublists in a sorted manner to produce a final sorted list. Merge Sort is well-suited for large datasets due to its predictable time complexity.",
  link: "https://github.com/bzhang98/sorting-visualizer/blob/main/src/sorting_functions/merge-sort.ts",
  timeComplexity:
    "Merge Sort has a time complexity of O(n log n) in all cases (best, average, and worst). The list is split in half until each sublist contains a single element, which takes O(log n) time. Each time, the lists must be merged together, which is an O(n) operation, resulting in a time complexity of O(n log n).",
  spaceComplexity:
    "Merge Sort has a space complexity of O(n) because it requires additional memory for the temporary arrays used during the merging process.",
  stability:
    "Yes. Merge Sort is a stable sorting algorithm. Equal elements retain their relative order during the merging process.",
};
