import { Task } from '../types';

const STORAGE_KEY = 'zentask_ai_data';

export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to local storage', error);
  }
};

export const loadTasks = (): Task[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load tasks from local storage', error);
    return [];
  }
};
