import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import './EnhancedQuestionnaire.css';

// Questionnaire configuration with dynamic content based on user choices
const questionnaireConfig = {
  fitness: {
    title: "Create Your Personalized Fitness Plan",
    subtitle: "Answer a few questions so we can build the perfect fitness program for you.",
    steps: [
      {
        id: "basics",
        title: "Basic Information",
        questions: [
          {
            id: "age_group",
            type: "radio",
            label: "Your Age Group:",
            options: [
              { value: "18-29", label: "18-29" },
              { value: "30-39", label: "30-39" },
              { value: "40-49", label: "40-49" },
              { value: "50+", label: "50+" }
            ],
            required: true
          },
          {
            id: "goal",
            type: "radio",
            label: "Your Fitness Goal:",
            options: [
              { value: "weight_loss", label: "Lose Weight" },
              { value: "muscle_gain", label: "Build Muscle" },
              { value: "general_fitness", label: "General Fitness" }
            ],
            required: true,
            insights: {
              "weight_loss": "We'll focus on calorie-burning workouts with appropriate cardio and strength training.",
              "muscle_gain": "We'll emphasize progressive resistance training with adequate recovery periods.",
              "general_fitness": "We'll create a balanced program with cardio, strength, and flexibility components."
            }
          }
        ]
      },
      {
        id: "body",
        title: "Your Body",
        questions: [
          {
            id: "body_shape",
            type: "radio",
            label: "Your Current Body Shape:",
            options: [
              { value: "slim", label: "Slim" },
              { value: "average", label: "Average" },
              { value: "heavy", label: "Heavy" }
            ],
            required: true
          },
          {
            id: "dream_body",
            type: "radio",
            label: "Your Dream Body:",
            options: [
              { value: "slim", label: "Slim" },
              { value: "fit", label: "Fit" },
              { value: "muscular", label: "Muscular" }
            ],
            required: true,
            insights: {
              "slim": "We'll focus on toning exercises with higher reps and moderate resistance.",
              "fit": "We'll create a balanced program to develop muscular definition while maintaining leanness.",
              "muscular": "We'll include progressive overload principles to maximize muscle growth."
            }
          }
        ]
      },
      {
        id: "training",
        title: "Training Preferences",
        questions: [
          {
            id: "sessions_per_week",
            type: "radio",
            label: "How often can you train per week?",
            options: [
              { value: "1", label: "1x" },
              { value: "2", label: "2x" },
              { value: "3", label: "3x" },
              { value: "4", label: "4x" },
              { value: "5", label: "5x" },
              { value: "6", label: "6x" }
            ],
            required: true,
            insights: {
              "1": "We'll design a comprehensive full-body program to maximize your single workout.",
              "2": "We'll create an upper/lower body split to optimize your two training days.",
              "3": "We'll implement a push/pull/legs split for balanced development.",
              "4": "We'll design a focused program allowing for specialization on specific muscle groups.",
              "5": "We'll create a body-part split allowing detailed focus on each muscle group with ample recovery.",
              "6": "We'll design a high-frequency program with specialized volume distribution."
            }
          },
          {
            id: "minutes_per_session",
            type: "radio",
            label: "How much time do you have per training session?",
            options: [
              { value: "30", label: "30 min" },
              { value: "45", label: "45 min" },
              { value: "60", label: "60 min" },
              { value: "75", label: "75 min" },
              { value: "90", label: "90 min" },
              { value: "120", label: "120 min" }
            ],
            required: true
          },
          {
            id: "equipment",
            type: "radio",
            label: "What training equipment will you be using?",
            options: [
              { value: "none", label: "None (Bodyweight only)" },
              { value: "minimal", label: "Minimal (Dumbbells, Resistance Bands)" },
              { value: "all", label: "Full Gym Equipment" }
            ],
            required: true,
            insights: {
              "none": "We'll create an effective program using only bodyweight exercises and creative workout structures.",
              "minimal": "We'll incorporate versatile dumbbell and resistance band exercises to maximize your results.",
              "all": "We'll design a comprehensive program utilizing a variety of equipment for optimal stimulus."
            }
          }
        ]
      },
      {
        id: "focus",
        title: "Focus Areas",
        questions: [
          {
            id: "focus_areas",
            type: "checkbox",
            label: "Which muscles are most important to you?",
            options: [
              { value: "abs", label: "Abs" },
              { value: "butt", label: "Butt" },
              { value: "legs", label: "Legs" },
              { value: "back", label: "Back" },
              { value: "arms", label: "Arms" },
              { value: "chest", label: "Chest" },
              { value: "all", label: "ALL" }
            ],
            required: true,
            insights: {
              "abs": "We'll incorporate targeted core exercises and fat-burning protocols.",
              "butt": "We'll focus on glute-specific exercises and activation techniques.",
              "legs": "We'll include a variety of quad, hamstring, and calf exercises.",
              "back": "We'll emphasize pulling movements and exercises for a strong, defined back.",
              "arms": "We'll incorporate specific bicep and tricep isolation work.",
              "chest": "We'll include pressing variations and isolation movements for chest development.",
              "all": "We'll create a balanced program targeting all major muscle groups."
            }
          }
        ]
      },
      {
        id: "measurements",
        title: "Body Measurements",
        questions: [
          {
            id: "weight",
            type: "number",
            label: "Weight (lbs/kgs):",
            required: true,
            min: 1
          },
          {
            id: "height",
            type: "number",
            label: "Height (cm):",
            required: true,
            min: 1
          },
          {
            id: "body_fat",
            type: "number",
            label: "Body Fat % (optional):",
            required: false,
            min: 1,
            max: 70
          },
          {
            id: "weight_goal",
            type: "number",
            label: "Weight Goal (lbs/kgs):",
            required: true,
            min: 1
          }
        ]
      }
    ]
  },
  new_mother: {
    title: "Create Your Personalized Mother's Fitness Plan",
    subtitle: "Safe and effective workouts for your journey as a new mother.",
    steps: [
      {
        id: "basics",
        title: "Basic Information",
        questions: [
          {
            id: "age_group",
            type: "radio",
            label: "Your Age Group:",
            options: [
              { value: "18-29", label: "18-29" },
              { value: "30-39", label: "30-39" },
              { value: "40-49", label: "40-49" }
            ],
            required: true
          },
          {
            id: "goal",
            type: "radio",
            label: "Your Fitness Goal:",
            options: [
              { value: "weight_loss", label: "Weight Loss" },
              { value: "body_recovery", label: "Body Recovery" }
            ],
            required: true,
            insights: {
              "weight_loss": "We'll design a safe, gradual approach to post-pregnancy weight loss that's mindful of recovery needs.",
              "body_recovery": "We'll focus on rebuilding core strength, pelvic floor health, and overall functional fitness."
            }
          },
          {
            id: "is_pregnant",
            type: "radio",
            label: "Pregnancy Status:",
            options: [
              { value: true, label: "Currently Pregnant" },
              { value: false, label: "New Mother (Post-pregnancy)" }
            ],
            required: true,
            insights: {
              "true": "We'll create a safe prenatal program with appropriate modifications for each trimester.",
              "false": "We'll design a postnatal program that addresses physical recovery needs."
            }
          }
        ]
      },
      {
        id: "body",
        title: "Your Body",
        questions: [
          {
            id: "body_shape",
            type: "radio",
            label: "Your Current Body Shape:",
            options: [
              { value: "slim", label: "Slim" },
              { value: "average", label: "Average" },
              { value: "heavy", label: "Heavy" }
            ],
            required: true
          },
          {
            id: "dream_body",
            type: "radio",
            label: "Your Dream Body:",
            options: [
              { value: "slim", label: "Slim" },
              { value: "fit", label: "Fit" },
              { value: "muscular", label: "Toned" }
            ],
            required: true
          }
        ]
      },
      {
        id: "training",
        title: "Training Preferences",
        questions: [
          {
            id: "sessions_per_week",
            type: "radio",
            label: "How often can you train per week?",
            options: [
              { value: "1", label: "1x" },
              { value: "2", label: "2x" },
              { value: "3", label: "3x" },
              { value: "4", label: "4x" },
              { value: "5", label: "5x" },
              { value: "6", label: "6x" }
            ],
            required: true,
            insights: {
              "1": "We'll design an efficient full-body program that maximizes your limited time.",
              "2": "We'll create a balanced program with one strength day and one mobility/recovery day.",
              "3": "We'll implement a program that alternates between strength, core, and recovery work."
            }
          },
          {
            id: "minutes_per_session",
            type: "radio",
            label: "How much time do you have per training session?",
            options: [
              { value: "15", label: "15 min" },
              { value: "30", label: "30 min" },
              { value: "45", label: "45 min" },
              { value: "60", label: "60 min" }
            ],
            required: true,
            insights: {
              "15": "We'll create micro-workouts that can be done efficiently, even with a baby nearby.",
              "30": "We'll design focused sessions that deliver results in a time-efficient manner."
            }
          },
          {
            id: "equipment",
            type: "radio",
            label: "What training equipment will you be using?",
            options: [
              { value: "none", label: "None (Bodyweight only)" },
              { value: "minimal", label: "Minimal (Dumbbells, Resistance Bands)" },
              { value: "all", label: "Full Gym Equipment" }
            ],
            required: true
          }
        ]
      },
      {
        id: "focus",
        title: "Focus Areas",
        questions: [
          {
            id: "focus_areas",
            type: "checkbox",
            label: "Which muscles are most important to you?",
            options: [
              { value: "abs", label: "Abs" },
              { value: "butt", label: "Butt" },
              { value: "legs", label: "Legs" },
              { value: "back", label: "Back" },
              { value: "arms", label: "Arms" },
              { value: "chest", label: "Chest" },
              { value: "all", label: "ALL" }
            ],
            required: true,
            insights: {
              "abs": "We'll focus on safe, progressive core rehabilitation exercises.",
              "butt": "We'll include exercises to strengthen glutes which support proper posture and reduce back pain.",
              "back": "We'll incorporate exercises to improve posture and reduce strain from baby carrying."
            }
          }
        ]
      },
      {
        id: "measurements",
        title: "Body Measurements",
        questions: [
          {
            id: "weight",
            type: "number",
            label: "Weight (lbs/kgs):",
            required: true,
            min: 1
          },
          {
            id: "height",
            type: "number",
            label: "Height (cm):",
            required: true,
            min: 1
          },
          {
            id: "body_fat",
            type: "number",
            label: "Body Fat % (optional):",
            required: false,
            min: 1,
            max: 70
          },
          {
            id: "weight_goal",
            type: "number",
            label: "Weight Goal (lbs/kgs):",
            required: true,
            min: 1
          }
        ]
      }
    ]
  },
  holistic: {
    title: "Create Your Personalized Holistic Wellness Plan",
    subtitle: "Find balance and harmony with a plan designed for your mind and body.",
    steps: [
      {
        id: "basics",
        title: "Your Wellness Journey",
        questions: [
          {
            id: "age_group",
            type: "radio",
            label: "Your Age Group:",
            options: [
              { value: "18-29", label: "18-29" },
              { value: "30-39", label: "30-39" },
              { value: "40-49", label: "40-49" },
              { value: "50+", label: "50+" }
            ],
            required: true
          },
          {
            id: "holistic_type",
            type: "radio",
            label: "Choose Your Holistic Practice:",
            options: [
              { value: "yoga", label: "Yoga" },
              { value: "power_yoga", label: "Power Yoga" },
              { value: "meditation", label: "Meditation" },
              { value: "breathwork", label: "Breathwork" },
              { value: "pilates", label: "Pilates" }
            ],
            required: true,
            insights: {
              "yoga": "We'll create a balanced program focusing on posture, flexibility and mindfulness.",
              "power_yoga": "We'll design a dynamic practice that builds strength while improving flexibility.",
              "meditation": "We'll develop a progressive meditation practice with complementary movement.",
              "breathwork": "We'll create a program centered on breathing techniques with supportive movement.",
              "pilates": "We'll design a core-focused routine that improves posture and body awareness."
            }
          }
        ]
      },
      {
        id: "preferences",
        title: "Practice Preferences",
        questions: [
          {
            id: "body_shape",
            type: "radio",
            label: "Your Current Body Shape:",
            options: [
              { value: "slim", label: "Slim" },
              { value: "average", label: "Average" },
              { value: "heavy", label: "Heavy" }
            ],
            required: true
          },
          {
            id: "sessions_per_week",
            type: "radio",
            label: "How often can you practice per week?",
            options: [
              { value: "1", label: "1x" },
              { value: "2", label: "2x" },
              { value: "3", label: "3x" },
              { value: "4", label: "4x" },
              { value: "5", label: "5x" },
              { value: "6", label: "6x" }
            ],
            required: true,
            insights: {
              "1": "We'll create a comprehensive session that balances all elements of your practice.",
              "2": "We'll alternate between active and restorative sessions for balance.",
              "3": "We'll implement a progressive program with varied intensity and focus areas."
            }
          },
          {
            id: "minutes_per_session",
            type: "radio",
            label: "How much time do you have per session?",
            options: [
              { value: "15", label: "15 min" },
              { value: "30", label: "30 min" },
              { value: "45", label: "45 min" },
              { value: "60", label: "60 min" }
            ],
            required: true
          }
        ]
      },
      {
        id: "focus",
        title: "Focus Areas",
        questions: [
          {
            id: "focus_areas",
            type: "checkbox",
            label: "Which areas would you like to focus on?",
            options: [
              { value: "abs", label: "Abs" },
              { value: "butt", label: "Butt" },
              { value: "legs", label: "Legs" },
              { value: "back", label: "Back" },
              { value: "arms", label: "Arms" },
              { value: "chest", label: "Chest" },
              { value: "mindfulness", label: "Mindfulness" },
              { value: "flexibility", label: "Flexibility" },
              { value: "stress_relief", label: "Stress Relief" },
              { value: "all", label: "ALL" }
            ],
            required: true,
            insights: {
              "mindfulness": "We'll incorporate meditation and present-moment awareness practices.",
              "flexibility": "We'll focus on dynamic and static stretching techniques to improve range of motion.",
              "stress_relief": "We'll emphasize breathing techniques and restorative practices."
            }
          }
        ]
      },
      {
        id: "measurements",
        title: "Body Measurements",
        questions: [
          {
            id: "weight",
            type: "number",
            label: "Weight (lbs/kgs):",
            required: true,
            min: 1
          },
          {
            id: "height",
            type: "number",
            label: "Height (cm):",
            required: true,
            min: 1
          },
          {
            id: "body_fat",
            type: "number",
            label: "Body Fat % (optional):",
            required: false,
            min: 1,
            max: 70
          },
          {
            id: "goal",
            type: "select",
            label: "What is your primary wellness goal?",
            options: [
              { value: "wellness", label: "Overall Wellness" },
              { value: "stress_reduction", label: "Stress Reduction" },
              { value: "flexibility", label: "Improved Flexibility" },
              { value: "mindfulness", label: "Mindfulness Practice" },
              { value: "strength", label: "Gentle Strength Building" }
            ],
            required: true,
            insights: {
              "wellness": "We'll create a balanced program addressing physical, mental, and emotional aspects.",
              "stress_reduction": "We'll emphasize techniques to activate the parasympathetic nervous system.",
              "flexibility": "We'll focus on progressive mobility work to safely improve range of motion.",
              "mindfulness": "We'll incorporate mindfulness practices throughout your physical routine.",
              "strength": "We'll include gentle progressive resistance training within your practice."
            }
          }
        ]
      }
    ]
  }
};

