import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../utilities/constants/colors';

import {Typography} from '../../utilities/constants/constant.style';
import AppButton from '../../components/AppButton';
import AppStatusBar from '../../components/AppStatusBar';
import AppTextInput from '../../components/AppTextInput';
import {useDispatch, useSelector} from 'react-redux';
import {forgotPassword} from '../../redux/features/auth/authThunks';
import {
  selectAuthLoading,
  selectAuthError,
} from '../../redux/features/auth/authSelectors';
import PopUp from '../../components/PopUp';
import {Back, Tick, Cross} from '../../assets/svg';
import {useTranslation} from 'react-i18next';
import {Formik} from 'formik';
import * as Yup from 'yup';

export default function ForgotPassword({navigation}) {
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    email: Yup.string().email(t('invalid_email')).required(t('email_required')),
    confirmEmail: Yup.string()
      .email(t('invalid_email'))
      .oneOf([Yup.ref('email')], t('emails_must_match'))
      .required(t('confirm_email_required')),
  });

  const handleForgotPassword = async values => {
    const {email} = values;
    try {
      const response = await dispatch(forgotPassword(email));
      if (response?.payload?.success) {
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
    navigation.replace('Login');
  };

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.screenWrapper}>
        <AppStatusBar />
        {showErrorPopup ? (
          <PopUp
            icon={<Cross />}
            title={t('something_went_wrong')}
            description={error || t('forgot_password_fail')}
            iconPress={closeErrorPopup}
            onButtonPress={closeErrorPopup}
          />
        ) : showSuccessPopup ? (
          <PopUp
            icon={<Tick />}
            title={t('mail_sent')}
            description={t('link_sent_msg')}
            iconPress={closeSuccessPopup}
            onButtonPress={closeSuccessPopup}
          />
        ) : (
          <View style={styles.formWrapper}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}>
              <Back />
            </TouchableOpacity>
            <Text style={[Typography.f_24_inter_bold, styles.title]}>
              {t('recover_password')}
            </Text>
            <Text style={[Typography.f_16_inter_regular, styles.infoText]}>
              {t('forget_password_msg')}
            </Text>
            <Formik
              initialValues={{email: '', confirmEmail: ''}}
              validationSchema={validationSchema}
              onSubmit={handleForgotPassword}
              >
              {({values, handleChange, handleSubmit, errors, touched}) => (
                <>
                  <AppTextInput
                    placeholder={t('your_email')}
                    value={values.email}
                    onChangeText={handleChange('email')}
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                  <AppTextInput
                    placeholder={t('repeat_email')}
                    value={values.confirmEmail}
                    onChangeText={handleChange('confirmEmail')}
                  />
                  {touched.confirmEmail && errors.confirmEmail && (
                    <Text style={styles.errorText}>{errors.confirmEmail}</Text>
                  )}
                  <AppButton
                    title={
                      loading ? (
                        <ActivityIndicator color={Colors.white} />
                      ) : (
                        t('send_reset_link')
                      )
                    }
                    btnColor={Colors.primary}
                    btnTitleColor={Colors.white}
                    style={styles.resetButton}
                    onPress={handleSubmit}
                  />
                </>
              )}
            </Formik>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  formWrapper: {
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  title: {
    color: Colors.black,
    marginBottom: 10,
    marginTop: 30,
  },
  infoText: {
    color: Colors.black,
    marginBottom: 20,
    lineHeight: 25,
  },
  resetButton: {
    marginTop: 40,
  },
  errorText: {
    color: Colors.error,
    ...Typography.f_16_inter_regular,
    marginTop: 5,
    marginLeft: 15,
  },
});
