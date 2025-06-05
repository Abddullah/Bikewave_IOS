import React, {useRef} from 'react';
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

// Ignore yellow box warnings
LogBox.ignoreAllLogs();

// Initialize Stripe
const stripePromise = new Promise(resolve => {
  resolve(EnvConfig.stripe.publishKey);
});
function App() {
  const navigationRef = useRef(null);

  React.useEffect(() => {
    const initializeApp = async () => {
      // Don't clear saved language, respect user's selection
      await fetchTranslations();
    };
    
    initializeApp();
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <NativeBaseProvider>
        <Provider store={store}>
          <StripeProvider publishableKey={EnvConfig.stripe.publishKey}>
            <SafeAreaView style={{flex: 1, backgroundColor: 'transparent'}}>
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
