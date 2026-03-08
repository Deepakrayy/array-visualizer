import { create } from 'zustand';

export type SortElement = {
  id: string;
  value: number;
};

export type TreeNode = {
  id: string;
  elements: SortElement[];
  left?: TreeNode;
  right?: TreeNode;
  isMerged: boolean;
  depth: number;
};

export type SortStep = {
  tree: TreeNode;
  activeNodeIds: string[];
  comparingElements: string[];
  codeLine: number;
  description: string;
  stats: { comparisons: number; merges: number; maxDepth: number };
};

interface SortState {
  initialArray: SortElement[];
  steps: SortStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number;
  mode: 'abstract' | 'real-world';
  theme: 'light' | 'dark';
  
  // Actions
  setInitialArray: (arr: number[]) => void;
  generateSteps: () => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  setSpeed: (speed: number) => void;
  setMode: (mode: 'abstract' | 'real-world') => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const generateMergeSortSteps = (initialArray: SortElement[]): SortStep[] => {
  const steps: SortStep[] = [];
  let comparisons = 0;
  let merges = 0;
  let maxDepth = 0;

  // Deep copy helper
  const copyTree = (node: TreeNode): TreeNode => ({
    ...node,
    elements: [...node.elements],
    left: node.left ? copyTree(node.left) : undefined,
    right: node.right ? copyTree(node.right) : undefined,
  });

  // Initial state
  let currentTree: TreeNode = {
    id: 'root',
    elements: [...initialArray],
    isMerged: false,
    depth: 0,
  };

  steps.push({
    tree: copyTree(currentTree),
    activeNodeIds: ['root'],
    comparingElements: [],
    codeLine: 1,
    description: 'Start Merge Sort',
    stats: { comparisons, merges, maxDepth },
  });

  const updateNodeInTree = (tree: TreeNode, targetId: string, updateFn: (node: TreeNode) => TreeNode): TreeNode => {
    if (tree.id === targetId) {
      return updateFn(tree);
    }
    return {
      ...tree,
      left: tree.left ? updateNodeInTree(tree.left, targetId, updateFn) : undefined,
      right: tree.right ? updateNodeInTree(tree.right, targetId, updateFn) : undefined,
    };
  };

  const mergeSort = (nodeId: string, arr: SortElement[], depth: number): SortElement[] => {
    maxDepth = Math.max(maxDepth, depth);
    
    steps.push({
      tree: copyTree(currentTree),
      activeNodeIds: [nodeId],
      comparingElements: [],
      codeLine: 2,
      description: `Checking if array length (${arr.length}) <= 1`,
      stats: { comparisons, merges, maxDepth },
    });

    if (arr.length <= 1) {
      steps.push({
        tree: copyTree(currentTree),
        activeNodeIds: [nodeId],
        comparingElements: [],
        codeLine: 3,
        description: 'Array length is <= 1, returning.',
        stats: { comparisons, merges, maxDepth },
      });
      return arr;
    }

    steps.push({
      tree: copyTree(currentTree),
      activeNodeIds: [nodeId],
      comparingElements: [],
      codeLine: 5,
      description: 'Calculating mid point to divide array.',
      stats: { comparisons, merges, maxDepth },
    });

    const mid = Math.floor(arr.length / 2);
    const leftArr = arr.slice(0, mid);
    const rightArr = arr.slice(mid);

    const leftId = `${nodeId}-L`;
    const rightId = `${nodeId}-R`;

    // Update tree with children
    currentTree = updateNodeInTree(currentTree, nodeId, (n) => ({
      ...n,
      left: { id: leftId, elements: leftArr, isMerged: false, depth: depth + 1 },
      right: { id: rightId, elements: rightArr, isMerged: false, depth: depth + 1 },
      elements: [], // Clear parent elements while split
    }));

    steps.push({
      tree: copyTree(currentTree),
      activeNodeIds: [leftId, rightId],
      comparingElements: [],
      codeLine: 7,
      description: 'Divided array into left and right halves.',
      stats: { comparisons, merges, maxDepth },
    });

    const sortedLeft = mergeSort(leftId, leftArr, depth + 1);
    
    steps.push({
      tree: copyTree(currentTree),
      activeNodeIds: [rightId],
      comparingElements: [],
      codeLine: 8,
      description: 'Now sorting the right half.',
      stats: { comparisons, merges, maxDepth },
    });
    
    const sortedRight = mergeSort(rightId, rightArr, depth + 1);

    steps.push({
      tree: copyTree(currentTree),
      activeNodeIds: [nodeId],
      comparingElements: [],
      codeLine: 10,
      description: 'Merging left and right halves.',
      stats: { comparisons, merges, maxDepth },
    });

    return merge(nodeId, leftId, rightId, sortedLeft, sortedRight, depth);
  };

  const merge = (parentId: string, leftId: string, rightId: string, left: SortElement[], right: SortElement[], _depth: number): SortElement[] => {
    let result: SortElement[] = [];
    let i = 0;
    let j = 0;

    // We need to show elements moving back to parent
    currentTree = updateNodeInTree(currentTree, parentId, (n) => ({
      ...n,
      elements: [], // Start empty
    }));

    while (i < left.length && j < right.length) {
      comparisons++;
      steps.push({
        tree: copyTree(currentTree),
        activeNodeIds: [leftId, rightId],
        comparingElements: [left[i].id, right[j].id],
        codeLine: 12, // Assuming a merge function code line
        description: `Comparing ${left[i].value} and ${right[j].value}`,
        stats: { comparisons, merges, maxDepth },
      });

      if (left[i].value <= right[j].value) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        j++;
      }

      // Update tree to show element moved to parent
      currentTree = updateNodeInTree(currentTree, parentId, (n) => ({
        ...n,
        elements: [...result],
      }));
      // Remove element from child
      currentTree = updateNodeInTree(currentTree, leftId, (n) => ({
        ...n,
        elements: left.slice(i),
      }));
      currentTree = updateNodeInTree(currentTree, rightId, (n) => ({
        ...n,
        elements: right.slice(j),
      }));

      steps.push({
        tree: copyTree(currentTree),
        activeNodeIds: [parentId],
        comparingElements: [],
        codeLine: 13,
        description: `Moved ${result[result.length - 1].value} to merged array.`,
        stats: { comparisons, merges, maxDepth },
      });
    }

    while (i < left.length) {
      result.push(left[i]);
      i++;
      currentTree = updateNodeInTree(currentTree, parentId, (n) => ({
        ...n,
        elements: [...result],
      }));
      currentTree = updateNodeInTree(currentTree, leftId, (n) => ({
        ...n,
        elements: left.slice(i),
      }));
      steps.push({
        tree: copyTree(currentTree),
        activeNodeIds: [parentId],
        comparingElements: [],
        codeLine: 15,
        description: `Moved remaining ${result[result.length - 1].value} from left array.`,
        stats: { comparisons, merges, maxDepth },
      });
    }

    while (j < right.length) {
      result.push(right[j]);
      j++;
      currentTree = updateNodeInTree(currentTree, parentId, (n) => ({
        ...n,
        elements: [...result],
      }));
      currentTree = updateNodeInTree(currentTree, rightId, (n) => ({
        ...n,
        elements: right.slice(j),
      }));
      steps.push({
        tree: copyTree(currentTree),
        activeNodeIds: [parentId],
        comparingElements: [],
        codeLine: 16,
        description: `Moved remaining ${result[result.length - 1].value} from right array.`,
        stats: { comparisons, merges, maxDepth },
      });
    }

    merges++;
    currentTree = updateNodeInTree(currentTree, parentId, (n) => ({
      ...n,
      isMerged: true,
      left: undefined, // Clear children after merge
      right: undefined,
    }));

    steps.push({
      tree: copyTree(currentTree),
      activeNodeIds: [parentId],
      comparingElements: [],
      codeLine: 17,
      description: 'Merge complete for this sub-array.',
      stats: { comparisons, merges, maxDepth },
    });

    return result;
  };

