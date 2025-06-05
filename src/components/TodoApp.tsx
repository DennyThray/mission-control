import { useEffect, useState } from "react";
import type { Todo, Priority } from "../types/todo";
import { mockTodos } from "../data/mock";
import TodoList from "./TodoList";
import TodoForm from "./TodoForm";
import TodoStats from "./TodoStats";

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const stored = localStorage.getItem("todos");
    if (stored) {
      try {
        const result = JSON.parse(stored) as Todo[];
        return result;
      } catch {
        console.error("Corrupted localStorage todos");
      }
    }
    return mockTodos;
  });

  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | Priority>("all");
  const [sortBy, setSortBy] = useState<"createdAt" | "priority">("createdAt");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if focused in an input or textarea
      const tag = (event.target as HTMLElement).tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        event.ctrlKey ||
        event.metaKey
      ) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case "a": {
          // Focus the input field
          const input = document.getElementById("todo-input");
          if (input instanceof HTMLInputElement) {
            input.focus();
            event.preventDefault();
          }
          break;
        }

        case "f": {
          // Toggle between all/active
          setFilter((prev) => (prev === "active" ? "all" : "active"));
          break;
        }

        case "p": {
          // Toggle sort mode
          setSortBy((prev) => (prev === "priority" ? "createdAt" : "priority"));
          break;
        }

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const applyFiltersAndSort = (): Todo[] => {
      let result = todos;

      result = result.filter((todo) => {
        if (filter === "active") {
          return !todo.completed;
        } else if (filter === "completed") {
          return todo.completed;
        } else {
          return true;
        }
      });

      result = result.filter((todo) => {
        if (priorityFilter !== "all") {
          return todo.priority === priorityFilter;
        } else {
          return true;
        }
      });

      result = result.sort((a, b) => {
        if (sortBy === "priority") {
          const priorityValues: Record<Priority, number> = {
            High: 0,
            Medium: 1,
            Low: 2,
          };

          const priorityDiff =
            priorityValues[a.priority] - priorityValues[b.priority];
          if (priorityDiff !== 0) return priorityDiff;

          const aDue = a.dueAt ? new Date(a.dueAt).getTime() : Infinity;
          const bDue = b.dueAt ? new Date(b.dueAt).getTime() : Infinity;

          return aDue - bDue;
        } else {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
      });

      return result;
    };

    setFilteredTodos(applyFiltersAndSort());
  }, [todos, filter, priorityFilter, sortBy]);

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        } else {
          return todo;
        }
      })
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(
      todos.filter((todo) => {
        return todo.id !== id;
      })
    );
  };

  const editTodo = (
    id: number,
    newTitle: string,
    newPriority: Priority,
    newDueAt: string
  ) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            title: newTitle,
            priority: newPriority,
            dueAt: newDueAt,
          };
        } else {
          return todo;
        }
      })
    );
  };

  return (
    <div className="p-6 max-w-3xl mx-auto text-white">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-400 tracking-wider text-center mb-6 drop-shadow">
        🚀 Mission Control
      </h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="px-3 py-2 bg-gray-800 rounded"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value as typeof filter);
          }}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>

        <select
          className="px-3 py-2 bg-gray-800 rounded"
          value={priorityFilter}
          onChange={(e) => {
            setPriorityFilter(e.target.value as typeof priorityFilter);
          }}
        >
          <option value="all">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select
          className="px-3 py-2 bg-gray-800 rounded"
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value as typeof sortBy);
          }}
        >
          <option value="createdAt">Sort by Date</option>
          <option value="priority">Sort by Priority</option>
        </select>
      </div>

      <TodoForm
        onAdd={(title, priority, dueAt) => {
          const newTodo: Todo = {
            id: Date.now(),
            title,
            completed: false,
            priority,
            createdAt: new Date().toISOString(),
            dueAt,
          };
          setTodos([...todos, newTodo]);
        }}
      />

      <TodoStats todos={todos} />

      <TodoList
        todos={filteredTodos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        onEdit={editTodo}
      />
    </div>
  );
};

export default TodoApp;
