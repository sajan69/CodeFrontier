import React from 'react';
import PropTypes from 'prop-types';
import TaskItem from './TaskItem';

function TaskList({ tasks, onToggleTask, onDeleteTask }) {
  if (tasks.length === 0) {
    return <p className="no-tasks">No tasks yet. Add some!</p>;
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggleTask}
          onDelete={onDeleteTask}
        />
      ))}
    </div>
  );
}

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired
    })
  ).isRequired,
  onToggleTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired
};

export default TaskList; 