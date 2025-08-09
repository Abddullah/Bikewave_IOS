import React, { useState } from 'react';
import { Text, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  createBottomTabNavigator,
  BottomTabBar,
} from '@react-navigation/bottom-tabs';
import { Typography } from '../utilities/constants/constant.style';
import { colors } from '../utilities/constants';
import { useAuth } from '../utilities/authUtils';
import AuthPrompt from '../components/AuthPrompt';
import { useNavigation } from '@react-navigation/native';

// icons
import {
  FavouriteActive,
  FavouriteInactive,
  HomeActive,
  HomeInactive,
  MessagesActive,
  MessagesInactive,
  OfferActive,
  OfferInactive,
  ProfileActive,
  ProfileInactive,
} from '../assets/svg';

// bottom navigation screens
import Home from '../screens/Home';
// home
import Past from '../screens/ReservationsClient/Past';
import InProgress from '../screens/ReservationsClient/InProgress';
import Earrings from '../screens/ReservationsOwner/Earrings';
import Confirmed from '../screens/ReservationsOwner/Confirmed';
import Record from '../screens/ReservationsOwner/Record';
import FeaturedBikes from '../screens/FeaturedBikes';

import Favorites from '../screens/Favorites';
// import Offer from '../screens/Offer';
import Messages from '../screens/Messages';
import Profile from '../screens/Profile';

import { Step1 } from '../screens/ListProduct/Step1';
import { Step2 } from '../screens/ListProduct/Step2';
import { Step3 } from '../screens/ListProduct/Step3';
import { Step4 } from '../screens/ListProduct/Step4';
import { Step5 } from '../screens/ListProduct/Step5';
import { Step6 } from '../screens/ListProduct/Step6';

import { AddBicycleWrapper } from '../screens/ListProduct/AddBicycleWrapper';

import Configuration from '../screens/Configuration';

import Chat from '../screens/Chat';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Authentication wrapper component for protected tabs
const AuthenticatedTabWrapper = ({ children, feature, featureName }) => {
  const { isAuthenticated } = useAuth();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const navigation = useNavigation();

  React.useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
    }
  }, [isAuthenticated]);

  // Reset modal state when tab focus changes
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!isAuthenticated) {
        setShowAuthPrompt(true);
      }
    });

    return unsubscribe;
  }, [navigation, isAuthenticated]);

  const handleClose = () => {
    setShowAuthPrompt(false);
    // Navigate back to Home tab when closing auth prompt
    navigation.navigate('Home');
  };

  if (!isAuthenticated) {
    return (
      <AuthPrompt
        visible={showAuthPrompt}
        onClose={handleClose}
        feature={feature}
        featureName={featureName}
      />
    );
  }

  return children;
};

function HomeRoutes() {
  return (
    <Stack.Navigator initialRouteName="Home1">
      <Stack.Screen
        options={{ headerShown: false }}
        name="Home1"
        component={Home}
      />
    </Stack.Navigator>
  );
}

function FavoritesRoutes() {
  const { t } = useTranslation();
  return (
    <AuthenticatedTabWrapper feature="favorites" featureName={t('add_to_favorites')}>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Favorites1"
          component={Favorites}
        />
      </Stack.Navigator>
    </AuthenticatedTabWrapper>
  );
}

function OfferRoutes() {
  const { t } = useTranslation();
  return (
    <AuthenticatedTabWrapper feature="addProduct" featureName={t('list_your_bike')}>
      <Stack.Navigator initialRouteName="AddBicycle">
        <Stack.Screen
          options={{ headerShown: false }}
          name="AddBicycle"
          component={AddBicycleWrapper}
        />
      </Stack.Navigator>
    </AuthenticatedTabWrapper>
  );
}

function MessagesRoutes() {
  const { t } = useTranslation();
  return (
    <AuthenticatedTabWrapper feature="messages" featureName={t('chat_with_owners')}>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Messages1"
          component={Messages}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Chat"
          component={Chat}
        />
      </Stack.Navigator>
    </AuthenticatedTabWrapper>
  );
}

function ProfileRoutes() {
  const { t } = useTranslation();
  return (
    <AuthenticatedTabWrapper feature="profile" featureName={t('your_profile')}>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Profile1"
          component={Profile}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Configuration"
          component={Configuration}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="InProgress"
          component={InProgress}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Past"
          component={Past}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Earrings"
          component={Earrings}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Confirmed"
          component={Confirmed}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Record"
          component={Record}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="FeaturedBikes"
          component={FeaturedBikes}
        />
      </Stack.Navigator>
    </AuthenticatedTabWrapper>
  );
}

export function AppBottomNavigator() {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      initialRouteName={'Home'}
      tabBar={props => {
        return <BottomTabBar {...props} />;
      }}
      screenOptions={{
        tabBarStyle: {
          height: 70,
          paddingBottom: Platform.OS === 'ios' ? 0 : 0,
        },
        tabBarHideOnKeyboard: true,
      }}>
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarLabel: ({ focused }) => {
            return (
              <Text
                style={[
                  {
                    color: focused ? colors.primary : colors.dark_gray,
                    top: Platform.OS === 'ios' ? -8 : -12,
                  },
                  Typography.f_12_roboto_medium,
                ]}>
                {t('home')}
              </Text>
            );
          },
          tabBarIcon: ({ focused }) => {
            return focused ? <HomeActive /> : <HomeInactive />;
          },
        }}
        name="Home"
        component={HomeRoutes}
      />
     
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarLabel: ({ focused }) => {
            return (
              <Text
                style={[
                  {
                    color: focused ? colors.primary : colors.dark_gray,
                    top: Platform.OS === 'ios' ? -8 : -12,
                  },
                  Typography.f_12_roboto_medium,
                ]}>
                {t('favorites')}
              </Text>
            );
          },
          tabBarIcon: ({ focused }) => {
            return focused ? <FavouriteActive /> : <FavouriteInactive />;
          },
        }}
        name="Favorites"
        component={FavoritesRoutes}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          // tabBarStyle: { display: 'none' },
          tabBarLabel: ({ focused }) => {
            return (
              <Text
                style={[
                  {
                    color: focused ? colors.primary : colors.dark_gray,
                    top: Platform.OS === 'ios' ? -8 : -12,
                  },
                  Typography.f_12_roboto_medium,
                ]}>
                {t('offer')}
              </Text>
            );
          },
          tabBarIcon: ({ focused }) => {
            return focused ? <OfferActive /> : <OfferInactive />;
          },
        }}
        name="Offer"
        component={OfferRoutes}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarLabel: ({ focused }) => {
            return (
              <Text
                style={[
                  {
                    color: focused ? colors.primary : colors.dark_gray,
                    top: Platform.OS === 'ios' ? -8 : -12,
                  },
                  Typography.f_12_roboto_medium,
                ]}>
                {t('messages')}
              </Text>
            );
          },
          tabBarIcon: ({ focused }) => {
            return focused ? <MessagesActive /> : <MessagesInactive />;
          },
        }}
        name="Messages"
        component={MessagesRoutes}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarLabel: ({ focused }) => {
            return (
              <Text
                style={[
                  {
                    color: focused ? colors.primary : colors.dark_gray,
                    top: Platform.OS === 'ios' ? -8 : -12,
                  },
                  Typography.f_12_roboto_medium,
                ]}>
                {t('profile')}
              </Text>
            );
          },
          tabBarIcon: ({ focused }) => {
            return focused ? <ProfileActive /> : <ProfileInactive />;
          },
        }}
        name="Profile"
        component={ProfileRoutes}
      />
    </Tab.Navigator>
  );
}
