import React from 'react';
import './NutritionTips.css';

const tips = [
  "Eat protein with every meal to maintain muscle mass and stay fuller longer.",
  "Aim for 8 glasses of water per day to stay hydrated and support metabolism.",
  "Include fiber-rich vegetables with lunch and dinner to stay full and support digestion.",
  "Choose complex carbs like whole grains, sweet potatoes, and beans for sustained energy.",
  "Include healthy fats like avocado, nuts, and olive oil to support hormone production.",
  "Meal prep on weekends to ensure you have healthy options available throughout the week."
];

const NutritionTips = () => {
  // Get a random tip from the array
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  
  // Simulate a water tracking progress
  const waterCount = Math.floor(Math.random() * 8) + 1;
  const waterPercentage = (waterCount / 10) * 100;
  
  return (
    <div className="nutrition-tips-container">
      <div className="tip-box">
        <h4>Today's Nutrition Tip</h4>
        <p>{randomTip}</p>
      </div>
      
      <div className="water-tracker">
        <div className="tracker-header">
          <h4>Water Intake</h4>
          <span>{waterCount}/10 glasses</span>
        </div>
        <div className="water-progress-bar">
          <div 
            className="water-progress" 
            style={{ width: `${waterPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default NutritionTips;