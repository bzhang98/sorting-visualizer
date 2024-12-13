import DataElement from "@/types/DataElement";
import Step from "@/types/Step";

const generateBubbleSortSteps = (data: DataElement[]): Step[] => {
  const steps: Step[] = [{}];
  const dataCopy = [...data];
  for (let i = 0; i < dataCopy.length; i++) {
    let swapped = false;
    for (let j = 0; j < dataCopy.length - i - 1; j++) {
      const step = {
        highlights: [
          {
            elements: [{ id: dataCopy[j].id, index: j }],
            color: "fill-green-500",
          },
          {
            elements: [{ id: dataCopy[j + 1].id, index: j + 1 }],
            color: "fill-red-500",
          },
        ],
      };
      if (dataCopy[j].value > dataCopy[j + 1].value) {
        [dataCopy[j], dataCopy[j + 1]] = [dataCopy[j + 1], dataCopy[j]];
        steps.push({
          swapIndices: [j, j + 1],
          ...step,
        });
        swapped = true;
      } else {
        steps.push(step);
      }
    }
    if (!swapped) {
      break;
    }
  }
  steps.push({
    highlights: [
      {
        elements: dataCopy.map((element, index) => ({
          id: element.id,
          index,
        })),
        color: "fill-green-700",
      },
    ],
  });
  return steps;
};

const generateSelectionSortSteps = (data: DataElement[]): Step[] => {
  const steps: Step[] = [{}];
  const dataCopy = [...data];
  for (let i = 0; i < dataCopy.length; i++) {
    let minIndex = i;

    for (let j = i + 1; j < dataCopy.length; j++) {
      steps.push({
        highlights: [
          {
            elements: [{ id: dataCopy[minIndex].id, index: minIndex }],
            color: "fill-green-500",
          },
          {
            elements: [{ id: dataCopy[j].id, index: j }],
            color: "fill-red-500",
          },
        ],
      });
      minIndex = dataCopy[j].value < dataCopy[minIndex].value ? j : minIndex;
    }

    steps.push({
      swapIndices: [i, minIndex],
      highlights: [
        {
          elements: [{ id: dataCopy[minIndex].id, index: minIndex }],
          color: "fill-green-500",
        },
        {
          elements: [{ id: dataCopy[i].id, index: i }],
          color: "fill-red-500",
        },
      ],
    });
    [dataCopy[i], dataCopy[minIndex]] = [dataCopy[minIndex], dataCopy[i]];
  }
  steps.push({
    highlights: [
      {
        elements: dataCopy.map((element, index) => ({
          id: element.id,
          index,
        })),
        color: "fill-green-700",
      },
    ],
  });
  return steps;
};

const generateInsertionSortSteps = (data: DataElement[]): Step[] => {
  const steps: Step[] = [{}];
  const dataCopy = [...data];
  for (let i = 1; i < dataCopy.length; i++) {
    let j = i;

    while (j > 0) {
      if (dataCopy[j].value >= dataCopy[j - 1].value) {
        steps.push({
          highlights: [
            {
              elements: [{ id: dataCopy[j].id, index: j }],
              color: "fill-green-500",
            },
            {
              elements: [{ id: dataCopy[j - 1].id, index: j - 1 }],
              color: "fill-red-500",
            },
          ],
        });
        break;
      }

      steps.push({
        swapIndices: [j, j - 1],
        highlights: [
          {
            elements: [{ id: dataCopy[j].id, index: j }],
            color: "fill-green-500",
          },
          {
            elements: [{ id: dataCopy[j - 1].id, index: j - 1 }],
            color: "fill-red-500",
          },
        ],
      });
      [dataCopy[j], dataCopy[j - 1]] = [dataCopy[j - 1], dataCopy[j]];
      j--;
    }
  }
  steps.push({
    highlights: [
      {
        elements: dataCopy.map((element, index) => {
          return {
            id: element.id,
            index,
          };
        }),
        color: "fill-green-700",
      },
    ],
  });
  return steps;
};

