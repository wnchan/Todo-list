import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import Dashboard from './Dashboard';
import Todo from './Todo';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

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
const categories = [
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

const priorities = ['Low', 'Medium', 'High'];

function App() {
  // load data from local storage 
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [inputValue, setInputValue] = useState('');
  const [date, setDate] = useState(null);
  const [category, setCategory] = useState(categories[0]);
  const [priority, setPriority] = useState(priorities[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [sortOption, setSortOption] = useState('Due Date');

  // save to local storage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (inputValue) {
      const newTodo = {
        text: inputValue,
        completed: false,
        date: date ? date.toLocaleDateString() : 'No due date',
        category: category.name,
        priority: priority
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
      setDate(null);
      setCategory(categories[0]);
      setPriority(priorities[0]);
      setShowDatePicker(false);
    }
  };

  const handleDeleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  // mark complete / not complete
  const toggleCompletion = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  // filter category
  const handleCategoryFilterChange = (categoryName) => {
    const newSelectedCategories = new Set(selectedCategories);
    if (categoryName === 'Select All') {
      if (selectedCategories.size === categories.length) {
        newSelectedCategories.clear();
      } else {
        categories.forEach(cat => newSelectedCategories.add(cat.name));
      }
    } else {
      if (newSelectedCategories.has(categoryName)) {
        newSelectedCategories.delete(categoryName); // uncheck selected cat
      } else {
        newSelectedCategories.add(categoryName); // check selected cat
      }
    }
    setSelectedCategories(newSelectedCategories);
  };

  const filteredTodos = todos.filter(todo => 
    selectedCategories.size === 0 || selectedCategories.has(todo.category)
  );

  // sort by due date/priority
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

  // use the useLocation hook to get the current path
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="App">
      <div className="top-controls">
        <Link to={isDashboard ? '/' : '/dashboard'} className="dashboard-link">
          {isDashboard ? 'Go Back Home' : 'Go to Dashboard'}
        </Link>
      </div>
      <h1 className="header">To Do List</h1>
      
      <Routes>
        <Route path="/" element={
          <div>
            <div className="input-container">
              <div className="top-controls">
                <div className="custom-dropdown">
                  <button className="dropdown-btn">
                    <img src={category.img} alt={category.name} className="category-icon" />
                    {category.name}
                    <span className="icon">▼</span>
                  </button>
                  <div className="dropdown-content">
                    {categories.map((cat) => (
                      <div
                        key={cat.name}
                        className="dropdown-item"
                        onClick={() => setCategory(cat)}
                      >
                        <img src={cat.img} alt={cat.name} className="category-icon" />
                        {cat.name}
                      </div>
                    ))}
                  </div>
                </div>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                  {priorities.map((p) => (
                    <option key={p} value={p}>{p} Priority</option>
                  ))}
                </select>
                <button onClick={() => setShowDatePicker(!showDatePicker)}>
                  {showDatePicker ? 'Hide Date Picker' : 'Add Date'}
                </button>
              </div>
              {showDatePicker && (
                <DatePicker
                  selected={date}
                  onChange={(date) => setDate(date)}
                  className="custom-calendar"
                  placeholderText="Select a date"
                />
              )}
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Add a new task"
              />
              <button onClick={handleAddTodo}>Add</button>
            </div>

            {/* Filter tasks */}
            <div className="filters">
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
                      checked={selectedCategories.size === categories.length}
                      onChange={() => handleCategoryFilterChange('Select All')}
                    />
                    <span>Select All</span>
                  </div>
                  {categories.map(cat => (
                    <div key={cat.name} className="category-filter-item">
                      <input
                        type="checkbox"
                        checked={selectedCategories.has(cat.name)}
                        onChange={() => handleCategoryFilterChange(cat.name)}
                      />
                      <img src={cat.img} alt={cat.name} className="category-icon" />
                      {cat.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <ul>
              {sortedTodos.map((todo, index) => (
                <Todo
                  key={index}
                  todo={todo}
                  onDelete={() => handleDeleteTodo(todos.findIndex(t => t.text === todo.text))}
                  onToggle={() => toggleCompletion(todos.findIndex(t => t.text === todo.text))}
                  showDeleteButton={true}
                />
              ))}
            </ul>
          </div>
        } />
        <Route path="/dashboard" element={<Dashboard todos={todos} setTodos={setTodos}/>} />
      </Routes>
    </div>
  );
}

// wrap App component with Router in the main 
const Root = () => (
  <Router>
    <App />
  </Router>
);

export default Root;
