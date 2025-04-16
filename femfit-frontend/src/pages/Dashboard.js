import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import './Dashboard.css';

// Components
import ProgressChart from '../components/shared/ProgressChart';
import WorkoutCard from '../components/fitness/WorkoutCard';
import NutritionTips from '../components/shared/NutritionTips';
import UpcomingWorkouts from '../components/fitness/UpcomingWorkouts';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile data
        const profileResponse = await axios.get(`${API_URL}/profiles/${currentUser.id}`, {
          params: { user_id: currentUser.id }
        });
        
        setProfile(profileResponse.data.data);
        
        // Fetch user's workouts
        const workoutsResponse = await axios.get(`${API_URL}/workouts`, {
          params: { user_id: currentUser.id }
        });
        
        setWorkouts(workoutsResponse.data.data.workouts || []);
        
        // Fetch user's progress data
        const progressResponse = await axios.get(`${API_URL}/progress`, {
          params: { user_id: currentUser.id }
        });
        
        setProgress(progressResponse.data.data.progress || []);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load your dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser.id]);
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const generateNewWorkout = async () => {
    try {
      setLoading(true);
      
      // Check if we already have workouts
      if (workouts.length > 0) {
        // Find the highest week number
        const highestWeek = Math.max(...workouts.map(w => w.week_number || 1));
        
        // Call the API to generate a new workout
        const response = await axios.post(`${API_URL}/workouts`, {
          user_id: currentUser.id,
          week_number: highestWeek + 1 // Increment the week number
        });
        
        if (response.data && response.data.data) {
          // Add the new workout to the workouts array
          const newWorkout = response.data.data.workout || response.data.data;
          setWorkouts([...workouts, newWorkout]);
          // Show success message
          alert("New workout plan generated successfully!");
        }
      } else {
        // First workout - start with week 1
        const response = await axios.post(`${API_URL}/workouts`, {
          user_id: currentUser.id,
          week_number: 1
        });
        
        if (response.data && response.data.data) {
          // Add the new workout to the workouts array
          const newWorkout = response.data.data.workout || response.data.data;
          setWorkouts([newWorkout]);
          // Show success message
          alert("New workout plan generated successfully!");
        }
      }
    } catch (error) {
      console.error('Error generating workout:', error);
      if (error.response && error.response.status === 409) {
        // Handle the case where a workout for this week already exists
        alert("A workout plan for this week already exists. Please try again with a different week number.");
      } else {
        alert("Failed to generate workout. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Check if user has a subscription
  const hasSubscription = currentUser.subscription_status === 'active';
  
  // Check if user has a profile
  const hasProfile = profile !== null;
  
  // Loading state
  if (loading) {
    return (
      <div className="container dashboard-container">
        <div className="loading-state">
          <div className="loader"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  // No subscription state
  if (!hasSubscription) {
    return (
      <div className="container dashboard-container">
        <div className="no-subscription">
          <h2>Subscribe to Access Your Personalized Plan</h2>
          <p>To access your personalized fitness plan and all features, you need an active subscription.</p>
          <Link to="/subscription" className="btn-primary">View Subscription Plans</Link>
        </div>
      </div>
    );
  }
  
  // No profile state
  if (!hasProfile) {
    return (
      <div className="container dashboard-container">
        <div className="no-profile">
          <h2>Complete Your Profile</h2>
          <p>To create your personalized fitness plan, we need to know more about you.</p>
          <div className="profile-options">
            <Link to="/fitness-questionnaire" className="profile-option">
              <h3>Fitness</h3>
              <p>Weight loss, muscle gain, or general fitness</p>
            </Link>
            <Link to="/mothers-questionnaire" className="profile-option">
              <h3>New Mothers</h3>
              <p>Specialized plans for new mothers</p>
            </Link>
            <Link to="/holistic-questionnaire" className="profile-option">
              <h3>Holistic Wellness</h3>
              <p>Mind and body wellness approach</p>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="container dashboard-container">
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
  
  // Render dashboard content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="dashboard-overview">
            <div className="dashboard-greeting">
              <h2>Welcome back, {currentUser.name}!</h2>
              <p>Here's an overview of your fitness journey</p>
            </div>
            
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>Current Weight</h3>
                <p className="stat-value">{profile.weight} {profile.weight > 50 ? 'lbs' : 'kg'}</p>
                <p className="stat-label">Goal: {profile.weight_goal} {profile.weight_goal > 50 ? 'lbs' : 'kg'}</p>
              </div>
              
              <div className="stat-card">
                <h3>Workout Streak</h3>
                <p className="stat-value">3 days</p>
                <p className="stat-label">Keep it up!</p>
              </div>
              
              <div className="stat-card">
                <h3>Next Workout</h3>
                <p className="stat-value">Today</p>
                <p className="stat-label">
                  <Link to={workouts.length > 0 ? `/workout-plan/${workouts[0].id}` : '#'}>
                    {workouts.length > 0 ? workouts[0].name : 'No upcoming workouts'}
                  </Link>
                </p>
              </div>
              
              <div className="stat-card">
                <h3>Subscription</h3>
                <p className="stat-value">{currentUser.subscription_type}</p>
                <p className="stat-label">
                  Expires: {new Date(currentUser.subscription_end_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="dashboard-sections">
              <div className="dashboard-section progress-section">
                <h3>Weight Progress</h3>
                <div className="chart-container">
                  <ProgressChart data={progress} />
                </div>
              </div>
              
              <div className="dashboard-section workout-section">
                <h3>Today's Workout</h3>
                {workouts.length > 0 ? (
                  <WorkoutCard workout={workouts[0]} />
                ) : (
                  <div className="no-workout">
                    <p>No workout scheduled for today.</p>
                    <button className="btn-primary" onClick={generateNewWorkout}>Generate Workout</button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="dashboard-sections">
              <div className="dashboard-section nutrition-section">
                <h3>Nutrition Tips</h3>
                <NutritionTips />
              </div>
              
              <div className="dashboard-section upcoming-section">
                <h3>Upcoming Workouts</h3>
                <UpcomingWorkouts workouts={workouts.slice(1)} onGenerateWorkout={generateNewWorkout} />
              </div>
            </div>
          </div>
        );
        
      case 'workouts':
        return (
          <div className="dashboard-workouts">
            <h2>Your Workout Plans</h2>
            
            {workouts.length > 0 ? (
              <div className="workout-list">
                {workouts.map(workout => (
                  <div key={workout.id} className="workout-item">
                    <div className="workout-info">
                      <h3>{workout.name}</h3>
                      <p>{workout.description}</p>
                      <div className="workout-meta">
                        <span>Week {workout.week_number}</span>
                        <span>{new Date(workout.start_date).toLocaleDateString()} - {new Date(workout.end_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Link to={`/workout-plan/${workout.id}`} className="btn-primary">View Plan</Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-workout">
                <p>No workout scheduled for today.</p>
                <button className="btn-primary" onClick={generateNewWorkout}>Generate Workout</button>
              </div>
            )}
          </div>
        );
        
      case 'progress':
        return (
          <div className="dashboard-progress">
            <h2>Your Progress</h2>
            
            <div className="progress-charts">
              <div className="progress-chart-container">
                <h3>Weight Progress</h3>
                <div className="chart-container large-chart">
                  <ProgressChart data={progress} />
                </div>
              </div>
              
              <div className="progress-stats">
                <div className="stat-card">
                  <h3>Starting Weight</h3>
                  <p className="stat-value">
                    {progress.length > 0 ? progress[0].weight : profile.weight} 
                    {profile.weight > 50 ? 'lbs' : 'kg'}
                  </p>
                </div>
                
                <div className="stat-card">
                  <h3>Current Weight</h3>
                  <p className="stat-value">
                    {profile.weight} {profile.weight > 50 ? 'lbs' : 'kg'}
                  </p>
                </div>
                
                <div className="stat-card">
                  <h3>Goal Weight</h3>
                  <p className="stat-value">
                    {profile.weight_goal} {profile.weight_goal > 50 ? 'lbs' : 'kg'}
                  </p>
                </div>
                
                <div className="stat-card">
                  <h3>Progress</h3>
                  <p className="stat-value">
                    {progress.length > 0 
                      ? (((progress[0].weight - profile.weight) / (progress[0].weight - profile.weight_goal)) * 100).toFixed(1)
                      : 0}%
                  </p>
                </div>
              </div>
            </div>
            
            <div className="update-progress">
              <h3>Update Your Progress</h3>
              <form className="progress-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="current-weight">Current Weight</label>
                    <input type="number" id="current-weight" className="form-control" placeholder="Enter weight" />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="body-fat">Body Fat % (optional)</label>
                    <input type="number" id="body-fat" className="form-control" placeholder="Enter body fat %" />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="progress-date">Date</label>
                    <input type="date" id="progress-date" className="form-control" defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="progress-notes">Notes (optional)</label>
                  <textarea id="progress-notes" className="form-control" rows="3" placeholder="How are you feeling? Any changes you've noticed?"></textarea>
                </div>
                
                <button type="submit" className="btn-primary">Update Progress</button>
              </form>
            </div>
          </div>
        );
        
      case 'profile':
        return (
          <div className="dashboard-profile">
            <h2>Your Profile</h2>
            
            <div className="profile-details">
              <div className="profile-section">
                <h3>Personal Information</h3>
                <div className="profile-info">
                  <div className="info-item">
                    <span className="info-label">Name:</span>
                    <span className="info-value">{currentUser.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{currentUser.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Age Group:</span>
                    <span className="info-value">{profile.age_group}</span>
                  </div>
                </div>
              </div>
              
              <div className="profile-section">
                <h3>Fitness Profile</h3>
                <div className="profile-info">
                  <div className="info-item">
                    <span className="info-label">Program Type:</span>
                    <span className="info-value">{profile.category}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Goal:</span>
                    <span className="info-value">{profile.goal}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Current Body Shape:</span>
                    <span className="info-value">{profile.body_shape}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Dream Body:</span>
                    <span className="info-value">{profile.dream_body}</span>
                  </div>
                </div>
              </div>
              
              <div className="profile-section">
                <h3>Training Preferences</h3>
                <div className="profile-info">
                  <div className="info-item">
                    <span className="info-label">Sessions Per Week:</span>
                    <span className="info-value">{profile.sessions_per_week}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Minutes Per Session:</span>
                    <span className="info-value">{profile.minutes_per_session}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Equipment Level:</span>
                    <span className="info-value">{profile.equipment}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Focus Areas:</span>
                    <span className="info-value">{profile.focus_areas}</span>
                  </div>
                </div>
              </div>
              
              <div className="profile-section">
                <h3>Subscription</h3>
                <div className="profile-info">
                  <div className="info-item">
                    <span className="info-label">Plan:</span>
                    <span className="info-value">{currentUser.subscription_type}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Status:</span>
                    <span className="info-value">{currentUser.subscription_status}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Expiration:</span>
                    <span className="info-value">{new Date(currentUser.subscription_end_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="profile-actions">
              <button className="btn-secondary">Edit Profile</button>
              <Link to="/subscription" className="btn-primary">Manage Subscription</Link>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="dashboard-page">
      <div className="container dashboard-container">
        <div className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabChange('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'workouts' ? 'active' : ''}`}
            onClick={() => handleTabChange('workouts')}
          >
            Workouts
          </button>
          <button 
            className={`tab-button ${activeTab === 'progress' ? 'active' : ''}`}
            onClick={() => handleTabChange('progress')}
          >
            Progress
          </button>
          <button 
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleTabChange('profile')}
          >
            Profile
          </button>
        </div>
        
        <div className="dashboard-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;