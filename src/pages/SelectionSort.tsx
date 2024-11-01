import Bars from "@/components/Bars";
import Description from "@/components/Description";
import Options from "@/components/Options";
import useGenerateData from "@/hooks/use-generate-data";
import { useEffect } from "react";
import { useAppContext } from "../context/app-context";
import Step from "@/types/Step";
import DataElement from "@/types/DataElement";
import Controls from "@/components/Controls";

export default function SelectionSort() {
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

    for (let i = 0; i < array.length; i++) {
      let currentMinIndex = i;
      const sortedRange = [0, i - 1];

      for (let j = i + 1; j < array.length; j++) {
        steps.push({
          currentState: [...array],
          highlightedIndices: [
            {
              indices: [currentMinIndex],
              color: "green",
              label: "Min",
            },
            {
              indices: [j],
              color: "red",
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

        if (array[j].value < array[currentMinIndex].value) {
          currentMinIndex = j;
          steps.push({
            currentState: [...array],
            highlightedIndices: [
              {
                indices: [currentMinIndex],
                color: "green",
                label: "Min",
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
        }
      }
      if (currentMinIndex !== i) {
        steps.push({
          currentState: [...array],
          highlightedIndices: [
            {
              indices: [currentMinIndex],
              color: "green",
              label: "Min",
            },
            {
              indices: [i],
              color: "red",
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
        [array[currentMinIndex], array[i]] = [array[i], array[currentMinIndex]];
        steps.push({
          currentState: [...array],
          highlightedIndices: [
            {
              indices: [i],
              color: "green",
              label: "Min",
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
      } else {
        steps.push({
          currentState: [...array],
          highlightedIndices: [
            {
              indices: [currentMinIndex],
              color: "green",
              label: "Min",
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
      <h1 className="text-4xl text-center font-bold mt-8">Selection Sort</h1>
      {steps.length && <Bars currentStep={steps[currentStep]} />}

      <Controls generateData={generateData} />
      <Options />
      <Description description={description} />
    </>
  );
}

const description = {
  description:
    "Selection Sort is an in-place comparison sorting algorithm. It works by repeatedly finding the minimum element from the unsorted portion of the list and moving it to the end of the sorted portion of the list. This process continues until the entire list is sorted. Like Bubble Sort, Selection Sort is easy to understand and implement, but it is inefficient on large lists due to its O(n²) time complexity.",
  link: "https://github.com/bzhang98/sorting-visualizer/blob/main/src/sorting_functions/selection-sort.ts",
  timeComplexity:
    "Selection sort is O(n²) in all cases (best, average, and worst). The algorithm always has to make the same number of comparisons to find the minimum value in the unsorted partition, regardless of the input data.",
  spaceComplexity:
    "Because Selection Sort is implemented iteratively and does not require any additional memory, it has a O(1) space complexity.",
  stability:
    "No. Selection Sort is not stable because it swaps non-adjacent elements. This can result in the relative order of equal elements changing.",
};
