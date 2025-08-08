import React, { useState, useEffect } from 'react';
import { FaBullseye, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import './SessionIntent.css';

const SessionIntent = ({ selectedTask, onIntentChange }) => {
  const [intent, setIntent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempIntent, setTempIntent] = useState('');

  // Load intent from localStorage
  useEffect(() => {
    const savedIntent = localStorage.getItem('focus-booster-session-intent');
    if (savedIntent) {
      setIntent(savedIntent);
    }
  }, []);

  // Auto-save intent to localStorage
  useEffect(() => {
    if (intent) {
      localStorage.setItem('focus-booster-session-intent', intent);
      if (onIntentChange) {
        onIntentChange(intent);
      }
    }
  }, [intent, onIntentChange]);

  const handleStartEdit = () => {
    setTempIntent(intent);
    setIsEditing(true);
  };

  const handleSave = () => {
    setIntent(tempIntent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempIntent(intent);
    setIsEditing(false);
  };

  const handleClear = () => {
    setIntent('');
    localStorage.removeItem('focus-booster-session-intent');
    if (onIntentChange) {
      onIntentChange('');
    }
  };

  const getSuggestedIntent = () => {
    if (selectedTask) {
      return `Complete: ${selectedTask.text}`;
    }
    return '';
  };

  if (isEditing) {
    return (
      <div className="session-intent">
        <div className="intent-header">
          <h3>Session Intent</h3>
          <div className="intent-actions">
            <button onClick={handleSave} className="btn btn-save-intent" title="Save">
              <FaSave />
            </button>
            <button onClick={handleCancel} className="btn btn-cancel-intent" title="Cancel">
              <FaTimes />
            </button>
          </div>
        </div>
        
        <div className="intent-content">
          <div className="intent-question">What will you accomplish in this session?</div>
          
          <textarea
            value={tempIntent}
            onChange={(e) => setTempIntent(e.target.value)}
            placeholder="I will focus on..."
            className="intent-textarea"
            rows="3"
          />
          
          {selectedTask && (
            <button 
              onClick={() => setTempIntent(getSuggestedIntent())}
              className="btn btn-suggest-intent"
            >
              Use selected task: "{selectedTask.text}"
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="session-intent">
      <div className="intent-header">
        <h3>Session Intent</h3>
        <div className="intent-actions">
          <button onClick={handleStartEdit} className="btn btn-edit-intent" title="Edit">
            <FaEdit />
          </button>
          {intent && (
            <button onClick={handleClear} className="btn btn-clear-intent" title="Clear">
              <FaTimes />
            </button>
          )}
        </div>
      </div>
      
      <div className="intent-content">
        {intent ? (
          <div className="intent-display">
            <div className="intent-icon">
              <FaBullseye />
            </div>
            <div className="intent-text">{intent}</div>
          </div>
        ) : (
          <div className="intent-empty">
            <div className="intent-icon">
              <FaBullseye />
            </div>
            <div className="intent-text">
              <div className="intent-question">What will you accomplish in this session?</div>
              <button onClick={handleStartEdit} className="btn btn-set-intent">
                Set Intent
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionIntent; 