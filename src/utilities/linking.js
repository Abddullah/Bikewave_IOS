/**
 * Deep Linking Configuration for React Navigation
 * This file defines URL patterns that the app will recognize for deep linking.
 */
import {getStateFromPath} from '@react-navigation/native';
import {EnvConfig} from '../config/envConfig';

// Configuration object for linking
const config = {
  screens: {
    // Define which URL patterns map to which screens in your app
    Tabs: {
      path: '',
      screens: {
        // Add paths for nested tab screens if needed
        Home: 'home',
        Search: 'search',
        MyBikes: 'my-bikes',
        Messages: 'messages',
        Profile: 'profile',
      },
    },
    // Add direct routes to specific screens
    Product: {
      path: 'product/:id',
      parse: {
        id: id => `${id}`,
      },
    },
    Login: 'login',
    Register: 'register',
    ForgotPassword: 'forgot-password',
    ResetPassword: 'reset-password',
    EditProfile: 'profile/edit',
    PaymentPreferences: 'payment/preferences',
    Step1: 'checkout/step1',
    Step2: 'checkout/step2',
    Step3: 'checkout/step3',
    Subscription: 'subscription',
    MyDocuments: 'documents',
    EditBike: 'edit-bike/:id',
    HighlightBike: 'highlight-bike/:id',
    // Add more routes as needed
  },
};

// URL prefixes that the app will handle
const linking = {
  prefixes: [
    `${EnvConfig.app.scheme}://`,
    EnvConfig.app.httpsDomain,
    EnvConfig.app.httpDomain,
  ],
  config,
  // Optional: You can add custom error handling for when deep linking fails
  getStateFromPath: (path, config) => {
    console.log('Deep link path:', path);
    try {
      // Use default behavior
      return getStateFromPath(path, config);
    } catch (error) {
      console.error('Error parsing deep link:', error);
      // Default to home screen if parsing fails
      return {routes: [{name: 'Tabs'}]};
    }
  },
};

export default linking;
