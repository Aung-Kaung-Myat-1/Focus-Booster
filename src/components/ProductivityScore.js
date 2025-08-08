import React, { useState, useEffect } from 'react';
import { FaStar, FaTrophy, FaChartLine, FaCrown, FaMedal } from 'react-icons/fa';
import LevelUpModal from './LevelUpModal';
import './ProductivityScore.css';

const ProductivityScore = () => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [totalExperience, setTotalExperience] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showLevelProgression, setShowLevelProgression] = useState(false);
  const [levelUpLevel, setLevelUpLevel] = useState(1);
  const [scoreBreakdown, setScoreBreakdown] = useState({
    pomodoros: 0,
    tasks: 0,
    distractions: 0,
    focusTime: 0
  });

  useEffect(() => {
    loadPersistentData();
    calculateProductivityScore();
  }, []);

  // Recalculate score in real time when data changes
  useEffect(() => {
    const interval = setInterval(() => {
      calculateProductivityScore();
    }, 1000); // Check every 1 second for faster updates

    return () => clearInterval(interval);
  }, [experience, totalExperience, level, totalPoints]);

  const loadPersistentData = () => {
    // Load persistent level and experience data
    const savedLevel = localStorage.getItem('focus-booster-level');
    const savedExperience = localStorage.getItem('focus-booster-experience');
    const savedTotalExperience = localStorage.getItem('focus-booster-total-experience');
    const savedTotalPoints = localStorage.getItem('focus-booster-total-points');
    
    if (savedLevel) setLevel(parseInt(savedLevel));
    if (savedExperience) setExperience(parseInt(savedExperience));
    if (savedTotalExperience) setTotalExperience(parseInt(savedTotalExperience));
    if (savedTotalPoints) setTotalPoints(parseInt(savedTotalPoints));
  };

  const savePersistentData = (newLevel, newExperience, newTotalExperience, newTotalPoints) => {
    localStorage.setItem('focus-booster-level', newLevel.toString());
    localStorage.setItem('focus-booster-experience', newExperience.toString());
    localStorage.setItem('focus-booster-total-experience', newTotalExperience.toString());
    if (typeof newTotalPoints === 'number') {
      localStorage.setItem('focus-booster-total-points', newTotalPoints.toString());
    }
  };

  const calculateProductivityScore = () => {
    const today = new Date().toDateString();
    
    // Get today's Pomodoros
    const savedData = localStorage.getItem(`focus-goal-${today}`);
    const pomodoros = savedData ? JSON.parse(savedData).count : 0;
    
    // Get completed tasks from TODAY only
    const savedTasks = localStorage.getItem('focus-booster-tasks');
    const tasks = savedTasks ? 
      JSON.parse(savedTasks).filter(t => 
        t.completed && 
        t.completedAt && 
        new Date(t.completedAt).toDateString() === today
      ).length : 0;
    
    // Get distractions
    const savedDistractions = localStorage.getItem('focus-booster-distractions');
    const distractions = savedDistractions ? 
      JSON.parse(savedDistractions).filter(d => d.date === today).length : 0;
    
    // Calculate focus time (Pomodoros * 25 minutes)
    const focusTime = pomodoros * 25;
    
    // Calculate score components
    const pomodoroScore = Math.min(pomodoros * 20, 100); // Max 100 points for Pomodoros
    const taskScore = Math.min(tasks * 5, 50); // 5 points per task, cap 50
    const distractionPenalty = Math.max(distractions * -10, -50); // Max -50 penalty
    const focusTimeBonus = Math.min(focusTime / 6, 25); // Max 25 points for focus time
    
    const totalScore = Math.max(0, Math.min(100, pomodoroScore + taskScore + distractionPenalty + focusTimeBonus));
    setScore(Math.round(totalScore));

    // Compute incremental points for today to avoid double counting
    const awardedKey = `focus-booster-points-awarded-${today}`;
    const awardedTodayRaw = localStorage.getItem(awardedKey);
    const awardedToday = awardedTodayRaw ? parseInt(awardedTodayRaw) : 0;
    const deltaPoints = Math.max(0, Math.round(totalScore) - awardedToday);

    // Calculate experience gained from delta only
    const deltaExperience = deltaPoints; // 1 exp per point, not 0.5

    let newExperience = experience + deltaExperience;
    let newTotalExperience = totalExperience + deltaExperience;

    // Debug: if experience seems wrong, recalculate from total score
    if (experience === 0 && totalScore > 0) {
      const expectedExp = Math.round(totalScore);
      newExperience = expectedExp;
      newTotalExperience = totalExperience + expectedExp;
    }

    // Level up logic (cap at 10)
    let newLevel = level;
    const experienceForNextLevel = level * 100;
    if (newExperience >= experienceForNextLevel) {
      newLevel = Math.min(level + 1, 10);
      const remainingExp = newExperience - experienceForNextLevel;
      newExperience = remainingExp;
      setExperience(remainingExp);
      setLevel(newLevel);
      setLevelUpLevel(newLevel);
      setShowLevelUp(true);
    } else {
      setExperience(newExperience);
    }

    setTotalExperience(newTotalExperience);

    // Persist cumulative points
    const updatedTotalPoints = totalPoints + deltaPoints;
    setTotalPoints(updatedTotalPoints);
    localStorage.setItem(awardedKey, Math.round(totalScore).toString());

    setScoreBreakdown({
      pomodoros,
      tasks,
      distractions,
      focusTime
    });
    
    // Save persistent data
    savePersistentData(newLevel, newExperience, newTotalExperience, updatedTotalPoints);
  };

  const getLevelTitle = (level) => {
    if (level >= 10) return 'Legendary Focus Master';
    if (level >= 9) return 'Elite Productivity Guru';
    if (level >= 8) return 'Advanced Focus Warrior';
    if (level >= 7) return 'Productivity Expert';
    if (level >= 6) return 'Focus Champion';
    if (level >= 5) return 'Productivity Pro';
    if (level >= 4) return 'Focus Enthusiast';
    if (level >= 3) return 'Productivity Builder';
    if (level >= 2) return 'Focus Beginner';
    return 'Productivity Novice';
  };

  const getLevelIcon = (level) => {
    if (level >= 10) return <FaCrown />;
    if (level >= 8) return <FaTrophy />;
    if (level >= 6) return <FaMedal />;
    if (level >= 4) return <FaStar />;
    return <FaChartLine />;
  };

  const getLevelColor = (level) => {
    if (level >= 10) return '#FFD700'; // Gold
    if (level >= 8) return '#C0C0C0'; // Silver
    if (level >= 6) return '#CD7F32'; // Bronze
    if (level >= 4) return '#4CAF50'; // Green
    return '#FF9800'; // Orange
  };

  const getProgressPercentage = () => {
    const experienceForNextLevel = level * 100;
    return Math.min((experience / experienceForNextLevel) * 100, 100);
  };

  const getExperiencePercentage = () => {
    const experienceForNextLevel = level * 100;
    return Math.min((experience / experienceForNextLevel) * 100, 100);
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Outstanding! You\'re a productivity master!';
    if (score >= 75) return 'Excellent work! Keep up the great focus!';
    if (score >= 60) return 'Good progress! You\'re building great habits!';
    if (score >= 40) return 'Getting started! Every Pomodoro counts!';
    return 'Don\'t worry! Focus on small wins today.';
  };

  const handleLevelUpClose = () => {
    setShowLevelUp(false);
  };

  return (
    <>
      <div className="productivity-score">
        <div className="score-header">
          <h3>Productivity Score</h3>
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="btn btn-toggle-details"
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </button>
        </div>

        <div className="score-display">
          <div className="score-circle-container">
            <div className="score-circle" style={{ '--progress': `${getProgressPercentage()}%` }}>
              <div className="score-value">{score}</div>
              <div className="score-label">/ 100</div>
            </div>
            <div className="level-badge" style={{ '--level-color': getLevelColor(level) }}>
              <span className="level-number">Lv.{level}</span>
            </div>
          </div>
          
          <div className="score-info">
            <div className="level-info">
              {getLevelIcon(level)}
              <span className="level-title">{getLevelTitle(level)}</span>
            </div>
            <div className="experience-bar">
              <div className="exp-label">Experience: {experience} / {level * 100}</div>
              <div className="exp-bar">
                <div 
                  className="exp-fill" 
                  style={{ width: `${getExperiencePercentage()}%` }}
                ></div>
              </div>
            </div>
            <p className="score-message">{getScoreMessage(score)}</p>
            <div className="total-exp">Total Experience: {totalExperience}</div>
          </div>
        </div>

        {showDetails && (
          <div className="score-breakdown">
            <h4>Score Breakdown</h4>
            <div className="breakdown-items">
              <div className="breakdown-item positive">
                <span className="breakdown-label">Pomodoros Completed</span>
                <span className="breakdown-value">+{scoreBreakdown.pomodoros * 20}</span>
              </div>
              <div className="breakdown-item positive">
                <span className="breakdown-label">Tasks Completed</span>
                <span className="breakdown-value">+{scoreBreakdown.tasks * 5}</span>
              </div>
              <div className="breakdown-item negative">
                <span className="breakdown-label">Distractions</span>
                <span className="breakdown-value">-{scoreBreakdown.distractions * 10}</span>
              </div>
              <div className="breakdown-item positive">
                <span className="breakdown-label">Focus Time Bonus</span>
                <span className="breakdown-value">+{Math.round(scoreBreakdown.focusTime / 6)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="score-actions">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="btn btn-toggle-details"
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </button>
          <button 
            onClick={() => setShowLevelProgression(true)}
            className="btn btn-level-progression"
          >
            View Level Progression
          </button>
        </div>

        <div className="score-tips">
          <h4>Tips to Improve</h4>
          <ul>
            <li>Complete more Pomodoros (20 points each)</li>
            <li>Finish your tasks (5 points each)</li>
            <li>Minimize distractions (-10 points each)</li>
            <li>Build consistent focus habits</li>
            <li>Level up by gaining experience!</li>
          </ul>
        </div>
      </div>

      <LevelUpModal 
        isOpen={showLevelUp}
        level={levelUpLevel}
        onClose={handleLevelUpClose}
      />

      {/* Level Progression Modal */}
      {showLevelProgression && (
        <div className="level-progression-overlay" onClick={() => setShowLevelProgression(false)}>
          <div className="level-progression-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Level Progression</h3>
              <button 
                className="modal-close"
                onClick={() => setShowLevelProgression(false)}
              >
                ×
              </button>
            </div>
            <div className="level-list">
              <div className={`level-item ${level >= 1 ? 'current' : ''}`}>
                <span className="level-number">Lv.1</span>
                <span className="level-name">Productivity Novice</span>
                <span className="level-exp">0-100 exp</span>
              </div>
              <div className={`level-item ${level >= 2 ? 'current' : ''}`}>
                <span className="level-number">Lv.2</span>
                <span className="level-name">Focus Beginner</span>
                <span className="level-exp">100-200 exp</span>
              </div>
              <div className={`level-item ${level >= 3 ? 'current' : ''}`}>
                <span className="level-number">Lv.3</span>
                <span className="level-name">Productivity Builder</span>
                <span className="level-exp">200-300 exp</span>
              </div>
              <div className={`level-item ${level >= 4 ? 'current' : ''}`}>
                <span className="level-number">Lv.4</span>
                <span className="level-name">Focus Enthusiast</span>
                <span className="level-exp">300-400 exp</span>
              </div>
              <div className={`level-item ${level >= 5 ? 'current' : ''}`}>
                <span className="level-number">Lv.5</span>
                <span className="level-name">Productivity Pro</span>
                <span className="level-exp">400-500 exp</span>
              </div>
              <div className={`level-item ${level >= 6 ? 'current' : ''}`}>
                <span className="level-number">Lv.6</span>
                <span className="level-name">Focus Champion</span>
                <span className="level-exp">500-600 exp</span>
              </div>
              <div className={`level-item ${level >= 7 ? 'current' : ''}`}>
                <span className="level-number">Lv.7</span>
                <span className="level-name">Productivity Expert</span>
                <span className="level-exp">600-700 exp</span>
              </div>
              <div className={`level-item ${level >= 8 ? 'current' : ''}`}>
                <span className="level-number">Lv.8</span>
                <span className="level-name">Advanced Focus Warrior</span>
                <span className="level-exp">700-800 exp</span>
              </div>
              <div className={`level-item ${level >= 9 ? 'current' : ''}`}>
                <span className="level-number">Lv.9</span>
                <span className="level-name">Elite Productivity Guru</span>
                <span className="level-exp">800-900 exp</span>
              </div>
              <div className={`level-item ${level >= 10 ? 'current' : ''}`}>
                <span className="level-number">Lv.10</span>
                <span className="level-name">Legendary Focus Master</span>
                <span className="level-exp">900-1000 exp</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductivityScore; 