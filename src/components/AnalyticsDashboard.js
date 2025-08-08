import React, { useState, useEffect } from 'react';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = ({ isVisible, onClose }) => {
  const [analytics, setAnalytics] = useState({
    dailyTotals: [],
    bestDay: null,
    averagePerDay: 0,
    totalPomodoros: 0
  });

  // Get Pomodoro data from localStorage for last 7 days
  const loadAnalytics = () => {
    const today = new Date();
    const dailyTotals = [];
    let totalPomodoros = 0;

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = `focus-goal-${date.toDateString()}`;
      const savedData = localStorage.getItem(dateKey);
      
      let dayTotal = 0;
      if (savedData) {
        const { count } = JSON.parse(savedData);
        dayTotal = count;
        totalPomodoros += count;
      }
      
      dailyTotals.push({
        date: date.toDateString(),
        total: dayTotal,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' })
      });
    }

    const bestDay = dailyTotals.reduce((best, current) => 
      current.total > best.total ? current : best
    );
    
    const averagePerDay = totalPomodoros / 7;

    setAnalytics({
      dailyTotals,
      bestDay,
      averagePerDay: Math.round(averagePerDay * 10) / 10,
      totalPomodoros
    });
  };

  useEffect(() => {
    if (isVisible) {
      loadAnalytics();
    }
  }, [isVisible]);

  const getMaxValue = () => {
    return Math.max(...analytics.dailyTotals.map(day => day.total), 1);
  };

  if (!isVisible) return null;

  return (
    <div className="analytics-overlay">
      <div className="analytics-modal">
        <div className="analytics-header">
          <h2>Focus Analytics</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="analytics-summary">
          <div className="summary-card">
            <h3>Total Pomodoros</h3>
            <div className="summary-value">{analytics.totalPomodoros}</div>
          </div>
          <div className="summary-card">
            <h3>Best Day</h3>
            <div className="summary-value">{analytics.bestDay?.total || 0}</div>
            <div className="summary-label">{analytics.bestDay?.dayName || 'N/A'}</div>
          </div>
          <div className="summary-card">
            <h3>Daily Average</h3>
            <div className="summary-value">{analytics.averagePerDay}</div>
          </div>
        </div>

        <div className="chart-section">
          <h3>Last 7 Days</h3>
          <div className="chart-container">
            {analytics.dailyTotals.map((day, index) => {
              const maxValue = getMaxValue();
              const height = (day.total / maxValue) * 100;
              
              return (
                <div key={index} className="chart-bar">
                  <div 
                    className="bar-fill"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="bar-label">{day.dayName}</div>
                  <div className="bar-value">{day.total}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="analytics-insights">
          <h3>Insights</h3>
          <ul>
            <li>You completed {analytics.totalPomodoros} Pomodoros this week</li>
            <li>Your most productive day was {analytics.bestDay?.dayName} with {analytics.bestDay?.total} Pomodoros</li>
            <li>You average {analytics.averagePerDay} Pomodoros per day</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 