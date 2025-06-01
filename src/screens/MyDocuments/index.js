import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import AppStatusBar from '../../components/AppStatusBar';
import Colors from '../../utilities/constants/colors';
import { Typography } from '../../utilities/constants/constant.style';
import { PrevWhite } from '../../assets/svg';
import Images from '../../assets/images';
import AppButton from '../../components/AppButton';
import { useTranslation } from 'react-i18next';
import { launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { sendApprovalImages } from '../../redux/features/auth/authThunks';
import {
  selectApprovalStatus,
  selectSendApprovalLoading,
} from '../../redux/features/auth/authSelectors';

export default function MyDocuments({ navigation }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const loading = useSelector(selectSendApprovalLoading);
  const approvalStatus = useSelector(selectApprovalStatus);
  const [frontIdImage, setFrontIdImage] = useState(null);
  const [backIdImage, setBackIdImage] = useState(null);

  const selectImage = side => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 1, includeBase64: false },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          const source = { uri: response.assets[0].uri };
          if (side === 'front') {
            setFrontIdImage(source);
          } else {
            setBackIdImage(source);
          }
        }
      },
    );
  };

  const handleDocumentApproval = async () => {
    if (!frontIdImage || !backIdImage) {
      console.log('Please upload both front and back images of your id.');
      return;
    }
    const photos = [
      { uri: frontIdImage.uri, type: 'image/jpeg', name: 'front_id.jpg' },
      { uri: backIdImage.uri, type: 'image/jpeg', name: 'back_id.jpg' },
    ];

    if (!approvalStatus) {
      const res = await dispatch(sendApprovalImages(photos));
      // const approvalRes = await dispatch(fetchApprovedInfo(user_id));
      // console.log(res, '-------res', approvalRes);
      navigation.pop();
    } else {
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.background}>
      <AppStatusBar />
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}>
          <PrevWhite />
        </TouchableOpacity>
        <Text style={[Typography.f_20_inter_semi_bold, styles.headerTitle]}>
          {t('my_documents')}
        </Text>
        <Text />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>
        <View style={styles.shadowContainer}>
          <View style={styles.cardContainer}>
            <Text style={[Typography.f_16_inter_regular, styles.cardText]}>
              {t('upload_front_id_msg')}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.uploadButton,
                { borderColor: frontIdImage ? Colors.primary : Colors.platinum },
              ]}
              onPress={() => selectImage('front')}>
              {frontIdImage ? (
                <Image
                  source={frontIdImage}
                  resizeMode="cover"
                  style={styles.uploadImage}
                />
              ) : (
                <Image
                  source={Images.ID_BG}
                  resizeMode="cover"
                  style={styles.uploadImage}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.shadowContainer, styles.shadowContainerLast]}>
          <View style={styles.cardContainer}>
            <Text style={[Typography.f_16_inter_regular, styles.cardText]}>
              {t('upload_back_id_msg')}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.uploadButton,
                { borderColor: backIdImage ? Colors.primary : Colors.platinum },
              ]}
              onPress={() => selectImage('back')}>
              {backIdImage ? (
                <Image
                  source={backIdImage}
                  resizeMode="cover"
                  style={styles.uploadImage}
                />
              ) : (
                <Image
                  source={Images.ID_BG}
                  resizeMode="cover"
                  style={styles.uploadImage}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <AppButton
          title={
            loading ? <ActivityIndicator color={Colors.white} /> : t('keep')
          }
          btnColor={Colors.primary}
          btnTitleColor={Colors.white}
          style={styles.appButton}
          onPress={handleDocumentApproval}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
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
  headerTitle: {
    color: Colors.white,
  },
  scrollView: {
    marginTop: -30,
  },
  shadowContainer: {
    marginHorizontal: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
    backgroundColor: Colors.white,
    borderRadius: 20
  },
  shadowContainerLast: {
    paddingBottom: 20,
  },
  cardContainer: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 15,
  },
  cardText: {
    color: Colors.black,
    lineHeight: 24
  },
  uploadButton: {
    borderStyle: 'dashed',
    borderWidth: 4,
    padding: 15,
    marginTop: 15,
    borderRadius: 12,
    marginHorizontal: 30,
  },
  uploadImage: {
    height: 179,
    alignSelf: 'center',
    borderRadius: 20,
    width: '100%',
  },
  appButton: {
    marginHorizontal: 15,
    marginBottom: 40,
    marginTop: 30
  },
});
