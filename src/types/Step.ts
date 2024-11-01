import DataElement from "./DataElement";
import { HighlightedIndices, HighlightedRange } from "./HighlightedElements";

interface Step {
  currentState: DataElement[];
  highlightedIndices?: HighlightedIndices;
  highlightedRange?: HighlightedRange;
  action: "start" | "swap" | "compare" | "done";
}

export default Step;
