import DataElement from "@/types/DataElement";
import Step from "@/types/Step";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type SortingState = "idle" | "playing" | "paused";

interface AppContextType {
  totalReset: () => void;
  numBars: number;
  setNumBars: React.Dispatch<React.SetStateAction<number>>;
  sortOrder: string;
  setSortOrder: React.Dispatch<React.SetStateAction<string>>;
  speed: number;
  setSpeed: React.Dispatch<React.SetStateAction<number>>;
  minValue: number;
  setMinValue: React.Dispatch<React.SetStateAction<number>>;
  maxValue: number;
  setMaxValue: React.Dispatch<React.SetStateAction<number>>;
  sortingState: SortingState;
  setSortingState: React.Dispatch<React.SetStateAction<SortingState>>;
  mode: "auto" | "manual";
  setMode: React.Dispatch<React.SetStateAction<"auto" | "manual">>;
  data: DataElement[];
  setData: React.Dispatch<React.SetStateAction<DataElement[]>>;
  steps: Step[];
  setSteps: React.Dispatch<React.SetStateAction<Step[]>>;
  currentStep: number;
  nextStep: () => void;
  previousStep: () => void;
  firstStep: () => void;
  lastStep: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [numBars, setNumBars] = useState(15);
  const [sortOrder, setSortOrder] = useState("random");
  const [speed, setSpeed] = useState(1);
  const [minValue, setMinValue] = useState(1);
  const [maxValue, setMaxValue] = useState(100);

  const [sortingState, setSortingState] = useState<SortingState>("idle");

  const [mode, setMode] = useState<"auto" | "manual">("auto");

  const [data, setData] = useState<DataElement[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (mode === "auto" && sortingState === "playing") {
      intervalId = setInterval(() => {
        nextStep();
      }, 250 / speed);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [mode, sortingState, speed]);

  const nextStep = () => {
    setCurrentStep((prev) => {
      if (prev < steps.length - 1) {
        return prev + 1;
      }
      setSortingState("idle");
      return prev;
    });
  };

  const previousStep = () => {
    setCurrentStep((prev) => {
      if (prev > 0) {
        return prev - 1;
      }
      setSortingState("idle");
      return prev;
    });
  };

  const firstStep = () => {
    setCurrentStep(0);
  };

  const lastStep = () => {
    setCurrentStep(steps.length - 1);
  };

  const totalReset = () => {
    setSortingState("idle");
    setCurrentStep(0);
  };

  return (
    <AppContext.Provider
      value={{
        totalReset,
        numBars,
        setNumBars,
        sortOrder,
        setSortOrder,
        speed,
        setSpeed,
        minValue,
        setMinValue,
        maxValue,
        setMaxValue,
        sortingState,
        setSortingState,
        mode,
        setMode,
        data,
        setData,
        steps,
        setSteps,
        currentStep,
        nextStep,
        previousStep,
        firstStep,
        lastStep,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
