import React from 'react';
import { Trash2, Calendar as CalendarIcon, Tag, AlertCircle } from 'lucide-react';
import { Task, Priority } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  
  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case Priority.HIGH: return 'text-red-500 bg-red-50 border-red-100';
      case Priority.MEDIUM: return 'text-amber-500 bg-amber-50 border-amber-100';
      case Priority.LOW: return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  const isOverdue = !task.completed && new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0));

  return (
    <div className={`
      group relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-300
      ${task.completed 
        ? 'bg-slate-50/50 border-slate-100 opacity-75' 
        : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-md'}
    `}>
      <button
        onClick={() => onToggle(task.id)}
        className={`
          flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
          ${task.completed 
            ? 'bg-indigo-500 border-indigo-500' 
            : 'border-slate-300 group-hover:border-indigo-400'}
        `}
      >
        {task.completed && (
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className={`
            font-medium text-base truncate transition-all
            ${task.completed ? 'text-slate-500 line-through decoration-slate-400' : 'text-slate-800'}
          `}>
            {task.title}
          </h3>
          {isOverdue && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
              <AlertCircle className="w-3 h-3" /> Overdue
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5" />
            {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            {task.category}
          </span>
          <span className={`px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)} font-medium`}>
            {task.priority}
          </span>
        </div>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Delete task"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};
