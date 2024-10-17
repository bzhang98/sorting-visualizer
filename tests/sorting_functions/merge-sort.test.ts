import mergeSort from "../../src/sorting_functions/merge-sort";

describe("Merge Sort", () => {
  it("should return an empty array when an empty array is passed", () => {
    expect(mergeSort([])).toEqual([]);
  });

  it("should return the same array when it has only one element", () => {
    expect(mergeSort([1])).toEqual([1]);
  });

  it("should return the array sorted in ascending order", () => {
    expect(mergeSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
  });

  it("should work with arrays that have repeated elements", () => {
    expect(mergeSort([3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5])).toEqual([
      1, 1, 2, 3, 3, 4, 5, 5, 5, 6, 9,
    ]);
  });

  it("should sort a large array correctly", () => {
    const size = 100000; // 100,000 elements
    const largeArray = Array.from({ length: size }, () =>
      Math.floor(Math.random() * size)
    );
    const sortedArray = [...largeArray].sort((a, b) => a - b);

    expect(mergeSort(largeArray)).toEqual(sortedArray);
  });

  it("should sort a large array within a reasonable time", () => {
    const size = 10000000; // 1 million elements
    const largeArray = Array.from({ length: size }, () =>
      Math.floor(Math.random() * size)
    );

    const start = performance.now();
    mergeSort(largeArray);
    const end = performance.now();

    const executionTime = end - start;
    console.log(`Execution time: ${executionTime} ms`);

    expect(executionTime).toBeLessThan(5000);
  });
});
