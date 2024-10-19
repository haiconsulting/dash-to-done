import React from 'react';
import Task from './Task';
import './TaskBoard.css';

function TaskBoard({ tasks, onTaskEdit, isManager }) {
  return (
    <div className="task-board">
      {tasks.map(task => (
        <Task 
          key={task.id} 
          task={task} 
          onEdit={onTaskEdit}
          isEditable={isManager || !task.locked}
        />
      ))}
    </div>
  );
}

export default TaskBoard;
