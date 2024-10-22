import React, { useState, useEffect } from 'react';
import './TeamMemberPanel.css';
import { saveTeamMembers, loadTeamMembers } from '../services/teamMemberService';

function TeamMemberPanel({ teamMembers, setTeamMembers }) {
  const [newMember, setNewMember] = useState({
    name: '',
    position: '',
    duties: '',
    isFullTime: true
  });

  useEffect(() => {
    const loadedTeamMembers = loadTeamMembers();
    if (loadedTeamMembers.length > 0) {
      setTeamMembers(loadedTeamMembers);
    }
  }, [setTeamMembers]);

  const handleAddMember = (e) => {
    e.preventDefault();
    const newMemberWithId = { ...newMember, id: Date.now() };
    const updatedTeamMembers = [...teamMembers, newMemberWithId];
    setTeamMembers(updatedTeamMembers);
    saveTeamMembers(updatedTeamMembers);
    setNewMember({ name: '', position: '', duties: '', isFullTime: true });
  };

  const handleRemoveMember = (id) => {
    const updatedTeamMembers = teamMembers.filter(member => member.id !== id);
    setTeamMembers(updatedTeamMembers);
    saveTeamMembers(updatedTeamMembers);
  };

  return (
    <div className="team-member-panel">
      <h3>Team Members</h3>
      <form onSubmit={handleAddMember}>
        <input
          type="text"
          placeholder="Name"
          value={newMember.name}
          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Position"
          value={newMember.position}
          onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
          required
        />
        <textarea
          placeholder="Duties"
          value={newMember.duties}
          onChange={(e) => setNewMember({ ...newMember, duties: e.target.value })}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={newMember.isFullTime}
            onChange={(e) => setNewMember({ ...newMember, isFullTime: e.target.checked })}
          />
          Full Time
        </label>
        <button type="submit">Add Team Member</button>
      </form>
      <ul>
        {teamMembers.map(member => (
          <li key={member.id}>
            {member.name} - {member.position}
            <button onClick={() => handleRemoveMember(member.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeamMemberPanel;
