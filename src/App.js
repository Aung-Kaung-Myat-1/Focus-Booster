import React, { useState, useEffect } from 'react';
import './App.css';

import DailyGoal from './components/DailyGoal';
import TodoList from './components/TodoList';
import SessionTag from './components/SessionTag';
import SessionIntent from './components/SessionIntent';
import FocusTimer from './components/FocusTimer';

import MoodTracker from './components/MoodTracker';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import DistractionLogger from './components/DistractionLogger';
import DailySummary from './components/DailySummary';
import AmbientSoundPlayer from './components/AmbientSoundPlayer';
import TimerSettings from './components/TimerSettings';
import TaskNotes from './components/TaskNotes';
import CalendarHeatmap from './components/CalendarHeatmap';
import DistractionTracker from './components/DistractionTracker';
import IdleDetector from './components/IdleDetector';
import ProductivityScore from './components/ProductivityScore';
import DataExporter from './components/DataExporter';
import { FaChartBar, FaClipboardList, FaCalendarAlt, FaExclamationTriangle, FaDownload, FaCog } from 'react-icons/fa';

function App() {
  const [showMoodPrompt, setShowMoodPrompt] = useState(false);
  const [showDistractionPrompt, setShowDistractionPrompt] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showDailySummary, setShowDailySummary] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDistractionTracker, setShowDistractionTracker] = useState(false);
  const [showDataExporter, setShowDataExporter] = useState(false);
  const [moodHistory, setMoodHistory] = useState([]);
  const [distractionHistory, setDistractionHistory] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTag, setSelectedTag] = useState('');
  const [currentTheme, setCurrentTheme] = useState({
    primary: '#392118',      // Ancient Grove (dark brown)
    secondary: '#663B2A',    // Canyon Rust (reddish-brown)
    accent: '#6D6941',       // Fernwood (muted olive green)
    background: '#F7F3E8',   // Very light beige (lighter version)
    text: '#392118',         // Ancient Grove (dark brown text)
    card: 'rgba(247, 243, 232, 0.9)'  // Very light beige card background
  });

  // Default theme if everything fails
  const defaultTheme = {
    primary: '#392118',      // Ancient Grove (dark brown)
    secondary: '#663B2A',    // Canyon Rust (reddish-brown)
    accent: '#6D6941',       // Fernwood (muted olive green)
    background: '#F7F3E8',   // Very light beige (lighter version)
    text: '#392118',         // Ancient Grove (dark brown text)
    card: 'rgba(247, 243, 232, 0.9)'  // Very light beige card background
  };
  const [timerSettings, setTimerSettings] = useState({
    focusTime: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4
  });
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    const savedMoods = localStorage.getItem('focus-booster-moods');
    const savedDistractions = localStorage.getItem('focus-booster-distractions');
    const savedTheme = localStorage.getItem('focus-booster-theme');
    
    try {
      if (savedMoods) { setMoodHistory(JSON.parse(savedMoods)); }
      if (savedDistractions) { setDistractionHistory(JSON.parse(savedDistractions)); }
      if (savedTheme) { 
        const parsedTheme = JSON.parse(savedTheme);
        setCurrentTheme(parsedTheme);
      } else {
        setCurrentTheme(defaultTheme);
      }
    } catch (error) {
      console.log('Error parsing localStorage data:', error);
      // Clear invalid data and use default theme
      localStorage.removeItem('focus-booster-moods');
      localStorage.removeItem('focus-booster-distractions');
      localStorage.removeItem('focus-booster-theme');
      setCurrentTheme(defaultTheme);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', currentTheme.primary);
    document.documentElement.style.setProperty('--secondary-color', currentTheme.secondary);
    document.documentElement.style.setProperty('--accent-color', currentTheme.accent);
    document.documentElement.style.setProperty('--text-color', currentTheme.text);
    document.documentElement.style.setProperty('--card-background', currentTheme.card);
    document.documentElement.style.setProperty('--app-background', `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 50%, ${currentTheme.accent} 100%)`);
  }, [currentTheme]);

  const handleGoalComplete = () => { console.log('Daily goal completed!'); };
  
  const handleThemeChange = (newTheme) => {
    setCurrentTheme(newTheme);
    localStorage.setItem('focus-booster-theme', JSON.stringify(newTheme));
  };
  
  const handleMoodSubmit = (moodData) => {
    const newMood = {
      ...moodData,
      timestamp: new Date().toISOString(),
      date: new Date().toDateString()
    };
    const updatedMoods = [newMood, ...moodHistory];
    setMoodHistory(updatedMoods);
    localStorage.setItem('focus-booster-moods', JSON.stringify(updatedMoods));
    setShowMoodPrompt(false);
  };
  
  const handleDistractionSubmit = (distractionData) => {
    const newDistraction = {
      ...distractionData,
      timestamp: new Date().toISOString(),
      date: new Date().toDateString()
    };
    const updatedDistractions = [newDistraction, ...distractionHistory];
    setDistractionHistory(updatedDistractions);
    localStorage.setItem('focus-booster-distractions', JSON.stringify(updatedDistractions));
    setShowDistractionPrompt(false);
  };
  
  const handlePomodoroComplete = () => { 
    setShowMoodPrompt(true); 
  };
  
  const handlePomodoroInterrupt = () => { 
    setShowDistractionPrompt(true); 
  };

  const handleTaskSelect = (task) => { setSelectedTask(task); };
  const handleTagSelect = (tag) => { setSelectedTag(tag); };
  const handleTimerSettingsChange = (settings) => { setTimerSettings(settings); };
  const handleTimerStateChange = (isRunning) => { setIsTimerRunning(isRunning); };

  const getTodayMoods = () => {
    const today = new Date().toDateString();
    return moodHistory.filter(mood => mood.date === today);
  };

  return (
    <div className="App">

      <header className="App-header">
        <h1>Welcome to Focus Booster!</h1>
        <div className="app-container">
          <AmbientSoundPlayer onThemeChange={handleThemeChange} />
          <DailyGoal onGoalComplete={handleGoalComplete} />
          
          <div className="main-content">
            {/* First row: Focus Timer + Productivity Score */}
            <div className="timer-productivity-row">
              <div className="timer-section">
                <FocusTimer
                  onPomodoroComplete={handlePomodoroComplete}
                  onPomodoroInterrupt={handlePomodoroInterrupt}
                  selectedTask={selectedTask}
                  selectedTag={selectedTag}
                  settings={timerSettings}
                  onTimerStateChange={handleTimerStateChange}
                  onSettingsChange={handleTimerSettingsChange}
                />
              </div>
              <ProductivityScore />
            </div>

            {/* Second row: Todo List + Session Tag */}
            <div className="todo-session-row">
              <TodoList onTaskSelect={handleTaskSelect} selectedTask={selectedTask} />
              <SessionTag onTagSelect={handleTagSelect} selectedTag={selectedTag} />
            </div>

            {/* Third row: Session Intent (full width) */}
            <div className="session-intent-row">
              <SessionIntent selectedTask={selectedTask} />
            </div>
          </div>

          <div className="app-actions">
            <button onClick={() => setShowAnalytics(true)} className="btn btn-analytics">
              <FaChartBar /><span>Analytics</span>
            </button>
            <button onClick={() => setShowDailySummary(true)} className="btn btn-summary">
              <FaClipboardList /><span>Daily Summary</span>
            </button>
            <button onClick={() => setShowCalendar(true)} className="btn btn-calendar">
              <FaCalendarAlt /><span>Calendar</span>
            </button>
            <button onClick={() => setShowDistractionTracker(true)} className="btn btn-distractions">
              <FaExclamationTriangle /><span>Distractions</span>
            </button>
            <button onClick={() => setShowDataExporter(true)} className="btn btn-export-data">
              <FaDownload /><span>Export Data</span>
            </button>
          </div>
        </div>
      </header>
      
      <MoodTracker showMoodPrompt={showMoodPrompt} onMoodSubmit={handleMoodSubmit} onClose={() => setShowMoodPrompt(false)} />
      <DistractionLogger showDistractionPrompt={showDistractionPrompt} onDistractionSubmit={handleDistractionSubmit} onClose={() => setShowDistractionPrompt(false)} />
      <AnalyticsDashboard isVisible={showAnalytics} onClose={() => setShowAnalytics(false)} />
      <DailySummary isVisible={showDailySummary} onClose={() => setShowDailySummary(false)} />
      <CalendarHeatmap isVisible={showCalendar} onClose={() => setShowCalendar(false)} />
      <DistractionTracker isVisible={showDistractionTracker} onClose={() => setShowDistractionTracker(false)} />
      <DataExporter isVisible={showDataExporter} onClose={() => setShowDataExporter(false)} />
      <IdleDetector 
        isTimerRunning={isTimerRunning} 
        onPause={() => setIsTimerRunning(false)}
        onResume={() => setIsTimerRunning(true)}
      />
    </div>
  );
}

export default App;
