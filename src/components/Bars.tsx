import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/app-context";
import Step from "@/types/Step";

export default function Bars({ currentStep }: { currentStep: Step }) {
  const { speed } = useAppContext();
  const containerRef = useRef<null | HTMLDivElement>(null);
  const [barWidth, setBarWidth] = useState(0);

  const getFillColor = (index: number) => {
    if (!currentStep.highlightedIndices && !currentStep.highlightedRange) {
      return "steelblue";
    }

    if (currentStep.highlightedIndices) {
      for (const highlight of currentStep.highlightedIndices) {
        if (highlight.indices.includes(index)) {
          return highlight.color || "steelblue";
        }
      }
    }

    if (currentStep.highlightedRange) {
      for (const highlight of currentStep.highlightedRange) {
        const [start, end] = highlight.range;
        if (index >= start && index <= end) {
          return highlight.color || "steelblue";
        }
      }
    }

    return "steelblue";
  };

  const getLabelForIndex = (index: number) => {
    if (!currentStep.highlightedIndices) return null;

    for (const highlight of currentStep.highlightedIndices) {
      if (!highlight.label) continue;

      // Only render the label on the first index of the group
      if (highlight.indices[0] === index) {
        return {
          text: highlight.label,
          width: highlight.indices.length * barWidth,
        };
      }
    }
    return null;
  };

  const generateRangePath = (startX: number, endX: number) => {
    const pathHeight = Math.min(15, (endX - startX + 1) / 2);
    const pathY = 0;
    return `M ${startX} ${pathY} v ${pathHeight} h ${
      endX - startX
    } v -${pathHeight}`;
  };

  useEffect(() => {
    if (containerRef.current) {
      const newBarWidth =
        containerRef.current.offsetWidth / currentStep.currentState.length;
      setBarWidth(newBarWidth);
    }
  }, [currentStep]);

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
          {currentStep.currentState.map(({ id, value }, index) => {
            const label = getLabelForIndex(index);
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
                overflow="visible"
              >
                <rect
                  x="25%"
                  y={`${100 - value}%`}
                  width="50%"
                  height={`${value}%`}
                  fill={getFillColor(index)}
                />
                {barWidth > 35 && (
                  <text
                    x="50%"
                    y={`${100 - value - 2}%`}
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {value}
                  </text>
                )}
                {label && (
                  <text
                    x={label.width / 2}
                    y="100%"
                    dy="20"
                    textAnchor="middle"
                    fontSize="12"
                  >
                    {label.text}
                  </text>
                )}
              </motion.svg>
            );
          })}
          {currentStep.highlightedRange?.map(({ range, label }, i) => {
            const startIndex = range[0];
            const endIndex = range.length === 2 ? range[1] : range[0];
            const startX = startIndex * barWidth + barWidth / 4;
            const endX = (endIndex + 1) * barWidth - barWidth / 4;
            const bracketPath = generateRangePath(startX, endX);

            return (
              <svg
                key={`bracket-${i}`}
                className="absolute"
                width="100%"
                height="35px" // Increased height to accommodate text
                style={{ bottom: "-80", left: "0" }} // Moved down to make room for text
              >
                <path
                  d={bracketPath}
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                />
                {label && (
                  <text
                    x={(startX + endX) / 2} // Center between start and end
                    y="30" // Position below the bracket
                    textAnchor="middle"
                    fontSize="12"
                  >
                    {label}
                  </text>
                )}
              </svg>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
