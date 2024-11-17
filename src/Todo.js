import React from 'react';

import workIcon from './work-icon.png';
import schoolIcon from './school-icon.png';
import healthIcon from './health-icon.png';
import giftIcon from './gift-icon.png';
import meetingIcon from './meeting-icon.png';
import ideasIcon from './ideas-icon.png';
import cookingIcon from './cooking-icon.png';
import paymentIcon from './payment-icon.png';
import othersIcon from './others-icon.png';

function Todo({ todo, onToggle, onDelete, showDeleteButton }) {
  const formatDate = (date) => {
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    return date;
  };

  const getCategoryImage = (category) => {
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
      case 'Others':
        return othersIcon;
      default:
        return '';
    }
  };

  return (
    <div className={`todo-item`}>
      <button onClick={onToggle} className="tick-button">
        {todo.completed ? '✔️' : '❌'}
      </button>
      <img src={getCategoryImage(todo.category)} alt={todo.category} className="category-icon" />
      <span>{todo.text}</span>
      <span className={`priority-label ${todo.priority === 'High' ? 'priority-high' : todo.priority === 'Medium' ? 'priority-medium' : 'priority-low'}`}>
        {todo.priority}
      </span>
      {todo.date && <span className="due-date">{formatDate(todo.date)}</span>}
      {showDeleteButton && <button onClick={onDelete}>Delete</button>} 
    </div>
  );
}

export default Todo;
