import React, {useEffect} from 'react';
import {StyleSheet, ImageBackground, View,Text} from 'react-native';
import Images from '../../assets/images/index';
import {Logo} from '../../assets/svg/index';
import Colors from '../../utilities/constants/colors';
import {useNavigation} from '@react-navigation/native';

export default function Splash() {
  const navigation = useNavigation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <ImageBackground
      style={[styles.background,{backgroundColor:'red'}]}
      resizeMode="cover"
      source={Images.splashBg2}>
      <View style={styles.overlay}>
        <Logo />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: Colors.white,
  },
});
