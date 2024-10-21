import { useState, useCallback, useEffect, useRef } from "react";
import Bars from "./Bars";
import { v4 as uuidv4 } from "uuid";
import Description from "./Description";

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
  }, [numBars, generateData]);

  type BubbleSortYield = {
    array: { id: string; value: number }[];
    action: "compare" | "swap" | "next" | "complete";
    indices: number[];
  };

  function* bubbleSortGenerator(
    array: { id: string; value: number }[]
  ): Generator<BubbleSortYield> {
    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        yield {
          array,
          action: "compare",
          indices: [j, j + 1],
        };

        if (array[j].value > array[j + 1].value) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          yield {
            array,
            action: "swap",
            indices: [j, j + 1],
          };
        }

        yield {
          array,
          action: "next",
          indices: [j, j + 1],
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
      const { array, indices } = next.value;
      setData(array);
      setComparedIndices(indices);

      animationFrameId.current = requestAnimationFrame(() => {
        setTimeout(step, 250 / speed);
      });
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
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
  }, [isSorting]);

  return (
    <>
      <h1 className="text-4xl text-center font-bold mt-8">Bubble Sort</h1>
      <Bars
        data={data}
        maxValue={maxValue}
        highlightedIndices={[{ indices: comparedIndices, color: "lightcoral" }]}
        numBars={numBars}
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
    "Bubble Sort is an in-place comparison sorting algorithm. It works by repeatedly comparing adjacent elements and swaps them if they are out of order. This process continues until the list is sorted, with each pass moving the next largest element to its correct position. Hence the largest element 'bubbles' up to the top. While easy to understand and implement, Bubble Sort is inefficient for large datasets due to the O(n²) time complexity.",
  link: "https://github.com/bzhang98/sorting-visualizer/blob/main/src/sorting_functions/bubble-sort.ts",
  timeComplexity:
    "In the average and worst cases, Bubble Sort is O(n²). In the best case, Bubble Sort can be O(n) - this is possible with an optimization that stops the algorithm if no swaps are made in any given pass, i.e. the list is already sorted.",
  spaceComplexity:
    "Because Bubble Sort is implemented iteratively and does not require any additional memory, it has a O(1) space complexity.",
  stability:
    "Yes. Bubble Sort is a stable sorting algorithm. Equal elements retain their relative order during the merging process.",
};
