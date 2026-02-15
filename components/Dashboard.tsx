import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Task, Priority } from '../types';
import { Sparkles } from 'lucide-react';
import { getMotivationalQuote } from '../services/geminiService';

interface DashboardProps {
  tasks: Task[];
}

export const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const [motivation, setMotivation] = useState<string>('');
  const [loadingMotivation, setLoadingMotivation] = useState(false);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    
    // Priority Distribution
    const priorityData = [
      { name: 'High', count: tasks.filter(t => t.priority === Priority.HIGH && !t.completed).length },
      { name: 'Med', count: tasks.filter(t => t.priority === Priority.MEDIUM && !t.completed).length },
      { name: 'Low', count: tasks.filter(t => t.priority === Priority.LOW && !t.completed).length },
    ];

    // Completion Data
    const completionData = [
      { name: 'Completed', value: completed },
      { name: 'Pending', value: pending },
    ];

    return { total, completed, pending, priorityData, completionData };
  }, [tasks]);

  const COLORS = ['#10b981', '#6366f1']; // Green for completed, Indigo for pending
  const PRIORITY_COLORS = ['#ef4444', '#f59e0b', '#10b981'];

  const handleGetMotivation = async () => {
    setLoadingMotivation(true);
    const quote = await getMotivationalQuote(stats.pending);
    setMotivation(quote);
    setLoadingMotivation(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Welcome & Motivation Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-2">Hello, Achiever!</h2>
          <p className="text-indigo-100 text-lg mb-6">
            You have <span className="font-bold text-white">{stats.pending}</span> tasks pending today.
          </p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            {motivation ? (
              <p className="font-medium text-lg italic animate-in fade-in">"{motivation}"</p>
            ) : (
              <div className="flex items-center gap-3">
                 <p className="text-indigo-100 text-sm">Need a boost?</p>
                 <button 
                  onClick={handleGetMotivation}
                  disabled={loadingMotivation}
                  className="px-4 py-2 bg-white text-indigo-600 rounded-lg text-sm font-bold shadow-lg hover:bg-indigo-50 transition-colors flex items-center gap-2"
                 >
                   <Sparkles className={`w-4 h-4 ${loadingMotivation ? 'animate-spin' : ''}`} />
                   {loadingMotivation ? 'Thinking...' : 'Get Inspired'}
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Completion Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Task Overview</h3>
          <div className="h-64">
            {stats.total === 0 ? (
               <div className="h-full flex items-center justify-center text-slate-400">No tasks yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.completionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {stats.completionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Priority Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Pending by Priority</h3>
          <div className="h-64">
             {stats.pending === 0 ? (
               <div className="h-full flex items-center justify-center text-slate-400">No pending tasks</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.priorityData} barSize={40}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {stats.priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[index % PRIORITY_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: stats.total, color: 'bg-indigo-50 text-indigo-700' },
          { label: 'Completed', value: stats.completed, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Pending', value: stats.pending, color: 'bg-amber-50 text-amber-700' },
          { label: 'Completion Rate', value: stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}%` : '0%', color: 'bg-slate-100 text-slate-700' }
        ].map((item, i) => (
          <div key={i} className={`${item.color} p-4 rounded-2xl flex flex-col items-center justify-center text-center`}>
            <span className="text-2xl font-bold mb-1">{item.value}</span>
            <span className="text-xs font-medium uppercase tracking-wider opacity-75">{item.label}</span>
          </div>
        ))}
      </div>

    </div>
  );
};
