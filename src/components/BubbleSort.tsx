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
  const isSorting = useRef<"idle" | "playing" | "paused">("idle");
  const sortGeneratorRef = useRef<Generator | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const generateData = useCallback(() => {
    setComparedIndices([]);
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
  }, [generateData]);

  type BubbleSortYield = {
    array: { id: string; value: number }[];
    action: "compare" | "swap" | "next" | "complete";
    indices: number[];
  };

  function* bubbleSortGenerator(
    arr: { id: string; value: number }[]
  ): Generator<BubbleSortYield> {
    const array = [...arr];
    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        yield {
          array: [...array],
          action: "compare",
          indices: [j, j + 1],
        };

        if (array[j].value > array[j + 1].value) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          yield {
            array: [...array],
            action: "swap",
            indices: [j, j + 1],
          };
        }

        yield {
          array: [...array],
          action: "next",
          indices: [],
        };
      }
    }
    return { array, action: "complete", indices: [] };
  }

  const step = useCallback(() => {
    if (!sortGeneratorRef.current || isSorting.current !== "playing") return;

    const next =
      sortGeneratorRef.current.next() as IteratorResult<BubbleSortYield>;
    if (!next.done) {
      const { array, action, indices } = next.value;
      setData(array);
      setComparedIndices(indices);

      if (action !== "next") {
        animationFrameId.current = requestAnimationFrame(() => {
          setTimeout(step, 250 / speed);
        });
      } else {
        step();
      }
    } else {
      isSorting.current = "idle";
      setComparedIndices([]);
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
    sortGeneratorRef.current = bubbleSortGenerator([...data]);
    step();
  }, [isSorting, data, step]);

  const pauseSorting = useCallback(() => {
    isSorting.current = "paused";
    setComparedIndices([]);
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
  }, [isSorting]);

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
        startSort={startSorting}
        pauseSort={pauseSorting}
      />
      <div className="text-lg max-w-[70%] p-8">
        <p className="mb-4">
          Bubble Sort is an in-place comparison sorting algorithm. It works by
          repeatedly comparing adjacent elements and swaps them if they are out
          of order. This process continues until the list is sorted, with each
          pass moving the next largest element to its correct position. Hence
          the largest element "bubbles" up to the top. While easy to understand
          and implement, Bubble Sort is inefficient for large datasets due to
          the O(n²) time complexity.
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
            <strong>Time Complexity:</strong> In the average and worst cases,
            Bubble Sort is O(n²) - occurs when the list is in reverse order or
            unsorted. In the best case, Bubble Sort is O(n) - this is possible
            with an optimization that stops the algorithm if no swaps are made
            in a pass, i.e. the list is already sorted.
          </li>
          <li className="py-4 border-t-2 grid grid-cols-[12rem_1fr]">
            <strong>Space Complexity:</strong> Because Bubble Sort is typically
            implemented iteratively and does not require any additional memory,
            it has a O(1) space complexity.
          </li>
          <li className="py-4 border-t-2 border-b-2 grid grid-cols-[12rem_1fr]">
            <strong>Stable:</strong> Yes. Bubble Sort is a stable sorting
            algorithm. If elements A and B are considered equal, then A precedes
            B in the sorted list if A appears before B in the input list.
          </li>
        </ul>
      </div>
    </>
  );
}
