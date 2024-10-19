import React, { useState, useEffect } from 'react';
import TaskInput from './TaskInput';
import TaskBoard from './TaskBoard';
import './TeamMemberDashboard.css';

function TeamMemberDashboard({ user, tasks, setTasks }) {
  const [isInputEnabled, setIsInputEnabled] = useState(false);
  const [assignedTasks, setAssignedTasks] = useState([]);

  useEffect(() => {
    // Check if tasks are locked and enable input
    const lockedTasks = tasks.some(task => task.locked);
    setIsInputEnabled(lockedTasks);

    // Filter assigned tasks
    const userAssignedTasks = tasks.filter(task => task.assigned_team_member === user.id);
    setAssignedTasks(userAssignedTasks);
  }, [tasks, user]);

  const handleTasksGenerated = (newTasks) => {
    setTasks([...tasks, ...newTasks]);
  };

  const handleTaskEdit = (editedTask) => {
    const updatedTasks = tasks.map(task => 
      task.id === editedTask.id ? editedTask : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div className="team-member-dashboard">
      <h2>Team Member Dashboard</h2>
      {assignedTasks.length === 0 && (
        <div className="notification">
          No tasks assigned yet. Please wait for the manager to assign tasks.
        </div>
      )}
      {isInputEnabled && (
        <TaskInput onTasksGenerated={handleTasksGenerated} />
      )}
      <TaskBoard 
        tasks={assignedTasks} 
        onTaskEdit={handleTaskEdit} 
        isManager={false}
      />
    </div>
  );
}

export default TeamMemberDashboard;
