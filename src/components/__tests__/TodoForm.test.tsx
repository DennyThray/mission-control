// src/components/__tests__/TodoForm.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TodoForm from "../TodoForm";

describe("TodoForm", () => {
  it("renders empty form in add mode", () => {
    render(<TodoForm onAdd={vi.fn()} />);
    expect(screen.getByLabelText(/Task Title/i)).toHaveValue("");
    expect(screen.getByLabelText(/Priority/i)).toHaveValue("Medium");
    expect(screen.getByLabelText(/Due Date/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("submits form in add mode", async () => {
    const handleAdd = vi.fn();

    render(<TodoForm onAdd={handleAdd} />);

    // Fill out form
    fireEvent.change(screen.getByLabelText(/task title/i), {
      target: { value: "Buy milk" },
    });
    fireEvent.change(screen.getByLabelText(/priority/i), {
      target: { value: "Medium" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /add/i }));

    await waitFor(() => {
      expect(handleAdd).toHaveBeenCalledWith(
        "Buy milk",
        "Medium",
        expect.any(String) // This covers the dueAt value
      );
    });
  });

  it("renders values in edit mode", () => {
    render(
      <TodoForm
        initialTitle="Fix bug"
        initialPriority="High"
        initialDueAt="2025-06-30T15:00"
        onUpdate={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByDisplayValue("Fix bug")).toBeInTheDocument();
    expect(screen.getByDisplayValue("High")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("submits updated values in edit mode", async () => {
    const handleUpdate = vi.fn();

    render(
      <TodoForm
        initialTitle="Fix bug"
        initialPriority="Medium"
        initialDueAt="2025-06-30T15:00"
        onUpdate={handleUpdate}
      />
    );

    fireEvent.change(screen.getByLabelText(/Task Title/i), {
      target: { value: "Fix login bug" },
    });

    fireEvent.change(screen.getByLabelText(/Priority/i), {
      target: { value: "High" },
    });

    fireEvent.change(screen.getByLabelText(/Due Date/i), {
      target: { value: "2025-06-30T15:00" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Update" }));

    await waitFor(() => {
      expect(handleUpdate).toHaveBeenCalledWith(
        "Fix login bug",
        "High",
        "2025-06-30T15:00"
      );
    });
  });

  it("validates empty title", async () => {
    const handleAdd = vi.fn();
    render(<TodoForm onAdd={handleAdd} />);

    fireEvent.change(screen.getByLabelText(/Task Title/i), {
      target: { value: "" },
    });

    fireEvent.submit(screen.getByRole("button", { name: "Add" }));
    expect(await screen.findByText("Title is required")).toBeInTheDocument();
    expect(handleAdd).not.toHaveBeenCalled();
  });
});
