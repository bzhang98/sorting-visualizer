import { ArrowUpRight } from "lucide-react";
import Bars from "./Bars";
import { useState, useCallback, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

export default function InsertionSort({
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
  const [lastSortedIndex, setLastSortedIndex] = useState<undefined | number>(
    undefined
  );

  const SORTING_STATES = {
    PLAYING: "playing",
    PAUSED: "paused",
    STOPPED: "stopped",
  };

  const sortingStateRef = useRef(SORTING_STATES.STOPPED);
  const outerIndexRef = useRef(1);
  const innerIndexRef = useRef<null | number>(null);

  const setSortingState = (state: string) => {
    sortingStateRef.current = state;
  };
  const isPlaying = () => sortingStateRef.current === SORTING_STATES.PLAYING;
  const isPaused = () => sortingStateRef.current === SORTING_STATES.PAUSED;
  const isStopped = () => sortingStateRef.current === SORTING_STATES.STOPPED;

  const generateData = useCallback((n: number) => {
    // Reset sorting state
    setSortingState(SORTING_STATES.STOPPED);
    outerIndexRef.current = 1;
    innerIndexRef.current = null;
    setLastSortedIndex(undefined);
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
      setLastSortedIndex(i);
      let j = innerIndexRef.current || i;
      innerIndexRef.current = null;

      setComparedIndices([j, j - 1]);
      await new Promise((resolve) => setTimeout(resolve, 250 / speed));

      while (j > 0 && newData[j - 1].value > newData[j].value) {
        if (isPaused()) {
          outerIndexRef.current = i;
          innerIndexRef.current = j;
          return;
        }

        if (isStopped()) {
          return;
        }

        setComparedIndices([j, j - 1]);

        [newData[j - 1], newData[j]] = [newData[j], newData[j - 1]];
        setData(newData);

        await new Promise((resolve) => setTimeout(resolve, 250 / speed));
        j--;
        setComparedIndices([j, j - 1]);
        await new Promise((resolve) => setTimeout(resolve, 250 / speed));
      }
    }

    setComparedIndices([]);
    setLastSortedIndex(undefined);
    setSortingState(SORTING_STATES.STOPPED);

    // Reset indices after completing the sort
    outerIndexRef.current = 1;
    innerIndexRef.current = null;
  }, [data, sortingStateRef]);

  const pauseSort = useCallback(() => {
    if (isPlaying()) setSortingState(SORTING_STATES.PAUSED);
  }, []);

  useEffect(() => {
    generateData(numBars);
  }, []);

  return (
    <>
      <h1 className="text-4xl text-center font-bold my-16">Insertion Sort</h1>
      <Bars
        data={data}
        maxValue={maxValue}
        comparedIndices={comparedIndices}
        numBars={numBars}
        highlightedIndex={lastSortedIndex}
        speed={speed}
        generateData={generateData}
        startSort={startSort}
        pauseSort={pauseSort}
      />
      <div className="text-lg max-w-[70%] p-8">
        <p className="mb-4">
          Insertion Sort sorts a list by taking elements one by one from an
          unsorted section and inserting them into their correct position in a
          growing sorted section. It's similar to sorting playing cards in your
          hand: you pick a card and place it in its proper position among the
          cards already sorted. Insertion Sort is efficient for small or nearly
          sorted lists, as it can shift elements instead of making many swaps.
        </p>
        <a
          href="https://github.com/bzhang98/sorting-visualizer/blob/main/src/sorting_functions/insertion-sort.ts"
          target="_blank"
          className="flex gap-2 items-center mb-8 hover:underline"
        >
          See the TypeScript implementation here <ArrowUpRight size={24} />
        </a>
        <ul>
          <li className="py-4 border-t-2 grid grid-cols-[12rem_1fr]">
            <strong>Time Complexity:</strong> Worst-case and average-case: O(n²)
            - occurs when the list is in reverse order. Best-case: O(n) - occurs
            when the list is already sorted, as each element only needs to be
            compared once.
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
