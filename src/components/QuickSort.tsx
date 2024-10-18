import Bars from "./Bars";
import { useState, useCallback, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Description from "./Description";

export default function QuickSort({
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

  const setSortingState = (state: string) => {
    sortingStateRef.current = state;
  };
  const isPlaying = () => sortingStateRef.current === SORTING_STATES.PLAYING;
  const isStopped = () => sortingStateRef.current === SORTING_STATES.STOPPED;

  const generateData = useCallback((n: number) => {
    // Reset sorting state
    setSortingState(SORTING_STATES.STOPPED);
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

    await quickSortInPlace(newData);

    async function quickSortInPlace(
      arr: { id: string; value: number }[],
      left = 0,
      right = arr.length - 1
    ) {
      if (left >= right) return;

      const pivot = arr[right].value;
      let j = left - 1;

      for (let i = left; i <= right; i++) {
        if (isStopped()) {
          return;
        }
        setComparedIndices([i, right]);
        await new Promise((resolve) => setTimeout(resolve, 250 / speed));
        if (arr[i].value > pivot) continue;

        j++;
        if (i > j) {
          setComparedIndices([i, j]);
          await new Promise((resolve) => setTimeout(resolve, 250 / speed));
          [arr[i], arr[j]] = [arr[j], arr[i]];
          setData([...arr]);
          await new Promise((resolve) => setTimeout(resolve, 250 / speed));
        }
      }

      await quickSortInPlace(arr, left, j - 1);
      await quickSortInPlace(arr, j + 1, right);
    }

    setComparedIndices([]);
    setSortingState(SORTING_STATES.STOPPED);

    // Reset indices after completing the sort
    console.log("got here");
  }, [data, sortingStateRef, speed]);

  const pauseSort = useCallback(() => {
    if (!isPlaying()) return;
    alert(
      "Sorry, you can't pause Quick Sort (yet). Please stop the sort instead."
    );
  }, []);

  useEffect(() => {
    generateData(numBars);
  }, []);

  useEffect(() => {
    generateData(numBars);
  }, [numBars]);

  return (
    <>
      <h1 className="text-4xl text-center font-bold mt-8">Quick Sort</h1>
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
      <Description description={description} />
    </>
  );
}

const description = {
  description:
    "Quick Sort is a divide-and-conquer comparison sorting algorithm. It sorts a list by selecting a 'pivot' element, partitioning the list into two halves—elements less than the pivot and elements greater than the pivot—and recursively sorting the sublists. Quick Sort is known for its efficiency on average and is often used in practice due to its low overhead and in-place sorting.",
  link: "https://github.com/bzhang98/sorting-visualizer/blob/main/src/sorting_functions/quick-sort-inplace.ts",
  timeComplexity:
    "In the average and best cases, Quick Sort has a time complexity of O(n log n) due to the balanced partitioning of the list. However, in the worst case (e.g., when the pivot selection results in highly unbalanced partitions), its time complexity is O(n²).",
  spaceComplexity:
    "Quick Sort has a space complexity of O(log n) due to the recursive calls in the stack when implemented in-place. If implemented with additional memory for partitions, space complexity can increase.",
  stability:
    "No. Quick Sort is not a stable sorting algorithm. Equal elements might not retain their relative order during the partitioning process.",
};