const generateHeapSortSteps = (data: DataElement[]): Step[] => {
  const percolateDown = (
    heap: DataElement[],
    index: number,
    heapSize: number,
    steps: Step[],
  ) => {
    let largest = index;
    const left = index * 2 + 1;
    const right = index * 2 + 2;

    if (left >= heapSize) {
      return;
    }

    steps.push({
      highlights: [
        {
          elements: [{ id: heap[index].id, index }],
          color: "fill-green-500",
        },
        {
          elements: [{ id: heap[left].id, index: left }],
          color: "fill-red-500",
        },
      ],
    });
    if (heap[left].value > heap[index].value) {
      largest = left;
    }

    if (right < heapSize) {
      steps.push({
        highlights: [
          {
            elements: [{ id: heap[index].id, index: index }],
            color: "fill-green-500",
          },
          {
            elements: [{ id: heap[right].id, index: right }],
            color: "fill-red-500",
          },
        ],
      });
      if (heap[right].value > heap[largest].value) {
        largest = right;
      }
    }

    if (largest !== index) {
      steps.push({
        swapIndices: [index, largest],
        highlights: [
          {
            elements: [{ id: heap[index].id, index }],
            color: "fill-green-500",
          },
          {
            elements: [{ id: heap[largest].id, index: largest }],
            color: "fill-red-500",
          },
        ],
      });
      [heap[index], heap[largest]] = [heap[largest], heap[index]];
      percolateDown(heap, largest, heapSize, steps);
    } else {
      steps.push({
        highlights: [
          {
            elements: [{ id: heap[largest].id, index: largest }],
            color: "fill-green-500",
          },
        ],
      });
    }
  };

  const steps: Step[] = [{}];
  const dataCopy = [...data];

  // Build max heap
  for (let i = Math.floor(dataCopy.length / 2) - 1; i >= 0; i--) {
    percolateDown(dataCopy, i, dataCopy.length, steps);
  }

  // Heap sort
  for (let i = dataCopy.length - 1; i >= 0; i--) {
    steps.push({
      swapIndices: [0, i],
      highlights: [
        {
          elements: [{ id: dataCopy[0].id, index: 0 }],
          color: "fill-green-500",
        },
        {
          elements: [{ id: dataCopy[i].id, index: i }],
          color: "fill-red-500",
        },
      ],
    });
    [dataCopy[0], dataCopy[i]] = [dataCopy[i], dataCopy[0]];
    percolateDown(dataCopy, 0, i, steps);
  }
  steps.push({
    highlights: [
      {
        elements: dataCopy.map((element, index) => {
          return {
            id: element.id,
            index,
          };
        }),
        color: "fill-green-700",
      },
    ],
  });

  return steps;
};

const generateQuickSortSteps = (data: DataElement[]): Step[] => {
  const steps: Step[] = [{}];
  const dataCopy = [...data];

  const quickSort = (
    data: DataElement[],
    steps: Step[],
    startIndex: number = 0,
    endIndex: number = data.length - 1,
  ) => {
    if (startIndex >= endIndex) {
      return;
    }

    const pivotValue = data[endIndex].value;
    let j = startIndex - 1;
    for (let i = startIndex; i <= endIndex; i++) {
      steps.push({
        highlights: [
          {
            elements: [{ id: data[i].id, index: i }],
            color: "fill-green-500",
          },
          {
            elements: [{ id: data[j]?.id, index: j }],
            color: "fill-red-500",
          },
          {
            elements: [{ id: data[endIndex].id, index: endIndex }],
            color: "fill-yellow-500",
          },
        ],
      });
      if (data[i].value > pivotValue) {
        continue;
      }
      j++;

      const step = {
        highlights: [
          {
            elements: [{ id: data[i].id, index: i }],
            color: "fill-green-500",
          },
          {
            elements: [{ id: data[j].id, index: j }],
            color: "fill-red-500",
          },
          {
            elements: [{ id: data[endIndex].id, index: endIndex }],
            color: "fill-yellow-500",
          },
        ],
      };

      if (i > j) {
        steps.push({
          swapIndices: [i, j],
          ...step,
        });
        [data[i], data[j]] = [data[j], data[i]];
      } else {
        steps.push(step);
      }
    }
    quickSort(data, steps, startIndex, j - 1);
    quickSort(data, steps, j + 1, endIndex);
  };

  quickSort(dataCopy, steps);

  steps.push({
    highlights: [
      {
        elements: dataCopy.map((element, index) => {
          return {
            id: element.id,
            index,
          };
        }),
        color: "fill-green-700",
      },
    ],
  });
  return steps;
};

export {
  generateBubbleSortSteps,
  generateSelectionSortSteps,
  generateInsertionSortSteps,
  generateHeapSortSteps,
  generateQuickSortSteps,
};
