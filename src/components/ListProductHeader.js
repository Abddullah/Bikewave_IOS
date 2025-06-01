import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PrevWhite } from '../assets/svg';
import Colors from '../utilities/constants/colors';
import { Typography } from '../utilities/constants/constant.style';
import DropShadow from 'react-native-drop-shadow';
import StepIndicator from './StepIndicator';

export const ListProductHeader = ({ currentStep, onBack, steps, desc, title, titleStyle }) => {
  const navigation = useNavigation();

  return (
    <View>
      <View style={styles.container}>
        <StepIndicator currentStep={currentStep} steps={steps} />
        <TouchableOpacity
          onPress={() => {
            if (currentStep == 1) {
              navigation.goBack()
            } else {
              onBack()
            }
          }}
          activeOpacity={0.8}
          style={styles.headerWrapper}
        >
          <PrevWhite />
          <Text style={[styles.headerTitle, titleStyle]}>{title}</Text>
        </TouchableOpacity>
      </View>
      <DropShadow style={styles.descriptionCard}>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            {desc}
          </Text>
        </View>
      </DropShadow>
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
    gap: 10,
    marginTop: 20,
    paddingHorizontal: 25,
  },
  headerTitle: {
    ...Typography.f_18_inter_semi_bold,
    color: Colors.white,
  },
  descriptionCard: {
    shadowColor: Colors.gray,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    top: -30,
    marginHorizontal: 15,
  },
  descriptionContainer: {
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 20,
  },
  descriptionText: {
    ...Typography.f_16_inter_regular,
    color: Colors.black,
  },
});
