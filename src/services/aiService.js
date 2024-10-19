import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

export const generateTasks = async (input) => {
  if (!API_KEY) {
    throw new Error('OpenAI API key is not set. Please check your environment variables.');
  }

  try {
    const response = await axios.post(
      API_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a task manager assistant. Generate a list of tasks based on the given input. Each task should be on a new line." },
          { role: "user", content: input }
        ],
        temperature: 0.7,
        max_tokens: 200
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.data || !response.data.choices || !response.data.choices[0] || !response.data.choices[0].message) {
      throw new Error('Unexpected API response format');
    }

    const tasksString = response.data.choices[0].message.content;
    const tasks = tasksString.split('\n').filter(task => task.trim() !== '').map(task => ({
      id: Date.now() + Math.random(),
      title: task.trim(),
      description: '',
      status: 'To Do',
      assigned_team_member: 2 // Assigning to team-member (ID: 2) for this test
    }));

    return tasks;
  } catch (error) {
    console.error('Error generating tasks:', error);
    if (error.response) {
      console.error('API response:', error.response.data);
    }
    throw error;
  }
};
