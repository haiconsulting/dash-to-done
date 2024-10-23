import React from 'react';
import Task from './Task';
import './TaskBoard.css';

function TaskBoard({ tasks, onTaskEdit, isManager, onFocus, onChunk, teamMembers }) {
  return (
    <div className="task-board">
      {tasks.map(task => (
        <Task
          key={task.id}
          task={task}
          onEdit={onTaskEdit}
          isEditable={isManager}
          onFocus={onFocus}
          onChunk={onChunk}
          teamMembers={teamMembers}
        />
      ))}
    </div>
  );
}

export default TaskBoard;
