import { useAppContext } from "@/context/app-context";
import { ChevronRight, ChevronLeft, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

export default function AutoControls({
  generateData,
  nextStep,
  prevStep,
}: {
  generateData: (sortOrder: string) => void;
  nextStep: () => void;
  prevStep: () => void;
}) {
  const { sortOrder } = useAppContext();

  return (
    <div
      className="controls flex items-center gap-8 mb-8 px-4 pt-4 border-t-2"
      style={{
        width: "clamp(700px, 100%, 1000px)",
        margin: "0 auto",
      }}
    >
      <Button onClick={prevStep}>
        <ChevronLeft />
      </Button>
      <Button onClick={nextStep}>
        <ChevronRight />
      </Button>
      <Button
        onClick={() => {
          generateData(sortOrder);
        }}
      >
        <RotateCcw /> Randomize
      </Button>
    </div>
  );
}
