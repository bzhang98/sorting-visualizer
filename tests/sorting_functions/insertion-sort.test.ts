import insertionSort from "../../src/sorting_functions/insertion-sort";

describe("Insertion Sort", () => {
  it("should return an empty array when an empty array is passed", () => {
    expect(insertionSort([])).toEqual([]);
  });

  it("should return the same array when it has only one element", () => {
    expect(insertionSort([1])).toEqual([1]);
  });

  it("should return the array sorted in ascending order", () => {
    expect(insertionSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
  });

  it("should work with arrays that have repeated elements", () => {
    expect(insertionSort([5, 4, 3, 2, 1, 1, 1, 1])).toEqual([
      1, 1, 1, 1, 2, 3, 4, 5,
    ]);
  });
});
