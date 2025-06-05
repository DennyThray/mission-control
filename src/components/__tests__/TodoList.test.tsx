import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TodoList from "../TodoList";
import type { Todo } from "../../types/todo";

const mockTodos: Todo[] = [
  {
    id: 1,
    title: "Test Task",
    priority: "Medium",
    completed: false,
    createdAt: new Date().toISOString(),
    dueAt: new Date().toISOString(),
  },
];

describe("TodoList", () => {
  it("renders todo items with correct content", () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    );

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Done" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("calls onToggle when Done button is clicked", () => {
    const onToggle = vi.fn();

    render(
      <TodoList
        todos={mockTodos}
        onToggle={onToggle}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(onToggle).toHaveBeenCalledWith(1);
  });

  it("calls onDelete when Delete button is clicked", () => {
    const onDelete = vi.fn();

    render(
      <TodoList
        todos={mockTodos}
        onToggle={vi.fn()}
        onDelete={onDelete}
        onEdit={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it("shows TodoForm when Edit is clicked", () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    expect(screen.getByDisplayValue("Test Task")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });
});
