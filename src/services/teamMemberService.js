const TEAM_MEMBERS_KEY = 'dash_to_done_team_members';

export const saveTeamMembers = (teamMembers) => {
  try {
    localStorage.setItem(TEAM_MEMBERS_KEY, JSON.stringify(teamMembers));
  } catch (error) {
    console.error('Error saving team members:', error);
  }
};

export const loadTeamMembers = () => {
  try {
    const data = localStorage.getItem(TEAM_MEMBERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading team members:', error);
    return [];
  }
};
