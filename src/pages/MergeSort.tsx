import Bars from "@/components/Bars";
import Description from "@/components/Description";
import Options from "@/components/Options";
import useGenerateData from "@/hooks/use-generate-data";
import { useEffect } from "react";
import { useAppContext } from "../context/app-context";
import Step from "@/types/Step";
import DataElement from "@/types/DataElement";
import Controls from "@/components/Controls";
import { HighlightedRange } from "@/types/HighlightedElements";

export default function MergeSort() {
  const { steps, currentStep } = useAppContext();
  const { generateData } = useGenerateData({
    generateSteps,
  });

  useEffect(() => {
    generateData();
  }, []);

  function generateSteps(data: DataElement[]) {
    function merge(
      leftSubarray: { value: number; id: string }[],
      rightSubarray: { value: number; id: string }[]
    ) {
      const mergedArray: { value: number; id: string }[] = [];
      let leftPointer = 0;
      let rightPointer = 0;
      const leftIndices: number[] = [];
      const rightIndices: number[] = [];

      while (
        leftPointer < leftSubarray.length &&
        rightPointer < rightSubarray.length
      ) {
        if (
          leftSubarray[leftPointer].value <= rightSubarray[rightPointer].value
        ) {
          mergedArray.push(leftSubarray[leftPointer]);
          leftIndices.push(mergedArray.length - 1);
          leftPointer++;
        } else {
          mergedArray.push(rightSubarray[rightPointer]);
          rightIndices.push(mergedArray.length - 1);
          rightPointer++;
        }
      }

      // Handle remaining elements in left array
      while (leftPointer < leftSubarray.length) {
        mergedArray.push(leftSubarray[leftPointer]);
        leftIndices.push(mergedArray.length - 1);
        leftPointer++;
      }

      // Handle remaining elements in right array
      while (rightPointer < rightSubarray.length) {
        mergedArray.push(rightSubarray[rightPointer]);
        rightIndices.push(mergedArray.length - 1);
        rightPointer++;
      }

      return { mergedArray, leftIndices, rightIndices };
    }

    const array = [...data];
    const steps: Step[] = [
      { currentState: [...array], highlightedIndices: [], action: "start" },
    ];

    let subarraySize = 1;
    while (subarraySize <= array.length) {
      let leftStart = 0;
      let rightStart = leftStart + subarraySize;

      while (leftStart < data.length) {
        const leftSubarray = array.slice(leftStart, leftStart + subarraySize);
        const rightSubarray = array.slice(
          rightStart,
          rightStart + subarraySize
        );

        const highlightedRanges: HighlightedRange = [
          {
            range: [
              leftStart,
              Math.min(leftStart + subarraySize - 1, array.length - 1),
            ],
            color: "red",
            label: "Left",
          },
        ];

        if (rightStart < array.length) {
          highlightedRanges.push({
            range: [
              rightStart,
              Math.min(rightStart + subarraySize - 1, array.length - 1),
            ],
            color: "green",
            label: "Right",
          });
        }

        steps.push({
          currentState: [...array],
          highlightedRange: highlightedRanges,
          action: "compare",
        });

        const { mergedArray, leftIndices, rightIndices } = merge(
          leftSubarray,
          rightSubarray
        );
        array.splice(leftStart, mergedArray.length, ...mergedArray);
        steps.push({
          currentState: [...array],
          highlightedIndices: [
            {
              indices: leftIndices.map((index) => index + leftStart),
              color: "red",
            },
            {
              indices: rightIndices.map((index) => index + leftStart),
              color: "green",
            },
          ],
          action: "swap",
        });

        leftStart += subarraySize * 2;
        rightStart += subarraySize * 2;
      }
      subarraySize *= 2;
    }

    steps.push({
      currentState: [...array],
      highlightedRange: [
        {
          range: [0, array.length - 1],
          color: "green",
          label: "Sorted",
        },
      ],
      action: "done",
    });
    return steps;
  }

  return (
    <>
      <h1 className="text-4xl text-center font-bold mt-8">Merge Sort</h1>
      {steps.length && <Bars currentStep={steps[currentStep]} />}

      <Controls generateData={generateData} />
      <Options />
      <Description description={description} />
    </>
  );
}

const description = {
  description:
    "Merge Sort is a divide-and-conquer comparison sorting algorithm. It works by recursively splitting the input list into smaller sublists until each sublist contains a single element. It then merges these sublists in a sorted manner to produce a final sorted list. The operation of merging two sorted arrays is a O(n) operation. Alternatively, Merge Sort can be implemented iteratively, where we start with the smallest possible subarray (a list with a single element), and merge them together, doubling the subarray size each time until we have the final sorted list. Merge Sort is well-suited for large datasets due to its predictable time complexity.",
  link: "https://github.com/bzhang98/sorting-visualizer/blob/main/src/sorting_functions/merge-sort.ts",
  timeComplexity:
    "Merge Sort has a time complexity of O(n log n) in all cases (best, average, and worst). The list is split in half until each sublist contains a single element, which takes O(log n) time. Each time, the lists must be merged together, which is an O(n) operation, resulting in a time complexity of O(n log n).",
  spaceComplexity:
    "Merge Sort has a space complexity of O(n) because it requires additional memory for the temporary arrays used during the merging process.",
  stability:
    "Yes. Merge Sort is a stable sorting algorithm. Equal elements retain their relative order during the merging process.",
};

/**
  function* mergeSortGenerator(
    array: { id: string; value: number }[]
  ): Generator<MergeSortYield> {
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
 */
