import React, { useState, useEffect } from 'react';
import { FaStickyNote, FaEdit, FaSave } from 'react-icons/fa';
import './TaskNotes.css';

const TaskNotes = ({ taskId, initialNote = '', displayNote = false, note = '', onNoteUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState(note);

  // Update editing note when note prop changes
  useEffect(() => {
    setEditingNote(note);
  }, [note]);

  const handleNoteChange = (e) => {
    setEditingNote(e.target.value);
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onNoteUpdate) {
      onNoteUpdate(taskId, editingNote);
    }
  };

  const handleCancel = () => {
    setEditingNote(note);
    setIsEditing(false);
  };

  // If displayNote is true, show the note content under task title
  if (displayNote) {
    if (!note) {
      return null;
    }
    return (
      <div className="note-display">
        <p className="note-text">{note}</p>
      </div>
    );
  }

  // Otherwise, show the button in action area
  if (!note && !isEditing) {
    return (
      <button 
        onClick={() => setIsEditing(true)}
        className="btn btn-add-note"
        title="Add note"
      >
        Note
      </button>
    );
  }

  return (
    <div className="task-notes">
      {!isEditing ? (
        <button 
          onClick={() => setIsEditing(true)}
          className="btn btn-edit-note"
          title="Edit note"
        >
          Note
        </button>
      ) : (
        <div className="notes-content">
          <div className="note-editor">
            <textarea
              value={editingNote}
              onChange={handleNoteChange}
              placeholder="Enter your note here..."
              className="note-textarea"
              rows="3"
            />
            <div className="note-actions">
              <button onClick={handleSave} className="btn btn-save-note">
                <FaSave />
                <span>Save</span>
              </button>
              <button onClick={handleCancel} className="btn btn-cancel-note">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskNotes; 