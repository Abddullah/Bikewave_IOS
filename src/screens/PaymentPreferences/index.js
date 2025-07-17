import React, {useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  RefreshControl,
  ScrollView,
} from 'react-native';
import AppStatusBar from '../../components/AppStatusBar';
import Colors from '../../utilities/constants/colors';
import {Typography} from '../../utilities/constants/constant.style';
import {PrevWhite} from '../../assets/svg';
import AppButton from '../../components/AppButton';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {
  createAccount,
  checkAccount,
  validateUser,
} from '../../redux/features/main/mainThunks';
import {
  selectMainLoading,
  selectAccountStatus,
  selectAccountStatusLoading,
} from '../../redux/features/main/mainSelectors';
import {
  selectAuthUserId,
  selectUserDetails,
} from '../../redux/features/auth/authSelectors';
import {fetchUserInfo} from '../../redux/features/auth/authThunks';
import {EnvConfig} from '../../config/envConfig';
import {getItem, setItem} from '../../services/assynsStorage';
import { useFocusEffect } from '@react-navigation/native';
import { i18n } from '../../i18n';

export default function PaymentPreferences({navigation, route}) {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const user_id = useSelector(selectAuthUserId);
  const {accountId} = useSelector(selectUserDetails);
  const loading = useSelector(selectMainLoading);
  const accountStatus = useSelector(selectAccountStatus);
  const accountStatusLoading = useSelector(selectAccountStatusLoading);
  const [refreshing, setRefreshing] = useState(false);
  
  // Check if user came from the listing flow
  const fromListing = route.params?.fromListing || false;

  const fetchAndValidateAccount = async () => {
    try {
      // Try to get account ID from AsyncStorage first
      const storedAccountId = await getItem('stripeAccountId');
      
      // If we have a stored account ID or one from Redux, check and validate
      if (storedAccountId || accountId) {
        const accountToUse = storedAccountId || accountId;
        
        // If we have an account ID from storage but not in Redux, validate it
        if (storedAccountId && !accountId) {
          try {
            await dispatch(validateUser(storedAccountId));
          } catch (validationError) {
            console.error('Error validating stored account ID:', validationError);
          }
        }
        
        // Check account status
        await dispatch(checkAccount(accountToUse)).catch(error => {
          console.log('Error checking account status:', error);
        });
        
        // Refresh user info to ensure we have the latest account details
        await dispatch(fetchUserInfo(user_id));
      }
      return true;
    } catch (error) {
      console.error('Error fetching account data:', error);
      return false;
    }
  };

  // Refresh account status when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('Screen focused, refreshing account status');
      setRefreshing(true);
      fetchAndValidateAccount().finally(() => {
        setRefreshing(false);
      });
      
      return () => {
        // Cleanup function when screen loses focus
        console.log('Screen unfocused');
      };
    }, [])  // Empty dependency array to ensure it runs every time the screen comes into focus
  );

  useEffect(() => {
    fetchAndValidateAccount();
  }, [accountId, dispatch]);

  // If account status changes to completed and user came from listing, navigate back
  useEffect(() => {
    console.log(fromListing , accountStatus?.accountCompleted, 'accountStatus',accountStatus)
    if (fromListing && accountStatus?.accountCompleted) {
      // navigation.goBack();
    }
  }, [accountStatus, fromListing, navigation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchAndValidateAccount();
    } finally {
      setRefreshing(false);
    }
  }, []);
 
  const handleSetupAccount = async () => {
    try {
      // First create the account
      let accountResult;
      if (!accountId) {
        accountResult = await dispatch(createAccount());
      }
      // If account creation was successful, get the account ID
      console.log(accountResult?.payload?.account, 'accountResult',accountId);
      if (accountId || (accountResult?.payload?.account)) {
        const updatedAccountId = accountId || accountResult?.payload?.account;
        console.log(updatedAccountId, 'updatedAccountId');
        
        // Save account ID to AsyncStorage
        await setItem('stripeAccountId', updatedAccountId);
        
        // Validate the user account after creation
        try {
          await dispatch(validateUser(updatedAccountId));
        } catch (validationError) {
          console.error('Error validating user account:', validationError);
        }
        
        try {
          // Create account link for onboarding
          const response = await fetch(
            `${EnvConfig.stripe.baseUrl}/account_links`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${EnvConfig.stripe.secretKey}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json',
              },
              body: new URLSearchParams({
                account: updatedAccountId,
                refresh_url: EnvConfig.stripe.refreshUrl,
                return_url: EnvConfig.stripe.returnUrl,
                type: 'account_onboarding',
                'collection_options[fields]': 'eventually_due',
              }).toString(),
            },
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              `Stripe API error: ${
                errorData.error?.message || 'Unknown error'
              }`,
            );
          }

          const accountLinkData = await response.json();

          if (accountLinkData?.url) {
            // Check if we can open the URL
            const canOpen = await Linking.canOpenURL(accountLinkData.url);
            if (canOpen) {
              // Open the account link in the device's browser
              await Linking.openURL(accountLinkData.url);

              // Set up a listener for when the user returns to the app
              const handleUrl = async event => {
                if (event.url.startsWith(EnvConfig.stripe.returnDomainUrl)) {
                  // Wait for 5 seconds to allow Stripe to process the documents
                  await new Promise(resolve => setTimeout(resolve, 5000));

                  // Check account status after user returns
                  await dispatch(checkAccount(updatedAccountId));
                  
                  // Also validate the user account
                  try {
                    await dispatch(validateUser(updatedAccountId));
                  } catch (validationError) {
                    console.error('Error validating user account after return:', validationError);
                  }

                  // Refresh user info
                  await dispatch(fetchUserInfo(user_id));
                  
                  // Force a UI refresh
                  onRefresh();

                  // Check again after 10 seconds to ensure we get the updated status
                  setTimeout(async () => {
                    await dispatch(checkAccount(updatedAccountId));
                    
                    // Validate again after 10 seconds
                    try {
                      await dispatch(validateUser(updatedAccountId));
                    } catch (validationError) {
                      console.error('Error validating user account after delay:', validationError);
                    }
                    
                    // Refresh user info again
                    await dispatch(fetchUserInfo(user_id));
                    
                    // Force another UI refresh
                    onRefresh();
                  }, 10000);
                }
              };

              // Add the listener with subscription pattern
              const subscription = Linking.addEventListener('url', handleUrl);

              // Set a timeout to clean up the listener after a reasonable time
              setTimeout(async () => {
                try {
                  await dispatch(validateUser(updatedAccountId));
                  await dispatch(fetchUserInfo(user_id));
                } catch (validationError) {
                  console.error('Error validating user account:', validationError);
                }
                subscription.remove();
              }, 120000); // Clean up after 2 minutes
            } else {
              console.error('Cannot open URL:', accountLinkData.url);
            }
          } else {
            console.error('No URL in account link response');
          }
          await dispatch(fetchUserInfo(user_id));
        } catch (error) {
          console.error('Error creating Stripe account link:', error);
          // Handle the error appropriately (show error message to user)
        }
      }
    } catch (error) {
      console.error('Error in handleSetupAccount:', error);
      // Handle the error appropriately (show error message to user)
    }
  };

  // Handle deep linking when app is opened from a URL
  useEffect(() => {
    const handleDeepLink = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (
        initialUrl &&
        initialUrl.startsWith(EnvConfig.stripe.returnDomainUrl)
      ) {
        // Check account status when app is opened from deep link
        dispatch(checkAccount());
      }
    };

    handleDeepLink();
  }, [dispatch]);

  return (
    <View style={styles.containerBackground}>
      <AppStatusBar />
      <View style={styles.headerContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}>
          <PrevWhite />
        </TouchableOpacity>
        <Text style={[Typography.f_20_inter_semi_bold, styles.headerTitleText]}>
          {t('payment_preferences')}
        </Text>
        <TouchableOpacity onPress={onRefresh} disabled={refreshing}>
          {refreshing ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Text style={[Typography.f_14_inter_regular, styles.refreshText]}>
              {i18n.language === 'sp' ? 'Actualizar' : 'Refresh'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
     
        <View style={styles.shadowWrapper}>
          <View style={styles.cardWrapper}>
            <Text style={[Typography.f_18_inter_semi_bold, styles.cardTitleText]}>
              {t('payment_placeholder')}
            </Text>
            <Text style={[Typography.f_16_inter_regular, styles.cardMessageText]}>
              {t('bike_rental_message')}
            </Text>
            {accountId ? (
              <>
                {/* <Text
                  style={[Typography.f_16_inter_semi_bold, styles.accountIdText]}>
                  {t('your_account_id_is')}: {accountId}
                </Text> */}
                {accountStatusLoading ? (
                  <ActivityIndicator
                    color={Colors.primary}
                    style={styles.statusIndicator}
                  />
                ) : accountStatus?.accountCompleted ? (
                  <Text
                    style={[
                      Typography.f_16_inter_semi_bold,
                      styles.statusText,
                      styles.completedText,
                    ]}>
                    {t('account_completed')}
                  </Text>
                ) : (
                  <Text
                    style={[
                      Typography.f_16_inter_semi_bold,
                      styles.statusText,
                      styles.pendingText,
                    ]}>
                    {t('account_pending')}
                  </Text>
                )}
              </>
            ) : (
              <Text style={[Typography.f_16_inter_regular, styles.noAccountText]}>
                {t('no_account_setup')}
              </Text>
            )}
          </View>
        </View>
      <View style={styles.footerContainer}>
        <Text
          style={[
            Typography.f_12_inter_regular,
            styles.termsAndConditionsText,
          ]}>
          {t('Terms_and_conditions')}
        </Text>
        {accountStatus?.accountCompleted === false && (
          <AppButton
            title={
              loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                t('complete_setup')
              )
            }
            btnColor={Colors.primary}
            btnTitleColor={Colors.white}
            style={styles.setupAccountButton}
            onPress={handleSetupAccount}
          />
        )}
        {accountStatus === null && (
          <AppButton
            title={
              loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                t('setup_account')
              )
            }
            btnColor={Colors.primary}
            btnTitleColor={Colors.white}
            style={styles.setupAccountButton}
            onPress={handleSetupAccount}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerBackground: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    // flexGrow: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 50,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  headerTitleText: {
    color: Colors.white,
  },
  refreshText: {
    color: Colors.white,
    textDecorationLine: 'underline',
  },
  shadowWrapper: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginHorizontal: 15,
    marginBottom: 20,
    marginTop: -30,
    backgroundColor: Colors.white,
    borderRadius: 20,
  },
  cardWrapper: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 15,
  },
  cardTitleText: {
    color: Colors.black,
    lineHeight: 23,
  },
  cardMessageText: {
    color: Colors.black,
    lineHeight: 26,
    marginTop: 8,
  },
  accountIdText: {
    color: Colors.primary,
    marginTop: 16,
    textAlign: 'center',
  },
  termsAndConditionsText: {
    color: Colors.black,
    textDecorationLine: 'underline',
    textAlign: 'center',
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  footerContainer: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  setupAccountButton: {
    marginHorizontal: 15,
    marginBottom: 40,
  },
  statusIndicator: {
    marginTop: 10,
  },
  statusText: {
    marginTop: 10,
    textAlign: 'center',
  },
  completedText: {
    color: Colors.success,
  },
  pendingText: {
    color: Colors.warning,
  },
  noAccountText: {
    color: Colors.gray,
    marginTop: 16,
    textAlign: 'center',
  },
});
