import { useAppContext } from "@/context/app-context";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";

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
    mode,
  } = useAppContext();

  return (
    <div
      className="options px-4 flex flex-col gap-4"
      style={{
        width: "clamp(700px, 100%, 1000px)",
        margin: "1rem auto",
      }}
    >
      <div>
        <Label htmlFor="speed" className="block">
          Speed: {speed}x
        </Label>
        <Slider
          value={[speed]}
          onValueChange={(value) => setSpeed(value[0])}
          min={0.25}
          max={10}
          step={0.05}
          className={`w-[300px] my-4 ${
            sortingState === "playing" || mode === "manual"
              ? "opacity-50 cursor-not-allowed"
              : "cursor-grab"
          }`}
          disabled={sortingState === "playing" || mode === "manual"}
        />
      </div>
      <div>
        <Label htmlFor="numBars" className="block">
          Number of Elements: {numBars}
        </Label>
        <div>
          <Slider
            value={[numBars]}
            onValueChange={(value) => setNumBars(value[0])}
            min={5}
            max={50}
            step={1}
            className="w-[300px] my-2 cursor-grab"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="maxValue" className="block">
          Maximum Value: {maxValue}
        </Label>
        <Slider
          value={[maxValue]}
          onValueChange={(value) => {
            const newValue = value[0];
            // Ensure maxValue does not go below minValue
            if (newValue >= minValue) {
              setMaxValue(newValue);
            }
          }}
          min={1}
          max={100}
          step={1}
          className="w-[300px] my-4 cursor-grab"
        />
      </div>
      <div>
        <Label htmlFor="minValue" className="block">
          Minimum Value: {minValue}
        </Label>
        <Slider
          value={[minValue]}
          onValueChange={(value) => {
            const newValue = value[0];
            // Ensure minValue does not go above maxValue
            if (newValue <= maxValue) {
              setMinValue(newValue);
            }
          }}
          min={1}
          max={100}
          step={1}
          className="w-[300px] my-4 cursor-grab"
        />
      </div>
      <div>
        <Label htmlFor="sortOrder" className="block mb-2">
          Sort Order
        </Label>
        <Select
          value={sortOrder}
          onValueChange={(value) => {
            setSortOrder(value);
          }}
        >
          <SelectTrigger id="sortOrder" className="w-[300px]">
            {sortOrder}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="random">Random</SelectItem>
            <SelectItem value="almostSortedAscending">
              Almost Sorted (Ascending)
            </SelectItem>
            <SelectItem value="almostSortedDescending">
              Almost Sorted (Descending)
            </SelectItem>
            <SelectItem value="sortedAscending">Sorted (Ascending)</SelectItem>
            <SelectItem value="sortedDescending">
              Sorted (Descending)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
