import { ArrowUpRight } from "lucide-react";
import Bars from "./Bars";
import { useState, useCallback, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

export default function SelectionSort({
  numBars,
  maxValue,
  speed,
}: {
  numBars: number;
  maxValue: number;
  speed: number;
}) {
  const [data, setData] = useState<{ id: string; value: number }[]>([]);

  const [comparedIndices, setComparedIndices] = useState<number[]>([]);
  const [firstUnsortedIndex, setFirstUnsortedIndex] = useState<
    undefined | number
  >(undefined);

  const SORTING_STATES = {
    PLAYING: "playing",
    PAUSED: "paused",
    STOPPED: "stopped",
  };

  const sortingStateRef = useRef(SORTING_STATES.STOPPED);
  const outerIndexRef = useRef(0);

  const setSortingState = (state: string) => {
    sortingStateRef.current = state;
  };
  const isPlaying = () => sortingStateRef.current === SORTING_STATES.PLAYING;
  const isPaused = () => sortingStateRef.current === SORTING_STATES.PAUSED;
  const isStopped = () => sortingStateRef.current === SORTING_STATES.STOPPED;

  const generateData = useCallback((n: number) => {
    // Reset sorting state
    setSortingState(SORTING_STATES.STOPPED);
    outerIndexRef.current = 0;

    setComparedIndices([]);
    setFirstUnsortedIndex(undefined);

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
    const len = newData.length;

    for (let i = outerIndexRef.current; i < len; i++) {
      let minIndex = i;
      setFirstUnsortedIndex(i);
      for (let j = outerIndexRef.current + 1; j < len; j++) {
        if (isPaused()) {
          // Save current indices for resuming later
          outerIndexRef.current = i;
          return;
        }

        if (isStopped()) {
          return;
        }

        setComparedIndices([j, minIndex]);
        await new Promise((resolve) => setTimeout(resolve, 250 / speed));
        minIndex = newData[j].value < newData[minIndex].value ? j : minIndex;
      }
      setComparedIndices([i, minIndex]);
      await new Promise((resolve) => setTimeout(resolve, 250 / speed));
      [newData[i], newData[minIndex]] = [newData[minIndex], newData[i]];
      setData([...newData]);
      outerIndexRef.current = i;
      await new Promise((resolve) => setTimeout(resolve, 250 / speed));
    }

    setComparedIndices([]);
    setFirstUnsortedIndex(undefined);
    setSortingState(SORTING_STATES.STOPPED);

    // Reset indices after completing the sort
    outerIndexRef.current = 0;
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
      <h1 className="text-4xl text-center font-bold my-16">Selection Sort</h1>
      <Bars
        data={data}
        maxValue={maxValue}
        comparedIndices={comparedIndices}
        numBars={numBars}
        highlightedIndex={firstUnsortedIndex}
        speed={speed}
        generateData={generateData}
        startSort={startSort}
        pauseSort={pauseSort}
      />
      <div className="text-lg max-w-[70%] p-8">
        <p className="mb-4">
          Selection Sort is a simple comparison-based sorting algorithm that
          works by repeatedly finding the minimum element from the unsorted
          portion of the list and swapping it with the first unsorted element.
          This process continues until the entire list is sorted. Selection Sort
          is intuitive and easy to understand but performs poorly on large
          datasets due to the number of comparisons it makes, even if the list
          is already sorted.
        </p>
        <a
          href="https://github.com/bzhang98/sorting-visualizer/blob/main/src/sorting_functions/selection-sort.ts"
          target="_blank"
          className="flex gap-2 items-center mb-8 hover:underline"
        >
          See the TypeScript implementation here <ArrowUpRight size={24} />
        </a>
        <ul>
          <li className="py-4 border-t-2 grid grid-cols-[12rem_1fr]">
            <strong>Time Complexity:</strong> Worst-case, average-case, and
            best-case: O(n²) - occurs because the algorithm always iterates over
            the remaining unsorted elements to find the minimum, regardless of
            the list's initial order.
          </li>
          <li className="py-4 border-t-2 grid grid-cols-[12rem_1fr]">
            <strong>Space Complexity:</strong> O(1)
          </li>
          <li className="py-4 border-t-2 border-b-2 grid grid-cols-[12rem_1fr]">
            <strong>Stable:</strong> No
          </li>
        </ul>
      </div>
    </>
  );
}
