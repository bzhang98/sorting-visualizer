import Bars from "./Bars";
import { useState, useCallback, useEffect, useRef } from "react";
import Description from "./Description";
import { useOptionsContext } from "../context/options-context";
import useGenerateData from "../hooks/use-generate-data";

export default function MergeSort() {
  const { numBars, maxValue, minValue, speed, sortOrder } = useOptionsContext();

  const [leftIndices, setLeftIndices] = useState<number[]>([]);
  const [rightIndices, setRightIndices] = useState<number[]>([]);
  const outerIndexRef = useRef(0);
  const innerIndexRef = useRef<null | number>(null);
  const isSorting = useRef<"idle" | "playing" | "paused">("idle");

  const resetPointers = useCallback(() => {
    setLeftIndices([]);
    setRightIndices([]);
    outerIndexRef.current = 0;
    innerIndexRef.current = null;
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

  type MergeSortYield = {
    array: { id: string; value: number }[];
    leftIndices: number[];
    rightIndices: number[];
  };

  function* mergeSortGenerator(
    array: { id: string; value: number }[]
  ): Generator<MergeSortYield> {
    function merge(
      left: { value: number; id: string }[],
      right: { value: number; id: string }[]
    ): {
      mergedArray: { value: number; id: string }[];
      leftIndices: number[];
      rightIndices: number[];
    } {
      const mergedArray: { value: number; id: string }[] = [];
      const leftIndices: number[] = [];
      const rightIndices: number[] = [];
      let leftPointer = 0;
      let rightPointer = 0;

      while (leftPointer < left.length && rightPointer < right.length) {
        if (left[leftPointer].value <= right[rightPointer].value) {
          mergedArray.push(left[leftPointer]);
          leftIndices.push(mergedArray.length - 1);
          leftPointer++;
        } else {
          mergedArray.push(right[rightPointer]);
          rightIndices.push(mergedArray.length - 1);
          rightPointer++;
        }
      }

      // Handle remaining elements in left array
      while (leftPointer < left.length) {
        mergedArray.push(left[leftPointer]);
        leftIndices.push(mergedArray.length - 1);
        leftPointer++;
      }

      // Handle remaining elements in right array
      while (rightPointer < right.length) {
        mergedArray.push(right[rightPointer]);
        rightIndices.push(mergedArray.length - 1);
        rightPointer++;
      }

      return { mergedArray, leftIndices, rightIndices };
    }

    let subarraySize = 1;
    while (subarraySize <= data.length * 2) {
      let left = 0;
      let right = left + subarraySize;

      while (left < data.length) {
        const leftSubarray = array.slice(left, left + subarraySize);
        const rightSubarray = array.slice(right, right + subarraySize);
        yield {
          array,
          leftIndices: Array.from(
            { length: leftSubarray.length },
            (_, i) => left + i
          ),
          rightIndices: Array.from(
            { length: rightSubarray.length },
            (_, i) => right + i
          ),
        };

        const { mergedArray, leftIndices, rightIndices } = merge(
          leftSubarray,
          rightSubarray
        );
        array.splice(left, mergedArray.length, ...mergedArray);
        yield {
          array,
          leftIndices: leftIndices.map((index) => left + index),
          rightIndices: rightIndices.map((index) => left + index),
        };
        left += subarraySize * 2;
        right += subarraySize * 2;
      }
      subarraySize *= 2;
    }
  }

  const step = useCallback(() => {
    if (!sortGeneratorRef.current || isSorting.current !== "playing") return;

    const next =
      sortGeneratorRef.current.next() as IteratorResult<MergeSortYield>;
    if (!next.done) {
      const { array, leftIndices, rightIndices } = next.value;
      setData(array);
      setLeftIndices(leftIndices);
      setRightIndices(rightIndices);

      animationFrameId.current = requestAnimationFrame(() => {
        setTimeout(step, 750 / speed);
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
      step();
      return;
    }

    isSorting.current = "playing";
    sortGeneratorRef.current = mergeSortGenerator([...data]);
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
      <h1 className="text-4xl text-center font-bold mt-8">Merge Sort</h1>
      <Bars
        data={data}
        highlightedIndices={[
          { color: "lightcoral", indices: leftIndices },
          {
            color: "limegreen",
            indices: rightIndices,
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
    "Merge Sort is a divide-and-conquer comparison sorting algorithm. It works by recursively splitting the input list into smaller sublists until each sublist contains a single element. It then merges these sublists in a sorted manner to produce a final sorted list. This approach is done because merging two sorted arrays is a O(n) operation. Alternatively, Merge Sort can be implemented iteratively, where we start with the smallest possible subarray (a list with a single element), and merge them together, doubling the subarray size each time until we have the final sorted list. Merge Sort is well-suited for large datasets due to its predictable time complexity.",
  link: "https://github.com/bzhang98/sorting-visualizer/blob/main/src/sorting_functions/merge-sort.ts",
  timeComplexity:
    "Merge Sort has a time complexity of O(n log n) in all cases (best, average, and worst). The list is split in half until each sublist contains a single element, which takes O(log n) time. Each time, the lists must be merged together, which is an O(n) operation, resulting in a time complexity of O(n log n).",
  spaceComplexity:
    "Merge Sort has a space complexity of O(n) because it requires additional memory for the temporary arrays used during the merging process.",
  stability:
    "Yes. Merge Sort is a stable sorting algorithm. Equal elements retain their relative order during the merging process.",
};
