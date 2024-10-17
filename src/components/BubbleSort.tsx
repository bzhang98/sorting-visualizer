import { useState, useCallback, useEffect, useRef } from "react";
import Bars from "./Bars";
import { v4 as uuidv4 } from "uuid";
import { ArrowUpRight } from "lucide-react";

export default function BubbleSort({
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

  const SORTING_STATES = {
    PLAYING: "playing",
    PAUSED: "paused",
    STOPPED: "stopped",
  };

  const sortingStateRef = useRef(SORTING_STATES.STOPPED);
  const outerIndexRef = useRef(0);
  const innerIndexRef = useRef(0);

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
    innerIndexRef.current = 0;
    setComparedIndices([]);

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
      for (let j = innerIndexRef.current; j < len - i - 1; j++) {
        if (isPaused()) {
          // Save current indices for resuming later
          outerIndexRef.current = i;
          innerIndexRef.current = j;
          return;
        }

        if (isStopped()) {
          return;
        }

        setComparedIndices([j, j + 1]);
        await new Promise((resolve) => setTimeout(resolve, 250 / speed));

        if (newData[j].value > newData[j + 1].value) {
          [newData[j], newData[j + 1]] = [newData[j + 1], newData[j]];

          setData([...newData]);
          await new Promise((resolve) => setTimeout(resolve, 250 / speed));
        }
      }
      // Reset inner loop index at the end of each outer iteration
      innerIndexRef.current = 0;
    }

    setComparedIndices([]);
    setSortingState(SORTING_STATES.STOPPED);

    // Reset indices after completing the sort
    outerIndexRef.current = 0;
    innerIndexRef.current = 0;
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
      <h1 className="text-4xl text-center font-bold my-16">Bubble Sort</h1>
      <Bars
        data={data}
        maxValue={maxValue}
        comparedIndices={comparedIndices}
        numBars={numBars}
        speed={speed}
        generateData={generateData}
        startSort={startSort}
        pauseSort={pauseSort}
      />
      <div className="text-lg max-w-[70%] p-8">
        <p className="mb-4">
          Bubble Sort is an in-place comparison sorting algorithm that
          repeatedly compares adjacent elements in a list and swaps them if they
          are out of order. This process continues until the list is sorted,
          with each pass moving the next largest element to its correct
          position, hence its name (the largest element "bubbles" up to the
          top). While easy to understand and implement, Bubble Sort is
          inefficient for large datasets due to its repeated comparisons and
          swaps.
        </p>
        <a
          href="https://github.com/bzhang98/sorting-visualizer/blob/main/src/sorting_functions/bubble-sort.ts"
          target="_blank"
          className="flex gap-2 items-center mb-8 hover:underline"
        >
          See the TypeScript implementation here <ArrowUpRight size={24} />
        </a>
        <ul>
          <li className="py-4 border-t-2 grid grid-cols-[12rem_1fr]">
            <strong>Time Complexity:</strong> Worst-case and average-case: O(n²)
            - occurs when the list is in reverse order or unsorted. Best-case:
            O(n) is possible with an optimized version that terminates early if
            no swaps are needed.
          </li>
          <li className="py-4 border-t-2 grid grid-cols-[12rem_1fr]">
            <strong>Space Complexity:</strong> O(1)
          </li>
          <li className="py-4 border-t-2 border-b-2 grid grid-cols-[12rem_1fr]">
            <strong>Stable:</strong> Yes
          </li>
        </ul>
      </div>
    </>
  );
}
