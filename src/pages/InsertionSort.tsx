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

export default function InsertionSort() {
  const { steps, mode, currentStep, nextStep, previousStep } = useAppContext();
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

    for (let i = 1; i < array.length; i++) {
      for (let j = i; j > 0; j--) {
        steps.push({
          currentState: [...array],
          highlightedIndices: [{ indices: [j], color: "red" }],
          highlightedRange: [
            {
              range: [0, i],
              color: "green",
              label: "Sorted",
            },
          ],
          action: "compare",
        });
        if (array[j - 1].value > array[j].value) {
          [array[j - 1], array[j]] = [array[j], array[j - 1]];
          steps.push({
            currentState: [...array],
            highlightedIndices: [{ indices: [j - 1], color: "red" }],
            highlightedRange: [
              {
                range: [0, i],
                color: "green",
                label: "Sorted",
              },
            ],
            action: "swap",
          });
        } else {
          break;
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
      <h1 className="text-4xl text-center font-bold mt-8">Insertion Sort</h1>
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
    "Insertion Sort is an in-place comparison sorting algorithm. It sorts a list by taking elements one by one from an unsorted section and inserting them into their correct position in a growing sorted section. While the average and worst-case time complexity of Insertion Sort is O(n²), it is more efficient than Bubble Sort and Selection Sort for small lists and nearly-sorted lists.",
  link: "https://github.com/bzhang98/sorting-visualizer/blob/main/src/sorting_functions/insertion-sort.ts",
  timeComplexity:
    "In the average and worst cases, Insertion Sort is O(n²). The best-case time complexity is O(n) when the list is already sorted, as only one comparison is needed between each element and its predecessor.",
  spaceComplexity:
    "Because Insertion Sort is implemented iteratively and does not require any additional memory, it has a O(1) space complexity.",
  stability:
    "Yes. Insertion Sort is a stable sorting algorithm. Equal elements retain their relative order during the merging process.",
};
