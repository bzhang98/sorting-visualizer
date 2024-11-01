import Bars from "@/components/Bars";
import Description from "@/components/Description";
import Options from "@/components/Options";
import useGenerateData from "@/hooks/use-generate-data";
import { useEffect } from "react";
import { useAppContext } from "../context/app-context";
import Step from "@/types/Step";
import DataElement from "@/types/DataElement";
import Controls from "@/components/Controls";

export default function QuickSort() {
  const { steps, currentStep } = useAppContext();
  const { generateData } = useGenerateData({
    generateSteps,
  });

  useEffect(() => {
    generateData();
  }, []);

  function generateSteps(data: DataElement[]) {
    const array = [...data];
    const steps: Step[] = [
      { currentState: [...array], highlightedIndices: [], action: "start" },
    ];

    function quickSort(
      array: DataElement[],
      steps: Step[],
      startIndex: number = 0,
      endIndex: number = array.length - 1
    ) {
      if (startIndex >= endIndex) {
        return;
      }
      const midIndex = Math.floor((startIndex + endIndex) / 2);

      steps.push({
        currentState: [...array],
        highlightedIndices: [
          { indices: [startIndex], color: "red" },
          { indices: [midIndex], color: "red" },
          { indices: [endIndex], color: "red" },
        ],
        highlightedRange: [
          {
            range: [startIndex, endIndex],
            label: "Sorting",
          },
        ],
        action: "compare",
      });

      const medianIndex = [
        { value: array[startIndex].value, index: startIndex },
        { value: array[midIndex].value, index: midIndex },
        { value: array[endIndex].value, index: endIndex },
      ].sort((a, b) => a.value - b.value)[1].index;

      steps.push({
        currentState: [...array],
        highlightedIndices: [
          { indices: [medianIndex], color: "red", label: "Median" },
        ],
        highlightedRange: [
          {
            range: [startIndex, endIndex],
            label: "Sorting",
          },
        ],
        action: "compare",
      });

      [array[medianIndex], array[endIndex]] = [
        array[endIndex],
        array[medianIndex],
      ];

      steps.push({
        currentState: [...array],
        highlightedIndices: [
          { indices: [endIndex], color: "green", label: "Pivot" },
        ],
        highlightedRange: [
          {
            range: [startIndex, endIndex],
            label: "Sorting",
          },
        ],
        action: "compare",
      });

      const pivotValue = array[endIndex].value;
      let j = startIndex - 1;
      for (let i = startIndex; i <= endIndex; i++) {
        steps.push({
          currentState: [...array],
          highlightedIndices: [
            { indices: [i], color: "red", label: "i" },
            {
              indices: [j],
              color: "red",
              label: "j",
            },
            {
              indices: [endIndex],
              color: "green",
              label: "Pivot",
            },
          ],
          highlightedRange: [
            {
              range: [startIndex, endIndex],
              label: "Sorting",
            },
          ],
          action: "compare",
        });

        if (array[i].value > pivotValue) {
          continue;
        }
        j++;
        steps.push({
          currentState: [...array],
          highlightedIndices: [
            { indices: [i], color: "red", label: "i" },
            {
              indices: [j],
              color: "red",
              label: "j",
            },
            {
              indices: [endIndex],
              color: "green",
              label: "Pivot",
            },
          ],
          highlightedRange: [
            {
              range: [startIndex, endIndex],
              label: "Sorting",
            },
          ],
          action: "compare",
        });
        if (i > j) {
          [array[i], array[j]] = [array[j], array[i]];
          steps.push({
            currentState: [...array],
            highlightedIndices: [
              { indices: [i], color: "red", label: "i" },
              {
                indices: [j],
                color: "red",
                label: "j",
              },
              {
                indices: [endIndex],
                color: "green",
                label: "Pivot",
              },
            ],
            highlightedRange: [
              {
                range: [startIndex, endIndex],
                label: "Sorting",
              },
            ],
            action: "compare",
          });
        }
      }
      quickSort(array, steps, startIndex, j - 1);
      quickSort(array, steps, j + 1, endIndex);
    }

    quickSort(array, steps);

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
      <h1 className="text-4xl text-center font-bold mt-8">Quick Sort</h1>
      {steps.length && <Bars currentStep={steps[currentStep]} />}

      <Controls generateData={generateData} />
      <Options />
      <Description description={description} />
    </>
  );
}

const description = {
  description:
    "Quick Sort is a divide-and-conquer comparison sorting algorithm. It sorts a list by selecting a 'pivot' element, partitioning the list into two halves—elements less than the pivot and elements greater than the pivot—and recursively sorting the sublists. We maintain two pointers, i and j, with i starting at the beginning of the list, and j initialized to start - 1. As we iterate through the elements, i scans through the list to find elements that are less than the pivot, while j keeps track of the last position where a smaller element was found. When i finds such an element, we increment j and swap the elements at i and j, ensuring that all elements to the left of j are less than or equal to the pivot. This process continues until i has traversed all elements. Once the iteration is complete, we place the pivot in its correct position by swapping it with the element at j + 1, thereby effectively partitioning the list into two halves: elements less than or equal to the pivot and elements greater than the pivot. We then recursively sort both halves, until the list is sorted. The pivot selection strategy can affect the algorithm's performance. This visualization uses 'median-of-three', where the pivot is the median of the first, middle, and last elements. This reduces the likelihood of the worst-case time complexity of creating extremely unbalanced halves.",
  link: "https://github.com/bzhang98/sorting-visualizer/blob/main/src/sorting_functions/quick-sort.ts",
  timeComplexity:
    "In the average and best cases, when the pivot selection creates balanced partititions, Quick Sort has a time complexity of O(n log n). However, in the worst case, when the pivot selection consistently results in unbalanced halves, its time complexity is closer to O(n²). This worst-case scenario can be avoided with more sophisticated pivot selection strategies.",
  spaceComplexity:
    "Quick Sort has a space complexity of O(log n) due to the recursive calls in the stack when implemented in-place. If implemented with additional memory for partitions, space complexity can increase.",
  stability:
    "No. Quick Sort is not a stable sorting algorithm. Equal elements might not retain their relative order during the partitioning process.",
};
