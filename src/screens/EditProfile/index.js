import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AppStatusBar from '../../components/AppStatusBar';
import Colors from '../../utilities/constants/colors';
import {Typography} from '../../utilities/constants/constant.style';
import DropShadow from 'react-native-drop-shadow';
import {PrevWhite} from '../../assets/svg';
import AppButton from '../../components/AppButton';
import AppTextInput from '../../components/AppTextInput';
import {useDispatch, useSelector} from 'react-redux';
import {fetchUserInfo, updateUser} from '../../redux/features/auth/authThunks';
import {
  selectUserDetails,
  selectAuthUserId,
  selectEditLoading,
} from '../../redux/features/auth/authSelectors';
import {useTranslation} from 'react-i18next';

export default function EditProfile({navigation}) {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const userDetails = useSelector(selectUserDetails);
  const user_id = useSelector(selectAuthUserId);
  const loading = useSelector(selectEditLoading);

  useEffect(() => {
    dispatch(fetchUserInfo(user_id));
  }, [user_id, dispatch]);

  const [formData, setFormData] = useState({
    firstName: userDetails?.firstName || '',
    lastName: userDetails?.secondName || '',
    email: userDetails?.email || '',
  });

  const handleUpdate = async () => {
    try {
      await dispatch(
        updateUser({
          userId: user_id,
          firstName: formData.firstName,
          secondName: formData.lastName,
          email: formData.email,
        }),
      );

      await dispatch(fetchUserInfo(user_id));

      navigation.navigate('Profile1');
    } catch (error) {
      console.error('Error updating user info', error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.containerBackground}>
        <AppStatusBar />
        <View style={styles.headerContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}>
            <PrevWhite />
          </TouchableOpacity>
          <Text style={styles.headerTitleText}>{t('Personal_data')}</Text>
          <Text />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginTop: -30}}>
          <View style={styles.shadowWrapper}>
            <View style={styles.cardWrapper}>
              <View>
                <Text style={styles.inputLabel}>{t('your_first_name')}</Text>
                <AppTextInput
                  placeholder={'Test'}
                  value={formData.firstName}
                  onChangeText={text =>
                    setFormData({...formData, firstName: text})
                  }
                  style={styles.inputField}
                />
              </View>
              <View>
                <Text style={styles.inputLabel}>{t('your_last_name')}</Text>
                <AppTextInput
                  placeholder={'Test'}
                  value={formData.lastName}
                  onChangeText={text =>
                    setFormData({...formData, lastName: text})
                  }
                  style={styles.inputField}
                />
              </View>
              <View>
                <Text style={styles.inputLabel}>{t('your_email')}</Text>
                <AppTextInput
                  placeholder={'mail@mail.com'}
                  value={formData.email}
                  onChangeText={text => setFormData({...formData, email: text})}
                  style={styles.inputField}
                />
              </View>
            </View>
          </View>
        <AppButton
          title={
            loading ? <ActivityIndicator color={Colors.white} /> : t('keep')
          }
          btnColor={Colors.primary}
          btnTitleColor={Colors.white}
          style={styles.keepButton}
          onPress={handleUpdate}
        />
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
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
    paddingTop: 40,
    paddingBottom: 50,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  headerTitleText: {
    color: Colors.white,
    ...Typography.f_20_inter_semi_bold,
  },
  shadowWrapper: {
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
    borderRadius: 20,
    marginHorizontal: 15,
    marginBottom: 5,
  },
  cardWrapper: {
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
  keepButton: {
    marginHorizontal: 15,
    marginTop: 220,
    marginBottom: 30,
  },
});
