import React, { useState, useEffect } from "react";

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await fetch(
                    "https://jsonplaceholder.typicode.com/todos"
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch todos");
                }
                const data = await response.json();
                setTodos(data.slice(0, 10));
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchTodos();
    }, []);

    const addTodo = () => {
        if (inputValue.trim()) {
            const newTodo = {
                id: todos.length + 1,
                title: inputValue,
                completed: false,
            };
            setTodos([...todos, newTodo]);
            setInputValue("");
        }
    };

    const removeTodo = (id) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter todo"
            />
            <button onClick={addTodo}>Add Todo</button>
            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        {todo.title}
                        <button onClick={() => removeTodo(todo.id)}>
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoList;
