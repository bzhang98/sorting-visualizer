import BubbleSort from "./components/BubbleSort";
import SelectionSort from "./components/SelectionSort";
import InsertionSort from "./components/InsertionSort";
import HeapSort from "./components/HeapSort";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <header className="p-4">
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
      <Routes>
        <Route
          path="/bubble-sort"
          element={<BubbleSort maxValue={100} numBars={100} speed={10} />}
        />
        <Route
          path="/selection-sort"
          element={<SelectionSort maxValue={100} numBars={100} speed={10} />}
        />
        <Route
          path="/insertion-sort"
          element={<InsertionSort maxValue={100} numBars={100} speed={10} />}
        />
        <Route
          path="/heap-sort"
          element={<HeapSort maxValue={100} numBars={100} speed={10} />}
        />
      </Routes>
    </Router>
  );
}
