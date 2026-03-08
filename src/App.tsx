import { Header } from './components/Header';
import { ArrayPlayground } from './components/ArrayPlayground';
import { CodeViewer } from './components/CodeViewer';
import { StatsDashboard } from './components/StatsDashboard';
import { VisualAids } from './components/VisualAids';
import { useSortStore } from './store/useSortStore';
import { useEffect } from 'react';

export default function App() {
  const { theme } = useSortStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30">
      <Header />
      
      <main className="flex-1 p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-400 mx-auto w-full">
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
          <StatsDashboard />
          <div className="flex-1 min-h-150">
            <ArrayPlayground />
          </div>
        </div>
        
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
          <div className="flex-1 min-h-100">
            <CodeViewer />
          </div>
        </div>

        <div className="lg:col-span-12">
          <VisualAids />
        </div>
      </main>
    </div>
  );
}
