import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function TaskInput({ onTasksGenerated }) {
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Send input to server and receive generated tasks
    const generatedTasks = [{ id: Date.now(), title: input, description: '', status: 'To Do' }];
    onTasksGenerated(generatedTasks);
    setInput('');
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
        <button type="submit">Generate Tasks</button>
      </form>
    </div>
  );
}

export default TaskInput;
