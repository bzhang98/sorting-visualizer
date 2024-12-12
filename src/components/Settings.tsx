import React, { ComponentProps } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import {
  ChevronFirst,
  ChevronLeft,
  Play,
  ChevronRight,
  ChevronLast,
} from "lucide-react";

import Sidebar from "./Sidebar";

const Settings: React.FC<ComponentProps<typeof Sidebar>> = ({
  settings,
  updateSettings,
  generate,
  incrementStep,
  decrementStep,
}) => {
  return (
    <>
      <h1 className="text-3xl font-bold p-2 py-6 border-b border-gray-300">
        Settings
      </h1>

      <div className="flex flex-col p-2 py-6 border-b border-gray-300">
        <h2 className="mb-4 text-xl font-semibold">Controls</h2>
        <div className="mb-4">
          <Label htmlFor="speed" className="block mb-2">
            Speed: {settings.speed}x
          </Label>
          <Slider
            min={0.25}
            max={10}
            step={0.05}
            value={[settings.speed]}
            onValueChange={(value) => {
              updateSettings("speed", value[0]);
            }}
          />
        </div>
        <div className="flex gap-2">
          <Button>
            <ChevronFirst />
          </Button>
          <Button onClick={decrementStep}>
            <ChevronLeft />
          </Button>
          <Button>
            <Play />
          </Button>
          <Button onClick={incrementStep}>
            <ChevronRight />
          </Button>
          <Button>
            <ChevronLast />
          </Button>
        </div>
      </div>

      <div className="flex flex-col py-6 p-2">
        <h2 className="mb-4 text-xl font-semibold">Options</h2>
        <div className="flex flex-col gap-4">
          <div>
            <Label>Algorithm</Label>
            <Select
              value={settings.algorithm}
              onValueChange={(value) => {
                updateSettings("algorithm", value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an algorithm..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bubble-sort">Bubble Sort</SelectItem>
                <SelectItem value="selection-sort">Selection Sort</SelectItem>
                <SelectItem value="insertion-sort">Insertion Sort</SelectItem>
                <SelectItem value="heap-sort">Heap Sort</SelectItem>
                <SelectItem value="merge-sort">Merge Sort</SelectItem>
                <SelectItem value="quick-sort">Quick Sort</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="numBars" className="block mb-2">
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
            <Label htmlFor="minValue" className="block mb-2">
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
            <Label htmlFor="maxValue" className="block mb-2">
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
            <Label htmlFor="sortOrder" className="block mb-2">
              Sort Order
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
          <Button onClick={generate}>Generate</Button>
        </div>
      </div>
    </>
  );
};

export default Settings;
