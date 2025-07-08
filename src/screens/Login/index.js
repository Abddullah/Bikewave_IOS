import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../utilities/constants/colors';

import { Typography } from '../../utilities/constants/constant.style';
import AppStatusBar from '../../components/AppStatusBar';
import AppTextInput from '../../components/AppTextInput';
import { login, googleSignIn } from '../../redux/features/auth/authThunks';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAuthLoading,
  selectAuthError,
  selectAuthUserId,
} from '../../redux/features/auth/authSelectors';
import AppButton from '../../components/AppButton';
import { Eye, EyeOff, Cross, Tick, Google, Apple } from '../../assets/svg';
import PopUp from '../../components/PopUp';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { saveFCMToken } from '../../utilities/fcmTokenManager';
import { EnvConfig } from '../../config/envConfig';

export default function Login({ navigation }) {
  const [securePassword, setSecurePassword] = useState(true);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const userId = useSelector(selectAuthUserId);

  const validationSchema = Yup.object({
    email: Yup.string().email(t('invalid_email')).required(t('email_required')),
    password: Yup.string()
      .min(6, t('password_min_length'))
      .required(t('password_required')),
  });
  console.log(EnvConfig,'_____EnvConfig_____ ');

  const handleLogin = async values => {
    const { email, password } = values;
    try {
      const response = await dispatch(login({ email, password }));
       if (response?.payload?.success) {
        if (userId) await saveFCMToken(userId);
    navigation.replace('Tabs');
    // setShowSuccessPopup(true);
      } else {
        setShowErrorPopup(true);
      }
    } catch (e) {
      console.log('ERR', e.message);
      setShowErrorPopup(true);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const response = await dispatch(googleSignIn());
      if (response?.payload?.success || response?.payload?.token) {
        const userId = response?.payload?.userId;
        if (userId) await saveFCMToken(userId);
        navigation.replace('Tabs');
      } else {
        setShowErrorPopup(true);
      }
    } catch (e) {
      setShowErrorPopup(true);
    }
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    navigation.replace('Tabs');
  };

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
    navigation.navigate('Login');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <AppStatusBar />
        {showSuccessPopup ? (
          <PopUp
            icon={<Tick />}
            title={t('login_success')}
            description={t('login_success_msg')}
            iconPress={closeSuccessPopup}
            onButtonPress={closeSuccessPopup}
          />
        ) : showErrorPopup ? (
          <PopUp
            icon={<Cross />}
            title={t('something_went_wrong')}
            description={error || t('login_fail_msg')}
            iconPress={closeErrorPopup}
            onButtonPress={closeErrorPopup}
          />
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.f_24_inter_bold}>{t('login')}</Text>
            <Formik
              initialValues={{
                email: '',
                password: '',
                // email: 'arina@gmail.com',
                // password: '222222',
            
              }}
              validationSchema={validationSchema}
              onSubmit={handleLogin}
            >
              {({ values, handleChange, handleSubmit, errors, touched }) => (
                <>
                  <AppTextInput
                    placeholder={t('email')}
                    value={values.email}
                    onChangeText={handleChange('email')}
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                  <AppTextInput
                    placeholder={t('password')}
                    value={values.password}
                    onChangeText={handleChange('password')}
                    secureTextEntry={securePassword}
                    icon={securePassword ? <EyeOff /> : <Eye />}
                    iconPress={() => setSecurePassword(!securePassword)}
                  />
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                  <AppButton
                    title={
                      loading ? (
                        <ActivityIndicator color={Colors.white} />
                      ) : (
                        t('login')
                      )
                    }
                    btnColor={Colors.primary}
                    btnTitleColor={Colors.white}
                    style={{ marginTop: 40 }}
                    onPress={handleSubmit}
                  />
                </>
              )}
            </Formik>
            <Text
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.footerText}>
              {t('forget_password')}
            </Text>
            <Text
              onPress={() => navigation.navigate('Register')}
              style={[Typography.f_16_inter_regular, styles.footerText]}>
              {t('dont_have_an_account')}{' '}
              <Text
                style={[
                  Typography.f_16_inter_extra_bold_italic,
                  { color: Colors.primary },
                ]}>
                {t('register')}
              </Text>
            </Text>
              <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    marginTop: 20,
                  }}
                >
                  {Platform.OS === "ios" ? (
                    <View
                      style={{
                        height: 50,
                        width: 50,
                        borderRadius: 50,
                        justifyContent: "center",
                        alignItems: "center",
                        borderWidth: 1.5,
                        borderColor: Colors.primary,
                        backgroundColor: Colors.white,
                      }}
                    >
                      <Apple />
                    </View>
                  ) : null}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleGoogleSignIn}
                    style={{
                      height: 50,
                      width: 50,
                      borderRadius: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 1.5,
                      borderColor: Colors.primary,
                      backgroundColor: Colors.white,
                    }}
                  >
                    <Google />
                  </TouchableOpacity>
                </View>
          </View>
        )}
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
  footerText: {
    color: Colors.black,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: Colors.error,
    ...Typography.f_16_inter_regular,
    marginTop: 5,
    marginLeft: 15,
  },
});
