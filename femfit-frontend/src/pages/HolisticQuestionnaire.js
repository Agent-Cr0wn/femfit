// File: src/pages/HolisticQuestionnaire.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import './Questionnaire.css';

const HolisticQuestionnaire = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    user_id: currentUser?.id || '',
    category: 'holistic',
    age_group: '',
    holistic_type: '',
    body_shape: '',
    sessions_per_week: '',
    minutes_per_session: '',
    focus_areas: [],
    weight: '',
    height: '',
    body_fat: '',
    goal: 'wellness'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // Handle multiple checkboxes for focus_areas
      if (name === 'focus_areas') {
        let updatedAreas = [...formData.focus_areas];
        
        if (checked) {
          updatedAreas.push(value);
        } else {
          updatedAreas = updatedAreas.filter(area => area !== value);
        }
        
        setFormData(prev => ({
          ...prev,
          focus_areas: updatedAreas
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Validate current step
  const validateStep = () => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.age_group) newErrors.age_group = 'Please select your age group';
        if (!formData.holistic_type) newErrors.holistic_type = 'Please select a holistic practice type';
        break;
      case 2:
        if (!formData.body_shape) newErrors.body_shape = 'Please select your body shape';
        if (!formData.sessions_per_week) newErrors.sessions_per_week = 'Please select how often you can practice';
        if (!formData.minutes_per_session) newErrors.minutes_per_session = 'Please select time per session';
        break;
      case 3:
        if (formData.focus_areas.length === 0) newErrors.focus_areas = 'Please select at least one focus area';
        break;
      case 4:
        if (!formData.weight) newErrors.weight = 'Please enter your weight';
        if (!formData.height) newErrors.height = 'Please enter your height';
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Navigation between steps
  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };
  
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateStep()) {
      setIsSubmitting(true);
      
      try {
        // Format focus_areas array to comma-separated string
        const formattedData = {
          ...formData,
          focus_areas: formData.focus_areas.join(',')
        };
        
        // Send to API
        const response = await axios.post(`${API_URL}/profiles`, formattedData);
        
        if (response.data.message === 'Profile created successfully') {
          // Redirect to subscription page before showing workout plan
          navigate('/subscription', { state: { fromQuestionnaire: true } });
        } else {
          throw new Error('Failed to create profile');
        }
      } catch (error) {
        console.error('Error submitting questionnaire:', error);
        setErrors({
          submit: error.response?.data?.error || 'Failed to submit your information. Please try again.'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container questionnaire-container">
        <div className="auth-redirect">
          <h2>Please Login or Register</h2>
          <p>You need to be logged in to create your personalized wellness plan.</p>
          <div className="auth-buttons">
            <button className="btn-primary" onClick={() => navigate('/login')}>Login</button>
            <button className="btn-secondary" onClick={() => navigate('/register')}>Register</button>
          </div>
        </div>
      </div>
    );
  }
  
  // Render different step content based on current step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h3>Step 1: Your Wellness Journey</h3>
            
            <div className="form-group">
              <label>Your Age Group:</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="age_group" 
                    value="18-29" 
                    checked={formData.age_group === '18-29'} 
                    onChange={handleChange} 
                  />
                  18-29
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="age_group" 
                    value="30-39" 
                    checked={formData.age_group === '30-39'} 
                    onChange={handleChange} 
                  />
                  30-39
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="age_group" 
                    value="40-49" 
                    checked={formData.age_group === '40-49'} 
                    onChange={handleChange} 
                  />
                  40-49
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="age_group" 
                    value="50+" 
                    checked={formData.age_group === '50+'} 
                    onChange={handleChange} 
                  />
                  50+
                </label>
              </div>
              {errors.age_group && <div className="error">{errors.age_group}</div>}
            </div>
            
            <div className="form-group">
              <label>Choose Your Holistic Practice:</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="holistic_type" 
                    value="yoga" 
                    checked={formData.holistic_type === 'yoga'} 
                    onChange={handleChange} 
                  />
                  Yoga
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="holistic_type" 
                    value="power_yoga" 
                    checked={formData.holistic_type === 'power_yoga'} 
                    onChange={handleChange} 
                  />
                  Power Yoga
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="holistic_type" 
                    value="meditation" 
                    checked={formData.holistic_type === 'meditation'} 
                    onChange={handleChange} 
                  />
                  Meditation
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="holistic_type" 
                    value="breathwork" 
                    checked={formData.holistic_type === 'breathwork'} 
                    onChange={handleChange} 
                  />
                  Breathwork
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="holistic_type" 
                    value="pilates" 
                    checked={formData.holistic_type === 'pilates'} 
                    onChange={handleChange} 
                  />
                  Pilates
                </label>
              </div>
              {errors.holistic_type && <div className="error">{errors.holistic_type}</div>}
            </div>
          </>
        );
        
      case 2:
        return (
          <>
            <h3>Step 2: Practice Preferences</h3>
            
            <div className="form-group">
              <label>Your Current Body Shape:</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="body_shape" 
                    value="slim" 
                    checked={formData.body_shape === 'slim'} 
                    onChange={handleChange} 
                  />
                  Slim
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="body_shape" 
                    value="average" 
                    checked={formData.body_shape === 'average'} 
                    onChange={handleChange} 
                  />
                  Average
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="body_shape" 
                    value="heavy" 
                    checked={formData.body_shape === 'heavy'} 
                    onChange={handleChange} 
                  />
                  Heavy
                </label>
              </div>
              {errors.body_shape && <div className="error">{errors.body_shape}</div>}
            </div>
            
            <div className="form-group">
              <label>How often can you practice per week?</label>
              <div className="radio-group">
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <label key={num} className="radio-label">
                    <input 
                      type="radio" 
                      name="sessions_per_week" 
                      value={num} 
                      checked={parseInt(formData.sessions_per_week) === num} 
                      onChange={handleChange} 
                    />
                    {num}x
                  </label>
                ))}
              </div>
              {errors.sessions_per_week && <div className="error">{errors.sessions_per_week}</div>}
            </div>
            
            <div className="form-group">
              <label>How much time do you have per session?</label>
              <div className="radio-group">
                {[15, 30, 45, 60].map(mins => (
                  <label key={mins} className="radio-label">
                    <input 
                      type="radio" 
                      name="minutes_per_session" 
                      value={mins} 
                      checked={parseInt(formData.minutes_per_session) === mins} 
                      onChange={handleChange} 
                    />
                    {mins} min
                  </label>
                ))}
              </div>
              {errors.minutes_per_session && <div className="error">{errors.minutes_per_session}</div>}
            </div>
          </>
        );
        
      case 3:
        return (
          <>
            <h3>Step 3: Focus Areas</h3>
            
            <div className="form-group">
              <label>Which areas would you like to focus on?</label>
              <div className="checkbox-group">
                {['Abs', 'Butt', 'Legs', 'Back', 'Arms', 'Chest'].map(area => (
                  <label key={area} className="checkbox-label">
                    <input 
                      type="checkbox" 
                      name="focus_areas" 
                      value={area.toLowerCase()} 
                      checked={formData.focus_areas.includes(area.toLowerCase())} 
                      onChange={handleChange} 
                    />
                    {area}
                  </label>
                ))}
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="focus_areas" 
                    value="mindfulness" 
                    checked={formData.focus_areas.includes('mindfulness')} 
                    onChange={handleChange} 
                  />
                  Mindfulness
                </label>
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="focus_areas" 
                    value="flexibility" 
                    checked={formData.focus_areas.includes('flexibility')} 
                    onChange={handleChange} 
                  />
                  Flexibility
                </label>
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="focus_areas" 
                    value="stress_relief" 
                    checked={formData.focus_areas.includes('stress_relief')} 
                    onChange={handleChange} 
                  />
                  Stress Relief
                </label>
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="focus_areas" 
                    value="all" 
                    checked={formData.focus_areas.includes('all')} 
                    onChange={handleChange} 
                  />
                  ALL
                </label>
              </div>
              {errors.focus_areas && <div className="error">{errors.focus_areas}</div>}
            </div>
          </>
        );
        
      case 4:
        return (
          <>
            <h3>Step 4: Body Measurements</h3>
            
            <div className="form-group">
              <label htmlFor="weight">Weight (lbs/kgs):</label>
              <input 
                type="number" 
                id="weight" 
                name="weight" 
                className="form-control" 
                value={formData.weight} 
                onChange={handleChange} 
                min="1" 
              />
              {errors.weight && <div className="error">{errors.weight}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="height">Height (cm):</label>
              <input 
                type="number" 
                id="height" 
                name="height" 
                className="form-control" 
                value={formData.height} 
                onChange={handleChange} 
                min="1" 
              />
              {errors.height && <div className="error">{errors.height}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="body_fat">Body Fat % (optional):</label>
              <input 
                type="number" 
                id="body_fat" 
                name="body_fat" 
                className="form-control" 
                value={formData.body_fat} 
                onChange={handleChange} 
                min="1" 
                max="70" 
              />
            </div>
            
            <div className="form-group">
              <label>What is your primary wellness goal?</label>
              <select 
                name="goal" 
                className="form-control" 
                value={formData.goal} 
                onChange={handleChange}
              >
                <option value="wellness">Overall Wellness</option>
                <option value="stress_reduction">Stress Reduction</option>
                <option value="flexibility">Improved Flexibility</option>
                <option value="mindfulness">Mindfulness Practice</option>
                <option value="strength">Gentle Strength Building</option>
              </select>
            </div>
          </>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="container questionnaire-container">
      <div className="questionnaire-header">
        <h2>Create Your Personalized Holistic Wellness Plan</h2>
        <p>Find balance and harmony with a plan designed for your mind and body.</p>
      </div>
      
      <div className="progress-bar">
        <div className="progress" style={{ width: `${(step / 4) * 100}%` }}></div>
      </div>
      <div className="step-indicator">Step {step} of 4</div>
      
      <form onSubmit={handleSubmit} className="questionnaire-form">
        <div className="form-content">
          {renderStepContent()}
          
          {errors.submit && (
            <div className="error-message">
              {errors.submit}
            </div>
          )}
        </div>
        
        <div className="form-navigation">
          {step > 1 && (
            <button 
              type="button" 
              className="btn-secondary prev-btn"
              onClick={prevStep}
            >
              Previous
            </button>
          )}
          
          {step < 4 ? (
            <button 
              type="button" 
              className="btn-primary next-btn"
              onClick={nextStep}
            >
              Continue
            </button>
          ) : (
            <button 
              type="submit" 
              className="btn-primary submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Your Plan...' : 'Create My Wellness Plan'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default HolisticQuestionnaire;