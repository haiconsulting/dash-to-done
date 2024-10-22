import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskInput from './TaskInput';
import TaskBoard from './TaskBoard';
import TeamMemberPanel from './TeamMemberPanel';
import { saveAppState, loadAppState } from '../services/aiService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './ManagerDashboard.css';

function ManagerDashboard({ user, tasks, setTasks }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [userQueries, setUserQueries] = useState([]);
  const [editorContent, setEditorContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppState = async () => {
      try {
        const savedState = await loadAppState();
        if (savedState) {
          setTeamMembers(savedState.teamMembers);
          setTasks(savedState.tasks);
          setUserQueries(savedState.userQueries);
        }
      } catch (error) {
        console.error('Error loading app state:', error);
      }
    };
    fetchAppState();
  }, [setTasks]);

  const handleTasksGenerated = async (newTasks, query) => {
    const updatedTasks = [...tasks, ...newTasks];
    const updatedQueries = [...userQueries, query];
    setTasks(updatedTasks);
    setUserQueries(updatedQueries);
    
    try {
      await saveAppState({ teamMembers, tasks: updatedTasks, userQueries: updatedQueries });
      console.log('State saved successfully after generating tasks');
    } catch (error) {
      console.error('Error saving state after generating tasks:', error);
    }
  };

  const handleTaskEdit = (editedTask) => {
    const updatedTasks = tasks.map(task => 
      task.id === editedTask.id ? editedTask : task
    );
    setTasks(updatedTasks);
  };

  const handleSaveState = async () => {
    try {
      await saveAppState({ teamMembers, tasks, userQueries });
      alert('State saved successfully');
    } catch (error) {
      console.error('Error saving state:', error);
      alert('Failed to save state');
    }
  };

  const handleLogout = () => {
    // Clear user data from state
    // This depends on how you're managing user state in your app
    // For example, if you have a setUser function:
    // setUser(null);
    navigate('/');
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  return (
    <div className="manager-dashboard">
      <div className="dashboard-header">
        <button onClick={handleLogout} className="logout-button">Logout</button>
        <h2>Manager Dashboard</h2>
        <button onClick={handleSaveState} className="save-state-button">Save State</button>
      </div>
      <div className="dashboard-content">
        <div className="main-content">
          <ReactQuill
            value={editorContent}
            onChange={handleEditorChange}
            modules={{
              toolbar: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'color': [] }, { 'background': [] }],
                ['link', 'image'],
                ['clean']
              ],
            }}
          />
          <TaskInput 
            onTasksGenerated={handleTasksGenerated} 
            teamMembers={teamMembers}
            editorContent={editorContent}
            setEditorContent={setEditorContent}
          />
          <TaskBoard 
            tasks={tasks} 
            onTaskEdit={handleTaskEdit} 
            isManager={true}
          />
        </div>
        <TeamMemberPanel teamMembers={teamMembers} setTeamMembers={setTeamMembers} />
      </div>
    </div>
  );
}

export default ManagerDashboard;
