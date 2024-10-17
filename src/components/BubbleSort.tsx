import { useState, useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

export default function BubbleSort({
  numBars,
  maxValue,
}: {
  numBars: number;
  maxValue: number;
}) {
  const [data, setData] = useState<{ id: string; value: number }[]>([]);

  const [comparedIndices, setComparedIndices] = useState<number[]>([]);

  const SORTING_STATES = {
    PLAYING: "playing",
    PAUSED: "paused",
    STOPPED: "stopped",
  };

  const sortingStateRef = useRef(SORTING_STATES.STOPPED);
  const outerIndexRef = useRef(0);
  const innerIndexRef = useRef(0);

  const setSortingState = (state: string) => {
    sortingStateRef.current = state;
  };
  const isPlaying = () => sortingStateRef.current === SORTING_STATES.PLAYING;
  const isPaused = () => sortingStateRef.current === SORTING_STATES.PAUSED;
  const isStopped = () => sortingStateRef.current === SORTING_STATES.STOPPED;

  const generateData = useCallback((n: number) => {
    // Reset sorting state
    setSortingState(SORTING_STATES.STOPPED);
    outerIndexRef.current = 0;
    innerIndexRef.current = 0;
    setComparedIndices([]);

    const newData = Array.from({ length: n }, () => ({
      id: uuidv4(), // Generate a unique ID for each object
      value: Math.floor(Math.random() * maxValue) + 1,
    }));

    setData(newData);
  }, []);

  const startSort = useCallback(async () => {
    if (isPlaying()) return; // Prevent starting if already sorting
    setSortingState(SORTING_STATES.PLAYING);

    let newData = [...data];
    const len = newData.length;

    for (let i = outerIndexRef.current; i < len; i++) {
      for (let j = innerIndexRef.current; j < len - i - 1; j++) {
        if (isPaused()) {
          // Save current indices for resuming later
          outerIndexRef.current = i;
          innerIndexRef.current = j;
          return;
        }

        if (isStopped()) {
          return;
        }

        setComparedIndices([j, j + 1]);
        await new Promise((resolve) => setTimeout(resolve, 10));

        if (newData[j].value > newData[j + 1].value) {
          [newData[j], newData[j + 1]] = [newData[j + 1], newData[j]];

          setData([...newData]);
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
      }
      // Reset inner loop index at the end of each outer iteration
      innerIndexRef.current = 0;
    }

    setComparedIndices([]);
    setSortingState(SORTING_STATES.STOPPED);

    // Reset indices after completing the sort
    outerIndexRef.current = 0;
    innerIndexRef.current = 0;
  }, [data, sortingStateRef]);

  const pauseSort = useCallback(() => {
    if (isPlaying()) setSortingState(SORTING_STATES.PAUSED);
  }, []);

  useEffect(() => {
    generateData(numBars);
  }, []);

  return (
    <>
      <h1 className="text-4xl text-center font-bold my-16">Bubble Sort</h1>
      <div className="w-full h-[600px] relative">
        <AnimatePresence initial={false}>
          {data.map(({ id, value }, index) => {
            const barWidth = window.innerWidth / data.length;
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
                transition={{ duration: 0.01 }}
              >
                <rect
                  x="25%"
                  y={`${100 - heightPercentage}%`}
                  width="50%"
                  height={`${heightPercentage}%`}
                  fill={comparedIndices.includes(index) ? "red" : "green"}
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
      <button
        onClick={() => {
          generateData(numBars);
        }}
      >
        Restart
      </button>
      <button
        onClick={() => {
          startSort();
        }}
      >
        Play
      </button>
      <button
        onClick={() => {
          pauseSort();
        }}
      >
        Pause
      </button>
    </>
  );
}
