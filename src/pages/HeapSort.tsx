import Bars from "@/components/Bars";
import Description from "@/components/Description";
import ManualControls from "@/components/ManualControls";
import Options from "@/components/Options";
import useGenerateData from "@/hooks/use-generate-data";
import { useEffect } from "react";
import { useAppContext } from "../context/app-context";
import Step from "@/types/Step";
import DataElement from "@/types/DataElement";
import AutoControls from "@/components/AutoControls";

export default function HeapSort() {
  const { steps, mode, currentStep, nextStep, previousStep } = useAppContext();
  const { generateData } = useGenerateData({
    generateSteps,
  });

  useEffect(() => {
    generateData();
  }, []);

  function percolate(
    array: DataElement[],
    index: number,
    heapSize: number,
    steps: Step[]
  ): void {
    let largestIndex = index;
    let leftChildIndex = 2 * index + 1;
    let rightChildIndex = 2 * index + 2;

    if (leftChildIndex >= heapSize) {
      return;
    }

    const sortedRange = [heapSize, array.length - 1];
    if (leftChildIndex < heapSize) {
      steps.push({
        currentState: [...array],
        highlightedIndices: [
          { indices: [index], color: "green", label: "Parent" },
          {
            indices: [leftChildIndex],
            color: "red",
            label: "Left Child",
          },
        ],
        highlightedRange:
          sortedRange[0] <= sortedRange[1]
            ? [
                {
                  range: sortedRange as [number, number],
                  color: "green",
                  label: "Sorted",
                },
              ]
            : undefined,
        action: "compare",
      });
      if (array[leftChildIndex].value > array[largestIndex].value) {
        largestIndex = leftChildIndex;
      }
    }

    if (rightChildIndex < heapSize) {
      steps.push({
        currentState: [...array],
        highlightedIndices: [
          { indices: [index], color: "green", label: "Parent" },
          {
            indices: [rightChildIndex],
            color: "red",
            label: "Right Child",
          },
        ],
        highlightedRange:
          sortedRange[0] <= sortedRange[1]
            ? [
                {
                  range: sortedRange as [number, number],
                  color: "green",
                  label: "Sorted",
                },
              ]
            : undefined,
        action: "compare",
      });
      if (array[rightChildIndex].value > array[largestIndex].value) {
        largestIndex = rightChildIndex;
      }
    }

    if (largestIndex !== index) {
      steps.push({
        currentState: [...array],
        highlightedIndices: [
          { indices: [index], color: "green", label: "Parent" },
          {
            indices: [largestIndex],
            color: "red",
            label: "Largest Child",
          },
        ],
        highlightedRange:
          sortedRange[0] <= sortedRange[1]
            ? [
                {
                  range: sortedRange as [number, number],
                  color: "green",
                  label: "Sorted",
                },
              ]
            : undefined,
        action: "compare",
      });
      [array[index], array[largestIndex]] = [array[largestIndex], array[index]];
      steps.push({
        currentState: [...array],
        highlightedIndices: [
          { indices: [index], color: "green", label: "Largest Child" },
          {
            indices: [largestIndex],
            color: "red",
            label: "Parent",
          },
        ],
        highlightedRange:
          sortedRange[0] <= sortedRange[1]
            ? [
                {
                  range: sortedRange as [number, number],
                  color: "green",
                  label: "Sorted",
                },
              ]
            : undefined,
        action: "swap",
      });
      percolate(array, largestIndex, heapSize, steps);
    } else {
      steps.push({
        currentState: [...array],
        highlightedIndices: [
          { indices: [index], color: "green", label: "Done" },
        ],
        action: "done",
      });
    }
  }

  function generateSteps(data: DataElement[]) {
    const array = [...data];
    const steps: Step[] = [
      { currentState: [...array], highlightedIndices: [], action: "start" },
    ];

    // Build max heap
    for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
      percolate(array, i, array.length, steps);
    }

    steps.push({
      currentState: [...array],
      highlightedRange: [
        {
          range: [0, array.length - 1],
          color: "green",
          label: "Max Heap",
        },
      ],
      action: "done",
    });

    // Heap sort
    for (let i = array.length - 1; i >= 0; i--) {
      const sortedRange = [i + 1, array.length - 1];
      steps.push({
        currentState: [...array],
        highlightedIndices: [
          { indices: [0], color: "green", label: "Root" },
          { indices: [i], color: "red" },
        ],
        highlightedRange:
          sortedRange[0] <= sortedRange[1]
            ? [
                {
                  range: sortedRange as [number, number],
                  color: "green",
                  label: "Sorted",
                },
              ]
            : undefined,
        action: "swap",
      });
      [array[0], array[i]] = [array[i], array[0]];
      steps.push({
        currentState: [...array],
        highlightedIndices: [{ indices: [0], color: "red", label: "Root" }],
        highlightedRange:
          sortedRange[0] <= sortedRange[1]
            ? [
                {
                  range: sortedRange as [number, number],
                  color: "green",
                  label: "Sorted",
                },
              ]
            : undefined,
        action: "swap",
      });
      percolate(array, 0, i, steps);
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
      <h1 className="text-4xl text-center font-bold mt-8">Heap Sort</h1>
      {steps.length && <Bars currentStep={steps[currentStep]} />}

      {mode === "manual" ? (
        <ManualControls
          generateData={generateData}
          nextStep={nextStep}
          prevStep={previousStep}
        />
      ) : (
        <AutoControls generateData={generateData} />
      )}
      <Options />
      <Description description={description} />
    </>
  );
}

const description = {
  description:
    "Heap Sort is a comparison-based sorting algorithm that uses a binary heap data structure. It sorts a list by first building a max heap from the data. A max heap has the property that each parent node is greater than or equal to both of its children. Because a max heap will always have the largest element as the root of the heap., we always have access to the biggest element in the list in O(1) time. We then repeatedly remove the largest element from the heap and subsequently restore the heap property until the heap is empty.",
  link: "https://github.com/bzhang98/sorting-visualizer/blob/main/src/sorting_functions/heap-sort.ts",
  timeComplexity:
    "Heap Sort has an average, worst, and best-case time complexity of O(n log n). Building the heap initially takes O(n) time. During the sorting phase, each removal operation followed by restoring the heap takes O(log n) time, and we must do this for n elements.",
  spaceComplexity:
    "Heap Sort has a space complexity of O(1) if implemented iteratively, as it sorts the list in place without requiring additional memory for another data structure or recursive function calls.",
  stability:
    "No. Heap Sort is not a stable sorting algorithm, as it does not preserve the relative order of equal elements.",
};

/* type HeapSortYield = {
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
      [array[index], array[largestIndex]] = [array[largestIndex], array[index]];

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
} */
