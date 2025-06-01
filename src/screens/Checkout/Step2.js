import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, ScrollView, TouchableOpacity, Alert} from 'react-native';
import AppButton from '../../components/AppButton';
import Colors from '../../utilities/constants/colors';
import AppStatusBar from '../../components/AppStatusBar';

import {CheckoutHeader} from '../../components/CheckoutHeader';
import AppTextInput from '../../components/AppTextInput';
import {Typography} from '../../utilities/constants/constant.style';
import DropShadow from 'react-native-drop-shadow';
import CheckBox from '@react-native-community/checkbox';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setInvoiceAddress } from '../../redux/features/main/mainThunks';
import CountryPicker from 'react-native-country-picker-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Step2 = ({navigation, route}) => {
  const dispatch = useDispatch();
  const { bicycle, selectedDateRange, totalPrice } = route?.params || {};
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    streetNumber: '',
    door: '',
    zip: '',
    city: '',
    country: '',
    email: '',
    telephone: '',
    agree: false,
    // firstName: 'John',
    // lastName: 'Doe',
    // streetNumber: 'Calle Mayor 123',
    // door: '4B',
    // zip: '28001',
    // city: 'Madrid',
    // country: 'Spain',
    // email: 'john.doe@example.com',
    // telephone: '123456789',
    // agree: false,
  });
  const [errors, setErrors] = useState({});
  const [countryCode, setCountryCode] = useState('ES');
  const [callingCode, setCallingCode] = useState('34');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const { t } = useTranslation();

  // Add check for required params
  useEffect(() => {
    if (!bicycle || !selectedDateRange || !totalPrice) {
      Alert.alert('Error', 'Missing booking details');
      navigation.goBack();
    }
  }, [bicycle, selectedDateRange, totalPrice]);

  const onSelectCountry = (country) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0]);
    setShowCountryPicker(false);
  };

  const validateForm = () => {
    let tempErrors = {};
    
    // Check required fields
    if (!formData.firstName.trim()) tempErrors.firstName = t('required_field');
    if (!formData.lastName.trim()) tempErrors.lastName = t('required_field');
    if (!formData.streetNumber.trim()) tempErrors.streetNumber = t('required_field');
    if (!formData.zip.trim()) tempErrors.zip = t('required_field');
    if (!formData.city.trim()) tempErrors.city = t('required_field');
    if (!formData.country.trim()) tempErrors.country = t('required_field');
    if (!formData.email.trim()) tempErrors.email = t('required_field');
    if (!formData.telephone.trim()) tempErrors.telephone = t('required_field');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      tempErrors.email = t('invalid_email');
    }

    // Phone validation
    const phoneRegex = /^\d{9,}$/;
    if (formData.telephone && !phoneRegex.test(formData.telephone)) {
      tempErrors.telephone = t('invalid_phone');
    }

    // ZIP code validation for Spain (5 digits)
    const zipRegex = /^\d{5}$/;
    if (formData.zip && !zipRegex.test(formData.zip)) {
      tempErrors.zip = t('invalid_zip');
    }

    // Terms and conditions
    if (!formData.agree) {
      tempErrors.agree = t('accept_terms_error');
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Add new function to load saved address
  const loadSavedAddress = async () => {
    try {
      const savedAddress = await AsyncStorage.getItem('savedBillingAddress');
      if (savedAddress) {
        const parsedAddress = JSON.parse(savedAddress);
        setFormData(prevState => ({
          ...prevState,
          ...parsedAddress,
          agree: false // Always keep agree unchecked for legal reasons
        }));
      }
    } catch (error) {
      console.error('Error loading saved address:', error);
    }
  };

  // Load saved address when component mounts
  useEffect(() => {
    loadSavedAddress();
  }, []);

  // Add new function to check if form data has changed
  const hasFormDataChanged = async () => {
    try {
      const savedAddress = await AsyncStorage.getItem('savedBillingAddress');
      if (!savedAddress) return true;

      const parsedAddress = JSON.parse(savedAddress);
      return (
        parsedAddress.firstName !== formData.firstName ||
        parsedAddress.lastName !== formData.lastName ||
        parsedAddress.streetNumber !== formData.streetNumber ||
        parsedAddress.door !== formData.door ||
        parsedAddress.zip !== formData.zip ||
        parsedAddress.city !== formData.city ||
        parsedAddress.country !== formData.country ||
        parsedAddress.email !== formData.email ||
        parsedAddress.telephone !== formData.telephone
      );
    } catch (error) {
      console.error('Error checking form data changes:', error);
      return true; // If there's an error reading storage, treat as changed
    }
  };

  const handleSaveContinue = async () => {
    if (!validateForm()) {
      return;
    }

    if (!bicycle || !selectedDateRange || !totalPrice) {
      Alert.alert('Error', 'Missing booking details');
      return;
    }

    try {
      // Check if form data has changed
      const isDataChanged = await hasFormDataChanged();
      
      if (!isDataChanged) {
        // If data hasn't changed, navigate directly without API call
        navigation.navigate('Step3', {
          bicycleId: bicycle._id,
          dateFrom: selectedDateRange.startDate,
          dateEnd: selectedDateRange.endDate,
          price: totalPrice.replace('€', '')
        });
        return;
      }

      // If data has changed, proceed with API call
      await dispatch(setInvoiceAddress({
        name: formData.firstName,
        surname: formData.lastName,
        street: formData.streetNumber,
        door: formData.door,
        postCode: formData.zip,
        city: formData.city,
        country: formData.country,
        emailBuyer: formData.email,
        phoneBuyer: formData.telephone
      }));

      // Save address to AsyncStorage after successful API call
      try {
        const addressToSave = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          streetNumber: formData.streetNumber,
          door: formData.door,
          zip: formData.zip,
          city: formData.city,
          country: formData.country,
          email: formData.email,
          telephone: formData.telephone
        };
        await AsyncStorage.setItem('savedBillingAddress', JSON.stringify(addressToSave));
      } catch (storageError) {
        console.error('Error saving address to storage:', storageError);
      }

      navigation.navigate('Step3', {
        bicycleId: bicycle._id,
        dateFrom: selectedDateRange.startDate,
        dateEnd: selectedDateRange.endDate,
        price: totalPrice.replace('€', '')
      });
    } catch (error) {
      console.error('Invoice address error:', error);
      setErrors({
        api: t('something_went_wrong')
      });
    }
  };

  const checkoutSteps = [
    t('checkoutSteps.booking'),
    t('checkoutSteps.billing'),
    t('checkoutSteps.pay'),
    t('checkoutSteps.confirmation'),
  ];

  return (
    <View style={styles.container}>
      <AppStatusBar />
      <ScrollView showsVerticalScrollIndicator={false}>
        <CheckoutHeader
          title={t('billing_info')}
          currentStep={2}
          steps={checkoutSteps}
          children={
            <View style={styles.formWrapper}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('first_name')}</Text>
                <AppTextInput
                  placeholder={t('first_name')}
                  value={formData.firstName}
                  onChangeText={text => {
                    setFormData({...formData, firstName: text});
                    if (errors.firstName) {
                      setErrors({...errors, firstName: ''});
                    }
                  }}
                  error={errors.firstName}
                />
                {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('last_name')}</Text>
                <AppTextInput
                  placeholder={t('last_name')}
                  value={formData.lastName}
                  onChangeText={text => {
                    setFormData({...formData, lastName: text});
                    if (errors.lastName) {
                      setErrors({...errors, lastName: ''});
                    }
                  }}
                  error={errors.lastName}
                />
                {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}
              </View>
            </View>
          }
        />
        <DropShadow style={styles.shadowStyle}>
          <View style={styles.formCard}>
            <View style={styles.rowGroup}>
              <View style={styles.streetInputWrapper}>
                <Text style={styles.inputLabel}>{t('street_and_number')}</Text>
                <AppTextInput
                  placeholder={t('street_number_placeholder')}
                  value={formData.streetNumber}
                  onChangeText={text => {
                    setFormData({...formData, streetNumber: text});
                    if (errors.streetNumber) {
                      setErrors({...errors, streetNumber: ''});
                    }
                  }}
                  error={errors.streetNumber}
                />
                {errors.streetNumber ? <Text style={styles.errorText}>{errors.streetNumber}</Text> : null}
              </View>
              <View style={styles.doorInputWrapper}>
                <Text style={styles.inputLabel}>{t('door')}</Text>
                <AppTextInput
                  placeholder={t('door_placeholder')}
                  value={formData.door}
                  onChangeText={text => setFormData({...formData, door: text})}
                />
              </View>
            </View>
            <View style={[styles.rowGroup, styles.rowSpacing]}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('zip_code')}</Text>
                <AppTextInput
                  placeholder={'00000'}
                  value={formData.zip}
                  onChangeText={text => {
                    setFormData({...formData, zip: text});
                    if (errors.zip) {
                      setErrors({...errors, zip: ''});
                    }
                  }}
                  error={errors.zip}
                  keyboardType="numeric"
                />
                {errors.zip ? <Text style={styles.errorText}>{errors.zip}</Text> : null}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('city')}</Text>
                <AppTextInput
                  placeholder={t('Madrid')}
                  value={formData.city}
                  onChangeText={text => {
                    setFormData({...formData, city: text});
                    if (errors.city) {
                      setErrors({...errors, city: ''});
                    }
                  }}
                  error={errors.city}
                />
                {errors.city ? <Text style={styles.errorText}>{errors.city}</Text> : null}
              </View>
            </View>
            <View style={styles.singleInputWrapper}>
              <Text style={styles.inputLabel}>{t('country')}</Text>
              <AppTextInput
                placeholder={t('country_placeholder')}
                value={formData.country}
                onChangeText={text => {
                  setFormData({...formData, country: text});
                  if (errors.country) {
                    setErrors({...errors, country: ''});
                  }
                }}
                error={errors.country}
              />
              {errors.country ? <Text style={styles.errorText}>{errors.country}</Text> : null}
            </View>
          </View>
        </DropShadow>
        <DropShadow style={[styles.shadowStyle, {marginTop: 20}]}>
          <View style={styles.formCard}>
            <View>
              <Text style={styles.inputLabel}>{t('email')}</Text>
              <AppTextInput
                placeholder={t('email_placeholder')}
                value={formData.email}
                onChangeText={text => {
                  setFormData({...formData, email: text});
                  if (errors.email) {
                    setErrors({...errors, email: ''});
                  }
                }}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>
            <View style={styles.telephoneWrapper}>
              <Text style={styles.inputLabel}>{t('telephone')}</Text>
              <View style={styles.telephoneInputContainer}>
                <TouchableOpacity 
                  onPress={() => setShowCountryPicker(true)}
                  style={styles.countryPickerButton}
                >
                  <CountryPicker
                    withFilter
                    withCallingCode
                    onSelect={onSelectCountry}
                    withFlag={false}
                    withEmoji={false}
                    withFlagButton={false}
                    countryCode={countryCode}
                    visible={showCountryPicker}
                    onClose={() => setShowCountryPicker(false)}
                  />
                  <Text style={styles.telephoneCode}>+{callingCode}</Text>
                </TouchableOpacity>
                <AppTextInput
                  placeholder={t('000 000 000')}
                  value={formData.telephone}
                  onChangeText={text => {
                    setFormData({...formData, telephone: text});
                    if (errors.telephone) {
                      setErrors({...errors, telephone: ''});
                    }
                  }}
                  style={styles.telephoneInput}
                  keyboardType="phone-pad"
                  error={errors.telephone}
                />
              </View>
              {errors.telephone ? <Text style={styles.errorText}>{errors.telephone}</Text> : null}
            </View>
          </View>
        </DropShadow>
        <View style={styles.checkboxWrapper}>
          <CheckBox
            tintColors={{true: Colors.primary, false: Colors.primary}}
            value={formData.agree}
            onValueChange={() => {
              setFormData({...formData, agree: !formData.agree});
              if (errors.agree) {
                setErrors({...errors, agree: ''});
              }
            }}
          />
          <Text style={styles.checkBoxLabel}>
            {t('accept_terms')}{' '}
            <Text style={{textDecorationLine: 'underline'}}>
              {t('privacy_policy')}
            </Text>
          </Text>
        </View>
        {errors.agree ? <Text style={[styles.errorText, styles.centerText]}>{errors.agree}</Text> : null}
        {errors.api ? <Text style={[styles.errorText, styles.centerText, styles.apiError]}>{errors.api}</Text> : null}
        <AppButton
          title={t('save_continue')}
          btnColor={Colors.primary}
          btnTitleColor={Colors.white}
          style={styles.continueButton}
          onPress={handleSaveContinue}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  formWrapper: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputGroup: {
    width: '45%',
  },
  inputLabel: {
    ...Typography.f_16_inter_medium,
    color: Colors.black,
    marginBottom: -5,
  },
  shadowStyle: {
    shadowColor: Colors.gray,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    marginTop: -15,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
  },
  rowGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowSpacing: {
    marginTop: 15,
  },
  streetInputWrapper: {
    width: '65%',
  },
  doorInputWrapper: {
    width: '25%',
  },
  singleInputWrapper: {
    marginTop: 15,
  },
  telephoneWrapper: {
    marginTop: 15,
  },
  telephoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.3,
    borderColor: Colors.gray,
    borderRadius: 8,
    backgroundColor: Colors.white,
    marginTop: 15,
    paddingHorizontal: 14,
    gap: 8,
    paddingVertical: 0.5,
  },
  countryPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  telephoneCode: {
    ...Typography.f_16_inter_medium,
    color: Colors.black,
  },
  telephoneInput: {
    borderWidth: 0,
    marginTop: 0,
    flex: 1,
    paddingLeft: 8,
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 10,
  },
  checkBoxLabel: {
    ...Typography.f_16_inter_medium,
    color: Colors.black,
  },
  continueButton: {
    margin: 20,
    marginTop: 10,
  },
  errorText: {
    color: Colors.error || 'red',
    fontSize: 12,
    marginTop: 4,
  },
  centerText: {
    textAlign: 'center',
  },
  apiError: {
    marginTop: 10,
    marginBottom: -5,
  }
});