  mergeSort('root', initialArray, 0);

  steps.push({
    tree: copyTree(currentTree),
    activeNodeIds: ['root'],
    comparingElements: [],
    codeLine: 18,
    description: 'Array is fully sorted!',
    stats: { comparisons, merges, maxDepth },
  });

  return steps;
};

export const useSortStore = create<SortState>((set, get) => ({
  initialArray: [],
  steps: [],
  currentStepIndex: 0,
  isPlaying: false,
  speed: 50,
  mode: 'abstract',
  theme: 'dark',

  setInitialArray: (arr: number[]) => {
    const elements = arr.map((val, i) => ({ id: `num-${i}-${val}`, value: val }));
    set({ initialArray: elements, currentStepIndex: 0, isPlaying: false });
    get().generateSteps();
  },

  generateSteps: () => {
    const { initialArray } = get();
    if (initialArray.length === 0) return;
    const steps = generateMergeSortSteps(initialArray);
    set({ steps, currentStepIndex: 0 });
  },

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  reset: () => set({ currentStepIndex: 0, isPlaying: false }),
  
  stepForward: () => set((state) => ({
    currentStepIndex: Math.min(state.currentStepIndex + 1, state.steps.length - 1)
  })),
  
  stepBackward: () => set((state) => ({
    currentStepIndex: Math.max(state.currentStepIndex - 1, 0)
  })),
  
  setSpeed: (speed: number) => set({ speed }),
  setMode: (mode: 'abstract' | 'real-world') => set({ mode }),
  setTheme: (theme: 'light' | 'dark') => {
    set({ theme });
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
}));
