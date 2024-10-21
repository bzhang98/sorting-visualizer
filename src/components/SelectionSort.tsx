import Bars from "./Bars";
import { useState, useCallback, useEffect, useRef } from "react";
import Description from "./Description";
import { useOptionsContext } from "../context/options-context";
import useGenerateData from "../hooks/use-generate-data";

export default function SelectionSort() {
  const { numBars, maxValue, minValue, speed, sortOrder } = useOptionsContext();
  const isSorting = useRef<"idle" | "playing" | "paused">("idle");

  const [currentMinIndex, setCurrentMinIndex] = useState<number | null>(null);
  const [currentInspectedIndex, setCurrentInspectedIndex] = useState<
    number | null
  >(null);
  const [lastUnsortedIndex, setLastUnsortedIndex] = useState<number | null>(
    null
  );

  const resetPointers = useCallback(() => {
    setCurrentInspectedIndex(null);
    setCurrentMinIndex(null);
    setLastUnsortedIndex(null);
  }, []);

  const {
    data,
    setData,
    sortGeneratorRef,
    animationFrameId,
    generateData,
  } = useGenerateData({
    numBars,
    minValue,
    maxValue,
    isSorting,
    resetData: resetPointers,
  });

  useEffect(() => {
    generateData(sortOrder);
  }, []);

  type SelectionSortYield = {
    array: { id: string; value: number }[];
    currentMinIndex: number | null;
    currentInspectedIndex: number | null;
    lastUnsortedIndex: number;
  };

  function* selectionSortGenerator(
    array: { id: string; value: number }[]
  ): Generator<SelectionSortYield> {
    for (let i = 0; i < array.length; i++) {
      let currentMinIndex = i;

      for (let j = i + 1; j < array.length; j++) {
        yield {
          array,
          currentMinIndex,
          currentInspectedIndex: j,
          lastUnsortedIndex: i,
        };
        if (array[j].value < array[currentMinIndex].value) {
          currentMinIndex = j;
        }
      }
      if (currentMinIndex !== i) {
        yield {
          array,
          currentMinIndex,
          currentInspectedIndex: null,
          lastUnsortedIndex: i,
        };
        [array[currentMinIndex], array[i]] = [array[i], array[currentMinIndex]];
        yield {
          array,
          currentMinIndex: i,
          currentInspectedIndex: null,
          lastUnsortedIndex: currentMinIndex,
        };
      }

      yield {
        array,
        currentMinIndex: i,
        currentInspectedIndex: null,
        lastUnsortedIndex: currentMinIndex,
      };
    }
  }

  const step = useCallback(() => {
    if (!sortGeneratorRef.current || isSorting.current !== "playing") return;

    const next =
      sortGeneratorRef.current.next() as IteratorResult<SelectionSortYield>;
    if (!next.done) {
      const {
        array,
        currentMinIndex,
        currentInspectedIndex,
        lastUnsortedIndex,
      } = next.value;
      setData(array);
      setCurrentMinIndex(currentMinIndex);
      setCurrentInspectedIndex(currentInspectedIndex);
      setLastUnsortedIndex(lastUnsortedIndex);

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
      if (!sortGeneratorRef.current) {
        sortGeneratorRef.current = selectionSortGenerator([...data]);
      }
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

  return (
    <>
      <h1 className="text-4xl text-center font-bold mt-8">Selection Sort</h1>
      <Bars
        data={data}
        highlightedIndices={[
          ...(currentMinIndex === lastUnsortedIndex
            ? [
                {
                  indices: [currentMinIndex as number],
                  color: "goldenrod",
                  label: "Min / Next to Swap",
                },
              ]
            : [
                {
                  indices: [currentMinIndex as number],
                  color: "goldenrod",
                  label: "Min",
                },
                {
                  indices: [lastUnsortedIndex as number],
                  color: "lightgreen",
                  label: "Next to Swap",
                },
              ]),
          {
            indices: [currentInspectedIndex as number],
            color: "lightcoral",
          },
        ]}
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
    "Selection Sort is an in-place comparison sorting algorithm. It worksby repeatedly finding the minimum element from the unsorted portion of the list and swapping it with the first unsorted element. After each pass, the smallest element is selected and sorted. This process continues until the entire list is sorted. Like Bubble Sort, Selection Sort is easy to understand and implement, but it is inefficient on large lists due to its O(n²) time complexity.",
  link: "https://github.com/bzhang98/sorting-visualizer/blob/main/src/sorting_functions/selection-sort.ts",
  timeComplexity:
    "Selection sort is O(n²) in all cases (best, average, and worst). The algorithm always has to make the same number of comparisons to find the minimum value in the unsorted partition, regardless of the input data.",
  spaceComplexity:
    "Because Selection Sort is implemented iteratively and does not require any additional memory, it has a O(1) space complexity.",
  stability:
    "No. Selection Sort is not stable because it swaps non-adjacent elements. This can result in the relative order of equal elements changing.",
};
