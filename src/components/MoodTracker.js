import React, { useState, useEffect } from 'react';
import { FaSmile, FaMeh, FaFrown } from 'react-icons/fa';
import './MoodTracker.css';

const MoodTracker = ({ showMoodPrompt, onMoodSubmit, onClose }) => {
  const [selectedMood, setSelectedMood] = useState(null);

  const moods = [
    { id: 'happy', icon: FaSmile, label: 'Happy', color: '#606941' },
    { id: 'neutral', icon: FaMeh, label: 'Neutral', color: '#724817' },
    { id: 'tired', icon: FaFrown, label: 'Tired', color: '#66382A' }
  ];

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  const handleSubmit = () => {
    if (selectedMood) {
      const moodData = {
        mood: selectedMood,
        timestamp: new Date().toISOString(),
        date: new Date().toDateString()
      };
      onMoodSubmit(moodData);
      setSelectedMood(null);
    }
  };

  if (!showMoodPrompt) return null;

  return (
    <div className="mood-overlay">
      <div className="mood-modal">
        <h3>How do you feel?</h3>
        <div className="mood-options">
          {moods.map((mood) => {
            const IconComponent = mood.icon;
            return (
              <button
                key={mood.id}
                className={`mood-option ${selectedMood?.id === mood.id ? 'selected' : ''}`}
                onClick={() => handleMoodSelect(mood)}
                style={{ '--mood-color': mood.color }}
              >
                <IconComponent className="mood-icon" />
                <span className="mood-label">{mood.label}</span>
              </button>
            );
          })}
        </div>
        <div className="mood-actions">
          <button onClick={handleSubmit} className="btn btn-submit" disabled={!selectedMood}>
            Submit
          </button>
          <button onClick={onClose} className="btn btn-skip">
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker; 