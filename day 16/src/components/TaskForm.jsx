import React, { useState } from 'react';
import PropTypes from 'prop-types';

function TaskForm({ onAddTask }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTask(text);
      setText('');
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task..."
        className="task-input"
      />
      <button type="submit" className="add-button">
        Add Task
      </button>
    </form>
  );
}

TaskForm.propTypes = {
  onAddTask: PropTypes.func.isRequired
};

export default TaskForm; 