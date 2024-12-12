import HomePage from "./pages/HomePage";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import VisualizerView from "./pages/VisualizerView";
import Learn from "./pages/Learn";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/visualizer" element={<VisualizerView />} />
        <Route path="/learn" element={<Learn />} />
      </Routes>
      <div className="flex items-center justify-center border-t py-4">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Brian Zhang. MIT License | Open Source
          Project
        </p>
      </div>
    </div>
  );
}
