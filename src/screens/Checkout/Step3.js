import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AppButton from '../../components/AppButton';
import Colors from '../../utilities/constants/colors';
import AppStatusBar from '../../components/AppStatusBar';

import { CheckoutHeader } from '../../components/CheckoutHeader';
import AppTextInput from '../../components/AppTextInput';
import { Typography } from '../../utilities/constants/constant.style';
import DropShadow from 'react-native-drop-shadow';
import { PayPal, Visa, Cross, Tick } from '../../assets/svg';
import PopUp from '../../components/PopUp';
import StepIndicator from '../../components/StepIndicator';
import { useTranslation } from 'react-i18next';
import { useStripe } from '@stripe/stripe-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectBookingDetails } from '../../redux/features/main/mainSelectors';
import { CardField, useStripe as useStripeHook } from '@stripe/stripe-react-native';
import { confirmBooking, updateBooking } from '../../redux/features/main/mainThunks';

export const Step3 = ({ navigation, route }) => {
  const [formData, setFormData] = useState({
    // cardName: 'John Doe',
    cardName: '',
  });
  const { t } = useTranslation();
  const { confirmPayment } = useStripeHook();
  const bookingDetails = useSelector(selectBookingDetails);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Get booking details from route params
  const { bicycleId, dateFrom, dateEnd, price } = route.params || {};

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');

  const checkoutSteps = [
    t('checkoutSteps.booking'),
    t('checkoutSteps.billing'),
    t('checkoutSteps.pay'),
    t('checkoutSteps.confirmation'),
  ];

  const handlePaymentMethodSelect = method => {
    setSelectedPaymentMethod(method);
  };

  const handleConfirmReservation = async () => {
    if (selectedPaymentMethod === 'card') {
      if (!bookingDetails?.client_secret) {
        setErrorMessage(t('errors.payment_info_missing'));
        setShowError(true);
        return;
      }

      if (!bookingDetails?.bookingId) {
        setErrorMessage(t('errors.booking_id_missing'));
        setShowError(true);
        return;
      }

      try {
        setLoading(true);
        
        // Get billing info from route params
        const billingInfo = route.params?.billingInfo;
        
        if (billingInfo) {
          // First update the booking with user information
          try {
            await dispatch(updateBooking({
              bookingId: bookingDetails.bookingId,
              info: billingInfo
            })).unwrap();
          } catch (error) {
            setErrorMessage(t('errors.booking_update_failed'));
            setShowError(true);
            setLoading(false);
            return;
          }
        }
        
        const { error, paymentIntent } = await confirmPayment(
          bookingDetails.client_secret,
          {
            paymentMethodType: 'Card',
            billingDetails: {
              name: formData.cardName,
            },
          }
        );

        if (error) {
          setErrorMessage(t('errors.payment_failed', { message: error.message }));
          setShowError(true);
        } else if (paymentIntent) {
          // Payment successful, now confirm the booking
          try {
            await dispatch(confirmBooking(bookingDetails.bookingId)).unwrap();
            setShowSuccess(true);
          } catch (error) {
            setErrorMessage(t('errors.booking_confirmation_failed'));
            setShowError(true);
          }
        }
      } catch (error) {
        setErrorMessage(t('errors.payment_failed'));
        setShowError(true);
      } finally {
        setLoading(false);
      }
    } else {
      // Handle PayPal payment
      setErrorMessage(t('errors.paypal_not_implemented'));
      setShowError(true);
    }
  };

  if (showError) {
    return (
      <View style={styles.safeAreaViewContainer}>
        <AppStatusBar />
        <View style={{ flex: 1 }}>
          <PopUp
            icon={<Cross />}
            title={t('errors.something_went_wrong')}
            onButtonPress={() => {
              navigation.navigate('Home');
            }}
            description={errorMessage || t('errors.booking_fail_msg')}
          />
          <View style={{ position: 'absolute', top: '5%' }}>
            <StepIndicator
              currentStep={4}
              steps={checkoutSteps}
              failedStepIndex={3}
            />
          </View>
        </View>
      </View>
    );
  }

  if (showSuccess) {
    return (
      <View style={styles.safeAreaViewContainer}>
        <AppStatusBar />
        <View style={{ flex: 1 }}>
          <PopUp
            icon={<Tick />}
            onButtonPress={() => {
              navigation.navigate('Home');
            }}
            title={t('booking_save')}
            description={t('booking_success_msg')}
          />
          <View style={{ position: 'absolute', top: '5%',alignSelf: 'center'}}>
            <StepIndicator currentStep={4} steps={checkoutSteps} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.safeAreaViewContainer}>
      <AppStatusBar />
      <ScrollView showsVerticalScrollIndicator={false}>
        <CheckoutHeader
          title={t('payment_details')}
          currentStep={3}
          steps={checkoutSteps}
          children={
            <DropShadow style={styles.dropShadowStyle}>
              <View style={styles.formContainer}>
                <View>
                  <Text style={styles.labelText}>{t('card_name')}</Text>
                  <AppTextInput
                    placeholder={t('card_name')}
                    value={formData.cardName}
                    onChangeText={text =>
                      setFormData({ ...formData, cardName: text })
                    }
                  />
                </View>
                <View style={styles.singleInputContainer}>
                  <Text style={styles.labelText}>{t('card_num')}</Text>
                  <CardField
                    postalCodeEnabled={false}
                    style={styles.cardField}
                    cardStyle={{
                      backgroundColor: Colors.white,
                      textColor: Colors.black,
                      borderColor: Colors.gray,
                    }}
                    fields={{
                      number: {
                        placeholder: '1234 5678 9012 3456',
                      },
                      expiration: {
                        placeholder: 'MM/YY',
                      },
                      cvc: {
                        placeholder: 'CVC',
                      },
                    }}
                  />
                </View>
              </View>
            </DropShadow>
          }
        />
        <View style={styles.paymentMethodsContainer}>
          <Text style={styles.paymentMethodsTitle}>{t('payment_method')}</Text>
          <View style={styles.paymentOptionsContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.paymentOptionCard}
              onPress={() => handlePaymentMethodSelect('card')}>
              <View style={styles.paymentOptionDetails}>
                <Visa />
                <Text style={styles.paymentOptionText}>{t('card')}</Text>
              </View>
              <View
                style={[
                  styles.radioButton,
                  selectedPaymentMethod === 'card' && styles.radioSelected,
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.paymentOptionCard}
              onPress={() => handlePaymentMethodSelect('paypal')}>
              <View style={styles.paymentOptionDetails}>
                <PayPal />
                <Text style={styles.paymentOptionText}>Paypal</Text>
              </View>
              <View
                style={[
                  styles.radioButton,
                  selectedPaymentMethod === 'paypal' && styles.radioSelected,
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
        <AppButton
          title={loading ? 'Processing...' : t('confirm_reservation')}
          btnColor={Colors.primary}
          btnTitleColor={Colors.white}
          style={styles.confirmButton}
          onPress={handleConfirmReservation}
          disabled={loading}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  dropShadowStyle: {
    shadowColor: Colors.gray,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  formContainer: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
  },
  labelText: {
    ...Typography.f_16_inter_medium,
    color: Colors.black,
    marginBottom: -5,
  },
  singleInputContainer: {
    marginTop: 15,
  },
  cardField: {
    width: '100%',
    height: 50,
    marginTop: 5,
  },
  paymentMethodsContainer: {
    paddingHorizontal: 20,
  },
  paymentMethodsTitle: {
    ...Typography.f_18_inter_semi_bold,
    color: Colors.black,
    marginBottom: 20,
  },
  paymentOptionsContainer: {
    gap: 15,
  },
  paymentOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderWidth: 0.5,
    borderColor: Colors.gray,
    borderRadius: 50,
  },
  paymentOptionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  paymentOptionText: {
    ...Typography.f_16_inter_medium,
    color: Colors.black,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  radioSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  confirmButton: {
    margin: 20,
    marginTop: 30,
  },
});
