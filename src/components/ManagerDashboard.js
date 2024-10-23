import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskInput from './TaskInput';
import TaskBoard from './TaskBoard';
import TeamMemberPanel from './TeamMemberPanel';
import Calendar from './Calendar';
import { saveAppState, loadAppState, chunkTask } from '../services/aiService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './ManagerDashboard.css';

function ManagerDashboard({ user, tasks, setTasks }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [userQueries, setUserQueries] = useState([]);
  const [editorContent, setEditorContent] = useState('');
  const [calendarEvents, setCalendarEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppState = async () => {
      try {
        const savedState = await loadAppState();
        if (savedState) {
          setTeamMembers(savedState.teamMembers || []);
          setTasks(savedState.tasks || []);
          setUserQueries(savedState.userQueries || []);
          setCalendarEvents(savedState.calendarEvents || []);
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
      await saveAppState({ teamMembers, tasks: updatedTasks, userQueries: updatedQueries, calendarEvents });
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
    saveAppState({ teamMembers, tasks: updatedTasks, userQueries, calendarEvents });
  };

  const handleSaveState = async () => {
    try {
      await saveAppState({ teamMembers, tasks, userQueries, calendarEvents });
      alert('State saved successfully');
    } catch (error) {
      console.error('Error saving state:', error);
      alert('Failed to save state');
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const handleCalendarEventAdd = (event) => {
    const updatedEvents = [...calendarEvents, event];
    setCalendarEvents(updatedEvents);
    saveAppState({ teamMembers, tasks, userQueries, calendarEvents: updatedEvents });
  };

  const handleTaskDrop = (task, start, end) => {
    const updatedTask = { ...task, scheduledStart: start, scheduledEnd: end };
    const updatedTasks = tasks.map(t => t.id === task.id ? updatedTask : t);
    setTasks(updatedTasks);
    saveAppState({ teamMembers, tasks: updatedTasks, userQueries, calendarEvents });
  };

  const handleTeamMembersChange = (updatedTeamMembers) => {
    setTeamMembers(updatedTeamMembers);
    saveAppState({ teamMembers: updatedTeamMembers, tasks, userQueries, calendarEvents });
  };

  const handleChunk = async (task) => {
    try {
      const chunkedTasks = await chunkTask(task);
      const updatedTasks = [...tasks.filter(t => t.id !== task.id), ...chunkedTasks];
      setTasks(updatedTasks);
      saveAppState({ teamMembers, tasks: updatedTasks, userQueries, calendarEvents });
    } catch (error) {
      console.error('Error chunking task:', error);
      alert('Failed to chunk task');
    }
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
            onFocus={() => {}}
            onChunk={handleChunk}
            teamMembers={teamMembers}
          />
          <Calendar 
            events={calendarEvents}
            tasks={tasks}
            onEventAdd={handleCalendarEventAdd}
            onTaskDrop={handleTaskDrop}
          />
        </div>
        <TeamMemberPanel teamMembers={teamMembers} setTeamMembers={handleTeamMembersChange} />
      </div>
    </div>
  );
}

export default ManagerDashboard;
