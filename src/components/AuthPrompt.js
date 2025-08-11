import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Colors from '../utilities/constants/colors';
import { Typography } from '../utilities/constants/constant.style';
import { Cross, HeartFill } from '../assets/svg';
import AppButton from './AppButton';
import Images from '../assets/images';
import AntDesign from 'react-native-vector-icons/AntDesign';

const AuthPrompt = ({ 
  visible, 
  onClose, 
  feature, 
  featureName,
  onAuthComplete 
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleLoginPress = () => {
    onClose();
    navigation.navigate('Login');
  };

  const handleRegisterPress = () => {
    onClose();
    navigation.navigate('Register');
  };

  // Choose appropriate icon based on feature
  const getFeatureIcon = (feature) => {
    switch (feature) {
      case 'favorites':
      case 'addToFavorites':
      case 'removeFromFavorites':
        return <HeartFill width={50} height={50} color={Colors.primary} />;
      default:
        return (
          <View style={styles.bikeIconContainer}>
            <Image 
              source={Images.bicycle} 
              style={styles.bikeIcon}
              resizeMode="contain"
            />
          </View>
        );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Professional Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}>
            <AntDesign name="close" size={16} color={Colors.gray} />
          </TouchableOpacity>

          <View style={styles.content}>
            {/* Feature Icon */}
            <View style={styles.iconContainer}>
              {getFeatureIcon(feature)}
            </View>
            
            {/* Title */}
            <Text style={styles.title}>
              {t('login_required')}
            </Text>
            
            {/* Message */}
            <Text style={styles.message}>
              {t('login_required_message', { feature: featureName || feature })}
            </Text>

            {/* Benefits Section */}
            <View style={styles.benefitsContainer}>
              <View style={styles.benefitItem}>
                <View style={styles.benefitDot} />
                <Text style={styles.benefitText}>{t('save_favorites')}</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitDot} />
                <Text style={styles.benefitText}>{t('chat_with_owners')}</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitDot} />
                <Text style={styles.benefitText}>{t('make_reservations')}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <AppButton
                title={t('login')}
                btnColor={Colors.primary}
                btnTitleColor={Colors.white}
                onPress={handleLoginPress}
                style={styles.loginButton}
              />
              
              <AppButton
                title={t('register')}
                btnColor={Colors.white}
                btnTitleColor={Colors.primary}
                onPress={handleRegisterPress}
                style={styles.registerButton}
              />
            </View>

            {/* Continue Browsing */}
            <TouchableOpacity
              style={styles.continueAsGuest}
              onPress={onClose}
              activeOpacity={0.7}>
              <Text style={styles.continueAsGuestText}>
                {t('continue_browsing')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    paddingHorizontal: 0,
  },
  container: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: '100%',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 15,
    maxHeight: '85%',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
    paddingBottom: 40,
  },
  iconContainer: {
    marginBottom: 25,
    backgroundColor: `${Colors.primary}10`,
    borderRadius: 40,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bikeIconContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bikeIcon: {
    width: 45,
    height: 45,
    tintColor: Colors.primary,
  },
  title: {
    ...Typography.f_24_inter_bold,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    ...Typography.f_16_inter_regular,
    color: Colors.darkGray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  benefitsContainer: {
    width: '100%',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginRight: 12,
  },
  benefitText: {
    ...Typography.f_14_inter_medium,
    color: Colors.black,
    flex: 1,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  loginButton: {
    borderRadius: 12,
    height: 50,
  },
  registerButton: {
    borderRadius: 12,
    height: 50,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
  },
  continueAsGuest: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  continueAsGuestText: {
    ...Typography.f_14_inter_medium,
    color: Colors.gray,
    textAlign: 'center',
  },
});

export default AuthPrompt; 