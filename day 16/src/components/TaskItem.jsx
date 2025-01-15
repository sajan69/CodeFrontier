import React from 'react';
import PropTypes from 'prop-types';

function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="task-checkbox"
      />
      <span className="task-text">{task.text}</span>
      <button
        onClick={() => onDelete(task.id)}
        className="delete-button"
      >
        Delete
      </button>
    </div>
  );
}

TaskItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default TaskItem; 