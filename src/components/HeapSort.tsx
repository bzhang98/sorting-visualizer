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
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const isSorting = useRef<"idle" | "playing" | "paused">("idle");
  const sortGeneratorRef = useRef<Generator | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const generateData = useCallback(() => {
    setComparedIndices([]);
    setHighlightedIndices([]);
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
  }, []);

  type HeapSortYield = {
    array: { id: string; value: number }[];
    action: "compare" | "swap" | "next" | "complete";
    comparedIndices: number[];
    highlightedIndices: number[];
  };

  function* heapSortGenerator(
    arr: { id: string; value: number }[]
  ): Generator<HeapSortYield> {
    const array = [...arr];

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
        action: "compare",
        comparedIndices: [
          index,
          leftChildIndex < heapSize ? leftChildIndex : -1,
        ],
        highlightedIndices: [heapSize < array.length ? heapSize - 1 : -1],
      };
      if (
        leftChildIndex < heapSize &&
        array[leftChildIndex].value > array[largestIndex].value
      ) {
        largestIndex = leftChildIndex;
      }

      yield {
        array,
        action: "compare",
        comparedIndices: [index, rightChildIndex],
        highlightedIndices: [heapSize < array.length ? heapSize - 1 : -1],
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
          action: "compare",
          comparedIndices: [index, largestIndex],
          highlightedIndices: [heapSize < array.length ? heapSize - 1 : -1],
        };
        [array[index], array[largestIndex]] = [
          array[largestIndex],
          array[index],
        ];

        yield {
          array,
          action: "swap",
          comparedIndices: [index, largestIndex],
          highlightedIndices: [heapSize < array.length ? heapSize - 1 : -1],
        };
        yield {
          array,
          action: "swap",
          comparedIndices: [index, largestIndex],
          highlightedIndices: [heapSize < array.length ? heapSize - 1 : -1],
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
        action: "compare",
        comparedIndices: [0, i],
        highlightedIndices: [i],
      };
      [array[0], array[i]] = [array[i], array[0]];

      yield {
        array,
        action: "compare",
        comparedIndices: [0, i],
        highlightedIndices: [i],
      };

      yield {
        array,
        action: "swap",
        comparedIndices: [0],
        highlightedIndices: [i],
      };
      yield {
        array,
        action: "swap",
        comparedIndices: [0],
        highlightedIndices: [i],
      };
      yield* percolate(array, 0, i);
    }

    return {
      array,
      action: "complete",
      comparedIndices: [],
      highlightedIndices: [],
    };
  }

  const step = useCallback(() => {
    if (!sortGeneratorRef.current || isSorting.current !== "playing") return;

    const next =
      sortGeneratorRef.current.next() as IteratorResult<HeapSortYield>;
    if (!next.done) {
      const { array, comparedIndices, highlightedIndices } = next.value;
      setData(array);
      setComparedIndices(comparedIndices);
      setHighlightedIndices(highlightedIndices);

      animationFrameId.current = requestAnimationFrame(() => {
        setTimeout(step, 250 / speed);
      });
    } else {
      isSorting.current = "idle";
      setComparedIndices([]);
      setHighlightedIndices([]);
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
        comparedIndices={comparedIndices}
        numBars={numBars}
        highlightedIndices={highlightedIndices}
        speed={speed}
        generateData={generateData}
        startSort={startSorting}
        pauseSort={pauseSorting}
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
