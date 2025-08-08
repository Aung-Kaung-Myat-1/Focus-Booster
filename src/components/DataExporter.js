import React, { useState } from 'react';
import { FaDownload, FaFileAlt, FaFileCsv } from 'react-icons/fa';
import './DataExporter.css';

const DataExporter = ({ isVisible, onClose }) => {
  const [exportFormat, setExportFormat] = useState('json');
  const [isExporting, setIsExporting] = useState(false);

  const getAllData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      tasks: JSON.parse(localStorage.getItem('focus-booster-tasks') || '[]'),
      pomodoroGoals: {},
      moodHistory: JSON.parse(localStorage.getItem('focus-booster-moods') || '[]'),
      distractions: JSON.parse(localStorage.getItem('focus-booster-distractions') || '[]'),
      sessionHistory: JSON.parse(localStorage.getItem('focus-booster-sessions') || '[]'),
      settings: {
        theme: localStorage.getItem('focus-booster-theme') || 'light',
        sound: localStorage.getItem('focus-booster-sound') || 'rain',
        volume: localStorage.getItem('focus-booster-volume') || '0.5',
        timerSettings: JSON.parse(localStorage.getItem('focus-booster-timer-settings') || '{}')
      }
    };

    // Get all Pomodoro goal data
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('focus-goal-')) {
        const date = key.replace('focus-goal-', '');
        data.pomodoroGoals[date] = JSON.parse(localStorage.getItem(key) || '{}');
      }
    });

    return data;
  };

  const exportToJSON = () => {
    const data = getAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focus-booster-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const data = getAllData();
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    // Tasks CSV
    csvContent += 'Tasks\n';
    csvContent += 'ID,Text,Completed,Created\n';
    data.tasks.forEach(task => {
      csvContent += `${task.id},"${task.text}",${task.completed},${task.created}\n`;
    });
    
    csvContent += '\nMood History\n';
    csvContent += 'Date,Mood,Timestamp\n';
    data.moodHistory.forEach(mood => {
      csvContent += `${mood.date},"${mood.mood}",${mood.timestamp}\n`;
    });
    
    csvContent += '\nDistractions\n';
    csvContent += 'Date,Reason,Timestamp\n';
    data.distractions.forEach(distraction => {
      csvContent += `${distraction.date},"${distraction.text}",${distraction.timestamp}\n`;
    });
    
    csvContent += '\nPomodoro Goals\n';
    csvContent += 'Date,Goal,Completed\n';
    Object.entries(data.pomodoroGoals).forEach(([date, goal]) => {
      csvContent += `${date},${goal.goal || 0},${goal.count || 0}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `focus-booster-data-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      if (exportFormat === 'json') {
        exportToJSON();
      } else {
        exportToCSV();
      }
      
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };

  const getDataSummary = () => {
    const data = getAllData();
    return {
      tasks: data.tasks.length,
      completedTasks: data.tasks.filter(t => t.completed).length,
      moods: data.moodHistory.length,
      distractions: data.distractions.length,
      sessions: data.sessionHistory.length,
      goalDays: Object.keys(data.pomodoroGoals).length
    };
  };

  const summary = getDataSummary();

  if (!isVisible) return null;

  return (
    <div className="exporter-overlay">
      <div className="exporter-modal">
        <div className="exporter-header">
          <h2>Export Your Data</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="data-summary">
          <h3>Data Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Tasks</span>
              <span className="summary-value">{summary.tasks}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Completed</span>
              <span className="summary-value">{summary.completedTasks}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Mood Entries</span>
              <span className="summary-value">{summary.moods}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Distractions</span>
              <span className="summary-value">{summary.distractions}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Sessions</span>
              <span className="summary-value">{summary.sessions}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Goal Days</span>
              <span className="summary-value">{summary.goalDays}</span>
            </div>
          </div>
        </div>

        <div className="export-options">
          <h3>Export Format</h3>
          <div className="format-options">
            <label className="format-option">
              <input
                type="radio"
                name="format"
                value="json"
                checked={exportFormat === 'json'}
                onChange={(e) => setExportFormat(e.target.value)}
              />
              <div className="format-content">
                <FaFileAlt />
                <div>
                  <span className="format-name">JSON</span>
                  <span className="format-desc">Complete data with structure</span>
                </div>
              </div>
            </label>
            
            <label className="format-option">
              <input
                type="radio"
                name="format"
                value="csv"
                checked={exportFormat === 'csv'}
                onChange={(e) => setExportFormat(e.target.value)}
              />
              <div className="format-content">
                <FaFileCsv />
                <div>
                  <span className="format-name">CSV</span>
                  <span className="format-desc">Spreadsheet compatible</span>
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="export-actions">
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="btn btn-export"
          >
            <FaDownload />
            <span>{isExporting ? 'Exporting...' : 'Export Data'}</span>
          </button>
        </div>

        <div className="export-info">
          <p>Your data will be exported as a file that you can save to your device.</p>
          <p>This includes all your tasks, mood history, distractions, and Pomodoro sessions.</p>
        </div>
      </div>
    </div>
  );
};

export default DataExporter; 