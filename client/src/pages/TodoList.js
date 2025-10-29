import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos, addTodo, deleteTodo } from '../features/todo/todoSlice';
import { logout } from '../features/auth/authSlice';
import './TodoList.css';

function TodoList() {
  const dispatch = useDispatch();
  const todos = useSelector(state => state.todo.list);
  const token = useSelector(state => state.auth.token);
  const [task, setTask] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (token) {
      dispatch(fetchTodos(token));
    }
  }, [dispatch, token]);

  const handleAdd = () => {
    if (task.trim()) {
      dispatch(addTodo({ task, token }));
      setTask('');
      inputRef.current.focus();
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteTodo({ id, token }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="todo-page">
      {/* Header */}
      <header className="todo-header">
        <div className="header-left">
          <img src="/mountblue-png.png" alt="Logo" className="header-logo" />
        </div>
        <div className="header-center">
          <h1 className="header-title">Mountblue Todo App</h1>
        </div>
        <div className="header-right">
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* Todo Container */}
      <div className="todo-container">
        <h2 className="todo-title">My To‑Do List</h2>

        <div className="todo-input-area">
          <input
            ref={inputRef}
            className="todo-input"
            placeholder="Enter new task..."
            value={task}
            onChange={e => setTask(e.target.value)}
          />
          <button className="todo-add-button" onClick={handleAdd}>Add</button>
        </div>

        <ul className="todo-list">
  {[...todos].slice().reverse().map((todo, index, arr) => (
    <li className="todo-item" key={todo._id}>
      <span className="todo-task-no">{arr.length - index}.</span> {/* Numbering from bottom */}
      <span className="todo-text">{todo.task}</span>
      <button className="todo-delete-button" onClick={() => handleDelete(todo._id)}>Delete</button>
    </li>
  ))}
</ul>

      </div>
    </div>
  );
}

export default TodoList;
