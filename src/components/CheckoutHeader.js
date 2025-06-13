import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {PrevWhite} from '../assets/svg';
import Colors from '../utilities/constants/colors';
import {Typography} from '../utilities/constants/constant.style';
import DropShadow from 'react-native-drop-shadow';
import StepIndicator from './StepIndicator';

export const CheckoutHeader = ({currentStep, steps, title, children}) => {
  const navigation = useNavigation();

  return (
    <View>
      <View style={styles.container}>
        <StepIndicator currentStep={currentStep} steps={steps} />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
          style={styles.headerWrapper}>
          <PrevWhite />
          <Text style={styles.headerTitle}>{title}</Text>
          <View/>
        </TouchableOpacity>
      </View>
      <DropShadow style={styles.childrenCard}>{children}</DropShadow>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingVertical: 50,
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 25,
    paddingHorizontal: 25,
    marginTop: 20,
    justifyContent: 'space-between',
  },
  headerTitle: {
    ...Typography.f_18_inter_semi_bold,
    color: Colors.white,
  },
  childrenCard: {
    shadowColor: Colors.gray,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    top: -35,
  },
});
