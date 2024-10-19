import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { generateTasks } from '../services/aiService';

function TaskInput({ onTasksGenerated }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const generatedTasks = await generateTasks(input);
      onTasksGenerated(generatedTasks);
      setInput('');
    } catch (error) {
      console.error('Error generating tasks:', error);
      setError(error.message || 'Failed to generate tasks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="task-input">
      <form onSubmit={handleSubmit}>
        <ReactQuill 
          value={input} 
          onChange={setInput}
          modules={{
            toolbar: [
              [{ 'header': [1, 2, false] }],
              ['bold', 'italic', 'underline'],
              [{'list': 'ordered'}, {'list': 'bullet'}],
              ['clean']
            ],
          }}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating Tasks...' : 'Generate Tasks'}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default TaskInput;
