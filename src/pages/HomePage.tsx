import {
  ArrowRight,
  BarChart2,
  Clock,
  Code,
  GraduationCap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  return (
    <div className="flex-1 bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Sorting Algorithm Visualizer
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            Understand how different sorting algorithms work through interactive
            visualizations
          </p>
          <div className="mx-auto flex max-w-48 flex-col gap-4">
            <Button asChild>
              <Link to="/visualizer">
                Start Visualizing <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/learn">
                <GraduationCap />
                Learn <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto flex max-w-lg flex-col gap-4">
          <Card className="flex flex-col items-center">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-blue-600" />
                Interactive Visualizations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Watch algorithms in action with adjustable controls
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col items-center">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Understand the performance characteristics of each algorithm
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col items-center">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-blue-600" />
                Source Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                View the underlying implementation of the visualizations
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
