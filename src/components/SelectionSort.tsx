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
  }, [data, sortingStateRef]);

  const pauseSort = useCallback(() => {
    if (isPlaying()) setSortingState(SORTING_STATES.PAUSED);
  }, []);

  useEffect(() => {
    generateData(numBars);
  }, []);

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
    </>
  );
}
