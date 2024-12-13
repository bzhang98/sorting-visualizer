import React, { ComponentProps } from "react";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import {
  ChevronFirst,
  ChevronLeft,
  Play,
  Pause,
  ChevronRight,
  ChevronLast,
} from "lucide-react";

import Sidebar from "./sidebar";

const Controls: React.FC<ComponentProps<typeof Sidebar>> = ({
  settings,
  updateSettings,
  incrementStep,
  decrementStep,
  skipToEnd,
  skipToStart,
  isPlaying,
  togglePlay,
}) => {
  return (
    <>
      <div className="mb-4">
        <Label htmlFor="speed" className="mb-2 block">
          Speed: {settings.speed}x
        </Label>
        <Slider
          id="speed"
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
        <Button onClick={skipToStart} disabled={!settings.stepEnabled}>
          <ChevronFirst size={16} />
        </Button>
        <Button onClick={decrementStep} disabled={!settings.stepEnabled}>
          <ChevronLeft size={16} />
        </Button>
        <Button onClick={togglePlay}>
          {!isPlaying ? <Play size={16} /> : <Pause size={16} />}
        </Button>
        <Button onClick={incrementStep} disabled={!settings.stepEnabled}>
          <ChevronRight size={16} />
        </Button>
        <Button onClick={skipToEnd} disabled={!settings.stepEnabled}>
          <ChevronLast size={16} />
        </Button>
      </div>
    </>
  );
};

export default Controls;
