import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Modal,
  Image,
  TouchableOpacity,
} from 'react-native';
import AppButton from '../../components/AppButton';
import {ListProductHeader} from '../../components/ListProductHeader';
import Colors from '../../utilities/constants/colors';
import AppStatusBar from '../../components/AppStatusBar';

import AppTextInput from '../../components/AppTextInput';
import {Typography} from '../../utilities/constants/constant.style';
import CheckBox from 'react-native-check-box';
import {useTranslation} from 'react-i18next';
import {colors} from '../../utilities/constants';
import {CrossBlack} from '../../assets/svg';

export const Step5 = ({formData, updateFormData, onBack, onNext}) => {
  const [deposit, setDeposit] = useState(false);
  const [error, setError] = useState(''); // State for validation error
  const {t} = useTranslation();
  const [currentStep, setCurrentStep] = useState(5);
  const [showModal, setShowModal] = useState(false);

  const toggleDeposit = () => {
    setDeposit(!deposit);
    if (!deposit) {
      updateFormData('deposit', ''); // Clear deposit when unchecking
    }
  };

  const validateForm = () => {
    // Check if price is empty
    if (!formData.price || formData.price.trim() === '') {
      setError(t('validation.price_required'));
      setTimeout(() => {
        setError('');
      }, 3000);
      return false;
    }

    // Check if price is a valid number
    const priceValue = parseFloat(formData.price);
    if (isNaN(priceValue)) {
      setError(t('validation.price_invalid'));
      setTimeout(() => {
        setError('');
      }, 3000);
      return false;
    }

    // Check if price is positive
    if (priceValue <= 0) {
      setError(t('validation.price_positive'));
      setTimeout(() => {
        setError('');
      }, 3000);
      return false;
    }

    // Deposit checkbox must be checked
    // if (!deposit) {
    //   setError(t('validation.deposit_required'));
    //   setTimeout(() => setError(''), 3000);
    //   return false;
    // }

    // Deposit field validations
    // if (deposit) {
    //   if (!formData.deposit || formData.deposit.trim() === '') {
    //     setError(t('validation.deposit_required'));
    //     setTimeout(() => setError(''), 3000);
    //     return false;
    //   }

    //   const depositValue = parseFloat(formData.deposit);
    //   if (isNaN(depositValue)) {
    //     setError(t('validation.deposit_invalid'));
    //     setTimeout(() => setError(''), 3000);
    //     return false;
    //   }

    //   if (depositValue <= 0) {
    //     setError(t('validation.deposit_positive'));
    //     setTimeout(() => setError(''), 3000);
    //     return false;
    //   }
    // }

    setError('');
    return true;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handlePriceChange = text => {
    updateFormData('price', text);
    if (error) setError(''); // Clear error when user types
  };
  const handleserialNumChange = text => {
    updateFormData('serialNum', text);
    if (error) setError(''); // Clear error when user types
  };

  const handleDepositChange = text => {
    updateFormData('deposit', text);
    if (error && error.includes('deposit')) setError(''); // Clear deposit-related errors
  };

  const steps = [
    t('steps.model'),
    t('steps.category'),
    t('steps.direction'),
    t('steps.photo'),
    t('steps.price'),
    t('steps.preview'),
  ];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <AppStatusBar />
        <ListProductHeader
          title={``}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          onBack={onBack}
          steps={steps}
          desc={
            <Text
              style={[Typography.f_16_inter_regular, {color: colors.black}]}>
              <Text style={[Typography.f_16_inter_bold]}>{t('setPrice')}</Text>{' '}
              {t('set_price_desc')}
            </Text>
          }
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.formWrapper}>
            <View>
              <Text
                style={[
                  Typography.f_14_inter_bold,
                  {color: colors.black, lineHeight: 22, paddingBottom: 20},
                ]}>
                {t('reminder')}
                <Text style={[Typography.f14]}> {t('insuranceTitle')}</Text>
              </Text>
              <Text style={styles.priceLabel}>
                {t('price_per_day')} <Text style={styles.asterisk}>*</Text>
              </Text>
              <AppTextInput
                placeholder={t('price_per_day_placeholder')}
                value={formData.price}
                onChangeText={handlePriceChange}
                keyboardType="numeric"
              />
              <Text style={[styles.priceLabel, {marginTop: 15}]}>
                {t('SerialNumber')}
              </Text>
              <AppTextInput
                placeholder={'Ej. 12345678'}
                value={formData.serialNum}
                onChangeText={handleserialNumChange}
                keyboardType="numeric"
              />
              <Text
                style={[
                  Typography.f_12_inter_medium,
                  {color: '#A05C7B', marginTop: 8},
                ]}
                onPress={() => setShowModal(true)}>
                {t('frameNum')}
              </Text>
              <Text
                style={[
                  Typography.f_12_inter_medium,
                  {color: Colors.black, marginTop: 10, lineHeight: 20},
                ]}>
                {t('NoFrame')}
              </Text>
            </View>
            <View style={styles.checkboxWrapper}>
              <CheckBox
                onClick={toggleDeposit}
                isChecked={deposit}
                checkBoxColor={Colors.primary}
              />
              <Text style={styles.billLabel}>{t('bill')}</Text>
            </View>
            {error && !error.includes('deposit') && (
              <Text style={styles.errorText}>{error}</Text>
            )}
            {deposit && (
              <>
                <AppTextInput
                  placeholder={t('bill_placeholder')}
                  value={formData.deposit}
                  onChangeText={handleDepositChange}
                  keyboardType="numeric"
                />
                {error && error.includes('deposit') && (
                  <Text style={styles.errorText}>{error}</Text>
                )}
              </>
            )}

            <Text
              style={[
                Typography.f_12_inter_regular,
                {
                  color: deposit ? Colors.black : Colors.gray,
                },
                styles.depositText,
              ]}>
              {t('deposit_text')}
            </Text>
          </View>
          <AppButton
            title={t('following')}
            btnColor={Colors.primary}
            btnTitleColor={Colors.white}
            style={styles.followBtn}
            onPress={handleNext}
          />
        </ScrollView>
        <Modal
          visible={showModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowModal(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 20,
                width: '90%',
              }}>
              <View>
                <Image
                  source={require('../../assets/images/serial_number_example.png')}
                  style={{width: '100%', height: 380, borderRadius: 10}}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{position: 'absolute', padding: 10, right: 0}}
                  onPress={() => setShowModal(false)}>
                  <CrossBlack />
                </TouchableOpacity>
              </View>
              <Text
                style={[
                  Typography.f_18_inter_semi_bold,
                  {color: colors.black, marginTop: 10},
                ]}>
                {t('frameNum_modal_title')}
              </Text>
              <Text
                style={[
                  Typography.f_14_roboto_medium,
                  {marginTop: 8, color: colors.black, lineHeight: 22},
                ]}>
                {t('frameNum_modal_1')}
              </Text>
              <View style={{marginTop: 8}}>
                {t('frameNum_modal_bullets', {returnObjects: true}).map(
                  (item, idx) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 10,
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          height: 5,
                          width: 5,
                          borderRadius: 50,
                          backgroundColor: colors.black,
                          bottom: 5,
                        }}
                      />
                      <Text
                        key={idx}
                        style={[
                          Typography.f_12_inter_medium,
                          {color: colors.black, paddingBottom: 10},
                        ]}>
                        {item}
                      </Text>
                    </View>
                  ),
                )}
              </View>
              <AppButton
                title={t('frameNum_modal_btn')}
                btnColor={Colors.primary}
                btnTitleColor={Colors.white}
                style={{marginTop: 10}}
                onPress={() => setShowModal(false)}
              />
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  formWrapper: {
    paddingHorizontal: 20,
  },
  priceLabel: {
    ...Typography.f_18_inter_semi_bold,
    color: Colors.black,
  },
  asterisk: {
    color: Colors.error,
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 20,
  },
  billLabel: {
    ...Typography.f_18_inter_semi_bold,
    color: Colors.black,
  },
  followBtn: {
    marginTop: 60,
    marginHorizontal: 20,
    marginBottom: 40,
  },
  depositText: {
    lineHeight: 20,
    marginTop: 20,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 5,
  },
});
