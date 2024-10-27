import Bars from "@/components/Bars";
import { useState, useCallback, useEffect } from "react";
import Description from "@/components/Description";
import useGenerateData from "../hooks/use-generate-data";
import { useAppContext } from "../context/app-context";

export default function SelectionSort() {
  const {
    numBars,
    maxValue,
    minValue,
    speed,
    sortOrder,
    isSorting,
    updateIsSorting,
  } = useAppContext();
  const [highlightedIndices, setHighlightedIndices] = useState<null | number[]>(
    null
  );

  const resetPointers = useCallback(() => {
    setHighlightedIndices([]);
  }, []);

  const { data, setData, sortGeneratorRef, animationFrameId, generateData } =
    useGenerateData({
      numBars,
      minValue,
      maxValue,
      updateIsSorting,
      resetData: resetPointers,
    });

  useEffect(() => {
    generateData(sortOrder);
  }, []);

  type InsertionSortYield = {
    array: { id: string; value: number }[];
    highlightedIndices: number[] | null;
  };

  function* insertionSortGenerator(
    array: { id: string; value: number }[]
  ): Generator<InsertionSortYield> {
    for (let i = 1; i < array.length; i++) {
      for (let j = i; j > 0; j--) {
        yield {
          array,
          highlightedIndices: [j, j - 1],
        };

        if (array[j - 1].value > array[j].value) {
          yield {
            array,
            highlightedIndices: [j, j - 1],
          };
          [array[j - 1], array[j]] = [array[j], array[j - 1]];

          yield {
            array,
            highlightedIndices: [j - 1, j],
          };
          yield {
            array,
            highlightedIndices: [j - 1, j],
          };
        } else {
          yield {
            array,
            highlightedIndices: [j, j - 1],
          };
          break;
        }
      }
    }
  }

  const step = useCallback(() => {
    if (!sortGeneratorRef.current || isSorting.current !== "playing") return;

    const next =
      sortGeneratorRef.current.next() as IteratorResult<InsertionSortYield>;
    if (!next.done) {
      const { array, highlightedIndices } = next.value;
      setData(array);
      setHighlightedIndices(highlightedIndices);

      animationFrameId.current = requestAnimationFrame(() => {
        setTimeout(step, 250 / speed);
      });
    } else {
      updateIsSorting("idle");
      resetPointers();
    }
  }, [speed, isSorting]);

  const startSorting = useCallback(() => {
    if (isSorting.current === "playing") return;

    if (isSorting.current === "paused") {
      updateIsSorting("playing");
      if (!sortGeneratorRef.current) {
        sortGeneratorRef.current = insertionSortGenerator([...data]);
      }
      step();
      return;
    }

    updateIsSorting("playing");
    sortGeneratorRef.current = insertionSortGenerator([...data]);
    step();
  }, [isSorting, data, step]);

  const pauseSorting = useCallback(() => {
    updateIsSorting("paused");
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
  }, [isSorting]);

  return (
    <>
      <h1 className="text-4xl text-center font-bold mt-8">Insertion Sort</h1>
      <Bars
        data={data}
        highlightedIndices={[
          {
            indices: highlightedIndices ? [highlightedIndices[0]] : [],
            color: "limegreen",
          },
          {
            indices: highlightedIndices ? [highlightedIndices[1]] : [],
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
    "Insertion Sort is an in-place comparison sorting algorithm. It sorts a list by taking elements one by one from an unsorted section and inserting them into their correct position in a growing sorted section. While the average and worst-case time complexity of Insertion Sort is O(n²), it is more efficient than Bubble Sort and Selection Sort for small lists and nearly-sorted lists.",
  link: "https://github.com/bzhang98/sorting-visualizer/blob/main/src/sorting_functions/insertion-sort.ts",
  timeComplexity:
    "In the average and worst cases, Insertion Sort is O(n²). The best-case time complexity is O(n) when the list is already sorted, as only one comparison is needed between each element and its predecessor.",
  spaceComplexity:
    "Because Insertion Sort is implemented iteratively and does not require any additional memory, it has a O(1) space complexity.",
  stability:
    "Yes. Insertion Sort is a stable sorting algorithm. If two elements are equal, their relative order is preserved.",
};
