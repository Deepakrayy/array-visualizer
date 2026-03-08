import { useSortStore } from '@/src/store/useSortStore';
import { motion } from 'framer-motion';

const codeLines = [
  { line: 1, text: 'function mergeSort(arr) {' },
  { line: 2, text: '  if (arr.length <= 1) {' },
  { line: 3, text: '    return arr;' },
  { line: 4, text: '  }' },
  { line: 5, text: '  const mid = Math.floor(arr.length / 2);' },
  { line: 6, text: '  const left = arr.slice(0, mid);' },
  { line: 7, text: '  const right = arr.slice(mid);' },
  { line: 8, text: '  const sortedLeft = mergeSort(left);' },
  { line: 9, text: '  const sortedRight = mergeSort(right);' },
  { line: 10, text: '  return merge(sortedLeft, sortedRight);' },
  { line: 11, text: '}' },
  { line: 12, text: 'function merge(left, right) {' },
  { line: 13, text: '  // compare left[i] and right[j]' },
  { line: 14, text: '  // push smaller to result' },
  { line: 15, text: '  // push remaining left elements' },
  { line: 16, text: '  // push remaining right elements' },
  { line: 17, text: '  return result;' },
  { line: 18, text: '}' },
];

export function CodeViewer() {
  const { steps, currentStepIndex } = useSortStore();
  const step = steps[currentStepIndex];
  const activeLine = step?.codeLine || 0;

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl shadow-sm border overflow-hidden">
      <div className="p-4 border-b bg-muted/30">
        <h2 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground">Algorithm Code</h2>
      </div>
      <div className="flex-1 p-4 overflow-auto font-mono text-xs sm:text-sm relative">
        {codeLines.map(({ line, text }) => (
          <div key={line} className="relative flex items-center py-1">
            <span className="w-8 text-muted-foreground/50 select-none">{line}</span>
            <span className={`relative z-10 ${activeLine === line ? 'text-primary font-bold' : 'text-foreground/80'}`}>
              {text}
            </span>
            {activeLine === line && (
              <motion.div
                layoutId="active-line"
                className="absolute inset-0 bg-primary/10 rounded-md border border-primary/20"
                initial={false}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
