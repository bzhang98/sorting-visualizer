import { useState, useCallback, useEffect, useRef } from "react";
import Bars from "./Bars";
import Description from "./Description";
import { useOptionsContext } from "../context/options-context";
import useGenerateData from "../hooks/use-generate-data";

export default function BubbleSort() {
  const { numBars, minValue, maxValue, speed, sortOrder } = useOptionsContext();
  const [comparedIndices, setComparedIndices] = useState<number[]>([]);
  const isSorting = useRef<"idle" | "playing" | "paused">("idle");

  const resetPointers = useCallback(() => {
    setComparedIndices([]);
  }, []);

  const { data, setData, sortGeneratorRef, animationFrameId, generateData } =
    useGenerateData({
      numBars,
      minValue,
      maxValue,
      isSorting,
      resetData: resetPointers,
    });

  useEffect(() => {
    generateData(sortOrder);
  }, []);

  type BubbleSortYield = {
    array: { id: string; value: number }[];
    indices: number[];
  };

  function* bubbleSortGenerator(
    array: { id: string; value: number }[]
  ): Generator<BubbleSortYield> {
    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        yield {
          array,
          indices: [j, j + 1],
        };

        if (array[j].value > array[j + 1].value) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          yield {
            array,
            indices: [j, j + 1],
          };
        }

        yield {
          array,
          indices: [j, j + 1],
        };
      }
    }
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
      resetPointers();
    }
  }, [speed, isSorting]);

  const startSorting = useCallback(() => {
    if (isSorting.current === "playing") return;

    if (isSorting.current === "paused") {
      isSorting.current = "playing";
      if(!sortGeneratorRef.current) {
        sortGeneratorRef.current = bubbleSortGenerator([...data]);
      }
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
        highlightedIndices={[{ indices: comparedIndices, color: "lightcoral" }]}
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
