interface Step {
  swapIndices?: number[];
  highlights?: {
    elements: { id: string; index: number }[];
    color: string;
  }[];
}

export default Step;
