import { ArrowUpRight } from "lucide-react";
import Bars from "./Bars";
import { useState, useCallback, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

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
  const [lastSortedIndex, setLastSortedIndex] = useState<undefined | number>(
    undefined
  );

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
    setLastSortedIndex(undefined);
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
    setLastSortedIndex(undefined);
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
      <div className="text-lg max-w-[70%] p-8">
        <p className="mb-4">
          Merge Sort sorts a list by dividing it into progressively larger
          sorted sublists and then merging these sorted sublists together. The
          bottom-up implementation starts by treating each individual element as
          a sorted sublist, then merges adjacent sublists of increasing size
          until the entire list is sorted. What you see is this process in
          action—small groups being merged into larger sorted groups until they
          form one fully sorted list. Merge Sort is efficient for larger lists
          because it divides the problem into smaller parts and handles them
          systematically.
        </p>
        <a
          href="https://github.com/bzhang98/sorting-visualizer/blob/main/src/sorting_functions/merge-sort.ts"
          target="_blank"
          className="flex gap-2 items-center mb-8 hover:underline"
        >
          See the TypeScript implementation here <ArrowUpRight size={24} />
        </a>
        <ul>
          <li className="py-4 border-t-2 grid grid-cols-[12rem_1fr]">
            <strong>Time Complexity:</strong> Worst-case, best-case, and
            average-case: O(n log n) - due to the repeated division and merging
            of sublists.
          </li>
          <li className="py-4 border-t-2 grid grid-cols-[12rem_1fr]">
            <strong>Space Complexity:</strong> O(n) - extra space is required
            for temporary arrays during the merging process.
          </li>
          <li className="py-4 border-t-2 border-b-2 grid grid-cols-[12rem_1fr]">
            <strong>Stable:</strong> Yes
          </li>
        </ul>
      </div>
    </>
  );
}
