import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import AppStatusBar from '../../components/AppStatusBar';
import Colors from '../../utilities/constants/colors';
import {Typography} from '../../utilities/constants/constant.style';
import DropShadow from 'react-native-drop-shadow';
import {PrevWhite, Eye, EyeOff} from '../../assets/svg';
import AppButton from '../../components/AppButton';
import AppTextInput from '../../components/AppTextInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {changePassword} from '../../redux/features/auth/authThunks';
import {selectAuthLoading} from '../../redux/features/auth/authSelectors';

export default function EditPassword({navigation}) {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const authLoading = useSelector(selectAuthLoading);

  const [formData, setFormData] = useState({
    currentPass: '',
    newPass: '',
    secureCurrPass: true,
    secureNewPass: true,
  });

  const handleChangePassword = async () => {
    try {
      const res = await dispatch(changePassword(formData.newPass));

      if (res.type === 'auth/changePassword/fulfilled') {
        console.log('Password change successful:', res);
        navigation.navigate('Login');
      } else {
        console.error('Error changing password:', res.error.message);
      }
    } catch (error) {
      console.error('Error changing password:', error.message);
    }
  };

  return (
    <View style={styles.containerBackground}>
      <AppStatusBar />
      <View style={styles.headerContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}>
          <PrevWhite />
        </TouchableOpacity>
        <Text style={styles.headerTitleText}>{t('password')}</Text>
        <Text />
      </View>
      <DropShadow style={styles.shadowWrapper}>
        <KeyboardAwareScrollView>
          <View style={styles.cardWrapper}>
            <View>
              <Text style={styles.inputLabel}>{t('current_pass')}</Text>
              <AppTextInput
                placeholder={'****'}
                value={formData.currentPass}
                onChangeText={text =>
                  setFormData({...formData, currentPass: text})
                }
                secureTextEntry={formData.secureCurrPass}
                icon={formData.secureCurrPass ? <EyeOff /> : <Eye />}
                iconPress={() =>
                  setFormData({
                    ...formData,
                    secureCurrPass: !formData.secureCurrPass,
                  })
                }
                style={styles.inputField}
              />
            </View>
            <View>
              <Text style={styles.inputLabel}>{t('new_pass')}</Text>
              <AppTextInput
                placeholder={'****'}
                value={formData.newPass}
                onChangeText={text => setFormData({...formData, newPass: text})}
                secureTextEntry={formData.secureNewPass}
                icon={formData.secureNewPass ? <EyeOff /> : <Eye />}
                iconPress={() =>
                  setFormData({
                    ...formData,
                    secureNewPass: !formData.secureNewPass,
                  })
                }
                style={styles.inputField}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </DropShadow>
      <View style={styles.footerContainer}>
        <AppButton
          title={
            authLoading ? <ActivityIndicator color={Colors.white} /> : t('keep')
          }
          btnColor={Colors.primary}
          btnTitleColor={Colors.white}
          style={styles.keepButton}
          onPress={handleChangePassword}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerBackground: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 50,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 15,
  },
  headerTitleText: {
    color: Colors.white,
    ...Typography.f_20_inter_semi_bold,
  },
  shadowWrapper: {
    shadowColor: Colors.gray,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    marginHorizontal: 15,
    marginTop: -30,
  },
  cardWrapper: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 35,
    gap: 15,
  },
  inputLabel: {
    color: Colors.black,
    ...Typography.f_18_inter_semi_bold,
  },
  inputField: {
    marginTop: 7,
  },
  footerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keepButton: {
    marginHorizontal: 15,
    marginBottom: 40,
  },
});
