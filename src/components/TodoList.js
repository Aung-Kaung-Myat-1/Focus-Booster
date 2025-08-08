import React, { useState, useEffect } from 'react';
import { FaCrosshairs, FaTrash } from 'react-icons/fa';
import TaskNotes from './TaskNotes';
import './TodoList.css';

const TodoList = ({ onTaskSelect, selectedTask }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [taskNotes, setTaskNotes] = useState({});

  // Load tasks from localStorage on component mount
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('focus-booster-tasks');
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        // Ensure all tasks have required properties
        const validatedTasks = parsedTasks.map(task => ({
          id: task.id || Date.now(),
          text: task.text || '',
          completed: task.completed || false,
          created: task.created || new Date().toISOString(),
          completedAt: task.completedAt || null,
          notes: task.notes || ''
        }));
        setTasks(validatedTasks);
      }
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      // If there's an error, start with empty tasks
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load notes from localStorage
  useEffect(() => {
    const notes = {};
    tasks.forEach(task => {
      const savedNote = localStorage.getItem(`focus-booster-task-note-${task.id}`);
      if (savedNote) {
        notes[task.id] = savedNote;
      }
    });
    setTaskNotes(notes);
  }, [tasks]);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('focus-booster-tasks', JSON.stringify(tasks));
      } catch (error) {
        console.error('Error saving tasks to localStorage:', error);
      }
    }
  }, [tasks, isLoading]);

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
        created: new Date().toISOString(),
        completedAt: null,
        notes: ''
      };
      setTasks(prevTasks => [...prevTasks, task]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === id) {
          return {
            ...task,
            completed: !task.completed,
            completedAt: !task.completed ? new Date().toISOString() : null
          };
        }
        return task;
      })
    );
  };

  const deleteTask = (id) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    // Also remove the note from localStorage
    localStorage.removeItem(`focus-booster-task-note-${id}`);
    setTaskNotes(prev => {
      const newNotes = { ...prev };
      delete newNotes[id];
      return newNotes;
    });
  };

  const selectTaskForFocus = (task) => {
    onTaskSelect(task);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const clearCompletedTasks = () => {
    setTasks(prevTasks => prevTasks.filter(task => !task.completed));
  };

  const updateTaskNote = (taskId, note) => {
    localStorage.setItem(`focus-booster-task-note-${taskId}`, note);
    setTaskNotes(prev => ({
      ...prev,
      [taskId]: note
    }));
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const hasCompletedTasks = completedTasks > 0;

  if (isLoading) {
    return (
      <div className="todo-list">
        <h3>To-Do List</h3>
        <div className="loading-tasks">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="todo-list">
      <h3>To-Do List</h3>
      
      <div className="task-input-section">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new task..."
          className="task-input"
        />
        <button onClick={addTask} className="btn btn-add-task">
          Add
        </button>
      </div>

      <div className="task-stats">
        <span>{completedTasks} of {totalTasks} completed</span>
        {hasCompletedTasks && (
          <button 
            onClick={clearCompletedTasks} 
            className="btn btn-clear-completed"
            title="Clear completed tasks"
          >
            Clear Completed
          </button>
        )}
      </div>

      <div className="tasks-container">
        {tasks.length === 0 ? (
          <p className="no-tasks">No tasks yet. Add one to get started!</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''} ${selectedTask?.id === task.id ? 'selected' : ''}`}>
              <div className="task-content">
                <input 
                  type="checkbox" 
                  checked={task.completed} 
                  onChange={() => toggleTask(task.id)} 
                  className="task-checkbox"
                />
                <div className="task-text-container">
                  <span className="task-text">{task.text}</span>
                  {task.completedAt && (
                    <span className="task-completed-date">
                      Completed: {new Date(task.completedAt).toLocaleDateString()}
                    </span>
                  )}
                  <TaskNotes 
                    taskId={task.id} 
                    displayNote={true} 
                    note={taskNotes[task.id] || ''}
                    onNoteUpdate={updateTaskNote}
                  />
                </div>
              </div>
              <div className="task-actions">
                {!task.completed && (
                  <button 
                    onClick={() => selectTaskForFocus(task)} 
                    className="btn btn-focus" 
                    title="Focus on this task"
                  >
                    <FaCrosshairs />
                  </button>
                )}
                <button 
                  onClick={() => deleteTask(task.id)} 
                  className="btn btn-delete" 
                  title="Delete task"
                >
                  <FaTrash />
                </button>
                <TaskNotes 
                  taskId={task.id} 
                  displayNote={false} 
                  note={taskNotes[task.id] || ''}
                  onNoteUpdate={updateTaskNote}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList; 