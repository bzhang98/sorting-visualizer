import { ArrowRight, BarChart2, Clock, Code, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Link } from "react-router-dom";

const HomePage = () => {
  const algorithms = [
    {
      name: "Bubble Sort",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      inPlace: true,
      stable: true,
      description:
        "A simple but inefficient sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they're in the wrong order. The pass through the list is repeated until no swaps are needed. While inefficient for large datasets, it's very easy to understand and implement.",
    },
    {
      name: "Selection Sort",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      inPlace: true,
      stable: false,
      description:
        "Works by repeatedly finding the minimum element from the unsorted portion and putting it at the beginning. Maintains two subarrays: sorted and unsorted. While not very efficient, it performs well on small lists and has the advantage of making the minimum number of swaps (O(n)).",
    },
    {
      name: "Insertion Sort",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      inPlace: true,
      stable: true,
      description:
        "Builds the final sorted array one item at a time by repeatedly inserting a new element into a sorted portion of the array. Highly efficient for small data sets and nearly sorted arrays. It's also adaptive, meaning it performs better if the array is already partially sorted.",
    },
    {
      name: "Heap Sort",
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(1)",
      inPlace: true,
      stable: false,
      description:
        "A comparison-based algorithm that uses a binary heap data structure. It first builds a max-heap, then repeatedly extracts the maximum element and rebuilds the heap. While it has optimal time complexity, it often performs slower than Quick Sort due to poor cache performance and more complex operations.",
    },
    {
      name: "Merge Sort",
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(n)",
      inPlace: false,
      stable: true,
      description:
        "A stable, divide-and-conquer algorithm that recursively splits the array in half, sorts each half, then merges them back together. Guaranteed O(n log n) performance and stable sorting make it ideal for sorting linked lists. However, it requires O(n) extra space for merging.",
    },
    {
      name: "Quick Sort",
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(log n)",
      inPlace: true,
      stable: false,
      description:
        "An efficient, in-place sorting algorithm that works by selecting a 'pivot' element and partitioning the array around it. While it has O(n²) worst-case complexity, its average case performance and good cache usage make it one of the fastest sorting algorithms in practice. Used as the default sort in many programming languages.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 -z-10">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sorting Algorithm Visualizer
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Understand how different sorting algorithms work through interactive
            visualizations
          </p>
          <Link
            to="/bubble-sort"
            className="bg-blue-600 w-fit text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            Start Visualizing <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-white shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-blue-600" />
                Interactive Visualizations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Watch algorithms in action with adjustable controls
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Understand the performance characteristics of each algorithm
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-600" />
                Source Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                View the implementation details on Github
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Algorithms Grid */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Available Algorithms
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-6">
          {algorithms.map((algo) => (
            <Link to={`${algo.name.toLowerCase().replace(" ", "-")}`}>
              <Card
                key={algo.name}
                className="bg-white shadow-md hover:shadow-lg h-full hover:scale-105 transition-all"
              >
                <CardHeader>
                  <CardTitle className="text-lg flex justify-between items-center">
                    {algo.name} <ArrowUpRight />
                  </CardTitle>
                  <div className="text-sm text-blue-600 font-mono">
                    Time Complexity: {algo.timeComplexity}
                    <br />
                    Space Complexity: {algo.spaceComplexity}
                    <br />
                    {algo.inPlace ? "In-Place" : "Not In-Place"}
                    <br />
                    {algo.stable ? "Stable" : "Unstable"}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{algo.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
