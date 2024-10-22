import BubbleSort from "./components/BubbleSort";
import SelectionSort from "./components/SelectionSort";
import InsertionSort from "./components/InsertionSort";
import HeapSort from "./components/HeapSort";
import MergeSort from "./components/MergeSort";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import QuickSort from "./components/QuickSort";
import useWindowWidth from "./hooks/use-window-width";
import { OptionsProvider } from "./context/options-context";
import { NavLink } from "react-router-dom";

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
        <div className="app">
          <div className="max-w-full links flex gap-8 p-8 bg-white shadow-md justify-center">
            <NavLink
              to="/bubble-sort"
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-700 font-medium px-4 py-2 rounded-md hover:bg-blue-50 transition-colors duration-200 relative group ${
                  isActive ? "text-blue-700 bg-blue-50" : ""
                }`
              }
            >
              Bubble Sort
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
            </NavLink>

            <NavLink
              to="/selection-sort"
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-700 font-medium px-4 py-2 rounded-md hover:bg-blue-50 transition-colors duration-200 relative group ${
                  isActive ? "text-blue-700 bg-blue-50" : ""
                }`
              }
            >
              Selection Sort
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
            </NavLink>

            <NavLink
              to="/insertion-sort"
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-700 font-medium px-4 py-2 rounded-md hover:bg-blue-50 transition-colors duration-200 relative group ${
                  isActive ? "text-blue-700 bg-blue-50" : ""
                }`
              }
            >
              Insertion Sort
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
            </NavLink>

            <NavLink
              to="/heap-sort"
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-700 font-medium px-4 py-2 rounded-md hover:bg-blue-50 transition-colors duration-200 relative group ${
                  isActive ? "text-blue-700 bg-blue-50" : ""
                }`
              }
            >
              Heap Sort
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
            </NavLink>

            <NavLink
              to="/merge-sort"
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-700 font-medium px-4 py-2 rounded-md hover:bg-blue-50 transition-colors duration-200 relative group ${
                  isActive ? "text-blue-700 bg-blue-50" : ""
                }`
              }
            >
              Merge Sort
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
            </NavLink>

            <NavLink
              to="/quick-sort"
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-700 font-medium px-4 py-2 rounded-md hover:bg-blue-50 transition-colors duration-200 relative group ${
                  isActive ? "text-blue-700 bg-blue-50" : ""
                }`
              }
            >
              Quick Sort
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
            </NavLink>
          </div>
          <div
            style={{
              width: "clamp(700px, 100%, 1000px)",
              margin: "0 auto",
            }}
          >
            <Routes>
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
    </OptionsProvider>
  );
}
