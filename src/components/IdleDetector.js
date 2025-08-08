import React, { useState, useEffect, useRef } from 'react';
import { FaPause, FaPlay, FaClock } from 'react-icons/fa';
import './IdleDetector.css';

const IdleDetector = ({ isTimerRunning, onPause, onResume }) => {
  const [isIdle, setIsIdle] = useState(false);
  const [idleTime, setIdleTime] = useState(0);
  const [showIdleAlert, setShowIdleAlert] = useState(false);
  const idleTimeoutRef = useRef(null);
  const idleIntervalRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  const IDLE_THRESHOLD = 2 * 60 * 1000; // 2 minutes in milliseconds

  // Track user activity
  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
      if (isIdle) {
        setIsIdle(false);
        setIdleTime(0);
        setShowIdleAlert(false);
        if (idleIntervalRef.current) {
          clearInterval(idleIntervalRef.current);
        }
      }
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [isIdle]);

  // Check for idle state when timer is running
  useEffect(() => {
    if (isTimerRunning && !isIdle) {
      idleTimeoutRef.current = setTimeout(() => {
        setIsIdle(true);
        setShowIdleAlert(true);
        onPause();
        
        // Start counting idle time
        idleIntervalRef.current = setInterval(() => {
          setIdleTime(prev => prev + 1);
        }, 1000);
      }, IDLE_THRESHOLD);
    } else {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    }

    return () => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, [isTimerRunning, isIdle, onPause]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (idleIntervalRef.current) {
        clearInterval(idleIntervalRef.current);
      }
    };
  }, []);

  const handleResume = () => {
    setIsIdle(false);
    setIdleTime(0);
    setShowIdleAlert(false);
    onResume();
    if (idleIntervalRef.current) {
      clearInterval(idleIntervalRef.current);
    }
  };

  const formatIdleTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!showIdleAlert) return null;

  return (
    <div className="idle-overlay">
      <div className="idle-alert">
        <div className="idle-header">
          <FaClock className="idle-icon" />
          <h3>Timer Paused</h3>
        </div>
        
        <div className="idle-content">
          <p>You've been inactive for {formatIdleTime(idleTime)}</p>
          <p className="idle-subtitle">The timer has been paused to help you stay focused.</p>
        </div>

        <div className="idle-actions">
          <button onClick={handleResume} className="btn btn-resume">
            <FaPlay />
            <span>Resume Timer</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdleDetector; 