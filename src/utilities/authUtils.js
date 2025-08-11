import { useSelector } from 'react-redux';
import { selectAuthToken, selectAuthUserId } from '../redux/features/auth/authSelectors';

// Hook to check if user is authenticated
export const useAuth = () => {
  const token = useSelector(selectAuthToken);
  const userId = useSelector(selectAuthUserId);
  
  const isAuthenticated = !!(token && userId);
  
  return {
    isAuthenticated,
    token,
    userId,
  };
};

// Function to check if authentication is required for a feature
export const requiresAuth = (feature) => {
  const accountBasedFeatures = [
    'favorites',
    'addToFavorites',
    'removeFromFavorites',
    'addProduct',
    'editProduct',
    'deleteProduct',
    'chat',
    'messages',
    'profile',
    'reservations',
    'booking',
    'checkout',
    'myDocuments',
    'paymentPreferences',
    'subscription',
    'highlightBike',
    'promotion'
  ];
  
  return accountBasedFeatures.includes(feature);
};

// Function to get user-friendly feature names for auth prompts
export const getFeatureName = (feature) => {
  const featureNames = {
    'favorites': 'add to favorites',
    'addToFavorites': 'add to favorites',
    'removeFromFavorites': 'remove from favorites',
    'addProduct': 'list your bike',
    'editProduct': 'edit your bike',
    'deleteProduct': 'delete your bike',
    'chat': 'chat with bike owner',
    'messages': 'access messages',
    'profile': 'access your profile',
    'reservations': 'view your reservations',
    'booking': 'make a reservation',
    'checkout': 'complete booking',
    'myDocuments': 'access your documents',
    'paymentPreferences': 'manage payment preferences',
    'subscription': 'manage subscription',
    'highlightBike': 'highlight your bike',
    'promotion': 'promote your bike'
  };
  
  return featureNames[feature] || feature;
}; 