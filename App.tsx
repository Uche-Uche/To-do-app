import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TaskList } from './components/TaskList';
import { AddTaskModal } from './components/AddTaskModal';
import { Task, ViewMode } from './types';
import { loadTasks, saveTasks } from './services/storageService';
import { Menu } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load tasks on mount
  useEffect(() => {
    const stored = loadTasks();
    if (stored) setTasks(stored);
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const addMultipleTasks = (tasksData: Omit<Task, 'id' | 'createdAt'>[]) => {
    const newTasks: Task[] = tasksData.map(t => ({
      ...t,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    }));
    setTasks((prev) => [...newTasks, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const getFilteredTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    
    switch (currentView) {
      case 'today':
        return tasks.filter(t => !t.completed && t.dueDate === today);
      case 'upcoming':
        return tasks.filter(t => !t.completed && t.dueDate > today).sort((a,b) => a.dueDate.localeCompare(b.dueDate));
      case 'completed':
        return tasks.filter(t => t.completed).sort((a,b) => b.createdAt - a.createdAt);
      default:
        return tasks;
    }
  };

  const renderContent = () => {
    if (currentView === 'dashboard') {
      return <Dashboard tasks={tasks} />;
    }
    
    const titles = {
      today: "Today's Agenda",
      upcoming: "Upcoming Tasks",
      completed: "Completed History"
    };

    return (
      <TaskList
        title={titles[currentView]}
        tasks={getFilteredTasks()}
        onToggle={toggleTask}
        onDelete={deleteTask}
      />
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      <Sidebar
        currentView={currentView}
        setView={setCurrentView}
        onAddTask={() => setIsModalOpen(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-bold text-lg text-slate-800">ZenTask AI</h1>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg"
          >
            + Add
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 lg:pb-8">
          <div className="max-w-5xl mx-auto">
             {renderContent()}
          </div>
        </div>
      </main>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addTask}
        onAddMultiple={addMultipleTasks}
      />
    </div>
  );
}

export default App;
