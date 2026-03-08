import { useSortStore } from '@/src/store/useSortStore';
import { Switch } from './ui/switch';
import { Moon, Sun, Package, Hash } from 'lucide-react';

export function Header() {
  const { theme, setTheme, mode, setMode } = useSortStore();

  return (
    <header className="flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
          <Hash className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Merge Sort Explorer</h1>
          <p className="text-xs text-muted-foreground font-medium">Interactive Algorithm Learning</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-full border">
          <button
            onClick={() => setMode('abstract')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              mode === 'abstract' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Hash className="w-4 h-4" />
            Abstract
          </button>
          <button
            onClick={() => setMode('real-world')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              mode === 'real-world' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Package className="w-4 h-4" />
            Real World
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-muted-foreground" />
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={(checked: any) => setTheme(checked ? 'dark' : 'light')}
          />
          <Moon className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
