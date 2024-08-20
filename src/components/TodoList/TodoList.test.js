import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import TodoList from "./TodoList";

// Mock the fetch API
beforeEach(() => {
    jest.spyOn(global, "fetch").mockImplementation((url) => {
        if (url === "https://jsonplaceholder.typicode.com/todos") {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([
                        { id: 1, title: "Todo 1", completed: false },
                        { id: 2, title: "Todo 2", completed: false },
                        { id: 3, title: "Todo 3", completed: false },
                    ]),
            });
        }
        return Promise.reject(new Error("API Error"));
    });
});

afterEach(() => {
    jest.clearAllMocks();
});

afterAll(() => {
    jest.restoreAllMocks();
});

// Test component to render correctly with the fetched data
test("renders fetched todos on mount", async () => {
    render(<TodoList />);

    await waitFor(() => {
        expect(screen.getByText("Todo 1")).toBeInTheDocument();
        expect(screen.getByText("Todo 2")).toBeInTheDocument();
        expect(screen.getByText("Todo 3")).toBeInTheDocument();
    });
});

// Test component to handle API fetch failure and display error message
test("handles API fetch failure", async () => {
    // Mock fetch to return a failed response
    fetch.mockImplementationOnce(() =>
        Promise.reject(new Error("Failed to fetch todos"))
    );

    render(<TodoList />);

    await waitFor(() => {
        expect(
            screen.getByText("Error: Failed to fetch todos")
        ).toBeInTheDocument();
    });
});

// Test adding a new todo
test("adds a new todo item", async () => {
    render(<TodoList />);

    await waitFor(() => screen.getByText("Todo 1"));

    fireEvent.change(screen.getByPlaceholderText("Enter todo"), {
        target: { value: "New Todo" },
    });

    fireEvent.click(screen.getByText("Add Todo"));

    expect(screen.getByText("New Todo")).toBeInTheDocument();
});

// Test removing a todo
test("removes a todo item", async () => {
    render(<TodoList />);

    // Wait for the todos to be rendered
    await waitFor(() => screen.getByText("Todo 1"));

    // Find the list item containing "Todo 1"
    const todoItem = screen.getByText("Todo 1").closest("li");

    // Click the "Remove" button inside this specific list item
    fireEvent.click(todoItem.querySelector("button"));

    // Verify that "Todo 1" is no longer in the document
    expect(screen.queryByText("Todo 1")).not.toBeInTheDocument();
});
