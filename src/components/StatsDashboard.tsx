import { useSortStore } from '@/src/store/useSortStore';
import { Card, CardContent } from './ui/card';
import { Activity, Layers, ArrowRightLeft, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export function StatsDashboard() {
  const { steps, currentStepIndex } = useSortStore();
  const step = steps[currentStepIndex];
  const stats = step?.stats || { comparisons: 0, merges: 0, maxDepth: 0 };

  const statItems = [
    { label: 'Comparisons', value: stats.comparisons, icon: ArrowRightLeft, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Merges', value: stats.merges, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Max Depth', value: stats.maxDepth, icon: Layers, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Steps', value: currentStepIndex, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, i) => (
        <Card key={i} className="overflow-hidden border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bg} ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{item.label}</p>
              <motion.p 
                key={item.value}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold tracking-tight"
              >
                {item.value}
              </motion.p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
