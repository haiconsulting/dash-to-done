import React, { useState, useEffect } from 'react';
import './Task.css';

function Task({ task, onEdit, isEditable, onFocus, onChunk, teamMembers }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [elapsedTime, setElapsedTime] = useState(task.elapsedTime || 0);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    let interval;
    if (isTracking) {
      interval = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  const handleEdit = () => {
    onEdit({ ...editedTask, elapsedTime });
    setIsEditing(false);
  };

  const toggleTimeTracking = () => {
    setIsTracking(!isTracking);
    onEdit({ ...task, isTracking: !isTracking, elapsedTime });
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('application/json', JSON.stringify(task));
  };

  const handleChunk = () => {
    if (onChunk) {
      onChunk(task);
    }
  };

  if (isEditing && isEditable) {
    return (
      <div className="task editing">
        <input
          value={editedTask.title}
          onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
          placeholder="Task title"
        />
        <textarea
          value={editedTask.description}
          onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
          placeholder="Task description"
        />
        <select
          value={editedTask.status}
          onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <select
          value={editedTask.assigned_team_member_id}
          onChange={(e) => setEditedTask({ ...editedTask, assigned_team_member_id: e.target.value, assigned_team_member: teamMembers.find(m => m.id === e.target.value)?.name })}
        >
          <option value="">Select Team Member</option>
          {teamMembers.map(member => (
            <option key={member.id} value={member.id}>{member.name}</option>
          ))}
        </select>
        <button onClick={handleEdit}>Save</button>
        <button onClick={() => setIsEditing(false)}>Cancel</button>
      </div>
    );
  }

  return (
    <div 
      className="task" 
      draggable={true} 
      onDragStart={handleDragStart}
    >
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>
      <p>Assigned to: {task.assigned_team_member}</p>
      <p>Time spent: {formatTime(elapsedTime)}</p>
      <button onClick={toggleTimeTracking}>
        {isTracking ? 'Stop Tracking' : 'Start Tracking'}
      </button>
      {isEditable && (
        <>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => onFocus(task)}>Focus</button>
          <button onClick={handleChunk}>Chunk</button>
        </>
      )}
      {task.scheduledStart && (
        <p>Scheduled: {new Date(task.scheduledStart).toLocaleString()} - {new Date(task.scheduledEnd).toLocaleString()}</p>
      )}
    </div>
  );
}

export default Task;