const EnhancedQuestionnaire = ({ type = 'fitness' }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    user_id: currentUser?.id || '',
    category: type
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInsight, setShowInsight] = useState(null);
  const [workoutPreview, setWorkoutPreview] = useState(null);
  
  // Get configuration for the selected questionnaire type
  const config = questionnaireConfig[type] || questionnaireConfig.fitness;
  const totalSteps = config.steps.length;
  
  useEffect(() => {
    // Reset form when type changes
    setFormData({
      user_id: currentUser?.id || '',
      category: type
    });
    setStep(0);
    setErrors({});
  }, [type, currentUser]);
  
  // Update workout preview based on current answers
  useEffect(() => {
    if (step > 1 && Object.keys(formData).length > 3) {
      generateWorkoutPreview();
    }
  }, [step, formData]);

  // Auto-submit form when reaching the final step
  useEffect(() => {
    // Only execute this effect when on the final step
    if (step >= totalSteps && !isSubmitting) {
      const submitForm = async () => {
        // FIX: Set isSubmitting first to prevent double submissions
        setIsSubmitting(true);
        
        try {
          // Format focus_areas array to comma-separated string if present
          const formattedData = { ...formData };
          
          if (formData.focus_areas && Array.isArray(formData.focus_areas)) {
            formattedData.focus_areas = formData.focus_areas.join(',');
          }
          
          // Convert boolean values to integers for PHP/MySQL compatibility
          if (formattedData.is_pregnant !== undefined) {
            formattedData.is_pregnant = formattedData.is_pregnant === 'true' || formattedData.is_pregnant === true ? 1 : 0;
          }
          
          // FIX: Add a console log to see what we're sending
          console.log("Submitting profile data:", formattedData);
          
          // FIX: Use a more robust way to handle the API call
          let profileResponse = null;
          
          // Wrap the API call in its own try/catch to better handle errors
          try {
            // Send to API
            profileResponse = await axios.post(`${API_URL}/profiles`, formattedData);
            console.log("Profile API response:", profileResponse.data);
          } catch (apiError) {
            console.error("API call error:", apiError);
            throw apiError; // rethrow to be caught by the outer catch
          }
          
          // Check for successful profile creation
          if (profileResponse && profileResponse.data && profileResponse.data.message) {
            // FIX: Add a short delay before redirecting to ensure the backend has time to process
            setTimeout(() => {
              // Redirect to dashboard
              navigate('/dashboard');
            }, 500);
          } else {
            console.error("Unexpected API response format:", profileResponse?.data);
            throw new Error('Failed to create profile');
          }
        } catch (error) {
          console.error('Error submitting questionnaire:', error);
          setErrors({
            submit: error.response?.data?.error || 'Failed to submit your information. Please try again.'
          });
          // Go back to the last step if submission fails
          setStep(totalSteps - 1);
        } finally {
          // FIX: Only reset isSubmitting if we've encountered an error
          // If success, keep it as true to prevent duplicate submissions
          if (errors.submit) {
            setIsSubmitting(false);
          }
        }
      };
      
      submitForm();
    }
    // FIX: Only include dependencies that should trigger this effect
  }, [step, totalSteps, formData]);
  
  const generateWorkoutPreview = () => {
    // This function would generate a simplified preview based on current selections
    // In a real implementation, this might make a lightweight API call
    
    let preview = {
      workoutType: "",
      frequency: "",
      focus: "",
      estimatedCalories: 0
    };
    
    // Basic workout type based on goal
    if (formData.goal === "weight_loss") {
      preview.workoutType = "Calorie-burning circuit training";
      preview.estimatedCalories = 400;
    } else if (formData.goal === "muscle_gain") {
      preview.workoutType = "Progressive resistance training";
      preview.estimatedCalories = 300;
    } else if (formData.goal === "body_recovery") {
      preview.workoutType = "Functional restoration training";
      preview.estimatedCalories = 250;
    } else {
      preview.workoutType = "Balanced fitness program";
      preview.estimatedCalories = 350;
    }
    
    // Frequency text
    if (formData.sessions_per_week) {
      preview.frequency = `${formData.sessions_per_week} sessions per week, approximately ${formData.minutes_per_session || 45} minutes each`;
    }
    
    // Focus areas
    if (formData.focus_areas && Array.isArray(formData.focus_areas) && formData.focus_areas.length > 0) {
      if (formData.focus_areas.includes('all')) {
        preview.focus = "Full-body training with balanced attention to all muscle groups";
      } else {
        const focusMap = {
          abs: "core", butt: "glutes", legs: "lower body", 
          back: "back", arms: "arms", chest: "chest",
          mindfulness: "mindfulness", flexibility: "flexibility",
          stress_relief: "stress management"
        };
        
        const focusAreas = formData.focus_areas.map(area => focusMap[area] || area).join(", ");
        preview.focus = `Emphasis on ${focusAreas}`;
      }
    }
    
    setWorkoutPreview(preview);
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // Handle checkbox groups (multiple values)
      if (name.includes('focus_areas')) {
        let updatedAreas = [...(formData.focus_areas || [])];
        
        if (checked) {
          // If "all" is selected, clear other selections
          if (value === 'all') {
            updatedAreas = ['all'];
          } else {
            // If another option is selected, remove "all" if present
            updatedAreas = updatedAreas.filter(item => item !== 'all');
            updatedAreas.push(value);
          }
        } else {
          updatedAreas = updatedAreas.filter(item => item !== value);
        }
        
        setFormData(prev => ({
          ...prev,
          focus_areas: updatedAreas
        }));
        
        // Show insight if available
        const currentQuestion = getCurrentQuestion();
        if (currentQuestion && currentQuestion.insights && currentQuestion.insights[value]) {
          setShowInsight({ question: name, value, text: currentQuestion.insights[value] });
        }
      } else {
        // Regular checkbox
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else {
      // Handle regular inputs (radio, text, number, select)
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Show insight if available
      const currentQuestion = getCurrentQuestion();
      if (currentQuestion && currentQuestion.insights && currentQuestion.insights[value]) {
        setShowInsight({ question: name, value, text: currentQuestion.insights[value] });
      }
    }
  };
  
  const getCurrentStep = () => {
    return config.steps[step] || null;
  };
  
  const getCurrentQuestion = () => {
    const currentStep = getCurrentStep();
    if (!currentStep || !currentStep.questions) return null;
    
    const questionId = Object.keys(errors)[0]; // Get the first error, if any
    
    if (questionId) {
      return currentStep.questions.find(q => q.id === questionId);
    }
    
    return null;
  };
  
  const validateStep = () => {
    const currentStep = getCurrentStep();
    if (!currentStep) return true;
    
    const newErrors = {};
    
    currentStep.questions.forEach(question => {
      const value = question.id === 'focus_areas' 
        ? formData.focus_areas 
        : formData[question.id];
      
      if (question.required) {
        if (question.type === 'checkbox' && (!value || value.length === 0)) {
          newErrors[question.id] = `Please select at least one ${question.label.toLowerCase()}`;
        } else if (!value && value !== false) {
          newErrors[question.id] = `Please ${question.type === 'select' ? 'select' : 'enter'} ${question.label.toLowerCase()}`;
        }
      }
      
      // Additional validations for number inputs
      if (question.type === 'number' && value) {
        const numValue = parseFloat(value);
        if (question.min !== undefined && numValue < question.min) {
          newErrors[question.id] = `Value must be at least ${question.min}`;
        }
        if (question.max !== undefined && numValue > question.max) {
          newErrors[question.id] = `Value must be no more than ${question.max}`;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const nextStep = () => {
    if (validateStep()) {
      setShowInsight(null); // Clear any insights
      setStep(prevStep => prevStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    setShowInsight(null); // Clear any insights
    setStep(prevStep => Math.max(0, prevStep - 1));
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (validateStep()) {
      setIsSubmitting(true);
      
      try {
        // Format focus_areas array to comma-separated string if present
        const formattedData = {
          ...formData
        };
        
        if (formData.focus_areas && Array.isArray(formData.focus_areas)) {
          formattedData.focus_areas = formData.focus_areas.join(',');
        }
        
        // Convert boolean values to integers for PHP/MySQL compatibility
        if (formattedData.is_pregnant !== undefined) {
          formattedData.is_pregnant = formattedData.is_pregnant === 'true' || formattedData.is_pregnant === true ? 1 : 0;
        }
        
        // Send to API
        const response = await axios.post(`${API_URL}/profiles`, formattedData);
        
        if (response.data.message === 'Profile created successfully') {
          // Redirect to dashboard instead of subscription page
          navigate('/dashboard');
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
          <p>You need to be logged in to create your personalized fitness plan.</p>
          <div className="auth-buttons">
            <button className="btn-primary" onClick={() => navigate('/login')}>Login</button>
            <button className="btn-secondary" onClick={() => navigate('/register')}>Register</button>
          </div>
        </div>
      </div>
    );
  }
  
  // Render form complete message when all steps are done
  if (step >= totalSteps) {
    return (
      <div className="container questionnaire-container">
        <div className="questionnaire-complete">
          <h2>Creating Your Personalized Plan</h2>
          <p>We're analyzing your responses to create the perfect fitness program for you.</p>
          <div className="loader"></div>
        </div>
      </div>
    );
  }
  
  // Get current step configuration
  const currentStep = getCurrentStep();
  if (!currentStep) return null;
  
  return (
    <div className="container questionnaire-container">
      <div className="questionnaire-header">
        <h2>{config.title}</h2>
        <p>{config.subtitle}</p>
      </div>
      
      <div className="progress-bar">
        <div className="progress" style={{ width: `${((step + 1) / totalSteps) * 100}%` }}></div>
      </div>
      <div className="step-indicator">Step {step + 1} of {totalSteps}</div>
      
      {/* Workout Preview Panel (shown after step 1) */}
      {workoutPreview && step > 1 && (
        <div className="workout-preview">
          <h3>Your Workout Preview</h3>
          <div className="preview-details">
            <div className="preview-item">
              <span className="preview-label">Workout Type:</span>
              <span className="preview-value">{workoutPreview.workoutType}</span>
            </div>
            <div className="preview-item">
              <span className="preview-label">Frequency:</span>
              <span className="preview-value">{workoutPreview.frequency}</span>
            </div>
            <div className="preview-item">
              <span className="preview-label">Focus:</span>
              <span className="preview-value">{workoutPreview.focus}</span>
            </div>
            <div className="preview-item">
              <span className="preview-label">Est. Calories/Session:</span>
              <span className="preview-value">{workoutPreview.estimatedCalories}</span>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="questionnaire-form">
        <div className="form-content">
          <h3>{currentStep.title}</h3>
          
          {currentStep.questions.map((question) => (
            <div key={question.id} className="form-group">
              <label>{question.label}</label>
              
              {question.type === 'radio' && (
                <div className="radio-group">
                  {question.options.map(option => (
                    <label 
                      key={option.value} 
                      className={`radio-label ${formData[question.id] === option.value ? 'selected' : ''}`}
                    >
                      <input 
                        type="radio" 
                        name={question.id} 
                        value={option.value}
                        checked={formData[question.id] === option.value}
                        onChange={handleChange} 
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              )}
              
              {question.type === 'checkbox' && (
                <div className="checkbox-group">
                  {question.options.map(option => (
                    <label 
                      key={option.value} 
                      className={`checkbox-label ${formData.focus_areas?.includes(option.value) ? 'selected' : ''}`}
                    >
                      <input 
                        type="checkbox" 
                        name={question.id} 
                        value={option.value}
                        checked={formData.focus_areas?.includes(option.value) || false}
                        onChange={handleChange} 
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              )}
              
              {question.type === 'number' && (
                <input 
                  type="number" 
                  id={question.id} 
                  name={question.id} 
                  className="form-control" 
                  value={formData[question.id] || ''}
                  onChange={handleChange} 
                  min={question.min} 
                  max={question.max}
                />
              )}
              
              {question.type === 'select' && (
                <select 
                  name={question.id} 
                  className="form-control" 
                  value={formData[question.id] || ''}
                  onChange={handleChange}
                >
                  <option value="">Select an option</option>
                  {question.options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
              
              {errors[question.id] && <div className="error">{errors[question.id]}</div>}
              
              {/* Show insight tip if relevant */}
              {showInsight && showInsight.question === question.id && (
                <div className="insight-tip">
                  <div className="insight-icon">💡</div>
                  <div className="insight-text">{showInsight.text}</div>
                </div>
              )}
            </div>
          ))}
          
          {errors.submit && (
            <div className="error-message">
              {errors.submit}
            </div>
          )}
        </div>
        
        <div className="form-navigation">
          {step > 0 && (
            <button 
              type="button" 
              className="btn-secondary prev-btn"
              onClick={prevStep}
            >
              Previous
            </button>
          )}
          
          <button 
            type="button" 
            className="btn-primary next-btn"
            onClick={nextStep}
          >
            {step === totalSteps - 1 ? 'Review' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnhancedQuestionnaire;