import { createContext, ReactNode, useContext, useState } from "react";

interface OptionsContextType {
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
}

const OptionsContext = createContext<OptionsContextType | undefined>(undefined);

export const useOptionsContext = () => {
  const context = useContext(OptionsContext);
  if (!context) {
    throw new Error("useOptionsContext must be used within a OptionsProvider");
  }
  return context;
};

export const OptionsProvider = ({ children }: { children: ReactNode }) => {
  const [numBars, setNumBars] = useState(15);
  const [sortOrder, setSortOrder] = useState("random");
  const [speed, setSpeed] = useState(1);
  const [minValue, setMinValue] = useState(1);
  const [maxValue, setMaxValue] = useState(100);

  return (
    <OptionsContext.Provider
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
      }}
    >
      {children}
    </OptionsContext.Provider>
  );
};
