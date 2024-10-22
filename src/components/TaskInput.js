import React, { useState } from 'react';
import { generateTasks } from '../services/aiService';
import 'react-quill/dist/quill.snow.css';

function TaskInput({ onTasksGenerated, teamMembers, editorContent, setEditorContent }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const generatedTasks = await generateTasks(editorContent, teamMembers);
      if (generatedTasks && generatedTasks.length > 0) {
        onTasksGenerated(generatedTasks, editorContent);
        setEditorContent('');
      } else {
        throw new Error('No tasks were generated');
      }
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
        <button type="submit" disabled={isLoading} className="generate-tasks-button">
          {isLoading ? 'Generating Tasks...' : 'Generate Tasks'}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default TaskInput;
