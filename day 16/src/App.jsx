import React, { useState } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Learn React Basics', completed: false },
    { id: 2, text: 'Practice with Components', completed: true },
    { id: 3, text: 'Master JSX Syntax', completed: false }
  ]);

  const addTask = (text) => {
    const newTask = {
      id: Date.now(),
      text,
      completed: false
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>React Task Manager</h1>
      </header>
      <main className="app-main">
        <TaskForm onAddTask={addTask} />
        <TaskList 
          tasks={tasks}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
        />
      </main>
    </div>
  );
}

export default App; 