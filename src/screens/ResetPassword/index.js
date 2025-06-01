import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../utilities/constants/colors';

import {Typography} from '../../utilities/constants/constant.style';
import AppButton from '../../components/AppButton';
import AppTextInput from '../../components/AppTextInput';
import AppStatusBar from '../../components/AppStatusBar';
import {useDispatch, useSelector} from 'react-redux';
import {changePassword} from '../../redux/features/auth/authThunks';
import {
  selectAuthError,
  selectAuthLoading,
} from '../../redux/features/auth/authSelectors';
import PopUp from '../../components/PopUp';
import {t} from 'i18next';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Tick, Cross} from '../../assets/svg';
import {useTranslation} from 'react-i18next';

const validationSchema = Yup.object({
  password: Yup.string()
    .min(6, t('password_min_length'))
    .required(t('password_required')),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], t('passwords_must_match'))
    .required(t('confirm_password_required')),
});

export default function ResetPassword({navigation}) {
  const {t} = useTranslation();
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <AppStatusBar />
        {/* when reset password success */}
        {/* <PopUp
          icon={<Tick />}
          title={t('password_reset')}
          description={t('password_save_msg')}
          iconPress={() => navigation.navigate('ResetPassword')}
          onButtonPress={() => navigation.navigate('ResetPassword')}
        /> */}
        {/* when reset password fail */}
        {/* <PopUp
          icon={<Cross />}
          title={t('something_went_wrong')}
          description={t('password_save_fail_msg')}
          iconPress={() => navigation.navigate('ResetPassword')}
          onButtonPress={() => navigation.navigate('ResetPassword')}
        /> */}
        <View style={styles.formContainer}>
          <Text style={styles.f_24_inter_bold}>{t('reset_password')}</Text>
          <Formik
            initialValues={{password: '', confirmPassword: ''}}
            // validationSchema={validationSchema}
            onSubmit={values => {
              console.log('Reset Password Data', values);
            }}>
            {({values, handleChange, handleSubmit, errors, touched}) => (
              <>
                <AppTextInput
                  placeholder={t('new_password')}
                  value={values.password}
                  onChangeText={handleChange('password')}
                />
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
                <AppTextInput
                  placeholder={t('repeat_password')}
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
                <AppButton
                  title={t('save_password')}
                  btnColor={Colors.primary}
                  btnTitleColor={Colors.white}
                  style={{marginTop: 40}}
                  onPress={() => navigation.navigate('Tabs')}
                />
              </>
            )}
          </Formik>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  formContainer: {
    paddingHorizontal: 15,
    paddingTop: 70,
  },
  f_24_inter_bold: {
    ...Typography.f_24_inter_bold,
    color: Colors.black,
    marginBottom: 20,
  },
  errorText: {
    color: Colors.error,
    ...Typography.f_16_inter_regular,
    marginTop: 5,
    marginLeft: 15,
  },
});
