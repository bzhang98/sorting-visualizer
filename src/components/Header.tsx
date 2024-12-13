import { Home } from "lucide-react";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <div className="flex flex-col items-center gap-6 border-b p-4 md:flex-row">
      <NavLink to="/" aria-label="Home">
        <Home className="h-5 w-5" />
      </NavLink>

      <div className="flex items-center gap-4">
        <NavLink to="/visualizer">Visualize</NavLink>
        <NavLink to="/learn">Learn</NavLink>
      </div>
    </div>
  );
};

export default Header;
