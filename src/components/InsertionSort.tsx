import { useState, useCallback, useEffect, useRef } from "react";

export default function InsertionSort({
  numBars,
  maxValue,
}: {
  numBars: number;
  maxValue: number;
}) {
  const [data, setData] = useState<number[]>([]);
  const barRefs = useRef<(SVGElement | null)[]>([]);

  useEffect(() => {
    barRefs.current = barRefs.current.slice(0, data.length);
  }, [data]);

  const [comparedIndices, setComparedIndices] = useState<number[]>([]);
  const [lastSortedIndex, setLastSortedIndex] = useState(0);

  const SORTING_STATES = {
    PLAYING: "playing",
    PAUSED: "paused",
    STOPPED: "stopped",
  };

  const sortingStateRef = useRef(SORTING_STATES.STOPPED);
  const outerIndexRef = useRef(1);
  const innerIndexRef = useRef<null | number>(null);

  const setSortingState = (state: string) => {
    sortingStateRef.current = state;
  };
  const isPlaying = () => sortingStateRef.current === SORTING_STATES.PLAYING;
  const isPaused = () => sortingStateRef.current === SORTING_STATES.PAUSED;
  const isStopped = () => sortingStateRef.current === SORTING_STATES.STOPPED;

  const generateData = useCallback((n: number, data?: number[]) => {
    // Reset sorting state
    setSortingState(SORTING_STATES.STOPPED);
    outerIndexRef.current = 1;
    innerIndexRef.current = null;
    setLastSortedIndex(0);
    setComparedIndices([]);

    const newData =
      data ||
      Array.from({ length: n }, () => Math.floor(Math.random() * maxValue) + 1);
    setData(newData);
  }, []);

  const startSort = useCallback(async () => {
    if (isPlaying()) return; // Prevent starting if already sorting
    setSortingState(SORTING_STATES.PLAYING);

    let newData = [...data];
    const len = newData.length;

    for (let i = outerIndexRef.current; i < len; i++) {
      setLastSortedIndex(i);
      let j = innerIndexRef.current || i;
      innerIndexRef.current = null;

      setComparedIndices([j, j - 1]);
      await new Promise((resolve) => setTimeout(resolve, 1));

      while (j > 0 && newData[j - 1] > newData[j]) {
        if (isPaused()) {
          outerIndexRef.current = i;
          innerIndexRef.current = j;
          return;
        }

        if (isStopped()) {
          return;
        }

        setComparedIndices([j, j - 1]);

        [newData[j - 1], newData[j]] = [newData[j], newData[j - 1]];
        setData(newData);

        await new Promise((resolve) => setTimeout(resolve, 1));
        j--;
        setComparedIndices([j, j - 1]);
        await new Promise((resolve) => setTimeout(resolve, 1));
      }
    }

    setComparedIndices([]);
    setSortingState(SORTING_STATES.STOPPED);

    // Reset indices after completing the sort
    outerIndexRef.current = 1;
    innerIndexRef.current = null;
  }, [data, sortingStateRef]);

  const pauseSort = useCallback(() => {
    if (isPlaying()) setSortingState(SORTING_STATES.PAUSED);
  }, []);

  useEffect(() => {
    generateData(numBars);
  }, []);

  return (
    <>
      <h1 className="text-4xl text-center font-bold my-16">Insertion Sort</h1>
      <div className="w-full h-[600px] relative">
        {data.map((value, index) => {
          const heightPercentage = (value / maxValue) * 100; // Calculate the height percentage
          const textYPosition =
            heightPercentage > 5 // Change threshold as needed
              ? `${100 - heightPercentage + 4}%` // Position inside the rectangle
              : `${100 - heightPercentage - 2}%`; // Position above the rectangle if too short
          const textColor = heightPercentage > 40 ? "white" : "black"; // Change threshold as needed
          return (
            <svg
              key={index}
              ref={(el) => (barRefs.current[index] = el)} // Assign ref for each bar
              width={`${100 / data.length}%`}
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: "absolute",
                left: `${(100 / data.length) * index}%`,
                transition: "left 0.1s ease",
              }}
            >
              <rect
                x="25%"
                y={`${100 - heightPercentage}%`}
                width="50%"
                height={`${heightPercentage}%`}
                fill={`${
                  comparedIndices.includes(index)
                    ? "red"
                    : index === lastSortedIndex
                    ? "blue"
                    : "green"
                }`}
                fillOpacity={
                  comparedIndices.includes(index)
                    ? 1
                    : 0.2 + (0.8 * value) / maxValue
                }
              />
              <text
                x="50%"
                y={textYPosition} // Use calculated y position
                fill={`${
                  comparedIndices.includes(index) ? "black" : textColor
                }`}
                fontSize="16"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {value} {/* Display the value */}
              </text>
            </svg>
          );
        })}
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
