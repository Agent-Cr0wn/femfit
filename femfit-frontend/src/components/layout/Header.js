import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <Link to="/">
            <h1>FemFit Collective</h1>
          </Link>
        </div>
        
        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <nav className={`main-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul>
            <li><Link to="/">Home</Link></li>
            
            <li className="dropdown">
              <span className="dropdown-toggle">Fitness</span>
              <div className="dropdown-menu">
                <Link to="/fitness-questionnaire">Personalized Program</Link>
                {isAuthenticated && <Link to="/dashboard">My Fitness Plan</Link>}
              </div>
            </li>
            
            <li className="dropdown">
              <span className="dropdown-toggle">New Mothers</span>
              <div className="dropdown-menu">
                <Link to="/mothers-questionnaire">Get Your Body Back</Link>
                {isAuthenticated && <Link to="/dashboard">My Program</Link>}
              </div>
            </li>
            
            <li className="dropdown">
              <span className="dropdown-toggle">Holistic Wellness</span>
              <div className="dropdown-menu">
                <Link to="/holistic-questionnaire">Mind & Body</Link>
                {isAuthenticated && <Link to="/dashboard">My Wellness Plan</Link>}
              </div>
            </li>
            
            <li><Link to="/about">About Us</Link></li>
            
            {isAuthenticated ? (
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li className="auth-item">
                  <button onClick={handleLogout} className="btn-secondary">Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="auth-item"><Link to="/login">Login</Link></li>
                <li className="auth-item">
                  <Link to="/register" className="btn-primary register-btn">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;