import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";

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
    <>
      <div
        className={`m-auto relative`}
        ref={containerRef}
        style={{ width: "90%", aspectRatio: "1 / 0.2" }}
      >
        <AnimatePresence initial={false}>
          {data.map(({ id, value }, index) => {
            const barWidth = (containerRef.current?.clientWidth ?? 0) / numBars;
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
      <div className="controls flex gap-8 p-8">
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
    </>
  );
}
