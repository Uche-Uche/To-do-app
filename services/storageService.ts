import { supabase } from './supabaseClient';
import { Task } from '../types';

// Map DB row (snake_case) to Task (camelCase)
const mapRowToTask = (row: any): Task => ({
  id: row.id,
  title: row.title,
  description: row.description,
  dueDate: row.due_date,
  completed: row.completed,
  priority: row.priority,
  category: row.category,
  // Convert Supabase timestamptz string to number for app compatibility
  createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
});

// Map Task (camelCase) to DB row (snake_case)
const mapTaskToRow = (task: Task) => ({
  id: task.id,
  title: task.title,
  description: task.description ?? '',
  due_date: task.dueDate,
  completed: task.completed,
  priority: task.priority,
  category: task.category,
  created_at: new Date(task.createdAt).toISOString(),
});

export const getTasks = async (): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tasks from Supabase:', error);
    return [];
  }
  return (data || []).map(mapRowToTask);
};

export const addTaskToDb = async (task: Task) => {
  const { error } = await supabase
    .from('tasks')
    .insert(mapTaskToRow(task));

  if (error) {
    console.error('Error adding task to Supabase:', error);
    throw error;
  }
};

export const addMultipleTasksToDb = async (tasks: Task[]) => {
  if (tasks.length === 0) return;
  const { error } = await supabase
    .from('tasks')
    .insert(tasks.map(mapTaskToRow));

  if (error) {
    console.error('Error adding multiple tasks to Supabase:', error);
    throw error;
  }
};

export const updateTaskInDb = async (id: string, updates: Partial<Task>) => {
  // Map updates to snake_case manually for partial updates
  const dbUpdates: any = {};
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
  if (updates.completed !== undefined) dbUpdates.completed = updates.completed;
  if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
  if (updates.category !== undefined) dbUpdates.category = updates.category;

  const { error } = await supabase
    .from('tasks')
    .update(dbUpdates)
    .eq('id', id);

  if (error) {
    console.error('Error updating task in Supabase:', error);
    throw error;
  }
};

export const deleteTaskFromDb = async (id: string) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting task from Supabase:', error);
    throw error;
  }
};
