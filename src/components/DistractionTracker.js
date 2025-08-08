import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaHistory, FaTimes } from 'react-icons/fa';
import './DistractionTracker.css';

const DistractionTracker = ({ isVisible, onClose }) => {
  const [distractions, setDistractions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [newDistraction, setNewDistraction] = useState('');

  // Load distractions from localStorage
  useEffect(() => {
    const savedDistractions = localStorage.getItem('focus-booster-distractions');
    if (savedDistractions) {
      setDistractions(JSON.parse(savedDistractions));
    }

    const savedShowHistory = localStorage.getItem('focus-booster-distractions-show-history');
    if (savedShowHistory !== null) {
      setShowHistory(savedShowHistory === 'true');
    }
  }, []);

  // Save distractions to localStorage
  useEffect(() => {
    localStorage.setItem('focus-booster-distractions', JSON.stringify(distractions));
  }, [distractions]);

  // Persist history visibility preference
  useEffect(() => {
    localStorage.setItem('focus-booster-distractions-show-history', String(showHistory));
  }, [showHistory]);

  const handleLogDistraction = () => {
    if (newDistraction.trim()) {
      const distraction = {
        id: Date.now(),
        text: newDistraction.trim(),
        timestamp: new Date().toISOString(),
        date: new Date().toDateString()
      };
      
      setDistractions(prev => [distraction, ...prev]);
      setNewDistraction('');
    }
  };

  const handleQuickLog = (reason) => {
    const distraction = {
      id: Date.now(),
      text: reason,
      timestamp: new Date().toISOString(),
      date: new Date().toDateString()
    };
    
    setDistractions(prev => [distraction, ...prev]);
  };

  const deleteDistraction = (id) => {
    setDistractions(prev => prev.filter(d => d.id !== id));
  };

  const toggleHistory = () => {
    setShowHistory(prev => !prev);
  };

  const getTodayDistractions = () => {
    const today = new Date().toDateString();
    return distractions.filter(d => d.date === today);
  };

  const getDistractionStats = () => {
    const today = new Date().toDateString();
    const todayDistractions = distractions.filter(d => d.date === today);
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const weekDistractions = distractions.filter(d => new Date(d.timestamp) > thisWeek);
    
    return {
      today: todayDistractions.length,
      thisWeek: weekDistractions.length,
      total: distractions.length
    };
  };

  const quickReasons = [
    'Phone notification',
    'Social media',
    'Email',
    'Hunger/thirst',
    'Bathroom break',
    'Someone interrupted',
    'Noise',
    'Tiredness',
    'Other'
  ];

  const stats = getDistractionStats();

  if (!isVisible) return null;

  return (
    <div className="distraction-overlay">
      <div className="distraction-modal">
        <div className="distraction-header">
          <h2>Distraction Tracker</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="distraction-stats">
          <div className="stat-item">
            <span className="stat-label">Today</span>
            <span className="stat-value">{stats.today}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">This Week</span>
            <span className="stat-value">{stats.thisWeek}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </div>

        <div className="distraction-input-section">
          <h3>Log New Distraction</h3>
          <div className="input-group">
            <input
              type="text"
              className="distraction-input"
              placeholder="What distracted you?"
              value={newDistraction}
              onChange={(e) => setNewDistraction(e.target.value)}
            />
            <button className="btn btn-log" onClick={handleLogDistraction}>Log</button>
          </div>
          <div className="quick-reasons">
            <h4>Quick Log</h4>
            <div className="reasons-grid">
              {quickReasons.map((reason, index) => (
                <button
                  key={index}
                  className="btn btn-quick-reason"
                  onClick={() => handleQuickLog(reason)}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="distraction-history">
          <div className="history-header">
            <h3>Recent Distractions</h3>
            <button 
              onClick={toggleHistory}
              className="btn btn-toggle-history"
            >
              <FaHistory />
              <span>{showHistory ? 'Hide' : 'Show'} History</span>
            </button>
          </div>

          {showHistory && (
            <div className="history-list">
              {distractions.length === 0 ? (
                <p className="no-distractions">No distractions logged yet.</p>
              ) : (
                distractions.slice(0, 20).map((distraction) => (
                  <div key={distraction.id} className="distraction-item">
                    <div className="distraction-content">
                      <span className="distraction-text">{distraction.text}</span>
                      <span className="distraction-time">
                        {new Date(distraction.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <button 
                      onClick={() => deleteDistraction(distraction.id)}
                      className="btn btn-delete-distraction"
                      title="Delete"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DistractionTracker; 