import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <h1>Fitness Tailored for Women</h1>
            <p>Personalized workout and nutrition plans designed specifically for your body, goals, and lifestyle.</p>
            <div className="hero-cta">
              <Link to="/register" className="btn-primary">Start Your Journey</Link>
              <Link to="/about" className="btn-secondary">Learn More</Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose FemFit Collective?</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Personalized Plans</h3>
              <p>Every workout and meal plan is tailored specifically to your body type, fitness level, and goals.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🤱</div>
              <h3>New Mother Focus</h3>
              <p>Specialized programs for pregnant women and new mothers to regain strength and confidence.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🧘‍♀️</div>
              <h3>Holistic Wellness</h3>
              <p>Mind and body integration with yoga, meditation, and breathwork practices for complete wellness.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🍎</div>
              <h3>Nutrition Guidance</h3>
              <p>Detailed meal plans and recipes designed to complement your fitness journey.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Programs Section */}
      <section className="programs-section">
        <div className="container">
          <h2 className="section-title">Our Programs</h2>
          
          <div className="programs-container">
            <div className="program-card">
              <div className="program-image fitness-program"></div>
              <div className="program-content">
                <h3>Fitness</h3>
                <p>Whether you want to lose weight, build muscle, or improve overall fitness, our personalized programs adapt to your goals.</p>
                <Link to="/fitness-questionnaire" className="program-link">Get Started</Link>
              </div>
            </div>
            
            <div className="program-card">
              <div className="program-image mothers-program"></div>
              <div className="program-content">
                <h3>New Mothers</h3>
                <p>Safe and effective workouts designed specifically for pregnant women and new mothers to strengthen and recover.</p>
                <Link to="/mothers-questionnaire" className="program-link">Get Started</Link>
              </div>
            </div>
            
            <div className="program-card">
              <div className="program-image holistic-program"></div>
              <div className="program-content">
                <h3>Holistic Wellness</h3>
                <p>Balance your mind and body with yoga, meditation, and breathwork practices for complete wellness.</p>
                <Link to="/holistic-questionnaire" className="program-link">Get Started</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">Success Stories</h2>
          
          <div className="testimonials-container">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"FemFit transformed my postpartum fitness journey. The personalized workouts helped me regain my strength and confidence in just 3 months!"</p>
              </div>
              <div className="testimonial-author">
                <div className="testimonial-avatar"></div>
                <div className="testimonial-info">
                  <h4>Sarah M.</h4>
                  <p>New Mother, 32</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"As a busy professional, I never thought I'd find time for fitness. The 30-minute programs fit perfectly into my schedule, and I've lost 15 pounds!"</p>
              </div>
              <div className="testimonial-author">
                <div className="testimonial-avatar"></div>
                <div className="testimonial-info">
                  <h4>Jennifer K.</h4>
                  <p>Marketing Director, 45</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The holistic approach has been life-changing. Not only am I physically stronger, but the stress management techniques have improved my mental health."</p>
              </div>
              <div className="testimonial-author">
                <div className="testimonial-avatar"></div>
                <div className="testimonial-info">
                  <h4>Michelle T.</h4>
                  <p>Student, 25</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Life?</h2>
            <p>Join thousands of women who have achieved their fitness goals with personalized plans from FemFit Collective.</p>
            <Link to="/register" className="btn-primary cta-button">Get Started Today</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;