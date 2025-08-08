import React, { useState, useEffect } from 'react';
import { FaCrown, FaTrophy, FaMedal, FaStar, FaChartLine, FaFire, FaRocket, FaGem } from 'react-icons/fa';
import './LevelUpModal.css';

const LevelUpModal = ({ isOpen, level, onClose }) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowAnimation(true);
      // Auto-close after 4 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      setShowAnimation(false);
    }
  }, [isOpen, onClose]);

  const getLevelTitle = (level) => {
    if (level >= 50) return 'Legendary Focus Master';
    if (level >= 40) return 'Elite Productivity Guru';
    if (level >= 30) return 'Advanced Focus Warrior';
    if (level >= 20) return 'Productivity Expert';
    if (level >= 15) return 'Focus Champion';
    if (level >= 10) return 'Productivity Pro';
    if (level >= 5) return 'Focus Enthusiast';
    if (level >= 3) return 'Productivity Builder';
    if (level >= 2) return 'Focus Beginner';
    return 'Productivity Novice';
  };

  const getLevelIcon = (level) => {
    if (level >= 50) return <FaCrown />;
    if (level >= 30) return <FaTrophy />;
    if (level >= 15) return <FaMedal />;
    if (level >= 5) return <FaStar />;
    return <FaChartLine />;
  };

  const getLevelColor = (level) => {
    if (level >= 50) return '#FFD700'; // Gold
    if (level >= 30) return '#C0C0C0'; // Silver
    if (level >= 15) return '#CD7F32'; // Bronze
    if (level >= 5) return '#4CAF50'; // Green
    return '#FF9800'; // Orange
  };

  const getLevelMessage = (level) => {
    if (level >= 50) return 'You have achieved legendary status! Your focus is unmatched!';
    if (level >= 40) return 'Elite level reached! You are a productivity master!';
    if (level >= 30) return 'Advanced warrior! Your focus skills are exceptional!';
    if (level >= 20) return 'Expert level! You are a productivity specialist!';
    if (level >= 15) return 'Champion! Your focus habits are outstanding!';
    if (level >= 10) return 'Pro level! You are a productivity professional!';
    if (level >= 5) return 'Enthusiast! Your focus journey is gaining momentum!';
    if (level >= 3) return 'Builder! You are constructing great habits!';
    if (level >= 2) return 'Beginner! Your focus journey has begun!';
    return 'Welcome to your productivity journey!';
  };

  const getLevelReward = (level) => {
    if (level >= 50) return 'Legendary Focus Powers Unlocked!';
    if (level >= 30) return 'Advanced Focus Techniques Available!';
    if (level >= 15) return 'Champion Focus Skills Unlocked!';
    if (level >= 5) return 'Enhanced Focus Abilities Available!';
    return 'Basic Focus Skills Unlocked!';
  };

  const getParticleIcon = (level) => {
    if (level >= 50) return <FaGem />;
    if (level >= 30) return <FaCrown />;
    if (level >= 15) return <FaTrophy />;
    if (level >= 5) return <FaStar />;
    return <FaFire />;
  };

  if (!isOpen) return null;

  return (
    <div className="level-up-overlay">
      <div className={`level-up-modal ${showAnimation ? 'show' : ''}`}>
        <div className="level-up-content">
          {/* Background particles */}
          <div className="particles">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="particle"
                style={{
                  '--delay': `${i * 0.1}s`,
                  '--position': `${Math.random() * 100}%`
                }}
              >
                {getParticleIcon(level)}
              </div>
            ))}
          </div>

          {/* Main celebration content */}
          <div className="celebration-header">
            <div className="level-badge-large" style={{ '--level-color': getLevelColor(level) }}>
              <div className="level-icon-large">
                {getLevelIcon(level)}
              </div>
              <div className="level-number-large">LEVEL {level}</div>
            </div>
          </div>

          <div className="celebration-body">
            <h1 className="level-title">{getLevelTitle(level)}</h1>
            <p className="level-message">{getLevelMessage(level)}</p>
            <div className="level-reward">
              <FaRocket className="reward-icon" />
              <span>{getLevelReward(level)}</span>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="level-progress">
            <div className="progress-text">Next Level: {level + 1}</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '0%' }}></div>
            </div>
            <div className="progress-requirement">
              Requires: {(level + 1) * 100} Experience Points
            </div>
          </div>

          {/* Close button */}
          <button onClick={onClose} className="btn-close-celebration">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelUpModal; 