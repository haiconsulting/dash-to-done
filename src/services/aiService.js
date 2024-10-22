import axios from 'axios';

const API_URL = 'http://localhost:3001'; // Adjust this if your server is running on a different port

export const generateTasks = async (input, teamMembers) => {
  try {
    const response = await axios.post(`${API_URL}/generate-tasks`, 
      { input, teamMembers },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.tasks;
  } catch (error) {
    console.error('Error generating tasks:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    throw new Error(error.response?.data?.error || error.message || 'Failed to generate tasks');
  }
};

export const saveAppState = async (state) => {
  try {
    const response = await axios.post(`${API_URL}/save-state`, state, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error saving app state:', error);
    throw new Error('Failed to save app state');
  }
};

export const loadAppState = async () => {
  try {
    const response = await axios.get(`${API_URL}/load-state`);
    return response.data;
  } catch (error) {
    console.error('Error loading app state:', error);
    throw new Error('Failed to load app state');
  }
};
