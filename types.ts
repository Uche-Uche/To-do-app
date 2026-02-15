export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export enum Category {
  PERSONAL = 'Personal',
  WORK = 'Work',
  SHOPPING = 'Shopping',
  HEALTH = 'Health',
  FINANCE = 'Finance',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // ISO Date string YYYY-MM-DD
  completed: boolean;
  priority: Priority;
  category: Category;
  createdAt: number;
}

export type ViewMode = 'dashboard' | 'today' | 'upcoming' | 'completed';

export interface AIResponse {
  subtasks?: string[];
  motivation?: string;
}
