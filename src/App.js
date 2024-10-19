import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ManagerDashboard from './components/ManagerDashboard';
import TeamMemberDashboard from './components/TeamMemberDashboard';
import Login from './components/Login';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Load tasks from local storage
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    // Save tasks to local storage whenever they change
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login setUser={setUser} />} />
          <Route 
            path="/manager" 
            element={<ManagerDashboard user={user} tasks={tasks} setTasks={setTasks} />} 
          />
          <Route 
            path="/team-member" 
            element={<TeamMemberDashboard user={user} tasks={tasks} setTasks={setTasks} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
