import React, { useState, useEffect } from "react";
import "./App.css";
import Template from "./components/Template";
import TodoList from "./components/TodoList";
import { MdAddCircle } from "react-icons/md";
import TodoInsert from "./components/TodoInsert";
import axios from "axios";

let nextId = 4;
const App = () => {
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [insertToggle, setInsertToggle] = useState(false);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("http://localhost:3001/todos");
      setTodos(response.data);
      nextId = response.data.length + 1;
    }
    fetchData();
  }, []);

  const onInsertToggle = () => {
    if (selectedTodo) {
      setSelectedTodo(null);
    }
    setInsertToggle((prev) => !prev);
  };

  const onInsertTodo = async (text) => {
    if (text === "") {
      return alert("일정을 입력해주세요.");
    } else {
      const todo = {
        id: nextId,
        text,
        checked: false,
      };
      await axios.post("http://localhost:3001/todos", todo);
      setTodos((todos) => todos.concat(todo));
      nextId++;
    }
  };

  const onCheckToggle = async (id) => {
    const todo = todos.find((todo) => todo.id === id);
    const updatedTodo = {
      ...todo,
      checked: !todo.checked,
    };
    await axios.put(`http://localhost:3001/todos/${id}`, updatedTodo);
    setTodos((todos) =>
      todos.map((todo) =>
        todo.id === id ? { ...todo, checked: !todo.checked } : todo
      )
    );
  };

  const onChangeSelectedTodo = (todo) => {
    setSelectedTodo(todo);
  };

  const onRemove = async (id) => {
    onInsertToggle();
    await axios.delete(`http://localhost:3001/todos/${id}`);
    setTodos((todos) => todos.filter((todo) => todo.id !== id));
  };

  const onUpdate = async (id, text) => {
    onInsertToggle();
    const todo = todos.find((todo) => todo.id === id);
    const updatedTodo = {
      ...todo,
      text,
    };
    await axios.put(`http://localhost:3001/todos/${id}`, updatedTodo);
    setTodos((todos) =>
      todos.map((todo) => (todo.id === id ? { ...todo, text } : todo))
    );
  };

  return (
    <Template todoLength={todos.length}>
      <TodoList
        todos={todos}
        onCheckToggle={onCheckToggle}
        onInsertToggle={onInsertToggle}
        onChangeSelectedTodo={onChangeSelectedTodo}
      />
      <div className="add-todo-button" onClick={onInsertToggle}>
        <MdAddCircle />
      </div>
      {insertToggle && (
        <TodoInsert
          selectedTodo={selectedTodo}
          onInsertToggle={onInsertToggle}
          onInsertTodo={onInsertTodo}
          onRemove={onRemove}
          onUpdate={onUpdate}
        />
      )}
    </Template>
  );
};

export default App;
