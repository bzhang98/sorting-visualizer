import BubbleSort from "./components/BubbleSort";
import SelectionSort from "./components/SelectionSort";
import InsertionSort from "./components/InsertionSort";
import HeapSort from "./components/HeapSort";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";
import { useCallback, useState } from "react";

export default function App() {
  const [speed, setSpeed] = useState(1);
  const [numBars, setNumBars] = useState(30);
  const [tempSpeed, setTempSpeed] = useState(speed);
  const [tempNumBars, setTempNumBars] = useState(numBars);

  const handleFinishChange = useCallback((setter: (arg0: number) => void, value: any) => {
    setter(Number(value));
  }, []);

  const handleChange = useCallback((setTemp: (arg0: number) => void, value: any) => {
    setTemp(Number(value));
  }, []);

  return (
    <Router>
      <header className="p-8">
        <nav className="flex gap-4">
          <Link className="hover:underline" to="/bubble-sort">
            Bubble Sort
          </Link>
          <Link className="hover:underline" to="/selection-sort">
            Selection Sort
          </Link>
          <Link className="hover:underline" to="/insertion-sort">
            Insertion Sort
          </Link>
          <Link className="hover:underline" to="/heap-sort">
            Heap Sort
          </Link>
        </nav>
      </header>
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
      </Routes>
    </Router>
  );
}
