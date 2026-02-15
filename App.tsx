import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TaskList } from './components/TaskList';
import { AddTaskModal } from './components/AddTaskModal';
import { Task, ViewMode } from './types';
import { 
  getTasks, 
  addTaskToDb, 
  addMultipleTasksToDb, 
  updateTaskInDb, 
  deleteTaskFromDb 
} from './services/storageService';
import { Menu } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks on mount from Supabase
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        console.error("Failed to load tasks", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };

    // Optimistic Update
    setTasks((prev) => [newTask, ...prev]);

    // Async DB Call
    addTaskToDb(newTask).catch(err => {
      console.error("Failed to add task, rolling back", err);
      setTasks(prev => prev.filter(t => t.id !== newTask.id));
      alert("Failed to save task to cloud.");
    });
  };

  const addMultipleTasks = (tasksData: Omit<Task, 'id' | 'createdAt'>[]) => {
    const newTasks: Task[] = tasksData.map(t => ({
      ...t,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    }));

    // Optimistic Update
    setTasks((prev) => [...newTasks, ...prev]);

    // Async DB Call
    addMultipleTasksToDb(newTasks).catch(err => {
      console.error("Failed to add tasks, rolling back", err);
      const newIds = new Set(newTasks.map(t => t.id));
      setTasks(prev => prev.filter(t => !newIds.has(t.id)));
      alert("Failed to save tasks to cloud.");
    });
  };

  const toggleTask = (id: string) => {
    // Find current status for rollback
    const taskToUpdate = tasks.find(t => t.id === id);
    if (!taskToUpdate) return;
    
    const newStatus = !taskToUpdate.completed;

    // Optimistic Update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: newStatus } : t))
    );

    // Async DB Call
    updateTaskInDb(id, { completed: newStatus }).catch(err => {
      console.error("Failed to update task, rolling back", err);
      // Rollback
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !newStatus } : t))
      );
    });
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (!taskToDelete) return;

    // Optimistic Update
    setTasks((prev) => prev.filter((t) => t.id !== id));

    // Async DB Call
    deleteTaskFromDb(id).catch(err => {
      console.error("Failed to delete task, rolling back", err);
      // Rollback
      setTasks(prev => [taskToDelete, ...prev].sort((a, b) => b.createdAt - a.createdAt));
      alert("Failed to delete task from cloud.");
    });
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
    if (isLoading) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

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
          <div className="max-w-5xl mx-auto h-full">
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
