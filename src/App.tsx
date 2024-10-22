import BubbleSort from "./components/BubbleSort";
import SelectionSort from "./components/SelectionSort";
import InsertionSort from "./components/InsertionSort";
import HeapSort from "./components/HeapSort";
import MergeSort from "./components/MergeSort";
import HomePage from "./components/HomePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import QuickSort from "./components/QuickSort";
import useWindowWidth from "./hooks/use-window-width";
import { AppProvider } from "./context/app-context";
import Nav from "./components/Nav";

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
    <AppProvider>
      <Router>
        <div className="app">
          <Nav />
          <div
            style={{
              margin: "0 auto",
            }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/bubble-sort" element={<BubbleSort />} />
              <Route path="/selection-sort" element={<SelectionSort />} />
              <Route path="/insertion-sort" element={<InsertionSort />} />
              <Route path="/heap-sort" element={<HeapSort />} />
              <Route path="/merge-sort" element={<MergeSort />} />
              <Route path="/quick-sort" element={<QuickSort />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
}
