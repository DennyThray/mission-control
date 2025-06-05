import { render, screen } from "@testing-library/react";
import TodoStats from "../TodoStats";
import type { Todo } from "../../types/todo";

const mockTodos: Todo[] = [
  {
    id: 1,
    title: "First",
    completed: false,
    priority: "Low",
    createdAt: "",
    dueAt: "",
  },
  {
    id: 2,
    title: "Second",
    completed: true,
    priority: "Medium",
    createdAt: "",
    dueAt: "",
  },
  {
    id: 3,
    title: "Urgent",
    completed: false,
    priority: "High",
    createdAt: "",
    dueAt: "",
  },
];

describe("TodoStats", () => {
  it("displays correct counts", () => {
    render(<TodoStats todos={mockTodos} />);

    expect(screen.getByText(/Total Todos:\s*3/)).toBeInTheDocument();
    expect(screen.getByText(/Active Todos:\s*2/)).toBeInTheDocument();
    expect(screen.getByText(/Completed Todos:\s*1/)).toBeInTheDocument();
  });

  it("shows the highest priority active todo", () => {
    render(<TodoStats todos={mockTodos} />);
    expect(screen.getByText("Urgent")).toBeInTheDocument();
  });

  it("shows a message when there are no active todos", () => {
    const allDone = mockTodos.map((todo) => ({ ...todo, completed: true }));
    render(<TodoStats todos={allDone} />);
    expect(screen.getByText("No active todos")).toBeInTheDocument();
  });
});
