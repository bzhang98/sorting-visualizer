import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "./theme-toggle";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <div className="border-b p-4">
      <ul className="flex flex-col items-center md:flex-row">
        <li>
          <Button variant="ghost" asChild>
            <Link to="/">
              <Home size={20} />
            </Link>
          </Button>
        </li>
        <div className="flex">
          <li>
            <Button variant="ghost" asChild>
              <Link to="/visualizer">Visualize</Link>
            </Button>
          </li>
          <li>
            <Button variant="ghost" asChild>
              <Link to="/learn">Learn</Link>
            </Button>
          </li>
        </div>
      </ul>

      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Header;
