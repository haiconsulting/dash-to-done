import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadTeamMembers } from '../services/teamMemberService';

function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadedTeamMembers = loadTeamMembers();
    setTeamMembers(loadedTeamMembers);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.toLowerCase() === 'manager') {
      setUser({ id: 1, name: 'Manager', role: 'manager' });
      navigate('/manager');
    } else {
      const teamMember = teamMembers.find(member => member.name.toLowerCase() === username.toLowerCase());
      if (teamMember) {
        setUser({ id: teamMember.id, name: teamMember.name, role: 'team-member' });
        navigate(`/team-member/${teamMember.id}`);
      } else {
        alert('Invalid username');
      }
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
