import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Bars({
  data,
  maxValue,
  comparedIndices,
  numBars,
  highlightedIndices,
  speed,
  generateData,
  startSort,
  pauseSort,
}: {
  data: { id: string; value: number }[];
  maxValue: number;
  comparedIndices: number[];
  numBars: number;
  highlightedIndices?: number[];
  speed: number;
  generateData: (n: number) => void;
  startSort: () => void;
  pauseSort: () => void;
}) {
  const containerRef = useRef<null | HTMLDivElement>(null);

  return (
    <div className="flex w-[100vw] p-8">
      <div className="controls flex flex-col justify-end gap-8 px-8">
        <button
          onClick={() => {
            generateData(numBars);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Restart
        </button>
        <button
          onClick={() => {
            startSort();
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Play
        </button>
        <button
          onClick={() => {
            pauseSort();
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Pause
        </button>
      </div>
      <div
        className={`m-auto relative grow`}
        ref={containerRef}
        style={{ aspectRatio: "1 / 0.4" }}
      >
        <AnimatePresence initial={false}>
          {data.map(({ id, value }, index) => {
            const barWidth = (containerRef.current?.offsetWidth ?? 0) / numBars;
            const heightPercentage = (value / maxValue) * 100;
            const textYPosition =
              heightPercentage > 5
                ? `${100 - heightPercentage + 4}%`
                : `${100 - heightPercentage - 2}%`;
            const textColor = "black";

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
              >
                <rect
                  x="25%"
                  y={`${100 - heightPercentage}%`}
                  width="50%"
                  height={`${heightPercentage}%`}
                  fill={`${
                    comparedIndices.includes(index)
                      ? "red"
                      : highlightedIndices !== undefined &&
                        highlightedIndices.includes(index)
                      ? "blue"
                      : "green"
                  }`}
                  fillOpacity={
                    comparedIndices.includes(index)
                      ? 1
                      : 0.1 + (0.5 * value) / maxValue
                  }
                />
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
      <div className="links flex flex-col justify-between gap-8 px-8">
        <Link
          className="bg-green-200 hover:bg-green-400 text-green-900 font-semibold py-2 px-4 rounded-md shadow-sm transition duration-200 text-center flex gap-2"
          to="/bubble-sort"
        >
          <ArrowLeft />
          Bubble Sort
        </Link>
        <Link
          className="bg-green-200 hover:bg-green-400 text-green-900 font-semibold py-2 px-4 rounded-md shadow-sm transition duration-200 text-center flex gap-2"
          to="/selection-sort"
        >
          <ArrowLeft />
          Selection Sort
        </Link>
        <Link
          className="bg-green-200 hover:bg-green-400 text-green-900 font-semibold py-2 px-4 rounded-md shadow-sm transition duration-200 text-center flex gap-2"
          to="/insertion-sort"
        >
          <ArrowLeft />
          Insertion Sort
        </Link>
        <Link
          className="bg-green-200 hover:bg-green-400 text-green-900 font-semibold py-2 px-4 rounded-md shadow-sm transition duration-200 text-center flex gap-2"
          to="/heap-sort"
        >
          <ArrowLeft />
          Heap Sort
        </Link>
        <Link
          className="bg-green-200 hover:bg-green-400 text-green-900 font-semibold py-2 px-4 rounded-md shadow-sm transition duration-200 text-center flex gap-2"
          to="/merge-sort"
        >
          <ArrowLeft />
          Merge Sort
        </Link>
        <Link
          className="bg-green-200 hover:bg-green-400 text-green-900 font-semibold py-2 px-4 rounded-md shadow-sm transition duration-200 text-center flex gap-2"
          to="/quick-sort"
        >
          <ArrowLeft />
          Quick Sort
        </Link>
      </div>
    </div>
  );
}
