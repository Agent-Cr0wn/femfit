import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SUBSCRIPTION_PLANS } from '../utils/constants';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import './Subscription.css';

const Subscription = () => {
  const { currentUser, updateSubscription } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if coming from questionnaire
  const fromQuestionnaire = location.state?.fromQuestionnaire || false;
  
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  
  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };
  
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };
  
  const handleCardDetailChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: value
    });
  };
  
  const validateCardDetails = () => {
    // Simple validation
    if (!cardDetails.cardName.trim()) return false;
    if (cardDetails.cardNumber.replace(/\s/g, '').length !== 16) return false;
    if (!cardDetails.expiryDate.match(/^\d{2}\/\d{2}$/)) return false;
    if (cardDetails.cvv.length < 3) return false;
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!selectedPlan) {
      setError('Please select a subscription plan');
      return;
    }
    
    if (paymentMethod === 'card' && !validateCardDetails()) {
      setError('Please enter valid card details');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Get plan details
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlan);
      
      // Calculate subscription end date
      let endDate = new Date();
      switch (selectedPlan) {
        case 'monthly':
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case 'quarterly':
          endDate.setMonth(endDate.getMonth() + 3);
          break;
        case 'biannual':
          endDate.setMonth(endDate.getMonth() + 6);
          break;
        default:
          break;
      }
      
      // Process subscription in backend (simplified)
      const response = await axios.post(`${API_URL}/users/${currentUser.id}/subscription`, {
        user_id: currentUser.id,
        subscription_type: selectedPlan,
        subscription_status: 'active',
        subscription_end_date: endDate.toISOString().split('T')[0],
        payment_method: paymentMethod,
        amount: plan.price
      });
      
      if (response.data.message === 'Subscription updated successfully') {
        // Update user context with new subscription
        updateSubscription({
          subscription_type: selectedPlan,
          subscription_status: 'active',
          subscription_end_date: endDate.toISOString().split('T')[0]
        });
        
        // Redirect based on where user came from
        if (fromQuestionnaire) {
          navigate('/dashboard');
        } else {
          navigate('/dashboard', { state: { subscriptionUpdated: true } });
        }
      }
    } catch (err) {
      console.error('Error processing subscription:', err);
      setError('Failed to process your subscription. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="subscription-page">
      <div className="container subscription-container">
        <div className="subscription-header">
          <h1>Choose Your FemFit Membership</h1>
          <p>Select the plan that best fits your fitness journey</p>
        </div>
        
        {error && (
          <div className="subscription-error">
            {error}
          </div>
        )}
        
        <div className="subscription-plans">
          {SUBSCRIPTION_PLANS.map(plan => (
            <div 
              key={plan.id} 
              className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''}`}
              onClick={() => handlePlanSelect(plan.id)}
            >
              <div className="plan-header">
                <h2>{plan.name}</h2>
                <div className="plan-price">
                  <span className="price">${plan.price}</span>
                  <span className="duration">/{plan.duration}</span>
                </div>
              </div>
              
              <div className="plan-features">
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              
              <div className="plan-footer">
                <button 
                  className={`btn-select ${selectedPlan === plan.id ? 'selected' : ''}`}
                >
                  {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {selectedPlan && (
          <div className="payment-section">
            <h2>Payment Method</h2>
            <div className="payment-methods">
              <div 
                className={`payment-method ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => handlePaymentMethodChange('card')}
              >
                <div className="payment-icon">💳</div>
                <span>Credit/Debit Card</span>
              </div>
              
              <div 
                className={`payment-method ${paymentMethod === 'paypal' ? 'active' : ''}`}
                onClick={() => handlePaymentMethodChange('paypal')}
              >
                <div className="payment-icon">P</div>
                <span>PayPal</span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="payment-form">
              {paymentMethod === 'card' && (
                <div className="card-details">
                  <div className="form-group">
                    <label htmlFor="cardName">Cardholder Name</label>
                    <input 
                      type="text" 
                      id="cardName" 
                      name="cardName" 
                      className="form-control" 
                      placeholder="Enter cardholder name" 
                      value={cardDetails.cardName}
                      onChange={handleCardDetailChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input 
                      type="text" 
                      id="cardNumber" 
                      name="cardNumber" 
                      className="form-control" 
                      placeholder="1234 5678 9012 3456" 
                      value={cardDetails.cardNumber}
                      onChange={handleCardDetailChange}
                      required
                      maxLength="19"
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="expiryDate">Expiry Date</label>
                      <input 
                        type="text" 
                        id="expiryDate" 
                        name="expiryDate" 
                        className="form-control" 
                        placeholder="MM/YY" 
                        value={cardDetails.expiryDate}
                        onChange={handleCardDetailChange}
                        required
                        maxLength="5"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="cvv">CVV</label>
                      <input 
                        type="text" 
                        id="cvv" 
                        name="cvv" 
                        className="form-control" 
                        placeholder="123" 
                        value={cardDetails.cvv}
                        onChange={handleCardDetailChange}
                        required
                        maxLength="4"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {paymentMethod === 'paypal' && (
                <div className="paypal-info">
                  <p>You will be redirected to PayPal to complete your payment.</p>
                </div>
              )}
              
              <div className="order-summary">
                <h3>Order Summary</h3>
                <div className="summary-item">
                  <span>Plan:</span>
                  <span>{selectedPlan ? SUBSCRIPTION_PLANS.find(p => p.id === selectedPlan)?.name : 'No plan selected'}</span>
                </div>
                <div className="summary-item">
                  <span>Duration:</span>
                  <span>{selectedPlan ? SUBSCRIPTION_PLANS.find(p => p.id === selectedPlan)?.duration : ''}</span>
                </div>
                <div className="summary-item total">
                  <span>Total:</span>
                  <span>${selectedPlan ? SUBSCRIPTION_PLANS.find(p => p.id === selectedPlan)?.price : '0.00'}</span>
                </div>
              </div>
              
              <div className="terms-agreement">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">
                  I agree to the Terms of Service, Privacy Policy, and Subscription Terms
                </label>
              </div>
              
              <button 
                type="submit" 
                className="btn-primary btn-subscribe"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Complete Purchase'}
              </button>
            </form>
          </div>
        )}
        
        <div className="subscription-footer">
          <h3>100% Satisfaction Guarantee</h3>
          <p>If you're not completely satisfied with your subscription within the first 7 days, we'll refund your payment. No questions asked.</p>
        </div>
      </div>
    </div>
  );
};
export default Subscription;