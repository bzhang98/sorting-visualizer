import selectionSort from "../../src/sorting_functions/selection-sort";

describe("Selection Sort", () => {
  it("should return an empty array when an empty array is passed", () => {
    expect(selectionSort([])).toEqual([]);
  });

  it("should return the same array when it has only one element", () => {
    expect(selectionSort([1])).toEqual([1]);
  });

  it("should return the array sorted in ascending order", () => {
    expect(selectionSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
  });

  it("should work with arrays that have repeated elements", () => {
    expect(selectionSort([5, 4, 3, 2, 1, 1, 1, 1])).toEqual([
      1, 1, 1, 1, 2, 3, 4, 5,
    ]);
  }); 
});
