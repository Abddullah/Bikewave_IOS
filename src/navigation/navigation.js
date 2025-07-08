import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// local imports
import Splash from './../screens/Splash/index';
import Register from '../screens/Register';
import Login from '../screens/Login';
import ForgotPassword from '../screens/ForgotPassword';
import ResetPassword from '../screens/ResetPassword';
import {AppBottomNavigator} from './BottomNavigation';
import DateFilter from '../screens/Filters';
import PriceFilter from '../screens/Filters/PriceFilter';
import Product from '../screens/Product';
//checkout
import {Step1} from '../screens/Checkout/Step1';
import {Step2} from '../screens/Checkout/Step2';
import {Step3} from '../screens/Checkout/Step3';

import EditBike from '../screens/EditBike';
//home
import HighlightBike from '../screens/HighlightBike';
import Promotion from '../screens/Promotion';
import Subscription from '../screens/Subscription';
import MyDocuments from '../screens/MyDocuments';
import PaymentPreferences from '../screens/PaymentPreferences';
import EditProfile from '../screens/EditProfile';
import EditPassword from '../screens/EditPassword';
import linking from '../utilities/linking';
import {getItem} from '../services/assynsStorage';
import { setUser, setUserToken } from '../redux/features/auth/authSlice';
import { useDispatch } from 'react-redux';
const Stack = createNativeStackNavigator();

// Creating a forwardRef component to expose navigation methods to parent components
const AppNavigator = React.forwardRef((props, ref) => {
  const [initialRoute, setInitialRoute] = React.useState('Splash');
  const [isLoading, setIsLoading] = React.useState(true);
  const dispatch = useDispatch();   
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getItem('userToken');
        if (userData) {
          const parsed = JSON.parse(userData);
          const token = parsed.token;
          await dispatch(setUserToken(token));
          await dispatch(setUser(parsed));
          setInitialRoute('Tabs');
        } else {
          setInitialRoute('Splash');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setInitialRoute('Splash');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer 
      ref={ref} 
      linking={linking}
      onStateChange={state => {
        const currentRouteName = ref?.current?.getCurrentRoute()?.name;
        if (currentRouteName) {
          console.log('Navigation State Changed - Current Route2:', currentRouteName);
        }
      }}
    >
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          options={{headerShown: false}}
          component={Splash}
          name="Splash"
        />
        <Stack.Screen
          options={{headerShown: false}}
          component={Register}
          name="Register"
        />
        <Stack.Screen
          options={{headerShown: false}}
          component={Login}
          name="Login"
        />
        <Stack.Screen
          options={{headerShown: false}}
          component={ForgotPassword}
          name="ForgotPassword"
        />
        <Stack.Screen
          options={{headerShown: false}}
          component={ResetPassword}
          name="ResetPassword"
        />
        <Stack.Screen
          options={{headerShown: false}}
          component={DateFilter}
          name="DateFilter"
        />
        <Stack.Screen
          options={{headerShown: false}}
          component={PriceFilter}
          name="PriceFilter"
        />
        <Stack.Screen
          options={{headerShown: false}}
          component={Product}
          name="Product"
        />
        <Stack.Screen
          options={{headerShown: false}}
          component={Step1}
          name="Step1"
        />
        <Stack.Screen
          options={{headerShown: false}}
          component={Step2}
          name="Step2"
        />
        <Stack.Screen
          options={{headerShown: false}}
          component={Step3}
          name="Step3"
        />
        <Stack.Screen
          options={{headerShown: false}}
          component={EditBike}
          name="EditBike"
        />
        <Stack.Screen
          options={{headerShown: false}}
          component={EditPassword}
          name="EditPassword"
        />
        <Stack.Screen
          options={{headerShown: false}}
          component={EditProfile}
          name="EditProfile"
        />
        <Stack.Screen
          options={{headerShown: false}}
          component={HighlightBike}
          name="HighlightBike"
        />
        <Stack.Screen
          options={{headerShown: false}}
          component={Promotion}
          name="Promotion"
        />
        <Stack.Screen
          options={{headerShown: false}}
          component={Subscription}
          name="Subscription"
        />
        <Stack.Screen
          options={{headerShown: false}}
          component={MyDocuments}
          name="MyDocuments"
        />
        <Stack.Screen
          options={{headerShown: false}}
          component={PaymentPreferences}
          name="PaymentPreferences"
        />
        <Stack.Screen
          options={{headerShown: false}}
          component={AppBottomNavigator}
          name="Tabs"
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
});

export default AppNavigator;
