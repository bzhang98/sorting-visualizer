import { useState, useEffect, useCallback, useRef } from "react";

import Sidebar from "@/components/Sidebar";

import DataElement from "@/types/DataElement";
import Settings from "@/types/Settings";
import Step from "@/types/Step";
import LegendItem from "@/types/LegendItem";

import {
  generateAlmostSortedAscendingData,
  generateAlmostSortedDescendingData,
  generateRandomData,
  generatedSortedAscendingData,
  generatedSortedDescendingData,
} from "@/utils/generate-data";
import {
  generateBubbleSortSteps,
  generateSelectionSortSteps,
  generateInsertionSortSteps,
  generateHeapSortSteps,
  generateQuickSortSteps,
} from "@/utils/generate-steps";
import Visualizer from "@/components/Visualizer";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";

const legendMap: { [key: string]: LegendItem[] } = {
  "Bubble Sort": [
    {
      color: "bg-green-500",
      label: "Current",
    },
    {
      color: "bg-red-500",
      label: "Comparing",
    },
  ],
  "Selection Sort": [
    {
      color: "bg-red-500",
      label: "Current",
    },
    {
      color: "bg-green-500",
      label: "Minimum",
    },
  ],
  "Insertion Sort": [
    {
      color: "bg-green-500",
      label: "Current",
    },
    {
      color: "bg-red-500",
      label: "Comparing",
    },
  ],
  "Heap Sort": [
    {
      color: "bg-green-500",
      label: "Current (Parent)",
    },
    {
      color: "bg-red-500",
      label: "Comparing (Child)",
    },
  ],
  "Quick Sort": [
    {
      color: "bg-yellow-500",
      label: "Pivot",
    },
    {
      color: "bg-green-500",
      label: "i",
    },
    {
      color: "bg-red-500",
      label: "j",
    },
  ],
};

