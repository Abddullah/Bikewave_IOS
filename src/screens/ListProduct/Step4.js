import React, { useState } from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Text,
  View
} from 'react-native';
import AppButton from '../../components/AppButton';
import { ListProductHeader } from '../../components/ListProductHeader';
import Colors from '../../utilities/constants/colors';
import AppStatusBar from '../../components/AppStatusBar';
import Images from '../../assets/images';
import { useTranslation } from 'react-i18next';

export const Step4 = ({ formData, onNext, onImagePick, onBack }) => {
  const { t } = useTranslation();
  const [error, setError] = useState(''); // State for validation error
  const steps = [
    t('steps.model'),
    t('steps.category'),
    t('steps.direction'),
    t('steps.photo'),
    t('steps.price'),
    t('steps.preview'),
  ];

  const handleNext = () => {
    if (!formData.photo || !formData.photo.uri) {
      setError(t('validation.photo_required'));
      setTimeout(() => {
        setError('');
      }, 3000);
      return;
    }
    setError('');
    onNext();
  };

  const handleImagePick = () => {
    onImagePick();
    setError(''); // Clear error when user attempts to pick an image
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <AppStatusBar />
        <ListProductHeader
          title={``}
          currentStep={4}
          steps={steps}
          onBack={onBack}
          desc={`${t('add_photo_desc')}`}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleImagePick}
          style={styles.imageContainer}
        >
          {formData.photo && formData.photo.uri ? (
            <Image
              source={{ uri: formData.photo.uri }}
              style={styles.galleryPlaceholder}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={Images.gallery}
              style={styles.galleryPlaceholder}
              resizeMode="stretch"
            />
          )}
        </TouchableOpacity>
        {error ? (
          <Text style={styles.errorText}>
            {error}
          </Text>
        ) : null}
        <AppButton
          title={t('following')}
          btnColor={Colors.primary}
          btnTitleColor={Colors.white}
          style={styles.followBtn}
          onPress={handleNext} // Changed from onNext to handleNext
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
  followBtn: {
    marginHorizontal: 20,
    marginVertical: 25,
  },
  galleryPlaceholder: {
    height: 350,
    width: '95%',
    alignSelf: 'center',
    borderRadius: 43,
  },
  imageContainer: {
    marginBottom: 10,
  },
  errorText: {
    color: Colors.error,
    textAlign: 'center',
  },
});