import Controls from "@/components/controls";
import Options from "@/components/options";
import { Button } from "./ui/button";
import Sidebar from "@/components/sidebar";

import { ArrowUpRight, GraduationCap } from "lucide-react";

import { Link } from "react-router-dom";
import { ComponentProps } from "react";
import { useTheme } from "./theme-provider";

const SidebarContentLarge: React.FC<ComponentProps<typeof Sidebar>> = (
  props,
) => {
  const sourceLink = `https://github.com/bzhang98/sorting-visualizer/blob/main/src/sorting_functions/${props.settings.algorithm.toLowerCase().replace(" ", "-")}.ts`;
  const { theme } = useTheme();
  return (
    <>
      <h1 className="mt-4 text-lg font-semibold">Settings</h1>
      <p className="text-sm text-muted-foreground">
        Customize the visualizer settings.
      </p>
      <div className="mt-8">
        <h2 className="mb-2 text-lg font-semibold">Controls</h2>
        <Controls {...props} />
      </div>
      <div className="light:border-gray-300 mt-8 border-b pb-4">
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
              height="24"
              width="24"
              alt="github icon"
              src={`https://cdn.simpleicons.org/typescript/${theme === "dark" ? "white" : "black"}`}
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
              height="24"
              width="24"
              alt="github icon"
              src={`https://cdn.simpleicons.org/github/${theme === "dark" ? "white" : "black"}`}
            />
            Source <ArrowUpRight />
          </a>
        </Button>
      </div>
    </>
  );
};

export default SidebarContentLarge;
