import React, { useState, useEffect } from 'react';
import { FaWalking, FaPrayingHands, FaTint, FaLungs, FaEye, FaMusic } from 'react-icons/fa';
import './BreakRecommender.css';

const BreakRecommender = ({ pomodoroCount, recentMoods }) => {
  const [recommendation, setRecommendation] = useState(null);

  const breakActivities = {
    walk: {
      name: 'Take a Walk',
      icon: FaWalking,
      description: 'Get some fresh air and stretch your legs',
      duration: '5-10 minutes'
    },
    stretch: {
      name: 'Stretch & Move',
      icon: FaPrayingHands,
      description: 'Do some light stretching exercises',
      duration: '3-5 minutes'
    },
    water: {
      name: 'Hydrate',
      icon: FaTint,
      description: 'Drink water and stay hydrated',
      duration: '1-2 minutes'
    },
    breathe: {
      name: 'Deep Breathing',
      icon: FaLungs,
      description: 'Practice deep breathing exercises',
      duration: '2-3 minutes'
    },
    eyes: {
      name: 'Eye Rest',
      icon: FaEye,
      description: 'Look away from screen, focus on distant objects',
      duration: '2-3 minutes'
    },
    music: {
      name: 'Listen to Music',
      icon: FaMusic,
      description: 'Enjoy some relaxing music',
      duration: '5 minutes'
    }
  };

  const getRecommendation = () => {
    let suggestions = [];

    // Base recommendations on Pomodoro count
    if (pomodoroCount <= 2) {
      suggestions.push('water', 'breathe');
    } else if (pomodoroCount <= 4) {
      suggestions.push('stretch', 'eyes', 'water');
    } else {
      suggestions.push('walk', 'stretch', 'music');
    }

    // Consider recent moods
    if (recentMoods && recentMoods.length > 0) {
      const recentMood = recentMoods[recentMoods.length - 1];
      if (recentMood.mood.id === 'tired') {
        suggestions = ['walk', 'breathe', 'music'];
      } else if (recentMood.mood.id === 'happy') {
        suggestions.push('stretch', 'water');
      }
    }

    // Remove duplicates and pick random
    const uniqueSuggestions = [...new Set(suggestions)];
    const randomSuggestion = uniqueSuggestions[Math.floor(Math.random() * uniqueSuggestions.length)];
    
    return breakActivities[randomSuggestion] || breakActivities.water;
  };

  useEffect(() => {
    if (pomodoroCount > 0) {
      setRecommendation(getRecommendation());
    }
  }, [pomodoroCount, recentMoods]);

  if (!recommendation) return null;

  const IconComponent = recommendation.icon;

  return (
    <div className="break-recommender">
      <h3>Break Suggestion</h3>
      <div className="recommendation-card">
        <div className="recommendation-icon">
          <IconComponent />
        </div>
        <div className="recommendation-content">
          <h4>{recommendation.name}</h4>
          <p>{recommendation.description}</p>
          <span className="duration">{recommendation.duration}</span>
        </div>
      </div>
    </div>
  );
};

export default BreakRecommender; 