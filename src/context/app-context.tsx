import { createContext, ReactNode, useContext, useRef, useState } from "react";

type SortingState = "idle" | "playing" | "paused";

interface AppContextType {
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
  isSorting: React.MutableRefObject<SortingState>;
  updateIsSorting: (newState: SortingState) => void;
  sortingState: SortingState;
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

  const isSorting = useRef<SortingState>("idle");
  const [sortingState, setSortingState] = useState<SortingState>("idle");

  const updateIsSorting = (newState: SortingState) => {
    isSorting.current = newState;
    setSortingState(newState); // Trigger a re-render whenever isSorting is updated
  };

  return (
    <AppContext.Provider
      value={{
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
        isSorting,
        updateIsSorting,
        sortingState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