const VisualizerView = () => {
  const [settings, setSettings] = useState<Settings>({
    algorithm: "Bubble Sort",
    numBars: 15,
    minValue: 1,
    maxValue: 100,
    sortOrder: "random",
    speed: 1,
    stepEnabled: true,
  });

  const [data, setData] = useState<DataElement[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [legend, setLegend] = useState<LegendItem[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const isProcessing = useRef(false);
  const justGenerated = useRef(false);

  const incrementStep = useCallback(() => {
    if (isProcessing.current) {
      return;
    }
    if (currentStep === steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    isProcessing.current = true;

    if (steps[currentStep].swapIndices) {
      const dataCopy = [...data];
      updateSettings("stepEnabled", false);
      const [i, j] = steps[currentStep].swapIndices;
      [dataCopy[i], dataCopy[j]] = [dataCopy[j], dataCopy[i]];
      setData([...dataCopy]);
      setTimeout(() => {
        setCurrentStep((prev) => {
          return justGenerated.current ? 0 : prev + 1;
        });
        justGenerated.current = false;
        isProcessing.current = false;
        if (!isPlaying) {
          updateSettings("stepEnabled", true);
        }
      }, 250 / settings.speed);
    } else {
      setCurrentStep((prev) => prev + 1);
      isProcessing.current = false;
    }
  }, [currentStep, data, isPlaying, settings.speed, steps]);

  const decrementStep = () => {
    if (currentStep === 0) {
      return;
    }
    if (steps[currentStep].swapIndices) {
      updateSettings("stepEnabled", false);
      const [i, j] = steps[currentStep].swapIndices;
      [data[i], data[j]] = [data[j], data[i]];
      setData([...data]);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        if (!isPlaying) {
          updateSettings("stepEnabled", true);
        }
      }, 250 / settings.speed);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipToEnd = () => {
    const dataCopy = [...data];
    const remainingSteps = steps.slice(currentStep);
    remainingSteps.forEach((step) => {
      if (step.swapIndices) {
        const [i, j] = step.swapIndices;
        [dataCopy[i], dataCopy[j]] = [dataCopy[j], dataCopy[i]];
      }
    });
    setData(dataCopy);
    setCurrentStep(steps.length - 1);
  };

  const skipToStart = () => {
    const dataCopy = [...data];
    const previousSteps = steps.slice(0, currentStep).reverse();
    previousSteps.forEach((step) => {
      if (step.swapIndices) {
        const [i, j] = step.swapIndices;
        [dataCopy[i], dataCopy[j]] = [dataCopy[j], dataCopy[i]];
      }
    });
    setData(dataCopy);
    setCurrentStep(0);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
    updateSettings("stepEnabled", !isPlaying);
  };

  const updateSettings = <K extends keyof Settings>(
    key: K,
    value: Settings[K],
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const generateData = useCallback(() => {
    const { numBars, minValue, maxValue, sortOrder } = settings;

    switch (sortOrder) {
      case "random": {
        const data = generateRandomData(numBars, minValue, maxValue);
        return data;
      }
      case "almostSortedAscending": {
        const data = generateAlmostSortedAscendingData(
          numBars,
          minValue,
          maxValue,
        );
        return data;
      }
      case "almostSortedDescending": {
        const data = generateAlmostSortedDescendingData(
          numBars,
          minValue,
          maxValue,
        );
        return data;
      }
      case "sortedAscending": {
        const data = generatedSortedAscendingData(numBars, minValue, maxValue);
        return data;
      }
      case "sortedDescending": {
        const data = generatedSortedDescendingData(numBars, minValue, maxValue);
        return data;
      }
      default: {
        const data = generateRandomData(numBars, minValue, maxValue);
        return data;
      }
    }
  }, [settings]);

  const generateSteps = useCallback(
    (data: DataElement[]) => {
      const { algorithm } = settings;

      switch (algorithm) {
        case "Bubble Sort": {
          return generateBubbleSortSteps(data);
        }
        case "Selection Sort": {
          return generateSelectionSortSteps(data);
        }
        case "Insertion Sort": {
          return generateInsertionSortSteps(data);
        }
        case "Heap Sort": {
          return generateHeapSortSteps(data);
        }
        case "Quick Sort": {
          return generateQuickSortSteps(data);
        }
        default: {
          return generateBubbleSortSteps(data);
        }
      }
    },
    [settings],
  );

  const generate = useCallback(() => {
    const data = generateData();
    const steps = generateSteps(data);
    setData(data);
    setSteps(steps);
    justGenerated.current = true;
  }, [generateData, generateSteps]);

  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [steps]);

  useEffect(() => {
    generate();
    setLegend(legendMap[settings.algorithm]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.algorithm]);

  useEffect(() => {
    if (isPlaying) {
      updateSettings("stepEnabled", false);
      const intervalId = setInterval(() => {
        if (isProcessing.current) return;
        incrementStep();
      }, 350 / settings.speed);

      return () => {
        clearInterval(intervalId);
      };
    } else {
      updateSettings("stepEnabled", true);
    }
  }, [incrementStep, isPlaying, settings.speed]);

  return (
    <main className="flex flex-1">
      <Sidebar
        settings={settings}
        updateSettings={updateSettings}
        generate={generate}
        incrementStep={incrementStep}
        decrementStep={decrementStep}
        skipToEnd={skipToEnd}
        skipToStart={skipToStart}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
      />
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-12 flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="text-lg font-semibold lg:text-xl lg:font-bold"
                variant="ghost"
              >
                {settings.algorithm}{" "}
                <ChevronsUpDown className="size-4 lg:size-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => updateSettings("algorithm", "Bubble Sort")}
              >
                Bubble Sort
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => updateSettings("algorithm", "Selection Sort")}
              >
                Selection Sort
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => updateSettings("algorithm", "Insertion Sort")}
              >
                Insertion Sort
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => updateSettings("algorithm", "Heap Sort")}
              >
                Heap Sort
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => updateSettings("algorithm", "Quick Sort")}
              >
                Quick Sort
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => updateSettings("algorithm", "Merge Sort")}
                disabled
              >
                Merge Sort - Coming Soon&#8482;
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => updateSettings("algorithm", "Merge Sort")}
                disabled
              >
                Radix Sort - Coming Soon&#8482;
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Visualizer
          data={data}
          step={steps[currentStep]}
          speed={settings.speed}
        />
        <div className="mt-8 flex gap-6">
          {legend.map((item) => {
            return (
              <div key={item.label} className="flex items-center gap-2">
                <div
                  className={`h-4 w-4 rounded lg:h-6 lg:w-6 ${item.color}`}
                ></div>
                <span className="lg:text-md text-sm">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default VisualizerView;
