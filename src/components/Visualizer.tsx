import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import DataElement from "@/types/DataElement";
import Step from "@/types/Step";

const Visualizer = ({
  data,
  step,
  speed,
}: {
  data: DataElement[];
  step: Step;
  speed: number;
}) => {
  const [width, setWidth] = useState(0);
  const [showLabels, setShowLabels] = useState(true);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (parentRef.current) {
        setWidth(parentRef.current.offsetWidth);
        setShowLabels(parentRef.current.offsetWidth / data.length > 50);
      }
    });

    if (parentRef.current) {
      resizeObserver.observe(parentRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [data.length]);

  const highlights = (() => {
    const highlights: Record<string, string> = {};
    step?.highlights?.forEach((highlight) => {
      highlight.elements.forEach((element) => {
        highlights[element.id] = highlight.color;
      });
    });
    return highlights;
  })();

  return (
    <div
      className="relative max-h-[600px] w-full flex-1 border-b border-gray-300"
      ref={parentRef}
    >
      {data.map((element, index) => {
        const fill = highlights[element.id] || "fill-sky-600";
        console.log(fill);

        return (
          <motion.svg
            key={element.id}
            className="absolute"
            width={width / data.length}
            height="100%"
            initial={{ x: (width / data.length) * index }}
            animate={{ x: (width / data.length) * index }}
            transition={{ duration: 0.25 / speed, ease: "easeIn" }}
            overflow="visible"
          >
            <rect
              x="25%"
              y={`${100 - element.value}%`}
              width="50%"
              height={`${element.value}%`}
              className={fill}
            />
            {showLabels && (
              <text
                x="50%"
                y={`${100 - element.value - 2}%`}
                textAnchor="middle"
                fontWeight="bold"
              >
                {element.value}
              </text>
            )}
          </motion.svg>
        );
      })}
    </div>
  );
};

export default Visualizer;
