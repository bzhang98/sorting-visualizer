import { Home } from "lucide-react";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <div className="flex items-center gap-4 border-b bg-white p-4 shadow-sm">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `group relative rounded-md px-4 py-2 font-medium text-gray-700 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-700 ${
            isActive ? "bg-blue-50 text-blue-700" : ""
          }`
        }
        aria-label="Home"
      >
        <Home className="h-5 w-5" />
      </NavLink>

      <NavLink
        to="/visualizer"
        className={({ isActive }) =>
          `group relative rounded-md px-4 py-2 font-medium text-gray-700 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-700 ${
            isActive ? "bg-blue-50 text-blue-700" : ""
          }`
        }
      >
        Visualize
        <span className="absolute bottom-0 left-0 h-0.5 w-full scale-x-0 transform bg-blue-700 transition-transform duration-200 group-hover:scale-x-100" />
      </NavLink>

      <NavLink
        to="/learn"
        className={({ isActive }) =>
          `group relative rounded-md px-4 py-2 font-medium text-gray-700 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-700 ${
            isActive ? "bg-blue-50 text-blue-700" : ""
          }`
        }
      >
        Learn
        <span className="absolute bottom-0 left-0 h-0.5 w-full scale-x-0 transform bg-blue-700 transition-transform duration-200 group-hover:scale-x-100" />
      </NavLink>
    </div>
  );
};

export default Header;
