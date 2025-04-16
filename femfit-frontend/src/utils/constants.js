export const API_URL = 'https://femfit.ct.ws/api';

// Subscription Plans
export const SUBSCRIPTION_PLANS = [
  {
    id: 'monthly',
    name: 'Monthly Plan',
    price: 14.99,
    duration: '1 month',
    features: [
      'Personalized fitness plans',
      'Access to exercise videos',
      'Weekly progress tracking',
      'Email support'
    ]
  },
  {
    id: 'quarterly',
    name: 'Quarterly Plan',
    price: 39.99,
    duration: '3 months',
    features: [
      'All features in Monthly Plan',
      'Nutrition guidance',
      'Priority email support',
      '10% discount'
    ]
  },
  {
    id: 'biannual',
    name: 'Biannual Plan',
    price: 69.99,
    duration: '6 months',
    features: [
      'All features in Quarterly Plan',
      'Advanced analytics',
      'Community access',
      '20% discount'
    ]
  }
];