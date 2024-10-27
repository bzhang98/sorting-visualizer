import { useAppContext } from "@/context/app-context";
import { Play, Pause } from "lucide-react";

export default function Controls({
  generateData,
  startSort,
  pauseSort,
}: {
  generateData: (sortOrder: string) => void;
  startSort: () => void;
  pauseSort: () => void;
}) {
  const { sortOrder } = useAppContext();

  return (
    <div
      className="controls flex items-center gap-8 mb-8 px-4"
      style={{
        width: "clamp(700px, 100%, 1000px)",
        margin: "0 auto",
      }}
    >
      <button
        onClick={() => {
          startSort();
        }}
        className="bg-gray-800 text-white px-4 py-2 rounded-md transition-transform transform hover:bg-gray-600 hover:-translate-y-0.5 hover:scale-105 active:scale-95 active:bg-gray-700 active:translate-y-0"
      >
        <Play />
      </button>
      <button
        onClick={() => {
          pauseSort();
        }}
        className="bg-gray-800 text-white px-4 py-2 rounded-md transition-transform transform hover:bg-gray-600 hover:-translate-y-0.5 hover:scale-105 active:scale-95 active:bg-gray-700 active:translate-y-0"
      >
        <Pause />
      </button>
      <button
        onClick={() => {
          generateData(sortOrder);
        }}
        className="bg-gray-800 text-white px-4 py-2 rounded-md transition-transform transform hover:bg-gray-600 hover:-translate-y-0.5 hover:scale-105 active:scale-95 active:bg-gray-700 active:translate-y-0"
      >
        Generate New Data
      </button>
    </div>
  );
}
