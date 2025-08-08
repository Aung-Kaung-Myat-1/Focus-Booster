import React, { useState, useEffect } from 'react';
import TimerSettings from './TimerSettings';
import './FocusTimer.css';

const FocusTimer = ({ 
  onPomodoroComplete, 
  onPomodoroInterrupt, 
  selectedTask, 
  selectedTag,
  settings = { focusTime: 25, shortBreak: 5, longBreak: 15, longBreakInterval: 4 },
  onTimerStateChange,
  onSettingsChange
}) => {
  const [timeLeft, setTimeLeft] = useState(settings.focusTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [sessionCount, setSessionCount] = useState(0);

  const WORK_TIME = settings.focusTime * 60;
  const BREAK_TIME = settings.shortBreak * 60;
  const LONG_BREAK_TIME = settings.longBreak * 60;
  const LONG_BREAK_INTERVAL = settings.longBreakInterval;

  useEffect(() => {
    setTimeLeft(WORK_TIME);
  }, [WORK_TIME]);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, WORK_TIME, BREAK_TIME]);

  useEffect(() => {
    if (onTimerStateChange) {
      onTimerStateChange(isRunning);
    }
  }, [isRunning, onTimerStateChange]);

  const handleSessionComplete = () => {
    if (isWorkSession) {
      // Work session completed
      window.incrementPomodoroCompleted();
      onPomodoroComplete();
      setSessionCount(prev => prev + 1);
      
      // Determine if it's time for a long break
      const shouldTakeLongBreak = (sessionCount + 1) % LONG_BREAK_INTERVAL === 0;
      const breakTime = shouldTakeLongBreak ? LONG_BREAK_TIME : BREAK_TIME;
      
      setTimeLeft(breakTime);
      setIsWorkSession(false);
      saveSessionToHistory(true);
    } else {
      // Break completed
      setTimeLeft(WORK_TIME);
      setIsWorkSession(true);
      saveSessionToHistory(false);
    }
    setIsRunning(false);
  };

  const saveSessionToHistory = (completed) => {
    const sessionData = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      task: selectedTask?.text || 'No task selected',
      tag: selectedTag || 'No tag',
      duration: isWorkSession ? settings.focusTime : settings.shortBreak,
      completed: completed,
      type: isWorkSession ? 'work' : 'break'
    };

    const existingSessions = JSON.parse(localStorage.getItem('focus-booster-sessions') || '[]');
    const updatedSessions = [sessionData, ...existingSessions];
    localStorage.setItem('focus-booster-sessions', JSON.stringify(updatedSessions));
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    if (isRunning && isWorkSession) {
      onPomodoroInterrupt();
    }
    setIsRunning(false);
    setTimeLeft(isWorkSession ? WORK_TIME : BREAK_TIME);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSettingsChange = (newSettings) => {
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
    // Reset timer with new settings
    setTimeLeft(newSettings.focusTime * 60);
    setIsRunning(false);
  };

  return (
    <div className="focus-timer">
      <div className="timer-header">
        <h2>{isWorkSession ? 'Focus Time' : 'Break Time'}</h2>
        <TimerSettings onSettingsChange={handleSettingsChange} />
      </div>
      
      <div className="timer-content">
        <div className="timer-main">
          {selectedTask && (
            <div className="current-task">
              <span className="task-label">Current Task:</span>
              <span className="task-text">{selectedTask.text}</span>
            </div>
          )}
          
          {selectedTag && (
            <div className="current-tag">
              <span className="tag-label">Session Tag:</span>
              <span className="tag-text">{selectedTag}</span>
            </div>
          )}

          <div className="timer-display">
            <div className="time">{formatTime(timeLeft)}</div>
            <div className="session-info">
              Session {sessionCount + 1} • {isWorkSession ? 'Work' : 'Break'}
            </div>
          </div>

          <div className="timer-controls">
            {!isRunning ? (
              <button onClick={startTimer} className="btn btn-start">
                Start
              </button>
            ) : (
              <button onClick={pauseTimer} className="btn btn-pause">
                Pause
              </button>
            )}
            <button onClick={resetTimer} className="btn btn-reset">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusTimer; 