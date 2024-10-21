import BubbleSort from "./components/BubbleSort";
import SelectionSort from "./components/SelectionSort";
import InsertionSort from "./components/InsertionSort";
import HeapSort from "./components/HeapSort";
import MergeSort from "./components/MergeSort";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import QuickSort from "./components/QuickSort";
import useWindowWidth from "./hooks/use-window-width";
import { OptionsProvider } from "./context/options-context";

export default function App() {
  const windowWidth = useWindowWidth();

  if (windowWidth < 750) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold">Please use a larger screen</h1>
      </div>
    );
  }

  return (
    <OptionsProvider>
      <Router>
        <div className="max-w-full links flex gap-8 p-8">
          <Link to="/bubble-sort">Bubble Sort</Link>
          <Link to="/selection-sort">Selection Sort</Link>
          <Link to="/insertion-sort">Insertion Sort</Link>
          <Link to="/heap-sort">Heap Sort</Link>
          <Link to="/merge-sort">Merge Sort</Link>
          <Link to="/quick-sort">Quick Sort</Link>
        </div>
        <Routes>
          <Route path="/bubble-sort" element={<BubbleSort />} />
          <Route path="/selection-sort" element={<SelectionSort />} />
          <Route path="/insertion-sort" element={<InsertionSort />} />
          <Route path="/heap-sort" element={<HeapSort />} />
          <Route path="/merge-sort" element={<MergeSort />} />
          <Route path="/quick-sort" element={<QuickSort />} />
        </Routes>
      </Router>
    </OptionsProvider>
  );
}
