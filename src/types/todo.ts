export type Priority = "Low" | "Medium" | "High";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
  dueAt: string;
}
