import { saveTeamMembers, loadTeamMembers } from './teamMemberService';

const STATE_KEY = 'dash_to_done_state';

export const saveAppState = (state) => {
  try {
    const stateToSave = {
      teamMembers: state.teamMembers,
      tasks: state.tasks,
      userQueries: state.userQueries || []
    };
    localStorage.setItem(STATE_KEY, JSON.stringify(stateToSave));
  } catch (error) {
    console.error('Error saving app state:', error);
  }
};

export const loadAppState = () => {
  try {
    const data = localStorage.getItem(STATE_KEY);
    if (data) {
      const parsedData = JSON.parse(data);
      saveTeamMembers(parsedData.teamMembers); // Save team members to their specific storage
      return parsedData;
    }
    return null;
  } catch (error) {
    console.error('Error loading app state:', error);
    return null;
  }
};
