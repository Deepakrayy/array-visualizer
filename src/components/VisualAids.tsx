import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Lightbulb, Zap, ShieldCheck, Cpu } from 'lucide-react';

export function VisualAids() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-blue-500/5 border-blue-500/20">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Lightbulb className="w-4 h-4" />
            Divide & Conquer
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
          Merge sort recursively divides the array into two halves until each subarray contains a single element, then merges them back together in sorted order.
        </CardContent>
      </Card>

      <Card className="bg-emerald-500/5 border-emerald-500/20">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Zap className="w-4 h-4" />
            Time Complexity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
          <div className="flex justify-between items-center font-mono font-bold text-emerald-700 dark:text-emerald-300">
            <span>Best: O(n log n)</span>
            <span>Worst: O(n log n)</span>
          </div>
          <p className="mt-2">Consistent performance regardless of initial array order.</p>
        </CardContent>
      </Card>

      <Card className="bg-purple-500/5 border-purple-500/20">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <Cpu className="w-4 h-4" />
            Space Complexity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
          <div className="font-mono font-bold text-purple-700 dark:text-purple-300">O(n)</div>
          <p className="mt-2">Requires additional memory proportional to the array size for the temporary merged arrays.</p>
        </CardContent>
      </Card>

      <Card className="bg-orange-500/5 border-orange-500/20">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <ShieldCheck className="w-4 h-4" />
            Stability
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
          <div className="font-bold text-orange-700 dark:text-orange-300">Stable Sort</div>
          <p className="mt-2">Maintains the relative order of records with equal keys (i.e., values).</p>
        </CardContent>
      </Card>
    </div>
  );
}
