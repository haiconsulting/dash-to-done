import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const generateTasks = async (input, teamMembers) => {
  try {
    const response = await axios.post(`${API_URL}/generate-tasks`, { input, teamMembers });
    return response.data.tasks;
  } catch (error) {
    console.error('Error generating tasks:', error);
    throw error;
  }
};

export const saveAppState = async (state) => {
  try {
    await axios.post(`${API_URL}/save-state`, state);
  } catch (error) {
    console.error('Error saving app state:', error);
    throw error;
  }
};

export const loadAppState = async () => {
  try {
    const response = await axios.get(`${API_URL}/load-state`);
    return response.data;
  } catch (error) {
    console.error('Error loading app state:', error);
    throw error;
  }
};

export const chunkTask = async (task) => {
  try {
    const response = await axios.post(`${API_URL}/chunk-task`, { task });
    return response.data.chunkedTasks;
  } catch (error) {
    console.error('Error chunking task:', error);
    throw error;
  }
};
