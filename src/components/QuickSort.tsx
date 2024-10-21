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
  }, [numBars, generateData]);

  type QuickSortYield = {
    arr: { id: string; value: number }[];
    action: "compare" | "swap" | "next" | "complete";
    comparedIndices: number[];
    highlightedIndices: number[];
  };

  function* quickSortGenerator(
    arr: { id: string; value: number }[],
    start = 0,
    end = arr.length - 1
  ): Generator<QuickSortYield> {
    if (start >= end) {
      return;
    }
    const pivotValue = arr[end].value;
    let j = start - 1;
    for (let i = start; i <= end; i++) {
      yield {
        arr,
        action: "compare",
        comparedIndices: [i, j],
        highlightedIndices: [end],
      };
      if (arr[i].value > pivotValue) {
        continue;
      }
      j++;
      yield {
        arr,
        action: "compare",
        comparedIndices: [i, j],
        highlightedIndices: [end],
      };
      if (i > j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        yield {
          arr,
          action: "swap",
          comparedIndices: [i, j],
          highlightedIndices: [end],
        };
        yield {
          arr,
          action: "swap",
          comparedIndices: [i, j],
          highlightedIndices: [end],
        };
      }
    }
    yield* quickSortGenerator(arr, start, j - 1);
    yield* quickSortGenerator(arr, j + 1, end);
  }

  const step = useCallback(() => {
    if (!sortGeneratorRef.current || isSorting.current !== "playing") return;

    const next =
      sortGeneratorRef.current.next() as IteratorResult<QuickSortYield>;
    if (!next.done) {
      const { arr, comparedIndices, highlightedIndices } = next.value;
      setData(arr);
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
    sortGeneratorRef.current = quickSortGenerator([...data]);
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
      <h1 className="text-4xl text-center font-bold mt-8">Quick Sort</h1>
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
