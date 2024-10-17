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
    </>
  );
}
