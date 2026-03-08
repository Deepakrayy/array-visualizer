import { useSortStore } from '@/src/store/useSortStore';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Shuffle, Play, Pause, SkipBack, SkipForward, RotateCcw, GripVertical } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { HTMLMotionProps } from 'framer-motion';

type SortableItemProps = {
  id: string;
  item: any;
  index: number;
  mode: string;
  handleRemove: (i: number) => void;
} & HTMLMotionProps<"div">;

const SortableItem = React.forwardRef<HTMLDivElement, SortableItemProps>(({ id, item, index, mode, handleRemove, ...props }, ref) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <motion.div
      ref={(node) => {
        setNodeRef(node);
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      style={style}
      layout
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={`relative group flex flex-col items-center justify-center w-16 h-24 rounded-xl shadow-md border-2 border-primary/20 ${
        mode === 'real-world' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100' : 'bg-background text-foreground'
      } ${isDragging ? 'opacity-50 scale-105 shadow-xl' : ''}`}
      {...props}
    >
      <div {...attributes} {...listeners} className="w-full h-6 flex items-center justify-center cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-foreground">
        <GripVertical className="w-4 h-4" />
      </div>
      <span className="text-2xl font-bold font-mono mb-2">{item.value}</span>
      <button
        onClick={() => handleRemove(index)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
      >
        <Trash2 className="w-3 h-3" />
      </button>
      {mode === 'real-world' && (
        <div className="absolute top-2 left-2 opacity-50">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </div>
      )}
    </motion.div>
  );
});

export function ArrayPlayground() {
  const { initialArray, setInitialArray, steps, currentStepIndex, isPlaying, play, pause, reset, stepForward, stepBackward, setSpeed, speed, mode } = useSortStore();
  const [arraySize, setArraySize] = useState(8);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    generateRandomArray(arraySize);
  }, []);

  useEffect(() => {
let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        if (currentStepIndex < steps.length - 1) {
          stepForward();
        } else {
          pause();
        }
      }, 1000 - speed * 9); // speed 0-100 -> 1000ms to 100ms
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStepIndex, steps.length, speed, stepForward, pause]);

  const generateRandomArray = (size: number) => {
    const newArr = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    setInitialArray(newArr);
  };

  const handleAdd = () => {
    if (initialArray.length < 15) {
      setInitialArray([...initialArray.map(e => e.value), Math.floor(Math.random() * 90) + 10]);
    }
  };

  const handleRemove = (index: number) => {
    const newArr = [...initialArray];
    newArr.splice(index, 1);
    setInitialArray(newArr.map(e => e.value));
  };

  const isSorting = currentStepIndex > 0 || isPlaying;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = initialArray.findIndex((item) => item.id === active.id);
      const newIndex = initialArray.findIndex((item) => item.id === over.id);
      const newArr = arrayMove(initialArray, oldIndex, newIndex);
      setInitialArray(newArr.map(item => item.value));
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-card rounded-2xl shadow-sm border h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Array Playground</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Size: {initialArray.length}</span>
            <Slider
              value={[initialArray.length]}
              min={4}
              max={15}
              step={1}
              onValueChange={(val) => {
                setArraySize(val[0]);
                generateRandomArray(val[0]);
              }}
              className="w-24"
              disabled={isSorting}
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => generateRandomArray(initialArray.length)} disabled={isSorting}>
            <Shuffle className="w-4 h-4 mr-2" />
            Randomize
          </Button>
          <Button variant="outline" size="sm" onClick={handleAdd} disabled={isSorting || initialArray.length >= 15}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center min-h-100 relative">
        {!isSorting ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={initialArray.map(i => i.id)} strategy={horizontalListSortingStrategy}>
              <div className="flex flex-wrap justify-center gap-4 p-8">
                <AnimatePresence>
                  {initialArray.map((item, index) => (
                    <SortableItem key={item.id} id={item.id} item={item} index={index} mode={mode} handleRemove={handleRemove} />
                  ))}
                </AnimatePresence>
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <SortVisualization />
        )}
      </div>

      <div className="flex flex-col gap-4 mt-auto p-4 bg-secondary/30 rounded-xl border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={reset} disabled={!isSorting}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={stepBackward} disabled={currentStepIndex === 0}>
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              variant={isPlaying ? "destructive" : "default"}
              size="icon"
              className="w-12 h-12 rounded-full shadow-lg"
              onClick={isPlaying ? pause : play}
              disabled={currentStepIndex >= steps.length - 1}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
            </Button>
            <Button variant="outline" size="icon" onClick={stepForward} disabled={currentStepIndex >= steps.length - 1}>
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-4 w-64">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Speed</span>
            <Slider
              value={[speed]}
              min={0}
              max={100}
              step={1}
              onValueChange={(val) => setSpeed(val[0])}
            />
          </div>
        </div>
        
        {steps.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs text-muted-foreground font-medium">
              <span>Step {currentStepIndex + 1} of {steps.length}</span>
              <span>{Math.round((currentStepIndex / (steps.length - 1)) * 100)}% Complete</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-sm font-medium text-center mt-2 text-primary">
              {steps[currentStepIndex]?.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function SortVisualization() {
  const { steps, currentStepIndex, mode } = useSortStore();
  const step = steps[currentStepIndex];

  if (!step) return null;

  const renderTree = (node: any, level: number = 0) => {
    const isActive = step.activeNodeIds.includes(node.id);
    
    return (
      <div key={node.id} className="flex flex-col items-center gap-8">
        <div className={`flex gap-2 p-3 rounded-2xl transition-all duration-300 ${
          isActive ? 'bg-primary/10 ring-2 ring-primary/30 shadow-lg' : 'bg-transparent'
        }`}>
          <AnimatePresence mode="popLayout">
            {node.elements.map((item: any) => {
              const isComparing = step.comparingElements.includes(item.id);
              return (
                <motion.div
                  key={item.id}
                  layoutId={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: isComparing ? 1.1 : 1,
                    y: isComparing ? -5 : 0
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className={`relative flex items-center justify-center w-12 h-16 rounded-xl shadow-sm border-2 ${
                    isComparing 
                      ? 'border-yellow-500 bg-yellow-100 text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-100 z-10 shadow-yellow-500/50' 
                      : mode === 'real-world'
                        ? 'border-amber-500/30 bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100'
                        : 'border-primary/20 bg-background text-foreground'
                  }`}
                >
                  <span className="text-lg font-bold font-mono">{item.value}</span>
                  {mode === 'real-world' && (
                    <div className="absolute top-1 left-1 opacity-40">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      </svg>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
          {node.elements.length === 0 && (
            <div className="h-16 w-12 border-2 border-dashed border-muted-foreground/20 rounded-xl flex items-center justify-center">
              <span className="text-xs text-muted-foreground/50">...</span>
            </div>
          )}
        </div>
        
        {(node.left || node.right) && (
          <div className="flex justify-center relative mt-8">
            <div className="absolute -top-8 left-1/2 w-px h-4 bg-border -translate-x-1/2" />
            <div className="absolute -top-4 left-1/4 right-1/4 h-px bg-border" />
            <div className="absolute -top-4 left-1/4 w-px h-4 bg-border" />
            <div className="absolute -top-4 right-1/4 w-px h-4 bg-border" />
            
            <div className="px-2 sm:px-4">{node.left && renderTree(node.left, level + 1)}</div>
            <div className="px-2 sm:px-4">{node.right && renderTree(node.right, level + 1)}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full overflow-auto p-8 flex justify-center items-start min-h-125">
      {renderTree(step.tree)}
    </div>
  );
}
