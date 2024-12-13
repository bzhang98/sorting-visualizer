import Options from "./options";
import Sidebar from "./sidebar";

import { GraduationCap, Pause, Play, Settings } from "lucide-react";

import { Link } from "react-router-dom";
import { ComponentProps } from "react";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { useTheme } from "./theme-provider";

const SidebarContentSmall: React.FC<ComponentProps<typeof Sidebar>> = (
  props,
) => {
  const sourceLink = `https://github.com/bzhang98/sorting-visualizer/blob/main/src/sorting_functions/${props.settings.algorithm.toLowerCase().replace(" ", "-")}.ts`;
  const { theme } = useTheme();
  return (
    <>
      <Dialog>
        <DialogTrigger asChild className="mb-2 block">
          <Button variant="outline">
            <Settings size={16} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Customize the visualizer settings.
            </DialogDescription>
          </DialogHeader>
          <div className="">
            <Label htmlFor="speed" className="mb-2 block">
              Speed: {props.settings.speed}x
            </Label>
            <Slider
              id="speed"
              min={0.25}
              max={10}
              step={0.05}
              value={[props.settings.speed]}
              onValueChange={(value) => {
                props.updateSettings("speed", value[0]);
              }}
            />
          </div>
          <Options {...props} />
          <DialogClose asChild>
            <div className="flex gap-4">
              <Button className="mt-4 w-full" variant="outline">
                Close
              </Button>
              <Button className="mt-4 w-full" onClick={props.generate}>
                Generate
              </Button>
            </div>
          </DialogClose>
        </DialogContent>
      </Dialog>
      <Button onClick={props.togglePlay}>
        {props.isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </Button>
      <div className="mt-4 flex flex-col gap-2 border-t pt-4">
        <Button variant="outline" asChild>
          <a
            className="flex w-full items-center"
            href={sourceLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              height="16"
              width="16"
              alt="github icon"
              src={`https://cdn.simpleicons.org/typescript/${theme === "dark" ? "white" : "black"}`}
            />
          </a>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/learn" className="w-full">
            <GraduationCap size={16} />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <a
            className="flex w-full items-center"
            href="https://github.com/bzhang98/sorting-visualizer/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              height="16"
              width="16"
              alt="github icon"
              src={`https://cdn.simpleicons.org/github/${theme === "dark" ? "white" : "black"}`}
            />
          </a>
        </Button>
      </div>
    </>
  );
};

export default SidebarContentSmall;
