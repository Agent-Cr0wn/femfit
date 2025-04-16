import React from 'react';
import { Link } from 'react-router-dom';
import './WorkoutCard.css';

const WorkoutCard = ({ workout }) => {
  if (!workout) {
    return (
      <div className="empty-workout-card">
        <p>No workout scheduled for today.</p>
        <button className="btn-primary">Generate Workout</button>
      </div>
    );
  }
  
  return (
    <div className="workout-card">
      <div className="workout-card-header">
        <h3>{workout.name}</h3>
        <span className="workout-type">
          {workout.category || 'Strength & Cardio'}
        </span>
      </div>
      
      <div className="workout-card-content">
        <p className="workout-description">
          {workout.description || 'Your personalized workout plan designed to help you reach your fitness goals.'}
        </p>
        
        <div className="workout-meta">
          <div className="meta-item">
            <span className="meta-label">Duration</span>
            <span className="meta-value">{workout.duration || '45-60'} min</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Focus</span>
            <span className="meta-value">{workout.focus || 'Full Body'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Week</span>
            <span className="meta-value">{workout.week_number || '1'}</span>
          </div>
        </div>
      </div>
      
      <div className="workout-card-actions">
        <Link to={`/workout-plan/${workout.id}`} className="btn-primary">
          Start Workout
        </Link>
        <button className="btn-secondary">Schedule for Later</button>
      </div>
    </div>
  );
};

export default WorkoutCard;