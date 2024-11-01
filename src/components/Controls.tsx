import { useAppContext } from "@/context/app-context";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronLast,
  ChevronFirst,
} from "lucide-react";
import { Button } from "./ui/button";

export default function Controls({
  generateData,
}: {
  generateData: () => void;
}) {
  const {
    sortingState,
    setSortingState,
    nextStep,
    previousStep,
    firstStep,
    lastStep,
  } = useAppContext();

  return (
    <div
      className="controls flex items-center gap-8 mb-8 px-4 pt-4 border-t-2"
      style={{
        width: "clamp(700px, 100%, 1000px)",
        margin: "0 auto",
      }}
    >
      <div className="flex gap-2">
        <Button
          onClick={() => {
            firstStep();
            setSortingState("idle");
          }}
        >
          <ChevronFirst />
        </Button>
        <Button
          onClick={() => {
            previousStep();
            setSortingState("idle");
          }}
        >
          <ChevronLeft />
        </Button>
        {sortingState === "playing" ? (
          <Button
            onClick={() => {
              setSortingState("paused");
            }}
          >
            <Pause />
          </Button>
        ) : (
          <Button
            onClick={() => {
              setSortingState("playing");
            }}
          >
            <Play />
          </Button>
        )}
        <Button
          onClick={() => {
            nextStep();
            setSortingState("idle");
          }}
        >
          <ChevronRight />
        </Button>
        <Button
          onClick={() => {
            lastStep();
            setSortingState("idle");
          }}
        >
          <ChevronLast />
        </Button>
      </div>

      <Button
        onClick={() => {
          generateData();
        }}
      >
        <RotateCcw /> Randomize
      </Button>
    </div>
  );
}
