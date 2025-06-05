import { useState } from "react";
import type { Todo, Priority } from "../types/todo";
import TodoForm from "./TodoForm";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (
    id: number,
    newTitle: string,
    newPriority: Priority,
    newDueAt: string
  ) => void;
}

const priorityClassMap: Record<Priority, string> = {
  High: "bg-red-600 text-white",
  Medium: "bg-yellow-400 text-black",
  Low: "bg-green-600 text-white",
};

const formatDueDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);

  return (
    <ul className="space-y-4">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="bg-gray-800 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center justify-between"
        >
          {editingId === todo.id ? (
            <TodoForm
              initialTitle={todo.title}
              initialPriority={todo.priority}
              initialDueAt={todo.dueAt}
              onUpdate={(newTitle, newPriority, newDueAt) => {
                onEdit(todo.id, newTitle, newPriority, newDueAt);
                setEditingId(null);
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <p
                  className={`text-lg font-medium ${
                    todo.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {todo.title}
                </p>
                <span
                  className={`text-xs font-semibold w-fit px-2 py-1 rounded ${
                    priorityClassMap[todo.priority]
                  }`}
                >
                  {todo.priority}
                </span>
                {todo.dueAt && (
                  <span className="text-sm text-gray-300">
                    Due: {formatDueDate(todo.dueAt)}
                  </span>
                )}
              </div>

              <div className="mt-3 sm:mt-0 sm:ml-4 flex gap-2">
                <button
                  onClick={() => onToggle(todo.id)}
                  className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm"
                >
                  {todo.completed ? "Undo" : "Done"}
                </button>
                <button
                  onClick={() => setEditingId(todo.id)}
                  className="px-3 py-1 rounded bg-yellow-500 hover:bg-yellow-400 text-black text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(todo.id)}
                  className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-sm"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
