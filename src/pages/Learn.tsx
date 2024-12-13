import { Clock, Construction } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Learn = () => {
  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <Card className="rounded-lg shadow-lg">
        <CardHeader className="flex flex-col items-center">
          <Construction
            className="h-24 w-24 text-yellow-500"
            strokeWidth={1.5}
          />
          <CardTitle>Page Under Construction</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center gap-2">
          <Clock className="h-6 w-6 text-green-500" />
          <p className="text-gray-500">Check back soon for updates</p>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Brian Zhang. MIT License | Open Source
            Project
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Learn;
