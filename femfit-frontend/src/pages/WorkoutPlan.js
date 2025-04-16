import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import './WorkoutPlan.css';

const WorkoutPlan = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDay, setSelectedDay] = useState(1); // Default to Monday (1)
  const [completedExercises, setCompletedExercises] = useState({});
  
  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        // Set loading state
        setLoading(true);
        
        // Fetch workout data
        const response = await axios.get(`${API_URL}/workouts/${id}`, {
          params: { user_id: currentUser.id }
        });
        
        if (response.data && response.data.data && response.data.data.workout) {
          setWorkout(response.data.data.workout);
          
          // Initialize the selected day to the current day of the week (1-7)
          const today = new Date().getDay();
          // Convert from Sunday=0 to Monday=1 format
          const currentDay = today === 0 ? 7 : today;
          setSelectedDay(currentDay);
        } else {
          setError('Invalid workout data received from server');
        }
      } catch (err) {
        console.error('Error fetching workout plan:', err);
        setError('Failed to load your workout plan. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser && id) {
      fetchWorkout();
    }
  }, [id, currentUser]);
  
  // Get current day exercises
  const getDayExercises = () => {
    if (!workout || !workout.exercises) return [];
    
    return workout.exercises.filter(exercise => exercise.day_of_week === selectedDay);
  };
  
  // Helper function to get day name
  const getDayName = (dayNumber) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber === 7 ? 0 : dayNumber];
  };
  
  // Handle exercise completion toggle
  const toggleExerciseCompletion = (exerciseIndex) => {
    setCompletedExercises(prev => ({
      ...prev,
      [exerciseIndex]: !prev[exerciseIndex]
    }));
    
    // In a real app, you would save this to the server
    // For example:
    // saveExerciseCompletion(exercise.id, !completedExercises[exerciseIndex]);
  };
  
  // Start workout - in a real app would track time, etc.
  const startWorkout = () => {
    alert("Starting workout! In a real app, this would start tracking your workout session.");
    // You could navigate to a workout timer screen or similar
  };
  
  // Download workout plan as PDF or text
  const downloadWorkoutPlan = () => {
    alert("In a real app, this would generate and download a PDF of your workout plan.");
    // This would typically generate a PDF or text file with workout details
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="container workout-plan-container">
        <div className="loading-state">
          <div className="loader"></div>
          <p>Loading your workout plan...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="container workout-plan-container">
        <div className="error-state">
          <h2>Something Went Wrong</h2>
          <p>{error}</p>
          <button 
            className="btn-primary" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  // No workout found
  if (!workout) {
    return (
      <div className="container workout-plan-container">
        <div className="not-found">
          <h2>Workout Plan Not Found</h2>
          <p>We couldn't find the workout plan you're looking for.</p>
          <Link to="/dashboard" className="btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }
  
  // Get exercises for the selected day
  const dayExercises = getDayExercises();
  const isRestDay = dayExercises.length === 0;
  
  // Calculate workout stats
  const totalSets = dayExercises.reduce((total, exercise) => total + (parseInt(exercise.sets) || 0), 0);
  const estimatedDuration = dayExercises.reduce((total, exercise) => {
    // If duration_minutes is set, use that
    if (exercise.duration_minutes) return total + parseInt(exercise.duration_minutes);
    // Otherwise estimate: 1 min per rep × sets + 1 min rest between sets
    const reps = parseInt(exercise.reps) || 10;
    const sets = parseInt(exercise.sets) || 3;
    return total + (reps * sets) / 10 + (sets - 1);
  }, 0);
  
  return (
    <div className="workout-plan-page">
      <div className="container workout-plan-container">
        <div className="workout-plan-header">
          <div className="plan-info">
            <h1>{workout.name}</h1>
            <p className="plan-description">{workout.description}</p>
            <div className="plan-meta">
              <span>Week {workout.week_number}</span>
              <span>{new Date(workout.start_date).toLocaleDateString()} - {new Date(workout.end_date).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="plan-actions">
            <button className="btn-secondary" onClick={downloadWorkoutPlan}>Download Plan</button>
            <button className="btn-primary" onClick={startWorkout}>Start Workout</button>
          </div>
        </div>
        
        <div className="workout-plan-content">
          <div className="day-tabs">
            {[1, 2, 3, 4, 5, 6, 7].map(day => (
              <button 
                key={day}
                className={`day-tab ${selectedDay === day ? 'active' : ''}`}
                onClick={() => setSelectedDay(day)}
              >
                {getDayName(day)}
              </button>
            ))}
          </div>
          
          <div className="day-content">
            <h2>Workout for {getDayName(selectedDay)}</h2>
            
            {!isRestDay && dayExercises.length > 0 && (
              <div className="workout-summary">
                <div className="summary-stat">
                  <div className="stat-label">Exercises</div>
                  <div className="stat-value">{dayExercises.length}</div>
                </div>
                <div className="summary-stat">
                  <div className="stat-label">Total Sets</div>
                  <div className="stat-value">{totalSets}</div>
                </div>
                <div className="summary-stat">
                  <div className="stat-label">Est. Duration</div>
                  <div className="stat-value">{Math.round(estimatedDuration)} min</div>
                </div>
              </div>
            )}
            
            {isRestDay ? (
              <div className="rest-day">
                <h3>Rest Day</h3>
                <p>Take this day to recover and prepare for your next workout. Remember that rest is an important part of your fitness journey.</p>
                <div className="rest-day-tips">
                  <h4>Recovery Tips:</h4>
                  <ul>
                    <li>Stay hydrated</li>
                    <li>Get enough sleep</li>
                    <li>Light stretching can help with muscle recovery</li>
                    <li>Maintain a balanced diet rich in protein</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="exercise-list">
                {dayExercises.map((exercise, index) => (
                  <div key={index} className="exercise-card">
                    <div className="exercise-header">
                      <h3 className="exercise-name">{exercise.name}</h3>
                      <div className="exercise-stats">
                        {exercise.sets && <span>{exercise.sets} sets</span>}
                        {exercise.reps && <span>{exercise.reps} reps</span>}
                        {exercise.duration_minutes && <span>{exercise.duration_minutes} min</span>}
                      </div>
                    </div>
                    
                    <div className="exercise-details">
                      <div className="exercise-description">
                        <p>{exercise.description || "This exercise helps build strength and endurance."}</p>
                        {exercise.form_tips && (
                          <div className="exercise-form-tips">
                            <strong>Form Tips:</strong> {exercise.form_tips}
                          </div>
                        )}
                        {exercise.notes && (
                          <div className="exercise-notes">
                            <strong>Trainer Notes:</strong> {exercise.notes}
                          </div>
                        )}
                      </div>
                      
                      {exercise.video_url || exercise.image_url ? (
                        <div className="exercise-media">
                          {exercise.video_url ? (
                            <div className="video-thumbnail">
                              <img 
                                src={exercise.image_url || "/assets/images/video-placeholder.jpg"} 
                                alt={`${exercise.name} demonstration`} 
                              />
                              <div className="play-button">▶</div>
                            </div>
                          ) : exercise.image_url ? (
                            <div className="exercise-image">
                              <img 
                                src={exercise.image_url} 
                                alt={`${exercise.name} demonstration`} 
                              />
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <div className="exercise-media">
                          <div className="video-thumbnail">
                            <img src="/assets/images/video-placeholder.jpg" alt={`${exercise.name} demonstration`} />
                            <div className="play-button">▶</div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="exercise-actions">
                      <button className="btn-secondary btn-sm">Watch Video</button>
                      <div className="exercise-completed">
                        <input 
                          type="checkbox" 
                          id={`exercise-${index}`} 
                          checked={completedExercises[index] || false}
                          onChange={() => toggleExerciseCompletion(index)}
                        />
                        <label htmlFor={`exercise-${index}`}>Mark as completed</label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="workout-plan-footer">
          <Link to="/dashboard" className="btn-secondary">Back to Dashboard</Link>
          <div className="plan-navigation">
            <button 
              className="btn-secondary" 
              disabled={selectedDay === 1}
              onClick={() => setSelectedDay(prev => prev - 1)}
            >
              Previous Day
            </button>
            <button 
              className="btn-primary" 
              disabled={selectedDay === 7}
              onClick={() => setSelectedDay(prev => prev + 1)}
            >
              Next Day
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlan;