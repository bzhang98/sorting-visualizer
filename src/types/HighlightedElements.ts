type HighlightedRange = {
  range: [number, number];
  color?: string;
  label?: string;
}[];

type HighlightedIndices = {
  indices: number[];
  color?: string;
  label?: string;
}[];

export type { HighlightedIndices, HighlightedRange };
