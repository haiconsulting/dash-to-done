import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskInput from './TaskInput';
import TaskBoard from './TaskBoard';
import Task from './Task'; // Add this import
import { loadAppState, saveAppState, chunkTask } from '../services/aiService';
import './TeamMemberDashboard.css';

function TeamMemberDashboard({ user, tasks, setTasks }) {
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [focusedTask, setFocusedTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppState = async () => {
      try {
        const savedState = await loadAppState();
        if (savedState) {
          setTasks(savedState.tasks);
          const userAssignedTasks = savedState.tasks.filter(task => task.assigned_team_member_id === user.id);
          setAssignedTasks(userAssignedTasks);
        }
      } catch (error) {
        console.error('Error loading app state:', error);
      }
    };
    fetchAppState();
  }, [setTasks, user.id]);

  const handleTaskEdit = (editedTask) => {
    const updatedTasks = tasks.map(task => 
      task.id === editedTask.id ? editedTask : task
    );
    setTasks(updatedTasks);
    setAssignedTasks(updatedTasks.filter(task => task.assigned_team_member_id === user.id));
  };

  const handleSaveState = async () => {
    try {
      await saveAppState({ tasks });
      alert('State saved successfully');
    } catch (error) {
      console.error('Error saving state:', error);
      alert('Failed to save state');
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleFocus = (task) => {
    setFocusedTask(task);
  };

  const handleChunk = async (task) => {
    try {
      const chunkedTasks = await chunkTask(task);
      const updatedTasks = [...tasks.filter(t => t.id !== task.id), ...chunkedTasks];
      setTasks(updatedTasks);
      setAssignedTasks(updatedTasks.filter(t => t.assigned_team_member_id === user.id));
    } catch (error) {
      console.error('Error chunking task:', error);
      alert('Failed to chunk task');
    }
  };

  return (
    <div className="team-member-dashboard">
      <div className="dashboard-header">
        <button onClick={handleLogout} className="logout-button">Logout</button>
        <h2>Team Member Dashboard: {user.name}</h2>
        <button onClick={handleSaveState} className="save-state-button">Save State</button>
      </div>
      {focusedTask && (
        <div className="focus-section">
          <h3>Focused Task</h3>
          <Task
            task={focusedTask}
            onEdit={handleTaskEdit}
            isEditable={true}
            onFocus={() => {}}
            onChunk={handleChunk}
          />
        </div>
      )}
      {assignedTasks.length === 0 ? (
        <div className="notification">
          No tasks assigned yet.
        </div>
      ) : (
        <TaskBoard 
          tasks={assignedTasks} 
          onTaskEdit={handleTaskEdit} 
          isManager={false}
          onFocus={handleFocus}
          onChunk={handleChunk}
        />
      )}
    </div>
  );
}

export default TeamMemberDashboard;
