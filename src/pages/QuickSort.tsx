import Bars from "@/components/Bars";
import { useState, useCallback, useEffect } from "react";
import Description from "@/components/Description";
import { useAppContext } from "../context/app-context";
import useGenerateData from "../hooks/use-generate-data";

export default function QuickSort() {
  const {
    numBars,
    maxValue,
    minValue,
    speed,
    sortOrder,
    isSorting,
    updateIsSorting,
  } = useAppContext();
  const [pointers, setPointers] = useState<{ index: number; label?: string }[]>(
    []
  );
  const [startIndex, setStartIndex] = useState<number | null>(null);
  const [pivotIndex, setPivotIndex] = useState<number | null>(null);

  const resetPointers = useCallback(() => {
    setPointers([]);
    setStartIndex(null);
    setPivotIndex(null);
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

  type QuickSortYield = {
    arr: { id: string; value: number }[];
    pointers: { index: number; label: string }[];
    start: number;
    pivot: number;
  };

  function* quickSortGenerator(
    arr: { id: string; value: number }[],
    start = 0,
    end = arr.length - 1
  ): Generator<QuickSortYield> {
    if (start >= end) {
      return;
    }

    const midIndex = Math.floor((start + end) / 2);
    const medianIndex = [
      { value: arr[start].value, index: start },
      { value: arr[midIndex].value, index: midIndex },
      { value: arr[end].value, index: end },
    ].sort((a, b) => a.value - b.value)[1].index;

    yield {
      arr,
      pointers: [
        { index: start, label: "Start" },
        { index: midIndex, label: "Middle" },
        { index: end, label: "End" },
      ],
      start: -1,
      pivot: -1,
    };

    [arr[medianIndex], arr[end]] = [arr[end], arr[medianIndex]];

    const pivotValue = arr[end].value;
    let j = start - 1;
    for (let i = start; i <= end; i++) {
      yield {
        arr,
        pointers: [
          { index: i, label: "i" },
          { index: j, label: "j" },
        ],
        start,
        pivot: end,
      };
      if (arr[i].value > pivotValue) {
        continue;
      }
      j++;
      yield {
        arr,
        pointers: [
          { index: i, label: "i" },
          { index: j, label: "j" },
        ],
        start,
        pivot: end,
      };
      if (i > j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        yield {
          arr,
          pointers: [
            { index: i, label: "i" },
            { index: j, label: "j" },
          ],

          start,
          pivot: end,
        };
        yield {
          arr,
          pointers: [
            { index: i, label: "i" },
            { index: j, label: "j" },
          ],
          start,
          pivot: end,
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
      const { arr, pointers, start, pivot } = next.value;
      setData(arr);
      setPointers(pointers);
      setStartIndex(start);
      setPivotIndex(pivot);

      animationFrameId.current = requestAnimationFrame(() => {
        setTimeout(step, 500 / speed);
      });
    } else {
      updateIsSorting("idle");
      setPointers([]);
      setStartIndex(null);
      setPivotIndex(null);
    }
  }, [speed, isSorting]);

  const startSorting = useCallback(() => {
    if (isSorting.current === "playing") return;

    if (isSorting.current === "paused") {
      updateIsSorting("playing");
      if (!sortGeneratorRef.current) {
        sortGeneratorRef.current = quickSortGenerator([...data]);
      }
      step();
      return;
    }

    updateIsSorting("playing");
    sortGeneratorRef.current = quickSortGenerator([...data]);
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
      <h1 className="text-4xl text-center font-bold mt-8">Quick Sort</h1>
      <Bars
        data={data}
        highlightedIndices={[
          { indices: [pivotIndex as number], color: "green", label: "Pivot" },
          ...pointers.map(({ index, label }) => ({
            indices: [index],
            color: "red",
            label,
          })),
          { indices: [startIndex as number], color: "blue", label: "Start" },
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
    "Quick Sort is a divide-and-conquer comparison sorting algorithm. It sorts a list by selecting a 'pivot' element, partitioning the list into two halves—elements less than the pivot and elements greater than the pivot—and recursively sorting the sublists. We maintain two pointers, i and j, with i starting at the beginning of the list, and j initialized to start - 1. As we iterate through the elements, i scans through the list to find elements that are less than the pivot, while j keeps track of the last position where a smaller element was found. When i finds such an element, we increment j and swap the elements at i and j, ensuring that all elements to the left of j are less than or equal to the pivot. This process continues until i has traversed all elements. Once the iteration is complete, we place the pivot in its correct position by swapping it with the element at j + 1, thereby effectively partitioning the list into two halves: elements less than or equal to the pivot and elements greater than the pivot. The pivot selection strategy can affect the algorithm's performance. This visualization uses 'median-of-three' where the pivot is the median of the first, middle, and last elements. This reduces the likelihood of the worst-case time complexity as compared to other approaches, for example, always setting the last element as the pivot.",
  link: "https://github.com/bzhang98/sorting-visualizer/blob/main/src/sorting_functions/quick-sort.ts",
  timeComplexity:
    "In the average and best cases, when the pivot selection creates balanced partititions, Quick Sort has a time complexity of O(n log n). However, in the worst case, when the pivot selection consistently results in unbalanced halves, its time complexity is closer to O(n²).",
  spaceComplexity:
    "Quick Sort has a space complexity of O(log n) due to the recursive calls in the stack when implemented in-place. If implemented with additional memory for partitions, space complexity can increase.",
  stability:
    "No. Quick Sort is not a stable sorting algorithm. Equal elements might not retain their relative order during the partitioning process.",
};
