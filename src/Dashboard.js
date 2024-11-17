import React, { useState } from 'react';
import Todo from './Todo';
import TaskDetails from './TaskDetails'; 
import './Dashboard.css';

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

// Categories with associated images
const categoriesData = [
  { name: 'Work', img: workIcon },
  { name: 'School', img: schoolIcon },
  { name: 'Health', img: healthIcon },
  { name: 'Gift', img: giftIcon },
  { name: 'Meeting', img: meetingIcon },
  { name: 'Ideas', img: ideasIcon },
  { name: 'Cooking', img: cookingIcon },
  { name: 'Payment', img: paymentIcon },
  { name: 'Others', img: othersIcon }
];

const Dashboard = ({ todos, setTodos }) => {
  const [filter, setFilter] = useState('All');
  const [sortOption, setSortOption] = useState('Due Date');
  const priorities = ['Low', 'Medium', 'High'];
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedTask, setSelectedTask] = useState(null); // state to hold the selected task

  // filter cat
  const handleCategoryFilterChange = (categoryName) => {
    const newSelectedCategories = new Set(selectedCategories);
    if (categoryName === 'Select All') {
      if (selectedCategories.size === categoriesData.length) {
        newSelectedCategories.clear();
      } else {
        categoriesData.forEach(cat => newSelectedCategories.add(cat.name));
      }
    } else {
      if (newSelectedCategories.has(categoryName)) {
        newSelectedCategories.delete(categoryName);
      } else {
        newSelectedCategories.add(categoryName);
      }
    }
    setSelectedCategories(newSelectedCategories);
  };

// filter task completion
  const filteredTodos = todos.filter(todo => {
    const categoryMatch = selectedCategories.size === 0 || selectedCategories.has(todo.category);
    const filterMatch =
      (filter === 'All') ||
      (filter === 'Completed' && todo.completed) ||
      (filter === 'Not Completed' && !todo.completed);

    return categoryMatch && filterMatch;
  });

  // filter due date/priority
  const sortedTodos = filteredTodos.sort((a, b) => {
    if (sortOption === 'Priority') {
      const priorityDiff = priorities.indexOf(b.priority) - priorities.indexOf(a.priority);
      if (priorityDiff !== 0) return priorityDiff;
      if (a.date === 'No due date' && b.date === 'No due date') {
        return 0;
      }
      if (a.date === 'No due date') return 1;
      if (b.date === 'No due date') return -1;
      return new Date(a.date) - new Date(b.date);
    } else if (sortOption === 'Due Date') {
      if (a.date === 'No due date' && b.date === 'No due date') {
        return 0;
      }
      if (a.date === 'No due date') return 1;
      if (b.date === 'No due date') return -1;
      return new Date(a.date) - new Date(b.date);
    }
    return 0;
  });

  const handleTaskClick = (task) => {
    setSelectedTask(task); 
  };

  const handleBackToDashboard = () => {
    setSelectedTask(null); // unselect task
  };

  const handleDeleteTask = () => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo !== selectedTask));
    setSelectedTask(null); // go back to the dashboard after deleting
  };

  if (selectedTask) {
    return <TaskDetails task={selectedTask} onBack={handleBackToDashboard} handleDeleteTask={handleDeleteTask}/>; //show task details if selected
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="filter-controls">
        <div className="filter-dropdown">
          <button className="dropdown-btn">
            {filter} Tasks
            <span className="icon">▼</span>
          </button>
          <div className="dropdown-content">
            {['All', 'Completed', 'Not Completed'].map((option) => (
              <div
                key={option}
                onClick={() => setFilter(option)}
                className="dropdown-item"
              >
              {option}
              </div>
            ))}
          </div>
        </div>
        <div className="sort-dropdown">
          <button className="dropdown-btn">
            Sort by: {sortOption}
            <span className="icon">▼</span>
          </button>
          <div className="dropdown-content">
            {['Due Date', 'Priority'].map((option) => (
              <div
                key={option}
                onClick={() => {
                  setSortOption(option);
                }}
                className="dropdown-item"
              >
                {option}
              </div>
            ))}
          </div>
        </div>
        <div className="category-filter-dropdown">
          <button className="dropdown-btn">
            Categories
            <span className="icon">▼</span>
          </button>
          <div className="dropdown-content">
            <div className="category-filter-item">
              <input
                type="checkbox"
                checked={selectedCategories.size === categoriesData.length}
                onChange={() => handleCategoryFilterChange('Select All')}
              />
              Select All
            </div>
            {categoriesData.map(({ name, img }) => (
              <div key={name} className="category-filter-item">
                <input
                  type="checkbox"
                  checked={selectedCategories.has(name)}
                  onChange={() => handleCategoryFilterChange(name)}
                />
                <img src={img} alt={name} className="category-icon" />
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
      <ul>
        {sortedTodos.map((todo, index) => (
          <li key={index} onClick={() => handleTaskClick(todo)}> {/* Handle click */}
            <Todo todo={todo} showDeleteButton={false} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
