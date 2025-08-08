import React, { useState, useEffect } from 'react';
import { FaCog, FaTimes } from 'react-icons/fa';
import './TimerSettings.css';

const TimerSettings = ({ onSettingsChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    focusTime: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4
  });
  const [tempSettings, setTempSettings] = useState({
    focusTime: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('focus-booster-timer-settings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      setTempSettings(parsedSettings);
    }
  }, []);

  const handleSettingChange = (key, value) => {
    setTempSettings(prev => ({
      ...prev,
      [key]: parseInt(value)
    }));
  };

  const handleSave = () => {
    setSettings(tempSettings);
    localStorage.setItem('focus-booster-timer-settings', JSON.stringify(tempSettings));
    if (onSettingsChange) {
      onSettingsChange(tempSettings);
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempSettings(settings); // Reset to original settings
    setIsOpen(false);
  };

  const handleClose = () => {
    handleCancel(); // Cancel changes when closing
  };

  return (
    <div className="timer-settings">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-settings-toggle"
        title="Timer Settings"
      >
        <FaCog />
      </button>

      {isOpen && (
        <div className="settings-modal">
          <div className="settings-content">
            <div className="settings-header">
              <h3>Timer Settings</h3>
              <button onClick={handleClose} className="close-btn">×</button>
            </div>
            
            <div className="setting-group">
              <label htmlFor="focus-time">Focus Duration (minutes)</label>
              <input
                id="focus-time"
                type="number"
                min="1"
                max="60"
                value={tempSettings.focusTime}
                onChange={(e) => handleSettingChange('focusTime', e.target.value)}
                className="setting-input"
              />
            </div>

            <div className="setting-group">
              <label htmlFor="short-break">Short Break (minutes)</label>
              <input
                id="short-break"
                type="number"
                min="1"
                max="30"
                value={tempSettings.shortBreak}
                onChange={(e) => handleSettingChange('shortBreak', e.target.value)}
                className="setting-input"
              />
            </div>

            <div className="setting-group">
              <label htmlFor="long-break">Long Break (minutes)</label>
              <input
                id="long-break"
                type="number"
                min="1"
                max="60"
                value={tempSettings.longBreak}
                onChange={(e) => handleSettingChange('longBreak', e.target.value)}
                className="setting-input"
              />
            </div>

            <div className="setting-group">
              <label htmlFor="long-break-interval">Long Break Interval (sessions)</label>
              <input
                id="long-break-interval"
                type="number"
                min="1"
                max="10"
                value={tempSettings.longBreakInterval}
                onChange={(e) => handleSettingChange('longBreakInterval', e.target.value)}
                className="setting-input"
              />
            </div>

            <div className="settings-actions">
              <button onClick={handleCancel} className="btn btn-cancel">
                Cancel
              </button>
              <button onClick={handleSave} className="btn btn-done">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimerSettings; 