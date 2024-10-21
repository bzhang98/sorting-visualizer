import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { useRef } from "react";
import { useOptionsContext } from "../context/options-context";

export default function Bars({
  data,
  highlightedIndices,
  generateData,
  startSort,
  pauseSort,
}: {
  data: { id: string; value: number }[];
  highlightedIndices?: { indices: number[]; color?: string; label?: string }[];
  generateData: (sortOrder: string) => void;
  startSort: () => void;
  pauseSort: () => void;
}) {
  const {
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
  } = useOptionsContext();

  const containerRef = useRef<null | HTMLDivElement>(null);

  const getFillColor = (index: number) => {
    if (!highlightedIndices) {
      return "lightsteelblue";
    }
    for (const { indices, color } of highlightedIndices) {
      if (indices.includes(index)) {
        return color;
      }
    }
    return "lightsteelblue"; // Default color if index is not highlighted
  };

  const getLabel = (index: number) => {
    if (!highlightedIndices) {
      return null;
    }
    for (const { indices, label } of highlightedIndices) {
      if (indices.includes(index)) {
        return label;
      }
    }
    return null;
  };

  return (
    <div
      className="w-[100vw] h-[100vh] p-8"
      style={{
        width: "clamp(700px, 100%, 1000px)",
        margin: "0 auto",
      }}
    >
      <div>
        <label htmlFor="speed" className="block mt-4">
          Speed: {speed}x
        </label>
        <input
          type="range"
          id="speed"
          min="0.25"
          max="10"
          step={0.05}
          value={speed}
          onChange={(e) => {
            setSpeed(Number(e.target.value));
          }}
          className="w-[300px]"
        />
      </div>
      <div
        className="relative my-16"
        ref={containerRef}
        style={{ aspectRatio: "1 / 0.4" }}
      >
        <AnimatePresence initial={false}>
          {data.map(({ id, value }, index) => {
            const barWidth =
              (containerRef.current?.offsetWidth ?? 0) / data.length;
            const heightPercentage = (value / 100) * 100;
            const textYPosition = `${100 - heightPercentage - 2}%`;
            const textColor = "black";
            const label = getLabel(index);
            const labelYPosition = `${110}%`; // Adjust this to move label further down
            const lineYStart = `${105}%`;
            const lineYEnd = `${100}%`; // Adjust to place line under the bar

            return (
              <motion.svg
                key={id}
                className="absolute"
                width={barWidth}
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
                initial={{ x: barWidth * index }}
                animate={{ x: barWidth * index }}
                transition={{ duration: 0.25 / speed }}
                overflow={"visible"}
              >
                <rect
                  x="25%"
                  y={`${100 - heightPercentage}%`}
                  width="50%"
                  height={`${heightPercentage}%`}
                  fill={getFillColor(index)}
                />
                {label && (
                  <>
                    <text
                      x="50%"
                      y={labelYPosition} // Position text below the bar
                      fill="black"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {label}
                    </text>
                    <line
                      x1="50%"
                      y1={lineYEnd} // Start of the line (near text)
                      x2="50%"
                      y2={lineYStart} // End of the line (bottom of the bar)
                      stroke="black"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)" // Optional: Use this if you define an arrow marker
                    />
                  </>
                )}
                {barWidth >= 50 && (
                  <text
                    x="50%"
                    y={textYPosition}
                    fill={textColor}
                    fontSize="16"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {value}
                  </text>
                )}
              </motion.svg>
            );
          })}
        </AnimatePresence>
      </div>
      <div className="controls flex gap-8 mb-8">
        <button
          onClick={() => {
            startSort();
          }}
          className="bg-slate-700 text-white px-4 py-2 rounded-md"
        >
          <Play />
        </button>
        <button
          onClick={() => {
            pauseSort();
          }}
          className="bg-slate-700 text-white px-4 py-2 rounded-md"
        >
          <Pause />
        </button>
        <button
          onClick={() => {
            generateData(sortOrder);
          }}
          className="bg-slate-700 text-white px-4 py-2 rounded-md"
        >
          Generate New Data
        </button>
      </div>
      <div className="options">
        <div>
          <label htmlFor="numBars" className="block mt-4">
            Number of Elements: {numBars}
          </label>
          <input
            type="range"
            id="numBars"
            min={5}
            max={50}
            step={1}
            value={numBars}
            onChange={(e) => {
              setNumBars(Number(e.target.value));
            }}
            className="w-[300px]"
          />
        </div>
        <div>
          <label htmlFor="numBars" className="block mt-4">
            Maximum Value: {maxValue}
          </label>
          <input
            type="range"
            id="numBars"
            min={minValue}
            max={100}
            step={1}
            value={maxValue}
            onChange={(e) => {
              setMaxValue(Number(e.target.value));
            }}
            className="w-[300px]"
          />
        </div>
        <div>
          <label htmlFor="numBars" className="block mt-4">
            Minimum Value: {minValue}
          </label>
          <input
            type="range"
            id="numBars"
            min={1}
            max={100}
            step={1}
            value={minValue}
            onChange={(e) => {
              setMinValue(Number(e.target.value));
              setMaxValue(Math.max(Number(e.target.value), maxValue));
            }}
            className="w-[300px]"
          />
        </div>
        <div>
          <label htmlFor="sortOrder" className="block mt-4">
            Sort Order
          </label>
          <select
            name="sortOrder"
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
            }}
            className="border border-slate-500 p-2 rounded-md"
          >
            <option value="random">Random</option>
            <option value="almostSortedAscending">
              Almost Sorted (Ascending)
            </option>
            <option value="almostSortedDescending">
              Almost Sorted (Descending)
            </option>
            <option value="sortedAscending">Sorted (Ascending)</option>
            <option value="sortedDescending">Sorted (Descending)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
