import React, { useState } from 'react';
import { X, Wand2 } from 'lucide-react';
import { Priority, Category, Task } from '../types';
import { generateSubtasks } from '../services/geminiService';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onAddMultiple?: (tasks: Omit<Task, 'id' | 'createdAt'>[]) => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAdd, onAddMultiple }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [category, setCategory] = useState<Category>(Category.PERSONAL);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      title,
      dueDate,
      priority,
      category,
      completed: false
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setDueDate(new Date().toISOString().split('T')[0]);
    setPriority(Priority.MEDIUM);
    setCategory(Category.PERSONAL);
    setAiSuggestions([]);
  };

  const handleAiBreakdown = async () => {
    if (!title) return;
    setIsGenerating(true);
    const subtasks = await generateSubtasks(title);
    setAiSuggestions(subtasks);
    setIsGenerating(false);
  };

  const handleAddSuggestions = () => {
    if (onAddMultiple && aiSuggestions.length > 0) {
      const tasks = aiSuggestions.map(suggestion => ({
        title: suggestion,
        dueDate,
        priority,
        category,
        completed: false
      }));
      onAddMultiple(tasks);
      // We also add the main task if desired, or just the subtasks. Let's just add subtasks and close.
      // But typically user might want the main task too. Let's assume this button replaces the current main task add.
      resetForm();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">Create New Task</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              />
              <button
                type="button"
                onClick={handleAiBreakdown}
                disabled={!title || isGenerating}
                className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 disabled:opacity-50 transition-colors flex items-center gap-2"
                title="Use AI to break this down"
              >
                <Wand2 className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline text-sm font-medium">Break Down</span>
              </button>
            </div>
            {isGenerating && <p className="text-xs text-indigo-600 mt-2 animate-pulse">Consulting AI for subtasks...</p>}
          </div>

          {aiSuggestions.length > 0 && (
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
                  <Wand2 className="w-4 h-4" /> AI Suggestions
                </h3>
                <button 
                  type="button" 
                  onClick={() => setAiSuggestions([])}
                  className="text-xs text-indigo-400 hover:text-indigo-600"
                >
                  Clear
                </button>
              </div>
              <ul className="space-y-1 mb-3">
                {aiSuggestions.map((st, idx) => (
                  <li key={idx} className="text-sm text-indigo-800 flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></span>
                    {st}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={handleAddSuggestions}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Add These {aiSuggestions.length} Subtasks Instead
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow text-slate-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow bg-white text-slate-600"
              >
                {Object.values(Priority).map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <div className="flex flex-wrap gap-2">
              {Object.values(Category).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`
                    px-3 py-1.5 rounded-full text-xs font-medium transition-all
                    ${category === cat 
                      ? 'bg-slate-800 text-white shadow-md transform scale-105' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
             <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 font-medium transition-all active:scale-95"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
