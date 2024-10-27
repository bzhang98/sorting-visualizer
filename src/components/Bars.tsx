import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { useRef } from "react";
import { useAppContext } from "../context/app-context";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
    sortingState,
  } = useAppContext();

  const containerRef = useRef<null | HTMLDivElement>(null);

  const getFillColor = (index: number) => {
    if (!highlightedIndices) {
      return "steelblue";
    }
    for (const { indices, color } of highlightedIndices) {
      if (indices.includes(index)) {
        return color;
      }
    }
    return "steelblue"; // Default color if index is not highlighted
  };

  const getLabels = (index: number) => {
    if (!highlightedIndices) {
      return [];
    }
    return highlightedIndices
      .filter(({ indices, label }) => indices.includes(index) && label)
      .map(({ label }) => label as string);
  };

  const LABEL_HEIGHT = 8; // Height of each label
  const LABEL_SPACING = 1; // Spacing between labels

  return (
    <div
      className="w-[100vw] p-8"
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
          disabled={sortingState === "playing"}
        />
      </div>
      <div
        className="relative mt-16 mb-32"
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
            const labels = getLabels(index);
            const baseLineYStart = 110;

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

                {labels.map((label, labelIndex) => {
                  const labelYPosition = `${
                    baseLineYStart +
                    (labelIndex * (LABEL_HEIGHT + LABEL_SPACING)) / 2
                  }%`;

                  return (
                    <g key={`${label}-${labelIndex}`}>
                      <text
                        x="50%"
                        y={labelYPosition}
                        fill="black"
                        fontSize="18"
                        fontWeight="semibold"
                        textAnchor="middle"
                      >
                        {label}
                      </text>
                    </g>
                  );
                })}

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
      <div className="controls flex items-center gap-8 mb-8">
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
        <div className="flex items-center space-x-2">
          <Switch id="manual-mode" onCheckedChange={e => console.log(e)}/>
          <Label htmlFor="manual-mode">Manual Mode</Label>
        </div>
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
            className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ease-in-out duration-150"
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
