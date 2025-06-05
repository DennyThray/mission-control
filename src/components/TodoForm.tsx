import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Priority } from "../types/todo";

interface TodoFormProps {
  onAdd?: (title: string, priority: Priority, dueAt: string) => void;
  onUpdate?: (title: string, priority: Priority, dueAt: string) => void;
  onCancel?: () => void;
  initialTitle?: string;
  initialPriority?: Priority;
  initialDueAt?: string;
}

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  priority: z.enum(["Low", "Medium", "High"]),
  dueAt: z.string().min(1, "Due date is required"),
});

type FormData = z.infer<typeof schema>;

function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const TodoForm: React.FC<TodoFormProps> = ({
  onAdd,
  onUpdate,
  onCancel,
  initialTitle = "",
  initialPriority = "Medium",
  initialDueAt = "",
}) => {
  const isEditing = !!onUpdate;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialTitle,
      priority: initialPriority,
      dueAt: "", // we’ll set it in useEffect
    },
  });

  useEffect(() => {
    setValue("title", initialTitle);
    setValue("priority", initialPriority);

    const fallbackDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const parsed = initialDueAt ? new Date(initialDueAt) : fallbackDate;
    const formatted = toDatetimeLocalValue(parsed);
    setValue("dueAt", formatted);
  }, [initialTitle, initialPriority, initialDueAt, setValue]);

  const onSubmit = (data: FormData) => {
    if (isEditing && onUpdate) {
      onUpdate(data.title.trim(), data.priority, data.dueAt);
    } else if (onAdd) {
      onAdd(data.title.trim(), data.priority, data.dueAt);
      reset();
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full mb-6 space-y-4">
      {/* Title Input */}
      <div>
        <label htmlFor="title" className="text-sm text-gray-400 block mb-1">
          Task Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="Enter a task"
          {...register("title")}
          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.title && (
          <p className="text-sm text-red-400 mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Priority Select */}
      <div>
        <label htmlFor="priority" className="text-sm text-gray-400 block mb-1">
          Priority
        </label>
        <select
          id="priority"
          {...register("priority")}
          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Due Date */}
      <div>
        <label htmlFor="dueAt" className="text-sm text-gray-400 block mb-1">
          Due Date
        </label>
        <input
          id="dueAt"
          type="datetime-local"
          {...register("dueAt")}
          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.dueAt && (
          <p className="text-sm text-red-400 mt-1">{errors.dueAt.message}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-2 justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded"
        >
          {isEditing ? "Update" : "Add"}
        </button>
        {isEditing && onCancel && (
          <button
            type="button"
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );

  return isEditing ? (
    formContent
  ) : (
    <div className="border border-blue-600 rounded p-4 bg-gray-900 mb-6">
      {formContent}
    </div>
  );
};

export default TodoForm;
