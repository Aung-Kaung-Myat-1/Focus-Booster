import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import './DailySummary.css';

const DailySummary = ({ isVisible, onClose }) => {
  const [summary, setSummary] = useState({
    totalSessions: 0,
    totalFocusTime: 0,
    completedTasks: 0,
    totalTasks: 0,
    sessionTags: {},
    sessionHistory: []
  });

  // Load Pomodoro data from localStorage for last 7 days
  const loadDailyData = () => {
    const today = new Date().toDateString();
    
    // Load Pomodoro sessions
    const pomodoroData = localStorage.getItem(`focus-goal-${today}`);
    let totalSessions = 0;
    if (pomodoroData) {
      const { count } = JSON.parse(pomodoroData);
      totalSessions = count;
    }

    // Load tasks
    const tasksData = localStorage.getItem('focus-booster-tasks');
    let completedTasks = 0;
    let totalTasks = 0;
    if (tasksData) {
      const tasks = JSON.parse(tasksData);
      totalTasks = tasks.length;
      completedTasks = tasks.filter(task => task.completed).length;
    }

    // Load session history
    const sessionHistoryData = localStorage.getItem('focus-booster-sessions');
    let sessionHistory = [];
    let sessionTags = {};
    if (sessionHistoryData) {
      sessionHistory = JSON.parse(sessionHistoryData);
      // Filter for today's sessions
      sessionHistory = sessionHistory.filter(session => 
        new Date(session.timestamp).toDateString() === today
      );
      
      // Count tags
      sessionHistory.forEach(session => {
        if (session.tag) {
          sessionTags[session.tag] = (sessionTags[session.tag] || 0) + 1;
        }
      });
    }

    const totalFocusTime = totalSessions * 25; // 25 minutes per session

    setSummary({
      totalSessions,
      totalFocusTime,
      completedTasks,
      totalTasks,
      sessionTags,
      sessionHistory
    });
  };

  useEffect(() => {
    if (isVisible) {
      loadDailyData();
    }
  }, [isVisible]);

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getTagChartData = () => {
    const tags = Object.entries(summary.sessionTags);
    if (tags.length === 0) return [];
    
    const total = tags.reduce((sum, [_, count]) => sum + count, 0);
    return tags.map(([tag, count]) => ({
      tag,
      count,
      percentage: Math.round((count / total) * 100)
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="summary-overlay">
      <div className="summary-modal">
        <div className="summary-header">
          <h2>Daily Summary</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="summary-stats">
          <div className="stat-card">
            <h3>Pomodoro Sessions</h3>
            <div className="stat-value">{summary.totalSessions}</div>
            <div className="stat-label">sessions completed</div>
          </div>
          
          <div className="stat-card">
            <h3>Focus Time</h3>
            <div className="stat-value">{formatTime(summary.totalFocusTime)}</div>
            <div className="stat-label">total focus time</div>
          </div>
          
          <div className="stat-card">
            <h3>Tasks Completed</h3>
            <div className="stat-value">{summary.completedTasks}</div>
            <div className="stat-label">of {summary.totalTasks} tasks</div>
          </div>
        </div>

        {Object.keys(summary.sessionTags).length > 0 && (
          <div className="tag-summary">
            <h3>Session Tags</h3>
            <div className="tag-chart">
              {getTagChartData().map(({ tag, count, percentage }) => (
                <div key={tag} className="tag-bar">
                  <div className="tag-info">
                    <span className="tag-name">{tag}</span>
                    <span className="tag-count">{count} sessions</span>
                  </div>
                  <div className="tag-progress">
                    <div 
                      className="tag-progress-fill"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="tag-percentage">{percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="session-history">
          <h3>Today's Sessions</h3>
          <div className="history-list">
            {summary.sessionHistory.length === 0 ? (
              <p className="no-sessions">No sessions recorded today</p>
            ) : (
              summary.sessionHistory.map((session, index) => (
                <div key={index} className="history-item">
                  <div className="history-time">
                    {new Date(session.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                  <div className="history-details">
                    <span className="history-task">
                      {session.task ? session.task.text : 'No task'}
                    </span>
                    {session.tag && (
                      <span className="history-tag">{session.tag}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailySummary; 