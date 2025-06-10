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
import AppButton from '../../components/AppButton';
import { ListProductHeader } from '../../components/ListProductHeader';
import Colors from '../../utilities/constants/colors';
import AppStatusBar from '../../components/AppStatusBar';

import AppTextInput from '../../components/AppTextInput';
import { Typography } from '../../utilities/constants/constant.style';
import { useTranslation } from 'react-i18next';

export const Step1 = ({ formData, updateFormData, onNext }) => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState({
    brand: '',
    model: '',
  });

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

  const handleNext = () => {
    if (validateForm()) {
      onNext();
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