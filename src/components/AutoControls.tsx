import { useAppContext } from "@/context/app-context";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

export default function AutoControls({
  generateData,
}: {
  generateData: () => void;
}) {
  const { setSortingState } = useAppContext();

  return (
    <div
      className="controls flex items-center gap-8 mb-8 px-4 pt-4 border-t-2"
      style={{
        width: "clamp(700px, 100%, 1000px)",
        margin: "0 auto",
      }}
    >
      <Button
        onClick={() => {
          setSortingState("playing");
        }}
      >
        <Play />
      </Button>
      <Button
        onClick={() => {
          setSortingState("paused");
        }}
      >
        <Pause />
      </Button>
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
