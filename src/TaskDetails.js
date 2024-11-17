import React, { useState, useEffect } from 'react';
import './TaskDetails.css'; 

// Import category icons
import workIcon from './work-icon.png';
import schoolIcon from './school-icon.png';
import healthIcon from './health-icon.png';
import giftIcon from './gift-icon.png';
import meetingIcon from './meeting-icon.png';
import ideasIcon from './ideas-icon.png';
import cookingIcon from './cooking-icon.png';
import paymentIcon from './payment-icon.png';
import othersIcon from './others-icon.png';

const TaskDetails = ({ task, onBack, handleDeleteTask }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // load comments from localStorage when the task changes
    const savedComments = localStorage.getItem(task.text);
    setComments(savedComments ? savedComments.split(', ') : []);
  }, [task]);

  const handleAddComment = () => {
    if (comment) {
      const updatedComments = [...comments, comment];
      setComments(updatedComments);
      setComment('');
      
      // save comments to localStorage
      localStorage.setItem(task.text, updatedComments.join(', ')); 
    }
  };

  const handleDeleteComment = (commentToDelete) => {
    const updatedComments = comments.filter((c) => c !== commentToDelete);
    setComments(updatedComments);
    
    // save updated comments to localStorage 
    localStorage.setItem(task.text, updatedComments.join(', ')); 
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Work':
        return workIcon;
      case 'School':
        return schoolIcon;
      case 'Health':
        return healthIcon;
      case 'Gift':
        return giftIcon;
      case 'Meeting':
        return meetingIcon;
      case 'Ideas':
        return ideasIcon;
      case 'Cooking':
        return cookingIcon;
      case 'Payment':
        return paymentIcon;
      default:
        return othersIcon; 
    }
  };

  return (
    <div className="task-details">
      <h2>Task Details</h2>
      <p>Task: {task.text}</p> 
      <div className="category-container">
        <p>Category: {task.category}</p>
        <img src={getCategoryIcon(task.category)} alt={task.category} className="category-icon" />
      </div>
      <p>Due Date: {task.date}</p>
      <p className="priority-label">
        Priority:<span className={`priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
      </p>
      <p>Comments:</p>
      {comments.length > 0 ? (
        <ul className="comments-list">
          {comments.map((c, index) => (
            <li key={index} className="comment-item">
              <p>{c}</p>
              <button onClick={() => handleDeleteComment(c)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments</p>
      )}

      <h3>Add Comment</h3>
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment"
      />
      <button onClick={handleAddComment}>Add Comment</button>
      <div className="button-container">
        <button className="delete-task-button" onClick={handleDeleteTask}>Delete Task</button>
        <button className="back-button" onClick={onBack}>Back to Dashboard</button>
      </div>
    </div>
  );
};

export default TaskDetails;
