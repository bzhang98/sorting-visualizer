import { ArrowUpRight } from "lucide-react";
import Bars from "./Bars";
import { useState, useCallback, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

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
      <div className="text-lg max-w-[70%] p-8">
        <p className="mb-4">
          Quick Sort sorts a list by selecting a "pivot" element and
          partitioning the remaining elements into two subarrays: those less
          than the pivot and those greater than or equal to it. It then
          recursively sorts each subarray. The pivot acts as a divider, ensuring
          that all elements to its left are smaller and those to its right are
          larger. This process continues until all elements are sorted. Quick
          Sort is efficient for large datasets and works well when the pivot
          divides the list into nearly equal parts.
        </p>
        <a
          href="https://github.com/bzhang98/sorting-visualizer/blob/main/src/sorting_functions/quick-sort-inplace.ts"
          target="_blank"
          className="flex gap-2 items-center mb-8 hover:underline"
        >
          See the TypeScript implementation here <ArrowUpRight size={24} />
        </a>
        <ul>
          <li className="py-4 border-t-2 grid grid-cols-[12rem_1fr]">
            <strong>Time Complexity:</strong> Worst-case: O(n²) - occurs when
            the pivot consistently selects the smallest or largest element, such
            as when the list is already sorted or nearly sorted. This can be
            mitigated through better pivot selection strategies including
            randomization or the median-of-three method. Average-case and
            best-case: O(n log n) when the pivot consistently divides the list
            into two nearly equal parts.
          </li>
          <li className="py-4 border-t-2 grid grid-cols-[12rem_1fr]">
            <strong>Space Complexity:</strong> O(n log n) due to the recursion
            stack.
          </li>
          <li className="py-4 border-t-2 border-b-2 grid grid-cols-[12rem_1fr]">
            <strong>Stable:</strong> No
          </li>
        </ul>
      </div>
    </>
  );
}
