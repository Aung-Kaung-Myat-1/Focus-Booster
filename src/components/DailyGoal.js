import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTrophy } from 'react-icons/fa';
import './DailyGoal.css';

const DailyGoal = ({ onGoalComplete }) => {
  const [dailyGoal, setDailyGoal] = useState(4);
  const [completedCount, setCompletedCount] = useState(0);
  const [isGoalMet, setIsGoalMet] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Get today's date as a string for localStorage key
  const getTodayKey = () => {
    const today = new Date();
    return `focus-goal-${today.toDateString()}`;
  };

  // Load goal and count from localStorage
  const loadDailyData = () => {
    const todayKey = getTodayKey();
    const savedData = localStorage.getItem(todayKey);
    
    if (savedData) {
      const { goal, count, date } = JSON.parse(savedData);
      const savedDate = new Date(date);
      const today = new Date();
      
      // Check if it's a new day
      if (savedDate.toDateString() !== today.toDateString()) {
        // New day, reset everything
        setDailyGoal(4);
        setCompletedCount(0);
        setIsGoalMet(false);
        saveDailyData(4, 0);
      } else {
        // Same day, load saved data
        setDailyGoal(goal);
        setCompletedCount(count);
        setIsGoalMet(count >= goal);
      }
    } else {
      // No saved data, set defaults
      setDailyGoal(4);
      setCompletedCount(0);
      setIsGoalMet(false);
      saveDailyData(4, 0);
    }
  };

  // Save goal and count to localStorage
  const saveDailyData = (goal, count) => {
    const todayKey = getTodayKey();
    const data = {
      goal,
      count,
      date: new Date().toISOString()
    };
    localStorage.setItem(todayKey, JSON.stringify(data));
  };

  // Update goal
  const updateGoal = (newGoal) => {
    setDailyGoal(newGoal);
    setCompletedCount(0);
    setIsGoalMet(false);
    saveDailyData(newGoal, 0);
  };

  // Increment completed count (called from parent component)
  const incrementCompleted = () => {
    const newCount = completedCount + 1;
    setCompletedCount(newCount);
    saveDailyData(dailyGoal, newCount);
    
    if (newCount >= dailyGoal && !isGoalMet) {
      setIsGoalMet(true);
      setShowCelebration(true);
      if (onGoalComplete) onGoalComplete();
      
      // Hide celebration after 3 seconds
      setTimeout(() => {
        setShowCelebration(false);
      }, 3000);
    }
  };

  // Calculate progress percentage
  const progressPercentage = Math.min((completedCount / dailyGoal) * 100, 100);

  useEffect(() => {
    loadDailyData();

    // Set up an interval to check for day changes
    const checkDayChange = () => {
      const todayKey = getTodayKey();
      const savedData = localStorage.getItem(todayKey);
      
      if (savedData) {
        const { date } = JSON.parse(savedData);
        const savedDate = new Date(date);
        const now = new Date();
        
        // If it's a new day, reset everything
        if (savedDate.toDateString() !== now.toDateString()) {
          setDailyGoal(4);
          setCompletedCount(0);
          setIsGoalMet(false);
          saveDailyData(4, 0);
        }
      }
    };

    // Calculate time until next midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeUntilMidnight = tomorrow - now;

    // Set up initial timeout to trigger at midnight
    const midnightTimeout = setTimeout(() => {
      checkDayChange();
      // After first midnight, check every 60 seconds
      const interval = setInterval(checkDayChange, 60000);
      return () => clearInterval(interval);
    }, timeUntilMidnight);

    // Check every minute for day changes
    const interval = setInterval(checkDayChange, 60000);

    // Cleanup
    return () => {
      clearTimeout(midnightTimeout);
      clearInterval(interval);
    };
  }, []);

  // Expose incrementCompleted to parent component
  useEffect(() => {
    if (window.incrementPomodoroCompleted) {
      window.incrementPomodoroCompleted = incrementCompleted;
    } else {
      window.incrementPomodoroCompleted = incrementCompleted;
    }
  }, [completedCount, dailyGoal, isGoalMet]);

  return (
    <div className="daily-goal">
      <h3>Daily Focus Goal</h3>
      
      <div className="goal-input-section">
        <label htmlFor="goal-input">Target Pomodoros:</label>
        <select 
          id="goal-input"
          value={dailyGoal} 
          onChange={(e) => updateGoal(parseInt(e.target.value))}
          className="goal-select"
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={8}>8</option>
          <option value={10}>10</option>
        </select>
      </div>

      <div className="progress-section">
        <div className="progress-text">
          {isGoalMet && <FaCheckCircle className="goal-check" />}
          {completedCount} / {dailyGoal} Pomodoros complete
        </div>
        
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {showCelebration && (
        <div className="celebration">
          <FaTrophy className="celebration-icon" />
          <span>Congratulations! You've reached your daily goal!</span>
          <FaTrophy className="celebration-icon" />
        </div>
      )}
    </div>
  );
};

export default DailyGoal; 