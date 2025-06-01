import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import {
  createStripeSubscriptionSession,
  checkUserSubscription,
  createAccount,
} from '../../redux/features/main/mainThunks';
import AppStatusBar from '../../components/AppStatusBar';
import Colors from '../../utilities/constants/colors';
import {PrevWhite, Success} from '../../assets/svg';
import {Typography} from '../../utilities/constants/constant.style';
import DropShadow from 'react-native-drop-shadow';
import AppButton from '../../components/AppButton';
import {useTranslation} from 'react-i18next';
import {selectUserDetails} from '../../redux/features/auth/authSelectors';
import {selectSubscriptionStatus} from '../../redux/features/main/mainSelectors';
import { EnvConfig } from '../../config/envConfig';

export default function Subscription({navigation}) {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const userDetail = useSelector(selectUserDetails);
  const subscriptionStatus = useSelector(selectSubscriptionStatus);
  const isSubscribed = userDetail?.accountId
    ? subscriptionStatus.hasActiveSubscription
    : false;
  const isCheckingSubscription = subscriptionStatus.loading;

  useEffect(() => {
    if (userDetail?.accountId)
      dispatch(checkUserSubscription(userDetail.accountId));
  }, [dispatch, userDetail?.accountId]);

  const handleSubscription = async () => {
    setLoading(true);
    try {
      const priceId = EnvConfig.stripe.priceId;
      if (!userDetail?.accountId) {
        dispatch(createAccount());
      }
      const response = await dispatch(
        createStripeSubscriptionSession({
          priceId,
          successUrl: EnvConfig.stripe.successUrl,
          cancelUrl: EnvConfig.stripe.cancelUrl,
        }),
      ).unwrap();

      if (response.url) {
        await Linking.openURL(response.url);

        // Set up listener for when user returns to app
        const handleUrl = async () => {
          // Check subscription status again after user returns
          await dispatch(checkUserSubscription());
        };

        const subscription = Linking.addEventListener('url', handleUrl);

        // Clean up listener after some time
        setTimeout(() => {
          subscription.remove();
        }, 120000); // 2 minutes
      } else {
        Alert.alert(t('error'), t('subscription_error'));
      }
    } catch (error) {
      Alert.alert(t('error'), error.message || t('subscription_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.background}>
      <AppStatusBar />
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}>
          <PrevWhite />
        </TouchableOpacity>
        <Text style={[Typography.f_20_inter_semi_bold, styles.headerTitle]}>
          {t('my_subscriptions')}
        </Text>
        <Text />
      </View>

      {isCheckingSubscription ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.white} />
          <Text style={[Typography.f_16_inter_regular, styles.loaderText]}>
            {t('checking_subscription')}
          </Text>
        </View>
      ) : (
        <>
          <DropShadow style={styles.shadowContainer}>
            <View style={styles.cardContainer}>
              <Text style={[Typography.f_22_inter_semi_bold, styles.cardTitle]}>
                {isSubscribed ? t('premium_member') : t('subscription_pro')}
              </Text>
              {isSubscribed ? (
                <View style={styles.subscribedContainer}>
                  <Success width={50} height={50} />
                  <Text
                    style={[
                      Typography.f_18_inter_semi_bold,
                      styles.subscribedText,
                    ]}>
                    {t('active_subscription')}
                  </Text>
                  <Text
                    style={[
                      Typography.f_16_inter_regular,
                      styles.subscribedSubText,
                    ]}>
                    {t('premium_features_enabled')}
                  </Text>
                </View>
              ) : (
                <>
                  <View style={styles.benefitsContainer}>
                    {[1, 2, 3, 4, 5].map((benefit, index) => (
                      <View style={styles.benefitItem} key={index}>
                        <Success />
                        <Text
                          style={[
                            Typography.f_16_inter_regular,
                            styles.benefitText,
                          ]}>
                          {t(`subscription_benefits.${benefit}`)}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <Text style={[Typography.f_38_inter_bold, styles.priceText]}>
                    39.99€
                  </Text>
                </>
              )}
            </View>
          </DropShadow>
          {!isSubscribed && (
            <AppButton
              title={t('subscribe')}
              btnColor={Colors.black}
              btnTitleColor={Colors.white}
              style={{marginBottom: 20}}
              onPress={handleSubscription}
              loading={loading}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 15,
  },
  headerTitle: {
    color: Colors.white,
  },
  shadowContainer: {
    shadowColor: Colors.gray,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    flex: 1,
    paddingTop: 40,
  },
  cardContainer: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
  },
  cardTitle: {
    color: Colors.black,
    textAlign: 'center',
    paddingBottom: 15,
  },
  benefitsContainer: {
    paddingVertical: 15,
    gap: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  benefitText: {
    color: Colors.black,
    flex: 1,
  },
  priceText: {
    color: Colors.black,
    textAlign: 'right',
  },
  subscribedContainer: {
    alignItems: 'center',
    padding: 20,
    gap: 15,
  },
  subscribedText: {
    color: Colors.black,
    textAlign: 'center',
  },
  subscribedSubText: {
    color: Colors.gray,
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    color: Colors.white,
    marginTop: 15,
  },
});
