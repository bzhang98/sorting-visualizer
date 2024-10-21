import Bars from "./Bars";
import { useState, useCallback, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Description from "./Description";

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
  const [highlightedIndices, setHighlightedIndices] = useState<null | number[]>(
    null
  );
  const isSorting = useRef<"idle" | "playing" | "paused">("idle");
  const sortGeneratorRef = useRef<Generator | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const generateData = useCallback(() => {
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
      isSorting.current = "idle";
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
        numBars={numBars}
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
    "Insertion Sort is an in-place comparison sorting algorithm. It sorts a list by taking elements one by one from an unsorted section and inserting them into their correct position in a growing sorted section. While the average and worst-case time complexity of Insertion Sort is O(n²), it is more efficient than Bubble Sort and Selection Sort for small lists and nearly-sorted lists.",
  link: "https://github.com/bzhang98/sorting-visualizer/blob/main/src/sorting_functions/insertion-sort.ts",
  timeComplexity:
    "In the average and worst cases, Insertion Sort is O(n²). The best-case time complexity is O(n) when the list is already sorted, as only one comparison is needed between each element and its predecessor.",
  spaceComplexity:
    "Because Insertion Sort is implemented iteratively and does not require any additional memory, it has a O(1) space complexity.",
  stability:
    "Yes. Insertion Sort is a stable sorting algorithm. If two elements are equal, their relative order is preserved.",
};
