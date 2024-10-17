import Bars from "./Bars";
import { useState, useCallback, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { ArrowUpRight } from "lucide-react";

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
  const isHeapifying = useRef(true);
  const outerIndexRef = useRef<null | number>(null);

  const setSortingState = (state: string) => {
    sortingStateRef.current = state;
  };
  const isPlaying = () => sortingStateRef.current === SORTING_STATES.PLAYING;
  const isPaused = () => sortingStateRef.current === SORTING_STATES.PAUSED;
  const isStopped = () => sortingStateRef.current === SORTING_STATES.STOPPED;

  const generateData = useCallback((n: number) => {
    // Reset sorting state
    setSortingState(SORTING_STATES.STOPPED);
    isHeapifying.current = true;
    outerIndexRef.current = null;
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

    async function percolate(
      arr: { id: string; value: number }[],
      index: number,
      heapSize: number
    ) {
      if (isStopped()) {
        setComparedIndices([]);
        return arr;
      }
      const newArray = [...arr];
      let largestIndex = index;
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;

      if (leftChildIndex < heapSize) {
        setComparedIndices([index, leftChildIndex]);
        await new Promise((resolve) => setTimeout(resolve, 250 / speed));

        if (newArray[leftChildIndex].value > newArray[largestIndex].value) {
          largestIndex = leftChildIndex;
        }
      }

      if (rightChildIndex < heapSize) {
        setComparedIndices([index, rightChildIndex]);
        await new Promise((resolve) => setTimeout(resolve, 250 / speed));

        if (newArray[rightChildIndex].value > newArray[largestIndex].value) {
          largestIndex = rightChildIndex;
        }
      }

      setComparedIndices([index, largestIndex]);
      await new Promise((resolve) => setTimeout(resolve, 250 / speed));

      if (largestIndex !== index) {
        [newArray[index], newArray[largestIndex]] = [
          newArray[largestIndex],
          newArray[index],
        ];
        setData(newArray);

        await new Promise((resolve) => setTimeout(resolve, 250 / speed));
        return percolate(newArray, largestIndex, heapSize);
      }
      return newArray;
    }

    let heapifiedData = [...data];
    if (isHeapifying.current) {
      const lastIndexWithChildren =
        outerIndexRef.current || Math.floor(heapifiedData.length / 2) - 1;
      for (let i = lastIndexWithChildren; i >= 0; i--) {
        if (isPaused()) {
          outerIndexRef.current = i;
          return;
        }
        if (isStopped()) {
          return;
        }
        heapifiedData = await percolate(heapifiedData, i, data.length);
      }
      setData(heapifiedData);
      isHeapifying.current = false;
      outerIndexRef.current = null;
    }

    let newData = [...heapifiedData];
    const len = outerIndexRef.current || newData.length - 1;
    for (let i = len; i >= 0; i--) {
      if (isPaused()) {
        outerIndexRef.current = i;
        return;
      }
      if (isStopped()) {
        return;
      }
      setComparedIndices([0, i]);
      await new Promise((resolve) => setTimeout(resolve, 250 / speed));

      [newData[0], newData[i]] = [newData[i], newData[0]];
      setData([...newData]);
      await new Promise((resolve) => setTimeout(resolve, 250 / speed));
      newData = await percolate(newData, 0, i);
      setLastSortedIndex(i - 1);
    }

    setComparedIndices([]);
    setLastSortedIndex(undefined);
    setSortingState(SORTING_STATES.STOPPED);
    isHeapifying.current = true;

    // Reset indices after completing the sort
    outerIndexRef.current = 1;
  }, [data, sortingStateRef]);

  const pauseSort = useCallback(() => {
    if (isPlaying()) setSortingState(SORTING_STATES.PAUSED);
  }, []);

  useEffect(() => {
    generateData(numBars);
  }, []);

  return (
    <>
      <h1 className="text-4xl text-center font-bold my-16">Heap Sort</h1>
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
          Heap Sort is a comparison-based sorting algorithm that first
          transforms the list into a binary heap, a tree-like structure where
          each parent node is larger (for a max-heap) than its child nodes.
          After building the heap, the algorithm repeatedly swaps the largest
          element (root) with the last element of the heap and reduces the heap
          size, restoring the heap property each time. This results in a sorted
          list as the elements are extracted in descending order.
        </p>
        <a
          href="https://github.com/bzhang98/sorting-visualizer/blob/main/src/sorting_functions/heap-sort.ts"
          target="_blank"
          className="flex gap-2 items-center mb-8 hover:underline"
        >
          See the TypeScript implementation here <ArrowUpRight size={24} />
        </a>
        <ul>
          <li className="py-4 border-t-2 grid grid-cols-[12rem_1fr]">
            <strong>Time Complexity:</strong> Worst-case, average-case, and
            best-case: O(n log n) - occurs because of the heap-building process
            and the repeated operations of heapifying after each extraction.
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
