import React from 'react';
import {
  StyleSheet,
  Text,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import Colors from '../utilities/constants/colors';
import Images from '../assets/images';
import {Typography} from '../utilities/constants/constant.style';
import AppButton from '../components/AppButton';
import {t} from 'i18next';

const PopUp = ({
  icon,
  iconPress,
  title,
  description,
  buttonTitle = t('back_to_top'),
  onButtonPress,
}) => {
  return (
    <ImageBackground
      style={styles.imageBackground}
      resizeMode="cover"
      source={Images.splashBg}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.iconContainer}
        onPress={iconPress}>
        {icon}
      </TouchableOpacity>
      <Text style={[Typography.f_24_inter_bold, styles.headingText]}>
        {title}
      </Text>
      <Text style={[Typography.f_16_inter_regular, styles.descriptionText]}>
        {description}
      </Text>
      <AppButton
        title={buttonTitle}
        btnColor={Colors.black}
        btnTitleColor={Colors.white}
        style={styles.buttonStyle}
        onPress={onButtonPress}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingTop: 120,
  },
  iconContainer: {
    alignSelf: 'center',
  },
  headingText: {
    color: Colors.white,
    marginVertical: 20,
    textAlign: 'center',
  },
  descriptionText: {
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonStyle: {
    marginTop: 40,
  },
});

export default PopUp;
