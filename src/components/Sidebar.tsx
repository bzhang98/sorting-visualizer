import React from "react";
import { Link } from "react-router-dom";

import {
  Pause,
  Play,
  Settings,
  ArrowUpRight,
  GraduationCap,
} from "lucide-react";
import TypescriptIcon from "@/assets/images/typescript.svg";
import GithubIcon from "@/assets/images/github.svg";

import SettingsType from "@/types/Settings";
import Controls from "./Controls";
import Options from "./Options";

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

interface SidebarProps {
  settings: SettingsType;
  updateSettings: (
    key: keyof SettingsType,
    value: SettingsType[keyof SettingsType],
  ) => void;
  generate: () => void;
  incrementStep: () => void;
  decrementStep: () => void;
  isPlaying: boolean;
  togglePlay: () => void;
  skipToEnd: () => void;
  skipToStart: () => void;
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const sourceLink = `https://github.com/bzhang98/sorting-visualizer/blob/main/src/sorting_functions/${props.settings.algorithm.toLowerCase().replace(" ", "-")}.ts`;
  return (
    <div className="border-r border-gray-300 p-4">
      <div className="hidden lg:block">
        <h1 className="mt-4 text-lg font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Customize the visualizer settings.
        </p>
        <div className="mt-8">
          <h2 className="mb-2 text-lg font-semibold">Controls</h2>
          <Controls {...props} />
        </div>
        <div className="mt-8 border-b border-gray-300 pb-4">
          <h2 className="mb-2 text-lg font-semibold">Options</h2>
          <Options {...props} />
          <Button className="mt-4 w-full" onClick={props.generate}>
            Generate
          </Button>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <Button variant="outline" asChild>
            <a
              className="flex w-full items-center"
              href={sourceLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={TypescriptIcon}
                alt="typescript icon"
                width="24"
                height="24"
              />
              Implementation <ArrowUpRight />
            </a>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/learn" className="w-full">
              <GraduationCap size={24} />
              Learn
              <ArrowUpRight />
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
                src={GithubIcon}
                alt="typescript icon"
                width="24"
                height="24"
              />
              Source <ArrowUpRight />
            </a>
          </Button>
        </div>
      </div>

      <Dialog>
        <DialogTrigger asChild className="mb-2 block lg:hidden">
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
      <Button className="lg:hidden" onClick={props.togglePlay}>
        {props.isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </Button>
      <div className="mt-4 flex flex-col gap-2 border-t border-gray-300 pt-4 lg:hidden">
        <Button variant="outline" asChild>
          <a
            className="flex w-full items-center"
            href={sourceLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={TypescriptIcon}
              alt="typescript icon"
              width="16"
              height="16"
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
              src={GithubIcon}
              alt="typescript icon"
              width="16"
              height="16"
            />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
