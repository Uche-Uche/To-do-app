import React from 'react';
import { Task } from '../types';
import { TaskItem } from './TaskItem';
import { Coffee } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  title: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, title, onToggle, onDelete }) => {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center p-8 animate-in fade-in">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Coffee className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">No tasks here!</h3>
        <p className="text-slate-500 max-w-sm">
          You're all caught up for this view. Enjoy your free time or add a new task to stay productive.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">
          {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
        </span>
      </div>
      <div className="grid gap-3">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};
