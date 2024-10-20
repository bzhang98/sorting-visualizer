import BubbleSort from "./components/BubbleSort";
import SelectionSort from "./components/SelectionSort";
import InsertionSort from "./components/InsertionSort";
import HeapSort from "./components/HeapSort";
import MergeSort from "./components/MergeSort";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useCallback, useState } from "react";
import QuickSort from "./components/QuickSort";
import useWindowWidth from "./hooks/use-window-width";

export default function App() {
  const [speed, setSpeed] = useState(1);
  const [numBars, setNumBars] = useState(30);
  const [tempSpeed, setTempSpeed] = useState(speed);
  const [tempNumBars, setTempNumBars] = useState(numBars);

  const windowWidth = useWindowWidth();

  const handleFinishChange = useCallback(
    (setter: (arg0: number) => void, value: any) => {
      setter(Number(value));
    },
    []
  );

  const handleChange = useCallback(
    (setTemp: (arg0: number) => void, value: any) => {
      setTemp(Number(value));
    },
    []
  );

  if (windowWidth < 768) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold">Please use a larger screen</h1>
      </div>
    );
  }

  return (
    <Router>
      <div className="px-8 flex flex-col gap-4 w-1/3">
        <h2 className="text-2xl font-semibold">Settings</h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="numBars">Number of Elements: {tempNumBars}</label>
          <input
            type="range"
            name="numBars"
            id="numBars"
            min={5}
            max={100}
            step={1}
            value={tempNumBars}
            onChange={(e) => handleChange(setTempNumBars, e.target.value)}
            onMouseUp={() => handleFinishChange(setNumBars, tempNumBars)}
            onTouchEnd={() => handleFinishChange(setNumBars, tempNumBars)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="speed">Speed: {tempSpeed}x</label>
          <input
            type="range"
            name="speed"
            id="speed"
            min={0.25}
            max={10}
            step={0.05}
            value={tempSpeed}
            onChange={(e) => handleChange(setTempSpeed, e.target.value)}
            onMouseUp={() => handleFinishChange(setSpeed, tempSpeed)}
            onTouchEnd={() => handleFinishChange(setSpeed, tempSpeed)}
          />
        </div>
      </div>
      <Routes>
        <Route
          path="/bubble-sort"
          element={
            <BubbleSort maxValue={100} numBars={numBars} speed={speed} />
          }
        />
        <Route
          path="/selection-sort"
          element={
            <SelectionSort maxValue={100} numBars={numBars} speed={speed} />
          }
        />
        <Route
          path="/insertion-sort"
          element={
            <InsertionSort maxValue={100} numBars={numBars} speed={speed} />
          }
        />
        <Route
          path="/heap-sort"
          element={<HeapSort maxValue={100} numBars={numBars} speed={speed} />}
        />
        <Route
          path="/merge-sort"
          element={<MergeSort maxValue={100} numBars={numBars} speed={speed} />}
        />
        <Route
          path="/quick-sort"
          element={<QuickSort maxValue={100} numBars={numBars} speed={speed} />}
        />
      </Routes>
    </Router>
  );
}
