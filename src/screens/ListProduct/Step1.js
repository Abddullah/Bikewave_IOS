import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AppButton from '../../components/AppButton';
import { ListProductHeader } from '../../components/ListProductHeader';
import Colors from '../../utilities/constants/colors';
import AppStatusBar from '../../components/AppStatusBar';
import { checkAccount, validateUser } from '../../redux/features/main/mainThunks';
import { selectUserDetails } from '../../redux/features/auth/authSelectors';
import PopUp from '../../components/PopUp';
import { Cross, Tick } from '../../assets/svg';

import AppTextInput from '../../components/AppTextInput';
import { Typography } from '../../utilities/constants/constant.style';
import { useTranslation } from 'react-i18next';
import { getItem } from '../../services/assynsStorage';

export const Step1 = ({ formData, updateFormData, onNext }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userDetails = useSelector(selectUserDetails);
  const [errors, setErrors] = useState({
    brand: '',
    model: '',
  });
  const [isValidating, setIsValidating] = useState(false);
  const [showAccountSetupPopup, setShowAccountSetupPopup] = useState(false);
  const [showAccountIncompletePopup, setShowAccountIncompletePopup] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [validationSuccess, setValidationSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  const steps = [
    t('steps.model'),
    t('steps.category'),
    t('steps.direction'),
    t('steps.photo'),
    t('steps.price'),
    t('steps.preview'),
  ];

  const validateForm = () => {
    const newErrors = {
      brand: '',
      model: '',
    };
    let isValid = true;

    if (!formData.brand.trim()) {
      newErrors.brand = t('validation.brand_required');
      isValid = false;
    }

    if (!formData.model.trim()) {
      newErrors.model = t('validation.model_required');
      isValid = false;
    }

    setErrors(newErrors);
    setTimeout(() => {
      setErrors({
        brand: '',
        model: '',
      });

    }, 3000);
    return isValid;
  };

  const handleAccountSetupPress = () => {
    setShowAccountSetupPopup(false);
    navigation.navigate('PaymentPreferences', { fromListing: true });
  };

  const handleAccountIncompletePress = () => {
    setShowAccountIncompletePopup(false);
    navigation.navigate('PaymentPreferences', { fromListing: true });
  };

  const handleValidateAccount = async () => {
    setIsValidating(true);
    try {
      // First check if the user has a valid accountId
      if (!userDetails?.accountId) {
        console.log('111111')
        setValidationError(t('account_setup_required') || 'Account setup required');
        setTimeout(() => {
          setShowValidationPopup(false);
          setShowAccountSetupPopup(true);
        }, 1500);
        return;
      }

      // Validate the user account
      const validationResponse = await dispatch(validateUser(userDetails.accountId)).unwrap();

      if (validationResponse.success && validationResponse.accountCompleted) {
        setValidationSuccess(true);
        setTimeout(() => {
          setShowValidationPopup(false);
          onNext();
        }, 1500);
      } else {
        // If validation failed but we have an accountId, the account setup is incomplete
        setValidationError(t('account_not_validated') || 'Your account needs to be validated before proceeding');
        setTimeout(() => {
          setShowValidationPopup(false);
          setShowAccountIncompletePopup(true);
        }, 1500);
      }
    } catch (error) {
      console.error('Validation error:', error);
      setValidationError(t('validation_failed') || 'Failed to validate your account');

      // Check if the error is due to missing account
      if (error.message && error.message.includes('Account ID not found')) {
        setTimeout(() => {
          setShowValidationPopup(false);
          setShowAccountSetupPopup(true);
        }, 1500);
      }
    } finally {
      setIsValidating(false);
    }
  };
  const fetchAndValidateAccount = async () => {
    try {
      // Try to get account ID from AsyncStorage first
      const storedAccountId = await getItem('stripeAccountId');
      console.log(storedAccountId, 'storedAccountId')
      // If we have a stored account ID or one from Redux, check and validate
      if (storedAccountId || userDetails?.accountId) {
        const accountToUse = storedAccountId || userDetails?.accountId;
        console.log(accountToUse, 'accountToUse')
        // If we have an account ID from storage but not in Redux, validate it
        if (storedAccountId && !userDetails?.accountId) {
          try {
            await dispatch(validateUser(storedAccountId));
          } catch (validationError) {
            console.error('Error validating stored account ID:', validationError);
          }
        }

        // Check account status
        const response = await dispatch(checkAccount(storedAccountId)).catch(error => {
          console.log('Error checking account status:', error);
        });
        console.log(response, 'response')
        if (response?.payload?.accountCompleted) {
          await onNext();
        }
      }
    } catch (error) {
      console.error('Error fetching account data:', error);
    }
  };

  const handleNext = async () => {
    if (validateForm()) {
      try {
        console.log(userDetails?.accountId, 'userDetails');
        // Check if user has accountId
        await fetchAndValidateAccount();

        if (!userDetails?.accountId) {
          // Show popup for account setup
          setShowAccountSetupPopup(true);
          return;
        }

        // Show validation popup
        // setShowValidationPopup(false);
        setValidationSuccess(false);
        setValidationError('');

      } catch (error) {
        console.error('Error:', error);
        setErrors({
          ...errors,
          brand: t('validation_failed') || 'Failed to validate your account',
        });
        setTimeout(() => {
          setErrors({
            brand: '',
            model: '',
          });
        }, 3000);
      }
    }
  };

  const handleFieldChange = (field, value) => {
    updateFormData(field, value);
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  if (showAccountSetupPopup) {
    return (
      <PopUp
        icon={<Cross />}
        title={t('account_setup_required') || 'Account Setup Required'}
        description={t('account_setup_message') || 'You need to set up your payment account before listing a bicycle'}
        buttonTitle={t('setup_now') || 'Setup Now'}
        iconPress={() => setShowAccountSetupPopup(false)}
        onButtonPress={handleAccountSetupPress}
      />
    );
  }

  if (showAccountIncompletePopup) {
    return (
      <PopUp
        icon={<Cross />}
        title={t('account_incomplete') || 'Account Setup Incomplete'}
        description={t('complete_account_setup_message') || 'Please complete your account setup before listing a bicycle'}
        buttonTitle={t('complete_setup') || 'Complete Setup'}
        iconPress={() => setShowAccountIncompletePopup(false)}
        onButtonPress={handleAccountIncompletePress}
      />
    );
  }

  if (showValidationPopup) {
    return (
      <PopUp
        icon={validationSuccess ? <Tick /> : validationError ? <Cross /> : null}
        title={validationSuccess
          ? t('validation_success') || 'Validation Successful'
          : validationError
            ? t('validation_failed') || 'Validation Failed'
            : t('account_validation') || 'Account Validation'}
        description={validationSuccess
          ? t('validation_success_message') || 'Your account has been successfully validated. Proceeding to next step.'
          : validationError
            ? validationError
            : t('validation_message') || 'We need to validate your account before proceeding. Click the button below to validate.'}
        buttonTitle={isValidating
          ? t('validating') || 'Validating...'
          : validationSuccess || validationError
            ? t('ok') || 'OK'
            : t('validate_account') || 'Validate Account'}
        iconPress={() => {
          if (validationSuccess || validationError) {
            setShowValidationPopup(false);
            if (validationError) {
              setShowAccountIncompletePopup(true);
            }
          }
        }}
        onButtonPress={() => {
          if (validationSuccess) {
            setShowValidationPopup(false);
            onNext();
          } else if (validationError) {
            setShowValidationPopup(false);
            setShowAccountIncompletePopup(true);
          } else {
            handleValidateAccount();
          }
        }}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <AppStatusBar />
          <ListProductHeader
            title={``}
            currentStep={1}
            steps={steps}
            desc={`${t('select_brand_model_description')}`}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ paddingHorizontal: 20 }}>
              <View style={styles.form}>
                <View>
                  <Text style={styles.label}>
                    {t('brand')} <Text style={styles.required}>*</Text>
                  </Text>
                  <AppTextInput
                    placeholder={t('brand_placeholder')}
                    value={formData.brand}
                    onChangeText={text => handleFieldChange('brand', text)}
                  />
                  {errors.brand ? <Text style={styles.errorText}>{errors.brand}</Text> : null}
                </View>
                <View>
                  <Text style={styles.label}>
                    {t('model')} <Text style={styles.required}>*</Text>
                  </Text>
                  <AppTextInput
                    placeholder={t('model_placeholder')}
                    value={formData.model}
                    onChangeText={text => handleFieldChange('model', text)}
                  />
                  {errors.model ? <Text style={styles.errorText}>{errors.model}</Text> : null}
                </View>
                <View>
                  <Text style={styles.label}>{t('description')}</Text>
                  <AppTextInput
                    placeholder={t('description_placeholder')}
                    value={formData.description}
                    onChangeText={text => updateFormData('description', text)}
                    multiline
                    numberOfLines={4}
                    fieldStyle={{ textAlignVertical: 'top' }}
                  />
                </View>
              </View>
            </View>
            <AppButton
              title={t('following')}
              btnColor={Colors.primary}
              btnTitleColor={Colors.white}
              style={styles.followBtn}
              onPress={handleNext}
            />
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  form: {
    gap: 15,
  },
  label: {
    ...Typography.f_18_inter_semi_bold,
    color: Colors.black,
  },
  required: {
    color: Colors.error,
  },
  followBtn: {
    marginHorizontal: 20,
    marginVertical: 25,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 5,
  },
});