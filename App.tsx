import React, {useRef, useEffect, useState} from 'react';
import {SafeAreaView, LogBox} from 'react-native';
import Toast from 'react-native-toast-message';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import {NativeBaseProvider} from 'native-base';
import AppNavigator from './src/navigation/navigation';
import {I18nextProvider} from 'react-i18next';
import i18n, {fetchTranslations, clearSavedLanguage} from './src/utilities/languageData/index';
import Colors from './src/utilities/constants/colors';
import {StripeProvider} from '@stripe/stripe-react-native';
import {EnvConfig} from './src/config/envConfig';
import {NavigationContainerRef} from '@react-navigation/native';

// Ignore yellow box warnings
LogBox.ignoreAllLogs();

// Initialize Stripe
const stripePromise = new Promise(resolve => {
  resolve(EnvConfig.stripe.publishKey);
});

function App() {
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  const routeNameRef = useRef<string | undefined>(undefined);
  const [currentRouteName, setCurrentRouteName] = useState<string | undefined>(undefined);

  React.useEffect(() => {
    const initializeApp = async () => {
      // Don't clear saved language, respect user's selection
      await fetchTranslations();
    };
    
    initializeApp();
  }, []);

  // Log active route whenever it changes
  useEffect(() => {
    const logInitialRoute = () => {
      setTimeout(() => {
        if (navigationRef.current) {
          const routeName = navigationRef.current.getCurrentRoute()?.name;
          // console.log('📱 INITIAL ROUTE:', routeName);
          routeNameRef.current = routeName;
          setCurrentRouteName(routeName);
        }
      }, 500);
    };

    logInitialRoute();

    // Set up event listener for route changes
    const interval = setInterval(() => {
      if (navigationRef.current) {
        const previousRouteName = routeNameRef.current;
        const newRouteName = navigationRef.current.getCurrentRoute()?.name;

        if (previousRouteName !== newRouteName) {
          // Route has changed
          // console.log('📱 ROUTE CHANGED:', {
          //   from: previousRouteName || 'undefined',
          //   to: newRouteName
          // });
          
          // Save the new route name
          routeNameRef.current = newRouteName;
          setCurrentRouteName(newRouteName);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Log state changes
  useEffect(() => {
    console.log('📱 CURRENT ROUTE STATE UPDATED:', currentRouteName);
  }, [currentRouteName]);

  return (
    <I18nextProvider i18n={i18n}>
      <NativeBaseProvider>
        <Provider store={store}>
          <StripeProvider publishableKey={EnvConfig.stripe.publishKey}>
           
            <SafeAreaView style={{flex: 1, backgroundColor:currentRouteName=="Splash"?'#102224': 'transparent'}}>
              <AppNavigator ref={navigationRef} />
              <Toast />
            </SafeAreaView>
          </StripeProvider>
        </Provider>
      </NativeBaseProvider>
    </I18nextProvider>
  );
}

export default App;
