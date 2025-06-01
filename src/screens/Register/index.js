import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import {Cross, Eye, EyeOff, Tick} from '../../assets/svg';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';
import {
  register,
  sendEmailAfterRegister,
} from '../../redux/features/auth/authThunks';
import {
  selectAuthLoading,
  selectAuthError,
} from '../../redux/features/auth/authSelectors';
import Colors from '../../utilities/constants/colors';
import {Typography} from '../../utilities/constants/constant.style';
import AppButton from '../../components/AppButton';
import AppTextInput from '../../components/AppTextInput';
import AppStatusBar from '../../components/AppStatusBar';
import PopUp from '../../components/PopUp';
import {useTranslation} from 'react-i18next';

export default function Register({navigation}) {
  const [securePassword, setSecurePassword] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const validationSchema = Yup.object({
    firstName: Yup.string().required(t('first_name_required')),
    lastName: Yup.string().required(t('last_name_required')),
    email: Yup.string().email(t('invalid_email')).required(t('email_required')),
    password: Yup.string()
      .min(6, t('password_min_length'))
      .required(t('password_required')),
  });

  const handleRegister = async values => {
    const {firstName, lastName, email, password} = values;
    try {
      const response = await dispatch(
        register({email, firstName, secondName: lastName, password}),
      );
      if (response?.payload?.success) {
        await dispatch(sendEmailAfterRegister(email));
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
      <View style={styles.container}>
        <AppStatusBar />
        {showSuccessPopup ? (
          <PopUp
            icon={<Tick />}
            title={t('successful_registration')}
            description={t('register_success_msg')}
            iconPress={closeSuccessPopup}
            onButtonPress={closeSuccessPopup}
          />
        ) : showErrorPopup ? (
          <PopUp
            icon={<Cross />}
            title={t('something_went_wrong')}
            description={error || t('register_fail_msg')}
            iconPress={closeErrorPopup}
            onButtonPress={closeErrorPopup}
          />
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.f_24_inter_bold}>
              {t('create_your_account')}
            </Text>
            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                password: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleRegister}>
              {({values, handleChange, handleSubmit, errors, touched}) => (
                <>
                  <AppTextInput
                    placeholder={t('first_name')}
                    value={values.firstName}
                    onChangeText={handleChange('firstName')}
                  />
                  {touched.firstName && errors.firstName && (
                    <Text style={styles.errorText}>{errors.firstName}</Text>
                  )}
                  <AppTextInput
                    placeholder={t('last_name')}
                    value={values.lastName}
                    onChangeText={handleChange('lastName')}
                  />
                  {touched.lastName && errors.lastName && (
                    <Text style={styles.errorText}>{errors.lastName}</Text>
                  )}
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
                        t('register')
                      )
                    }
                    btnColor={Colors.primary}
                    btnTitleColor={Colors.white}
                    onPress={handleSubmit}
                    style={{marginTop: 40}}
                  />
                </>
              )}
            </Formik>
            <Text
              onPress={() => navigation.navigate('Login')}
              style={[Typography.f_16_inter_regular, styles.footerText]}>
              {t('already_have_an_account')}{' '}
              <Text
                style={[
                  Typography.f_16_inter_extra_bold_italic,
                  {color: Colors.primary},
                ]}>
                {t('login')}
              </Text>
            </Text>
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
