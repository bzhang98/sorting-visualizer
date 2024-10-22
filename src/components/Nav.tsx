import { Home } from "lucide-react";
import { NavLink } from "react-router-dom";

const Header = () => {
  const algorithms = [
    "Bubble Sort",
    "Selection Sort",
    "Insertion Sort",
    "Heap Sort",
    "Merge Sort",
    "Quick Sort",
  ];

  return (
    <div className="border-b bg-white shadow-sm">
      <div className="px-4 flex justify-center items-center gap-6" style={{
        margin: "0 auto",
        width: "clamp(700px, 100%, 1000px)",
      }}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-gray-700 hover:text-blue-700 font-medium px-4 py-2 rounded-md hover:bg-blue-50 transition-colors duration-200 relative group ${
              isActive ? "text-blue-700 bg-blue-50" : ""
            }`
          }
          aria-label="Home"
        >
          <Home className="w-5 h-5" />
        </NavLink>

        <div className="flex items-center gap-8 overflow-x-auto py-4">
          {algorithms.map((algo) => (
            <NavLink
              to={`/${algo.toLowerCase().replace(" ", "-")}`}
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-700 font-medium px-4 py-2 rounded-md hover:bg-blue-50 transition-colors duration-200 relative group ${
                  isActive ? "text-blue-700 bg-blue-50" : ""
                }`
              }
            >
              {algo}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;
