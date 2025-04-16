import React from 'react';
import { Link } from 'react-router-dom';
import './UpcomingWorkouts.css';

const UpcomingWorkouts = ({ workouts = [], onGenerateWorkout }) => {
  // Handle case with no workouts
  if (!workouts || workouts.length === 0) {
    return (
      <div className="no-upcoming-workouts">
        <p>No upcoming workouts scheduled.</p>
        <button 
          className="btn-primary btn-sm"
          onClick={() => onGenerateWorkout ? onGenerateWorkout() : null}
        >
          Generate New Workout
        </button>
      </div>
    );
  }
  
  // Only show next 3 workouts
  const nextWorkouts = workouts.slice(0, 3);
  
  return (
    <div className="upcoming-workouts-container">
      {nextWorkouts.map((workout, index) => (
        <div key={workout.id || index} className="upcoming-workout">
          <div className="workout-date">
            <span className="day">
              {workout.start_date 
                ? new Date(workout.start_date).toLocaleDateString('en-US', { weekday: 'short' }) 
                : 'Day'}
            </span>
            <span className="date">
              {workout.start_date 
                ? new Date(workout.start_date).getDate() 
                : index + 1}
            </span>
          </div>
          <div className="workout-info">
            <h4>{workout.name || `Workout ${index + 1}`}</h4>
            <p>{workout.description || 'Your personalized workout plan'}</p>
          </div>
          <Link to={`/workout-plan/${workout.id || index}`} className="workout-action">
            View
          </Link>
        </div>
      ))}
      
      {workouts.length > 3 && (
        <div className="see-all-workouts">
          <Link to="/dashboard?tab=workouts">See All Workouts</Link>
        </div>
      )}
    </div>
  );
};

export default UpcomingWorkouts;