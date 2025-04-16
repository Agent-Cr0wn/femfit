import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="container">
          <h1>About FemFit Collective</h1>
          <p>Empowering women through personalized fitness</p>
        </div>
      </div>
      
      <div className="container about-container">
        <section className="about-section mission-section">
          <div className="section-content">
            <h2>Our Mission</h2>
            <p>
              At FemFit Collective, our mission is to empower women on their fitness journeys by providing 
              personalized, accessible, and effective fitness and nutrition plans designed specifically for women's bodies and needs.
            </p>
            <p>
              We believe that fitness should be inclusive, enjoyable, and tailored to each woman's unique goals, 
              lifestyle, and preferences. Our platform is built on the understanding that women's bodies are different, 
              and their fitness journeys should reflect that uniqueness.
            </p>
          </div>
          <div className="section-image mission-image"></div>
        </section>
        
        <section className="about-section story-section">
          <div className="section-image story-image"></div>
          <div className="section-content">
            <h2>Our Story</h2>
            <p>
              FemFit Collective was born from a simple observation: women often struggle to find fitness programs 
              that truly meet their needs. Our founder, a fitness professional and mother of two, experienced firsthand 
              the challenges of finding effective workout routines that accommodated her changing body and busy schedule.
            </p>
            <p>
              Recognizing this gap in the fitness industry, she assembled a team of women's health experts, 
              nutritionists, and fitness professionals to create a platform that puts women at the center of the fitness experience.
            </p>
            <p>
              Since our launch, we've helped thousands of women transform their lives through customized fitness plans 
              that respect their bodies, fit into their lifestyles, and help them achieve their unique goals.
            </p>
          </div>
        </section>
        
        <section className="about-section values-section">
          <div className="section-content">
            <h2>Our Values</h2>
            <div className="values-grid">
              <div className="value-card">
                <h3>Personalization</h3>
                <p>We believe every woman deserves a fitness plan as unique as she is.</p>
              </div>
              
              <div className="value-card">
                <h3>Inclusivity</h3>
                <p>We welcome and support women of all ages, sizes, and fitness levels.</p>
              </div>
              
              <div className="value-card">
                <h3>Empowerment</h3>
                <p>We aim to build confidence through achievable fitness milestones.</p>
              </div>
              
              <div className="value-card">
                <h3>Community</h3>
                <p>We foster a supportive environment where women can share and grow together.</p>
              </div>
              
              <div className="value-card">
                <h3>Education</h3>
                <p>We believe in helping women understand the "why" behind their fitness journey.</p>
              </div>
              
              <div className="value-card">
                <h3>Balance</h3>
                <p>We promote sustainable fitness that complements rather than dominates life.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="about-section team-section">
          <h2>Our Expert Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-photo"></div>
              <h3>Sarah Johnson</h3>
              <p className="member-title">Founder & CEO</p>
              <p className="member-bio">
                Certified Personal Trainer with 15+ years of experience specializing in women's fitness.
              </p>
            </div>
            
            <div className="team-member">
              <div className="member-photo"></div>
              <h3>Dr. Emily Chen</h3>
              <p className="member-title">Women's Health Expert</p>
              <p className="member-bio">
                Board-certified OB/GYN with expertise in fitness during pregnancy and postpartum recovery.
              </p>
            </div>
            
            <div className="team-member">
              <div className="member-photo"></div>
              <h3>Maria Rodriguez</h3>
              <p className="member-title">Head Nutritionist</p>
              <p className="member-bio">
                Registered Dietitian specializing in women's nutritional needs across all life stages.
              </p>
            </div>
            
            <div className="team-member">
              <div className="member-photo"></div>
              <h3>Lisa Thompson</h3>
              <p className="member-title">Yoga & Mindfulness Coach</p>
              <p className="member-bio">
                Certified yoga instructor with 10+ years teaching holistic wellness practices.
              </p>
            </div>
          </div>
        </section>
        
        <section className="join-section">
          <div className="join-content">
            <h2>Join Our Community</h2>
            <p>
              Ready to experience fitness designed specifically for you? Join thousands of women who have transformed 
              their lives with FemFit Collective's personalized approach to women's fitness.
            </p>
            <div className="join-buttons">
              <Link to="/register" className="btn-primary">Start Your Journey</Link>
              <Link to="/fitness-questionnaire" className="btn-secondary">Explore Programs</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;