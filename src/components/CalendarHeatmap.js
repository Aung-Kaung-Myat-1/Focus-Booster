import React, { useState, useEffect } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import './CalendarHeatmap.css';

const CalendarHeatmap = ({ isVisible, onClose }) => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // Generate calendar data for the selected month
  useEffect(() => {
    if (isVisible) {
      generateHeatmapData();
    }
  }, [isVisible, selectedMonth]);

  // Refresh data when localStorage changes (for real-time updates)
  useEffect(() => {
    if (isVisible) {
      const handleStorageChange = () => {
        generateHeatmapData();
      };

      // Listen for localStorage changes from other tabs/windows
      window.addEventListener('storage', handleStorageChange);
      
      // Also refresh every 5 seconds to catch updates from same tab
      const interval = setInterval(generateHeatmapData, 5000);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        clearInterval(interval);
      };
    }
  }, [isVisible]);

  const generateHeatmapData = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const data = [];
    let dayCount = 1;
    
    // Generate 6 weeks (42 days) to ensure we cover the entire month
    for (let week = 0; week < 6; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        if (week === 0 && day < firstDayOfMonth) {
          weekData.push(null); // Empty cell
        } else if (dayCount > daysInMonth) {
          weekData.push(null); // Empty cell
        } else {
          const date = new Date(year, month, dayCount);
          const dateString = date.toDateString();
          const pomodoroCount = getPomodoroCountForDate(dateString);
          weekData.push({
            date: dateString,
            day: dayCount,
            count: pomodoroCount
          });
          // Debug: Log today's data
          if (dateString === new Date().toDateString() && pomodoroCount > 0) {
            console.log(`Calendar Debug: Found ${pomodoroCount} Pomodoros for today (${dateString})`);
          }
          dayCount++;
        }
      }
      data.push(weekData);
    }
    
    setHeatmapData(data);
  };

  const getPomodoroCountForDate = (dateString) => {
    try {
      const savedData = localStorage.getItem(`focus-goal-${dateString}`);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // Handle both old and new data formats
        const count = parsed.count || 0;
        return count;
      }
    } catch (error) {
      console.error('Error parsing Pomodoro data for date:', dateString, error);
    }
    return 0;
  };

  const getColorIntensity = (count) => {
    if (count === 0) return 'no-activity';
    if (count <= 2) return 'low-activity';
    if (count <= 4) return 'medium-activity';
    if (count <= 6) return 'high-activity';
    return 'very-high-activity';
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const changeMonth = (direction) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedMonth(newDate);
  };

  const getMonthTotal = () => {
    return heatmapData.flat()
      .filter(day => day !== null)
      .reduce((total, day) => total + day.count, 0);
  };

  const getActiveDays = () => {
    return heatmapData.flat()
      .filter(day => day !== null && day.count > 0)
      .length;
  };

  const getTodayCount = () => {
    const todayString = new Date().toDateString();
    return getPomodoroCountForDate(todayString);
  };

  if (!isVisible) return null;

  return (
    <div className="heatmap-overlay">
      <div className="heatmap-modal">
        <div className="heatmap-header">
          <h2>Pomodoro Calendar</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="month-navigation">
          <button onClick={() => changeMonth(-1)} className="btn btn-nav">
            ‹
          </button>
          <h3>{formatMonthYear(selectedMonth)}</h3>
          <button onClick={() => changeMonth(1)} className="btn btn-nav">
            ›
          </button>
        </div>

        <div className="calendar-container">
          <div className="weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>

          <div className="calendar-grid">
            {heatmapData.map((week, weekIndex) => (
              <div key={weekIndex} className="calendar-week">
                {week.map((day, dayIndex) => (
                  <div 
                    key={dayIndex} 
                    className={`calendar-day ${day ? getColorIntensity(day.count) : 'empty'}`}
                    title={day ? `${day.count} Pomodoros on ${new Date(day.date).toLocaleDateString()}` : ''}
                  >
                    {day ? day.day : ''}
                    {day && day.count > 0 && (
                      <span className="pomodoro-count">{day.count}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="calendar-stats">
          <div className="stat-section">
            <h4>This Month's Activity</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{getMonthTotal()}</span>
                <span className="stat-label">Total Pomodoros</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{getActiveDays()}</span>
                <span className="stat-label">Active Days</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{getTodayCount()}</span>
                <span className="stat-label">Today</span>
              </div>
            </div>
          </div>
        </div>

        <div className="heatmap-legend">
          <div className="legend-item">
            <div className="legend-color no-activity"></div>
            <span>0 Pomodoros</span>
          </div>
          <div className="legend-item">
            <div className="legend-color low-activity"></div>
            <span>1-2 Pomodoros</span>
          </div>
          <div className="legend-item">
            <div className="legend-color medium-activity"></div>
            <span>3-4 Pomodoros</span>
          </div>
          <div className="legend-item">
            <div className="legend-color high-activity"></div>
            <span>5-6 Pomodoros</span>
          </div>
          <div className="legend-item">
            <div className="legend-color very-high-activity"></div>
            <span>7+ Pomodoros</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeatmap; 