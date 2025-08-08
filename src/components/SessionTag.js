import React, { useState } from 'react';
import './SessionTag.css';

const SessionTag = ({ onTagSelect, selectedTag }) => {
  const [customTag, setCustomTag] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const commonTags = [
    'Work',
    'Study',
    'Reading',
    'Writing',
    'Coding',
    'Exercise',
    'Cleaning',
    'Planning',
    'Learning',
    'Creative'
  ];

  const handleTagSelect = (tag) => {
    if (tag === 'Custom') {
      setShowCustomInput(true);
    } else {
      onTagSelect(tag);
      setShowCustomInput(false);
      setCustomTag('');
    }
  };

  const handleCustomTagSubmit = () => {
    if (customTag.trim()) {
      onTagSelect(customTag.trim());
      setCustomTag('');
      setShowCustomInput(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCustomTagSubmit();
    }
  };

  return (
    <div className="session-tag">
      <h3>Session Tag</h3>
      <p className="tag-subtitle">What are you focusing on?</p>
      
      <div className="tag-options">
        {commonTags.map((tag) => (
          <button
            key={tag}
            className={`tag-option ${selectedTag === tag ? 'selected' : ''}`}
            onClick={() => handleTagSelect(tag)}
          >
            {tag}
          </button>
        ))}
        <button
          className={`tag-option ${showCustomInput ? 'selected' : ''}`}
          onClick={() => handleTagSelect('Custom')}
        >
          Custom
        </button>
      </div>

      {showCustomInput && (
        <div className="custom-tag-input">
          <input
            type="text"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter custom tag..."
            className="custom-tag-field"
            autoFocus
          />
          <button onClick={handleCustomTagSubmit} className="btn btn-submit-tag">
            Add
          </button>
        </div>
      )}

      {selectedTag && !showCustomInput && (
        <div className="selected-tag-display">
          <span className="selected-tag-label">Selected:</span>
          <span className="selected-tag">{selectedTag}</span>
        </div>
      )}
    </div>
  );
};

export default SessionTag; 