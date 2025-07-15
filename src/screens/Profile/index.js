import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import AppStatusBar from '../../components/AppStatusBar';
import { Typography } from '../../utilities/constants/constant.style';
import Colors from '../../utilities/constants/colors';
import TabBar from '../../components/TabBar';
import ProfileHeader from '../../components/ProfileHeader';
import BikeCard from '../../components/BikeCard';
import Images from '../../assets/images';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo, deleteUser } from '../../redux/features/auth/authThunks';
import {
  selectAuthLoading,
  selectUserDetails,
  selectAuthUserId,
  selectAuthError,
  authStates,
} from '../../redux/features/auth/authSelectors';
import images from '../../assets/images';
import { heightFlex1 } from '../../utilities/constants/screenResolution';
import { NextGreen, TickGreenWithBG, Cross } from '../../assets/svg';
import BottomSheet from '../../components/BottomSheet';
import AppButton from '../../components/AppButton';
import PopUp from '../../components/PopUp';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import store from '../../redux/store';
import { setUserToken } from '../../redux/features/auth/authSlice';
import { deleteItem } from '../../services/assynsStorage';
import { removeFCMToken } from '../../utilities/fcmTokenManager';
import { getReviewsByUserId } from '../../redux/features/main/mainThunks';

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

export default function Profile({ navigation }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('about');
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const refRBSheet = useRef();

  const loading = useSelector(selectAuthLoading);
  const userDetails = useSelector(selectUserDetails);
  const user_id = useSelector(selectAuthUserId);
  const authError = useSelector(selectAuthError);
  const userId = useSelector(selectAuthUserId);
  const userReviews = useSelector(state => state.main.userReviews);

  console.log(userReviews,'userReviews')
  const reviewsLoading = useSelector(state => state.main.reviewsLoading);

  useEffect(() => {
    dispatch(fetchUserInfo(user_id));
  }, [user_id, dispatch]);

  const handleDeleteBike = () => {
    dispatch(fetchUserInfo(user_id));
  };

  const tabs = [
    { key: 'about', label: t('about_me') },
    { key: 'config', label: t('configuration') },
  ];

  const firstName = userDetails?.firstName ?? 'User';
  const secondName = userDetails?.secondName ?? '';

  const user = {
    name: `${firstName} ${secondName}`.trim(),
    bio: {
      sp: `¡Hola a todos! Soy ${firstName} y estoy emocionad@ de formar parte de esta increíble plataforma. ¡List@ para descubrir nuevas rutas y compartir la pasión por el ciclismo con todos!`,
      en: `Hello everyone! I'm ${firstName} and I'm excited to be part of this incredible platform. Ready to discover new routes and share the passion for cycling with everyone!`,
    },
    avatar: Images.profile,
  };

  const bikes =
    userDetails?.bicycles?.map(bike => ({
      id: bike?._id,
      brand: bike?.brand,
      model: bike?.model,
      location: `${bike?.location?.city}, ${bike?.location?.country}`,
      price: bike?.price.toString(),
      image: bike.photo ? { uri: bike.photo } : images.bicycle,
      description: bike?.description,
      deposit: bike?.deposit,
      category: bike?.category,
    })) || [];

  const openBottomSheet = () => {
    if (refRBSheet.current) {
      refRBSheet.current.open();
    }
  };

  const accountItems = [
    {
      key: 'my_reservations_client',
      onPress: () => navigation.navigate('Profile', { screen: 'InProgress' }),
    },
    {
      key: 'my_reservations_owner',
      onPress: () => navigation.navigate('Profile', { screen: 'Earrings' }),
    },
    {
      key: 'my_featured_bikes',
      onPress: () => navigation.navigate('Profile', { screen: 'FeaturedBikes' }),
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
          await removeFCMToken(userId);
          // Remove Stripe account ID from AsyncStorage
          await deleteItem('stripeAccountId');
          const token = await deleteItem('userToken');
          if (token) {
            store.dispatch(setUserToken(``));
            navigation.navigate('Login');
          }
        } catch (error) {
          console.error('Error during logout:', error);
        }
      },
    },
  ];

  const otherItems = [{ key: 'report_incident' }];

  useEffect(() => {
    dispatch(getReviewsByUserId());
}, [userId, dispatch]);


  const handleDeleteUser = async () => {
    try {
      const response = await dispatch(deleteUser(user_id));
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
  };

  const fetchReviews = () => {
    dispatch(getReviewsByUserId());
  };

  const renderContent = () => {
    if (activeTab === 'about') {
      return (
        <View>
          <ProfileHeader user={user} userReviews={userReviews} reviewsLoading={reviewsLoading} fetchReviews={fetchReviews} />
          <ScrollView contentContainerStyle={{ height: heightFlex1 * (Platform.OS === 'ios' ? 5.5 : 4.5) }}>
            <Text style={styles.sectionTitle}>{t('my_garage')}</Text>
            {bikes.length === 0 ? (
              <Text style={styles.noBikesMessage} onPress={() => navigation.navigate('Offer')}>
                {t('no_bikes_available')}
              </Text>
            ) : (
              <FlatList
                data={bikes}
                renderItem={({ item }) => (
                  <BikeCard
                    bike={item}
                    promote={true}
                    onDelete={handleDeleteBike}
                  />
                )}
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={styles.bikeGrid}
                contentContainerStyle={{ paddingBottom: 5,gap:20 }}
              />
            )}
          </ScrollView>
        </View>
      );
    } else {
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 20 }}
          style={{ marginTop: Platform.OS === 'ios' ? -20 : -20, }}>
          <MenuSection title={t('account')} items={accountItems} />
          <MenuSection title={t('configuration')} items={configItems} />
          <MenuSection items={otherItems} />
          <LanguageSwitcher />
        </ScrollView>
      );
    }
  };

  return (
    <View style={styles.background}>
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
            <Text style={styles.headerTitle}>{t('profile')}</Text>
          </View>
          <TabBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
          />
          {loading ? (
            <ActivityIndicator
              color={Colors.primary}
              size={'small'}
              style={{ marginTop: 10 }}
            />
          ) : (
            renderContent()
          )}
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
                      loading ? (
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
  background: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 10,
  },
  headerTitle: {
    color: Colors.white,
    textAlign: 'center',
    ...Typography.f_20_inter_semi_bold,
    fontWeight: '600',
  },
  sectionTitle: {
    ...Typography.f_20_inter_semi_bold,
    color: Colors.black,
    padding: 20,
    fontWeight: '600',
  },
  bikeGrid: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    // marginVertical:20
  },
  noBikesMessage: {
    textAlign: 'center',
    color: Colors.primary,
    padding: 20,
    marginTop: "auto",
    ...Typography.f_16_inter_medium,
  },
  menuSectionContainer: {
    // marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitleText: {
    ...Typography.f_18_inter_semi_bold,
    color: Colors.black,
    fontWeight: '600',
  },
  menuCardContainer: {
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
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
    fontWeight: '600',
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
