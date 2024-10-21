import Bars from "./Bars";
import { useState, useCallback, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Description from "./Description";

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
  const [sortedPartition, setSortedPartition] = useState<number[]>([]);
  const isSorting = useRef<"idle" | "playing" | "paused">("idle");
  const sortGeneratorRef = useRef<Generator | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const generateData = useCallback(() => {
    setComparedIndices([]);
    setSortedPartition([]);
    isSorting.current = "idle";
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    const newData = Array.from({ length: numBars }, () => ({
      id: uuidv4(),
      value: Math.floor(Math.random() * maxValue) + 1,
    }));

    setData(newData);
    sortGeneratorRef.current = null;
  }, [numBars, maxValue]);

  useEffect(() => {
    generateData();
  }, [numBars, generateData]);

  type HeapSortYield = {
    array: { id: string; value: number }[];
    comparedIndices: number[];
    sortedPartition: number[] | null;
  };

  function* heapSortGenerator(
    array: { id: string; value: number }[]
  ): Generator<HeapSortYield> {
    // Build max heap
    function* percolate(
      array: { id: string; value: number }[],
      index: number,
      heapSize: number
    ): Generator<HeapSortYield> {
      let largestIndex = index;
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;

      if (leftChildIndex >= heapSize) {
        return;
      }

      yield {
        array,
        comparedIndices: [index, leftChildIndex],
        sortedPartition: Array.from(
          { length: array.length - heapSize },
          (_, i) => heapSize + i
        ),
      };
      if (
        leftChildIndex < heapSize &&
        array[leftChildIndex].value > array[largestIndex].value
      ) {
        largestIndex = leftChildIndex;
      }

      yield {
        array,
        comparedIndices: [index, rightChildIndex],
        sortedPartition: Array.from(
          { length: array.length - heapSize },
          (_, i) => heapSize + i
        ),
      };
      if (
        rightChildIndex < heapSize &&
        array[rightChildIndex].value > array[largestIndex].value
      ) {
        largestIndex = rightChildIndex;
      }

      if (largestIndex !== index) {
        yield {
          array,
          comparedIndices: [index, largestIndex],
          sortedPartition: Array.from(
            { length: array.length - heapSize },
            (_, i) => heapSize + i
          ),
        };
        [array[index], array[largestIndex]] = [
          array[largestIndex],
          array[index],
        ];

        yield {
          array,
          comparedIndices: [index, largestIndex],
          sortedPartition: Array.from(
            { length: array.length - heapSize },
            (_, i) => heapSize + i
          ),
        };
        yield {
          array,
          comparedIndices: [index, largestIndex],
          sortedPartition: Array.from(
            { length: array.length - heapSize },
            (_, i) => heapSize + i
          ),
        };
        yield* percolate(array, largestIndex, heapSize);
      }
    }

    for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
      yield* percolate(array, i, array.length);
    }

    // Heap sort
    for (let i = array.length - 1; i >= 0; i--) {
      yield {
        array,
        comparedIndices: [0, i],
        sortedPartition: Array.from(
          { length: array.length - i },
          (_, j) => i + j
        ),
      };
      [array[0], array[i]] = [array[i], array[0]];

      yield {
        array,
        comparedIndices: [0, i],
        sortedPartition: Array.from(
          { length: array.length - i },
          (_, j) => i + j
        ),
      };

      yield {
        array,
        comparedIndices: [0],
        sortedPartition: Array.from(
          { length: array.length - i },
          (_, j) => i + j
        ),
      };
      yield {
        array,
        comparedIndices: [0],
        sortedPartition: Array.from(
          { length: array.length - i },
          (_, j) => i + j
        ),
      };
      yield* percolate(array, 0, i);
    }
  }

  const step = useCallback(() => {
    if (!sortGeneratorRef.current || isSorting.current !== "playing") return;

    const next =
      sortGeneratorRef.current.next() as IteratorResult<HeapSortYield>;
    if (!next.done) {
      const { array, comparedIndices, sortedPartition } = next.value;
      setData(array);
      setComparedIndices(comparedIndices);
      setSortedPartition(sortedPartition || []);

      animationFrameId.current = requestAnimationFrame(() => {
        setTimeout(step, 250 / speed);
      });
    } else {
      isSorting.current = "idle";
      setComparedIndices([]);
      setSortedPartition([]);
    }
  }, [speed, isSorting]);

  const startSorting = useCallback(() => {
    if (isSorting.current === "playing") return;

    if (isSorting.current === "paused") {
      isSorting.current = "playing";
      step();
      return;
    }

    isSorting.current = "playing";
    sortGeneratorRef.current = heapSortGenerator([...data]);
    step();
  }, [isSorting, data, step]);

  const pauseSorting = useCallback(() => {
    isSorting.current = "paused";
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
  }, [isSorting]);

  return (
    <>
      <h1 className="text-4xl text-center font-bold mt-8">Heap Sort</h1>
      <Bars
        data={data}
        maxValue={maxValue}
        numBars={numBars}
        highlightedIndices={[
          { color: "lightcoral", indices: comparedIndices },
          { color: "limegreen", indices: sortedPartition },
        ]}
        speed={speed}
        generateData={generateData}
        startSort={startSorting}
        pauseSort={pauseSorting}
      />
      <Description description={description} />
    </>
  );
}

const description = {
  description:
    "Heap Sort is a comparison-based sorting algorithm that uses a binary heap data structure. It sorts a list by first building a max heap from the data, then repeatedly removing the largest element from the heap and rebuilding it until the heap is empty. Heap Sort is efficient for larger datasets, as it has a consistent time complexity.",
  link: "https://github.com/bzhang98/sorting-visualizer/blob/main/src/sorting_functions/heap-sort.ts",
  timeComplexity:
    "Heap Sort has an average, worst, and best-case time complexity of O(n log n), as building the heap takes O(n) time, and each removal operation takes O(log n) time over n elements.",
  spaceComplexity:
    "Heap Sort has a space complexity of O(1) if implemented iteratively, as it sorts the list in place without requiring additional memory for another data structure.",
  stability:
    "No. Heap Sort is not a stable sorting algorithm because the relative order of equal elements may not be preserved during the heap-building process.",
};
