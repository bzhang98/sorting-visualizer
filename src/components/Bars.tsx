import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { useAppContext } from "../context/app-context";

export default function Bars({
  data,
  highlightedIndices,
}: {
  data: { id: string; value: number }[];
  highlightedIndices?: { indices: number[]; color?: string; label?: string }[];
}) {
  const { speed } = useAppContext();
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
      className="px-4"
      style={{
        width: "clamp(700px, 100%, 1000px)",
        margin: "0 auto",
      }}
    >
      <div
        className="relative mt-16 mb-32"
        ref={containerRef}
        style={{ aspectRatio: "1 / 0.3" }}
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
    </div>
  );
}
