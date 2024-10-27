import Bars from "@/components/Bars";
import { useState, useCallback, useEffect } from "react";
import Description from "@/components/Description";
import useGenerateData from "../hooks/use-generate-data";
import { useAppContext } from "../context/app-context";
import Controls from "@/components/Controls";
import Options from "@/components/Options";

export default function InsertionSort() {
  const {
    numBars,
    maxValue,
    minValue,
    speed,
    sortOrder,
    isSorting,
    updateIsSorting,
  } = useAppContext();

  const [comparedIndices, setComparedIndices] = useState<number[]>([]);
  const [sortedPartition, setSortedPartition] = useState<number[]>([]);

  const resetPointers = useCallback(() => {
    setComparedIndices([]);
    setSortedPartition([]);
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

  type HeapSortYield = {
    array: { id: string; value: number }[];
    comparedIndices: number[];
    sortedPartition: number[] | null;
  };

  function* heapSortGenerator(
    array: { id: string; value: number }[]
  ): Generator<HeapSortYield> {
    // Build max heap
    function* percolate(
      array: { id: string; value: number }[],
      index: number,
      heapSize: number
    ): Generator<HeapSortYield> {
      let largestIndex = index;
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;

      if (leftChildIndex >= heapSize) {
        return;
      }

      yield {
        array,
        comparedIndices: [index, leftChildIndex],
        sortedPartition: Array.from(
          { length: array.length - heapSize },
          (_, i) => heapSize + i
        ),
      };
      if (
        leftChildIndex < heapSize &&
        array[leftChildIndex].value > array[largestIndex].value
      ) {
        largestIndex = leftChildIndex;
      }

      yield {
        array,
        comparedIndices: [index, rightChildIndex],
        sortedPartition: Array.from(
          { length: array.length - heapSize },
          (_, i) => heapSize + i
        ),
      };
      if (
        rightChildIndex < heapSize &&
        array[rightChildIndex].value > array[largestIndex].value
      ) {
        largestIndex = rightChildIndex;
      }

      if (largestIndex !== index) {
        yield {
          array,
          comparedIndices: [index, largestIndex],
          sortedPartition: Array.from(
            { length: array.length - heapSize },
            (_, i) => heapSize + i
          ),
        };
        [array[index], array[largestIndex]] = [
          array[largestIndex],
          array[index],
        ];

        yield {
          array,
          comparedIndices: [index, largestIndex],
          sortedPartition: Array.from(
            { length: array.length - heapSize },
            (_, i) => heapSize + i
          ),
        };
        yield {
          array,
          comparedIndices: [index, largestIndex],
          sortedPartition: Array.from(
            { length: array.length - heapSize },
            (_, i) => heapSize + i
          ),
        };
        yield* percolate(array, largestIndex, heapSize);
      }
    }

    for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
      yield* percolate(array, i, array.length);
    }

    // Heap sort
    for (let i = array.length - 1; i >= 0; i--) {
      yield {
        array,
        comparedIndices: [0, i],
        sortedPartition: Array.from(
          { length: array.length - i },
          (_, j) => i + j
        ),
      };
      [array[0], array[i]] = [array[i], array[0]];

      yield {
        array,
        comparedIndices: [0, i],
        sortedPartition: Array.from(
          { length: array.length - i },
          (_, j) => i + j
        ),
      };

      yield {
        array,
        comparedIndices: [0],
        sortedPartition: Array.from(
          { length: array.length - i },
          (_, j) => i + j
        ),
      };
      yield {
        array,
        comparedIndices: [0],
        sortedPartition: Array.from(
          { length: array.length - i },
          (_, j) => i + j
        ),
      };
      yield* percolate(array, 0, i);
    }
  }

  const step = useCallback(() => {
    if (!sortGeneratorRef.current || isSorting.current !== "playing") return;

    const next =
      sortGeneratorRef.current.next() as IteratorResult<HeapSortYield>;
    if (!next.done) {
      const { array, comparedIndices, sortedPartition } = next.value;
      setData(array);
      setComparedIndices(comparedIndices);
      setSortedPartition(sortedPartition || []);

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
        sortGeneratorRef.current = heapSortGenerator([...data]);
      }
      step();
      return;
    }

    updateIsSorting("playing");
    sortGeneratorRef.current = heapSortGenerator([...data]);
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
      <h1 className="text-4xl text-center font-bold mt-8">Heap Sort</h1>
      <Bars
        data={data}
        highlightedIndices={[
          { color: "lightcoral", indices: comparedIndices },
          { color: "limegreen", indices: sortedPartition },
        ]}
      />
      <Controls
        generateData={generateData}
        startSort={startSorting}
        pauseSort={pauseSorting}
      />
      <Options />
      <Description description={description} />
    </>
  );
}

const description = {
  description:
    "Heap Sort is a comparison-based sorting algorithm that uses a binary heap data structure. It sorts a list by first building a max heap from the data. A max heap has the property that each parent node is greater than or equal to both of its children. Also, a max heap will always have the largest element as the root of the heap. Therefore, we always have access to the biggest element in the list in O(1) time. We then repeatedly remove the largest element from the heap and subsequently restore the heap property until the heap is empty.",
  link: "https://github.com/bzhang98/sorting-visualizer/blob/main/src/sorting_functions/heap-sort.ts",
  timeComplexity:
    "Heap Sort has an average, worst, and best-case time complexity of O(n log n). Building the heap initially takes O(n) time. During the sorting phase, each removal operation followed by restoring the heap takes O(log n) time, and we must do this for n elements.",
  spaceComplexity:
    "Heap Sort has a space complexity of O(1) if implemented iteratively, as it sorts the list in place without requiring additional memory for another data structure or recursive function calls.",
  stability:
    "No. Heap Sort is not a stable sorting algorithm, as it does not preserve the relative order of equal elements.",
};
