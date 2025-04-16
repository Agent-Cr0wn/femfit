import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FitnessQuestionnaire from './pages/FitnessQuestionnaire';
import MothersQuestionnaire from './pages/MothersQuestionnaire';
import HolisticQuestionnaire from './pages/HolisticQuestionnaire';
import Subscription from './pages/Subscription';
import WorkoutPlan from './pages/WorkoutPlan';
import AboutUs from './pages/AboutUs';
import NotFound from './pages/NotFound';
import EnhancedQuestionnaire from './components/EnhancedQuestionnaire';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<AboutUs />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          // In your routes/pages
          <Route 
            path="/fitness-questionnaire" 
            element={
              <ProtectedRoute>
                <EnhancedQuestionnaire type="fitness" />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/mothers-questionnaire" 
            element={
              <ProtectedRoute>
                <EnhancedQuestionnaire type="new_mother" />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/holistic-questionnaire" 
            element={
              <ProtectedRoute>
                <EnhancedQuestionnaire type="holistic" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/subscription" 
            element={
              <ProtectedRoute>
                <Subscription />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/workout-plan/:id" 
            element={
              <ProtectedRoute>
                <WorkoutPlan />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;