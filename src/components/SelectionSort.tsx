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

  type SelectionSortYield = {
    array: { id: string; value: number }[];
    action: "compare" | "swap" | "next" | "complete";
    comparedIndices: number[];
    highlightedIndices: number[];
  };

  function* selectionSortGenerator(
    arr: { id: string; value: number }[]
  ): Generator<SelectionSortYield> {
    const array = [...arr];
    for (let i = 0; i < array.length; i++) {
      let currentMinIndex = i;

      for (let j = i + 1; j < array.length; j++) {
        yield {
          array,
          action: "compare",
          comparedIndices: [currentMinIndex, j],
          highlightedIndices: [i],
        };
        if (array[j].value < array[currentMinIndex].value) {
          currentMinIndex = j;
        }
      }
      [array[i], array[currentMinIndex]] = [array[currentMinIndex], array[i]];
      yield {
        array,
        action: "swap",
        comparedIndices: [currentMinIndex, i],
        highlightedIndices: [i],
      };
      yield {
        array,
        action: "next",
        comparedIndices: [currentMinIndex, i],
        highlightedIndices: [i],
      };
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
      sortGeneratorRef.current.next() as IteratorResult<SelectionSortYield>;
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
    sortGeneratorRef.current = selectionSortGenerator([...data]);
    step();
  }, [isSorting, data, step]);

  const pauseSorting = useCallback(() => {
    isSorting.current = "paused";
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
  }, [isSorting]);

  useEffect(() => {
    generateData();
  }, []);

  return (
    <>
      <h1 className="text-4xl text-center font-bold mt-8">Selection Sort</h1>
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
          Selection Sort is an in-place comparison sorting algorithm. It works
          by repeatedly finding the minimum element from the unsorted portion of
          the list and swapping it with the first unsorted element. After each
          pass, the smallest element is selected and sorted. This process
          continues until the entire list is sorted. Like Bubble Sort, Selection
          Sort is easy to understand and implement, but it is inefficient on
          large lists due to its O(n²) time complexity.
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
            <strong>Time Complexity:</strong> Selection sort is O(n²) in all
            cases (best, average, and worst). The algorithm always has to make
            the same number of comparisons to find the minimum value in the
            unsorted partition, regardless of the input data.
          </li>
          <li className="py-4 border-t-2 grid grid-cols-[12rem_1fr]">
            <strong>Space Complexity:</strong> Because Selection Sort is
            implemented iteratively and does not require any additional memory,
            it has a O(1) space complexity.
          </li>
          <li className="py-4 border-t-2 border-b-2 grid grid-cols-[12rem_1fr]">
            <strong>Stable:</strong> No. Selection Sort is not stable because it
            swaps non-adjacent elements. This can result in the relative order
            of equal elements changing.
          </li>
        </ul>
      </div>
    </>
  );
}
