import React from "react";
import SettingsType from "@/types/Settings";
import SidebarContentLarge from "./sidebar-content-large";
import SidebarContentSmall from "./sidebar-content-small";

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
  return (
    <div className="border-r p-4">
      <div className="hidden lg:block">
        <SidebarContentLarge {...props} />
      </div>
      <div className="lg:hidden">
        <SidebarContentSmall {...props} />
      </div>
    </div>
  );
};

export default Sidebar;
