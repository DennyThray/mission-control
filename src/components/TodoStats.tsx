import type { Todo, Priority } from "../types/todo";

interface TodoStatsProps {
  todos: Todo[];
}

const priorityRank: Record<Priority, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
};

const TodoStats: React.FC<TodoStatsProps> = ({ todos }) => {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const active = total - completed;

  const highestPriorityTodo = todos
    .filter((t) => !t.completed)
    .sort((a, b) => {
      const priorityDiff = priorityRank[b.priority] - priorityRank[a.priority];
      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      // Tiebreaker: older todo comes first
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    })[0];

  return (
    <div className="bg-gray-800 rounded p-4 mb-6 text-sm text-gray-300 space-y-1">
      <div>Total Todos: {total}</div>
      <div>Active Todos: {active}</div>
      <div>Completed Todos: {completed}</div>
      {highestPriorityTodo ? (
        <div>
          Highest Priority Todo:{" "}
          <span className="text-white font-medium">
            {highestPriorityTodo.title}
          </span>{" "}
          <span className="text-xs text-gray-400">
            ({highestPriorityTodo.priority})
          </span>
        </div>
      ) : (
        <div>No active todos</div>
      )}
    </div>
  );
};

export default TodoStats;
