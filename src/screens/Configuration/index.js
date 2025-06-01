import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import AppStatusBar from '../../components/AppStatusBar';
import { useSelector, useDispatch } from 'react-redux';
import { deleteUser } from '../../redux/features/auth/authThunks';
import {
  selectAuthLoading,
  selectAuthError,
  selectAuthUserId,
} from '../../redux/features/auth/authSelectors';
import { Typography } from '../../utilities/constants/constant.style';
import Colors from '../../utilities/constants/colors';
import TabBar from '../../components/TabBar';
import { NextGreen, TickGreenWithBG, Cross } from '../../assets/svg';
import BottomSheet from '../../components/BottomSheet';
import AppButton from '../../components/AppButton';
import PopUp from '../../components/PopUp';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import store from '../../redux/store';
import { setUserToken } from '../../redux/features/auth/authSlice';
import { deleteItem } from '../../services/assynsStorage';
import { removeFCMToken } from '../../utilities/fcmTokenManager';

const MenuItem = ({ title, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    style={styles.menuItemContainer}>
    <Text style={styles.menuItemText}>{title}</Text>
    <NextGreen />
  </TouchableOpacity>
);

const MenuSection = ({ title, items }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.menuSectionContainer}>
      <View style={styles.menuCardContainer}>
        {title && <Text style={styles.sectionTitleText}>{title}</Text>}
        {items.map(item => (
          <MenuItem key={item.key} title={t(item.key)} onPress={item.onPress} />
        ))}
      </View>
    </View>
  );
};

export default function Configuration({ navigation }) {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('config');
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const authLoading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);
  const userId = useSelector(selectAuthUserId);
  const { t } = useTranslation();
  const refRBSheet = useRef();

  useEffect(() => {
    setActiveTab('config');
  }, [activeTab]);

  const openBottomSheet = () => {
    if (refRBSheet.current) {
      refRBSheet.current.open();
    }
  };

  const tabs = [
    { key: 'about', label: t('about_me'), navTarget: { screen: 'Profile1' } },
    {
      key: 'config',
      label: t('configuration'),
      navTarget: { screen: 'Configuration' },
    },
  ];

  const accountItems = [
    {
      key: 'my_reservations_client',
      onPress: () => navigation.navigate('Home', { screen: 'InProgress' }),
    },
    {
      key: 'my_reservations_owner',
      onPress: () => navigation.navigate('Home', { screen: 'Earrings' }),
    },
    {
      key: 'my_featured_bikes',
      onPress: () => navigation.navigate('Home', { screen: 'FeaturedBikes' }),
    },
    {
      key: 'subscriptions',
      onPress: () => navigation.navigate('Subscription'),
    },
  ];

  const configItems = [
    { key: 'my_documents', onPress: () => navigation.navigate('MyDocuments') },
    {
      key: 'payment_preferences',
      onPress: () => navigation.navigate('PaymentPreferences'),
    },
    {
      key: 'edit_personal_data',
      onPress: () => navigation.navigate('EditProfile'),
    },
    { key: 'edit_password', onPress: () => navigation.navigate('EditPassword') },
    { key: 'delete_account', onPress: openBottomSheet },
    {
      key: 'sign_out',
      onPress: async () => {
        try {
          // Remove FCM token before logout
          console.log('userId', userId);
          await removeFCMToken(userId);
          const token = await deleteItem('userToken');
          if (token) {
            store.dispatch(setUserToken(``));
            navigation.navigate('Login');
          }
        } catch (error) {
          console.error('Error during logout:', error);
        }
      }
    },
  ];

  const otherItems = [{ key: 'report_incident' }];

  const handleDeleteUser = async () => {
    try {
      const response = await dispatch(deleteUser(userId));
      if (response?.meta?.requestStatus === 'fulfilled') {
        setShowSuccessPopup(true);
      } else {
        setShowErrorPopup(true);
      }
    } catch (e) {
      setShowErrorPopup(true);
      console.log('ERR', e.message);
    }
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    setTimeout(() => {
      navigation.navigate('Register');
    }, 300);
  };

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
    setTimeout(() => {
      navigation.navigate('Configuration');
    }, 300);
  };

  return (
    <View style={styles.containerBackground}>
      <AppStatusBar />
      {showErrorPopup ? (
        <PopUp
          icon={<Cross />}
          title={t('something_went_wrong')}
          description={authError || t('profile_del_fail_msg')}
          iconPress={closeErrorPopup}
          onButtonPress={closeErrorPopup}
        />
      ) : showSuccessPopup ? (
        <PopUp
          icon={<TickGreenWithBG />}
          title={t('success_profile_del')}
          description={t('profile_del_msg')}
          iconPress={closeSuccessPopup}
          onButtonPress={closeSuccessPopup}
        />
      ) : (
        <>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitleText}>{t('profile')}</Text>
          </View>
          <TabBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginTop: -35 }}>
            <MenuSection title={t('account')} items={accountItems} />
            <MenuSection title={t('configuration')} items={configItems} />
            <MenuSection items={otherItems} />
            <LanguageSwitcher />
          </ScrollView>
          <BottomSheet ref={refRBSheet} HEIGHT={450}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.bottomSheetContentWrapper}>
                <Text style={styles.confirmTitle}>
                  {t('del_confirm_title')}
                </Text>
                <Text style={styles.confirmMessage}>
                  {t('del_confirm_msg')}
                </Text>
                <View style={styles.bottomSheetButtonWrapper}>
                  <AppButton
                    title={t('cancel')}
                    btnTitleColor={Colors.white}
                    style={styles.cancelButton}
                    onPress={() => {
                      if (refRBSheet.current) {
                        refRBSheet.current.close();
                      }
                    }}
                  />
                  <AppButton
                    title={
                      authLoading ? (
                        <ActivityIndicator color={Colors.primary} />
                      ) : (
                        t('eliminate')
                      )
                    }
                    btnColor={Colors.white}
                    btnTitleColor={Colors.primary}
                    onPress={handleDeleteUser}
                  />
                </View>
              </View>
            </ScrollView>
          </BottomSheet>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  containerBackground: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    backgroundColor: Colors.primary,
    paddingTop: 40,
    paddingBottom: 10,
  },
  headerTitleText: {
    color: Colors.white,
    textAlign: 'center',
    ...Typography.f_20_inter_semi_bold,
  },
  menuSectionContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitleText: {
    ...Typography.f_18_inter_semi_bold,
    color: Colors.black,
  },
  menuCardContainer: {
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
    borderRadius: 20,
    padding: 15,
    gap: 20,
  },
  menuItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemText: {
    ...Typography.f_16_inter_medium,
    color: Colors.black,
    width: '80%',
  },
  bottomSheetContentWrapper: {
    padding: 20,
  },
  confirmTitle: {
    ...Typography.f_18_inter_semi_bold,
    color: Colors.white,
    lineHeight: 21,
  },
  confirmMessage: {
    ...Typography.f_16_inter_regular,
    color: Colors.white,
    lineHeight: 24,
    marginTop: 10,
  },
  bottomSheetButtonWrapper: {
    gap: 10,
    marginTop: 35,
  },
  cancelButton: {
    borderWidth: 0.5,
    borderColor: Colors.white,
  },
});
