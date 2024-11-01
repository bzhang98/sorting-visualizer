import Bars from "@/components/Bars";
import Description from "@/components/Description";
import Options from "@/components/Options";
import useGenerateData from "@/hooks/use-generate-data";
import { useEffect } from "react";
import { useAppContext } from "../context/app-context";
import Step from "@/types/Step";
import DataElement from "@/types/DataElement";
import Controls from "@/components/Controls";

export default function BubbleSort() {
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

    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        const sortedRange = [array.length - i, array.length - 1] as [
          number,
          number
        ];
        steps.push({
          currentState: [...array],

          highlightedIndices: [{ indices: [j, j + 1], color: "red" }],
          highlightedRange:
            sortedRange[0] <= sortedRange[1]
              ? [
                  {
                    range: sortedRange,
                    color: "green",
                    label: "Sorted",
                  },
                ]
              : undefined,
          action: "compare",
        });
        if (array[j].value > array[j + 1].value) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          steps.push({
            currentState: [...array],

            highlightedIndices: [{ indices: [j, j + 1], color: "red" }],
            highlightedRange:
              sortedRange[0] <= sortedRange[1]
                ? [
                    {
                      range: sortedRange,
                      color: "green",
                      label: "Sorted",
                    },
                  ]
                : undefined,
            action: "swap",
          });
        }
      }
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
      <h1 className="text-4xl text-center font-bold mt-8">Bubble Sort</h1>
      {steps.length > 0 && <Bars currentStep={steps[currentStep]} />}

      <Controls generateData={generateData} />
      <Options />
      <Description description={description} />
    </>
  );
}

const description = {
  description:
    "Bubble Sort is an in-place comparison sorting algorithm. It works by repeatedly comparing adjacent elements and swaps them if they are out of order. This process continues until the list is sorted, with each pass moving the next largest element to its correct position. Hence, the largest element 'bubbles' up to the top. While easy to understand and implement, Bubble Sort is inefficient for large datasets due to the O(n²) time complexity.",
  link: "https://github.com/bzhang98/sorting-visualizer/blob/main/src/sorting_functions/bubble-sort.ts",
  timeComplexity:
    "In the average and worst cases, Bubble Sort is O(n²). In the best case, Bubble Sort can be O(n) - this is possible with an optimization that stops the algorithm if no swaps are made in any given pass (when the list is already sorted).",
  spaceComplexity:
    "Because Bubble Sort is implemented iteratively and does not require any additional memory, it has a O(1) space complexity.",
  stability:
    "Yes. Bubble Sort is a stable sorting algorithm. Equal elements retain their relative order during the merging process.",
};
