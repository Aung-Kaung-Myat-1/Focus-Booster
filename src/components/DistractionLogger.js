import React, { useState } from 'react';
import './DistractionLogger.css';

const DistractionLogger = ({ showDistractionPrompt, onDistractionSubmit, onClose }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const commonReasons = [
    'Phone notification',
    'Social media',
    'Email',
    'Hunger/thirst',
    'Bathroom break',
    'Someone interrupted',
    'Lost focus',
    'Tired/bored',
    'Other'
  ];

  const handleReasonSelect = (reason) => {
    setSelectedReason(reason);
    if (reason !== 'Other') {
      setCustomReason('');
    }
  };

  const handleSubmit = () => {
    const finalReason = selectedReason === 'Other' ? customReason : selectedReason;
    if (finalReason.trim()) {
      const distractionData = {
        reason: finalReason,
        timestamp: new Date().toISOString(),
        date: new Date().toDateString()
      };
      onDistractionSubmit(distractionData);
      setSelectedReason('');
      setCustomReason('');
    }
  };

  if (!showDistractionPrompt) return null;

  return (
    <div className="distraction-overlay">
      <div className="distraction-modal">
        <h3>What distracted you?</h3>
        <p className="distraction-subtitle">Help us understand your focus patterns</p>
        
        <div className="reason-options">
          {commonReasons.map((reason) => (
            <button
              key={reason}
              className={`reason-option ${selectedReason === reason ? 'selected' : ''}`}
              onClick={() => handleReasonSelect(reason)}
            >
              {reason}
            </button>
          ))}
        </div>

        {selectedReason === 'Other' && (
          <div className="custom-reason">
            <label htmlFor="custom-reason">Please specify:</label>
            <input
              id="custom-reason"
              type="text"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Enter your distraction reason..."
              className="custom-reason-input"
            />
          </div>
        )}

        <div className="distraction-actions">
          <button 
            onClick={handleSubmit} 
            className="btn btn-submit" 
            disabled={!selectedReason || (selectedReason === 'Other' && !customReason.trim())}
          >
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

export default DistractionLogger; 