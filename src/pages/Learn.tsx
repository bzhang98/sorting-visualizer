import { Clock, Construction, Wrench } from "lucide-react";

const Learn = () => {
  return (
    <div className="flex flex-1 items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="mb-6 flex justify-center">
          <Construction
            className="h-24 w-24 text-yellow-500"
            strokeWidth={1.5}
          />
        </div>

        <h1 className="mb-4 text-3xl font-bold text-gray-800">
          Page Under Construction
        </h1>

        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Wrench className="h-6 w-6 text-blue-500" />
            <p className="text-gray-600">
              I'm working hard to bring you new content
            </p>
          </div>

          <div className="flex items-center justify-center space-x-3">
            <Clock className="h-6 w-6 text-green-500" />
            <p className="text-gray-600">Check back soon for updates</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Brian Zhang. MIT License | Open Source
            Project
          </p>
        </div>
      </div>
    </div>
  );
};

export default Learn;
