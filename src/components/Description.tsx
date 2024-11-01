import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface DescriptionProps {
  description: {
    description: string;
    link: string;
    timeComplexity: string;
    spaceComplexity: string;
    stability: string;
  };
}

export default function Description({ description }: DescriptionProps) {
  return (
    <div
      className="max-w-6xl mx-auto px-4 space-y-6"
      style={{
        margin: "2rem auto",
        width: "clamp(700px, 100%, 1000px)",
      }}
    >
      {/* Main Description Card */}
      <Card className="bg-white shadow-md">
        <CardContent className="pt-6">
          <p className="text-gray-600 leading-relaxed">
            {description.description}
          </p>
        </CardContent>
      </Card>

      {/* Implementation Link Card */}
      <Card className="bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer">
        <a href={description.link} target="_blank">
          <CardContent className="flex items-center gap-3 py-4">
            <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded flex items-center justify-center font-mono font-semibold">
              TS
            </div>
            <span className="text-gray-700 flex items-center gap-2">
              See the implementation here
              <ExternalLink className="w-4 h-4 text-blue-600" />
            </span>
          </CardContent>
        </a>
      </Card>

      {/* Complexity Details Card */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Algorithm Characteristics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Time Complexity</h3>
              <p className="text-gray-600">{description.timeComplexity}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Space Complexity</h3>
              <p className="text-gray-600">{description.spaceComplexity}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Stability</h3>
              <p className="text-gray-600">{description.stability}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
