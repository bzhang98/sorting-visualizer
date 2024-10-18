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

  useEffect(() => {
    generateData();
  }, []);

  type InsertionSortYield = {
    array: { id: string; value: number }[];
    action: "compare" | "swap" | "next" | "complete";
    comparedIndices: number[];
    highlightedIndices: number[];
  };

  function* insertionSortGenerator(
    arr: { id: string; value: number }[]
  ): Generator<InsertionSortYield> {
    const array = [...arr];

    for (let i = 1; i < array.length; i++) {
      for (let j = i; j > 0; j--) {
        yield {
          array,
          action: "compare",
          comparedIndices: [j - 1, j],
          highlightedIndices: [i],
        };

        if (array[j - 1].value > array[j].value) {
          [array[j - 1], array[j]] = [array[j], array[j - 1]];
          yield {
            array,
            action: "swap",
            comparedIndices: [j - 1, j],
            highlightedIndices: [i],
          };
          yield {
            array,
            action: "swap",
            comparedIndices: [j - 1, j],
            highlightedIndices: [i],
          };
        } else {
          yield {
            array,
            action: "next",
            comparedIndices: [j - 1, j],
            highlightedIndices: [i],
          };
          break;
        }
      }
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
      sortGeneratorRef.current.next() as IteratorResult<InsertionSortYield>;
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
    sortGeneratorRef.current = insertionSortGenerator([...data]);
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
      <h1 className="text-4xl text-center font-bold mt-8">Insertion Sort</h1>
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
          Insertion Sort is an in-place comparison sorting algorithm. It sorts a
          list by taking elements one by one from an unsorted section and
          inserting them into their correct position in a growing sorted
          section. While the average and worst-case time complexity of Insertion
          Sort is O(n²), it is more efficient than Bubble Sort and Selection
          Sort for small lists and nearly-sorted lists.
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
            <strong>Time Complexity:</strong> In the average and worst cases,
            Insertion Sort is O(n²). The best-case time complexity is O(n) when
            the list is already sorted, as only one comparison is needed between
            each element and its predecessor.
          </li>
          <li className="py-4 border-t-2 grid grid-cols-[12rem_1fr]">
            <strong>Space Complexity:</strong> Because Insertion Sort is
            implemented iteratively and does not require any additional memory,
            it has a O(1) space complexity.
          </li>
          <li className="py-4 border-t-2 border-b-2 grid grid-cols-[12rem_1fr]">
            <strong>Stable:</strong> Yes. Insertion Sort is a stable sorting
            algorithm. If two elements are equal, their relative order is
            preserved.
          </li>
        </ul>
      </div>
    </>
  );
}
