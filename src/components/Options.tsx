import React, { ComponentProps } from "react";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";
import Sidebar from "./Sidebar";

const Options: React.FC<ComponentProps<typeof Sidebar>> = ({
  settings,
  updateSettings,
}) => {
  return (
    <>
      <div className="flex flex-col gap-4">
        <div>
          <Label htmlFor="numBars" className="mb-2 block">
            Number of Elements: {settings.numBars}
          </Label>
          <div>
            <Slider
              id="numBars"
              min={5}
              max={50}
              step={1}
              value={[settings.numBars]}
              onValueChange={(value) => {
                updateSettings("numBars", value[0]);
              }}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="minValue" className="mb-2 block">
            Minimum Value: {settings.minValue}
          </Label>
          <Slider
            id="minValue"
            min={1}
            max={100}
            step={1}
            value={[settings.minValue]}
            onValueChange={(value) => {
              const newValue = value[0];
              if (newValue <= settings.maxValue) {
                updateSettings("minValue", newValue);
              }
            }}
          />
        </div>
        <div>
          <Label htmlFor="maxValue" className="mb-2 block">
            Maximum Value: {settings.maxValue}
          </Label>
          <Slider
            min={1}
            max={100}
            step={1}
            value={[settings.maxValue]}
            onValueChange={(value) => {
              const newValue = value[0];
              if (newValue >= settings.minValue) {
                updateSettings("maxValue", newValue);
              }
            }}
          />
        </div>
        <div>
          <Label htmlFor="sortOrder" className="mb-2 block">
            Initial Sort Order
          </Label>
          <Select
            value={settings.sortOrder}
            onValueChange={(value) => {
              updateSettings("sortOrder", value);
            }}
          >
            <SelectTrigger id="sortOrder">
              <SelectValue placeholder="Select sort order for initial data..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="random">Random</SelectItem>
              <SelectItem value="almostSortedAscending">
                Almost Sorted (Ascending)
              </SelectItem>
              <SelectItem value="almostSortedDescending">
                Almost Sorted (Descending)
              </SelectItem>
              <SelectItem value="sortedAscending">
                Sorted (Ascending)
              </SelectItem>
              <SelectItem value="sortedDescending">
                Sorted (Descending)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};

export default Options;
