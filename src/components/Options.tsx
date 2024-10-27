import { useAppContext } from "@/context/app-context";
import { Label } from "@radix-ui/react-label";
import { Switch } from "@radix-ui/react-switch";

export default function Options() {
  const {
    numBars,
    setNumBars,
    sortOrder,
    setSortOrder,
    minValue,
    setMinValue,
    maxValue,
    setMaxValue,
    speed,
    setSpeed,
    sortingState,
  } = useAppContext();

  return (
    <div
      className="options px-4"
      style={{
        width: "clamp(700px, 100%, 1000px)",
        margin: "0 auto",
      }}
    >
      <Switch />
      <div className="flex items-center mt-4">
        <Switch id="airplane-mode" />
        <Label htmlFor="airplane-mode">Manual Mode</Label>
      </div>
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
        <label htmlFor="maxValue" className="block mt-4">
          Maximum Value: {maxValue}
        </label>
        <input
          type="range"
          id="maxValue"
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
        <label htmlFor="minValue" className="block mt-4">
          Minimum Value: {minValue}
        </label>
        <input
          type="range"
          id="minValue"
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
  );
}
