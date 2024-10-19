import React, { useState } from 'react';
import TaskInput from './TaskInput';
import TaskBoard from './TaskBoard';
import './ManagerDashboard.css';

function ManagerDashboard({ user, tasks, setTasks }) {
  const [isInputLocked, setIsInputLocked] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'To Do' });

  const handleTasksGenerated = (newTasks) => {
    setTasks([...tasks, ...newTasks]);
    setIsInputLocked(true);
  };

  const handleTaskEdit = (editedTask) => {
    const updatedTasks = tasks.map(task => 
      task.id === editedTask.id ? editedTask : task
    );
    setTasks(updatedTasks);
  };

  const handleLockTasks = () => {
    setIsInputLocked(true);
  };

  const handleManualTaskSubmit = (e) => {
    e.preventDefault();
    const taskToAdd = { ...newTask, id: Date.now() };
    setTasks([...tasks, taskToAdd]);
    setNewTask({ title: '', description: '', status: 'To Do' });
  };

  return (
    <div className="manager-dashboard">
      <h2>Manager Dashboard</h2>
      {!isInputLocked && (
        <TaskInput onTasksGenerated={handleTasksGenerated} />
      )}
      <TaskBoard 
        tasks={tasks} 
        onTaskEdit={handleTaskEdit} 
        isManager={true}
      />
      {!isInputLocked && (
        <button onClick={handleLockTasks}>Lock Tasks</button>
      )}
      <div className="manual-task-form">
        <h3>Add Task Manually</h3>
        <form onSubmit={handleManualTaskSubmit}>
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Task Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <select
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <button type="submit">Add Task</button>
        </form>
      </div>
    </div>
  );
}

export default ManagerDashboard;
