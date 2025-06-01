import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {TickGreen, CrossRed} from '../assets/svg'; 
import Colors from '../utilities/constants/colors';
import {Typography} from '../utilities/constants/constant.style';

const StepIndicator = ({currentStep, steps, failedStepIndex}) => {
  const screenWidth = Dimensions.get('window').width;

  const stepWidth = 27;
  const totalStepWidth = stepWidth * steps.length;
  const availableSpace = screenWidth - totalStepWidth - 23;

  const connectorWidth = availableSpace / (steps.length - 0.3);

  return (
    <View>
      <View style={styles.stepsWrapper}>
        {steps.map((_, index) => (
          <View style={styles.stepItem} key={index}>
            <View style={styles.outerStepCircle}>
              {index + 1 === failedStepIndex ? (
                <CrossRed /> 
              ) : index + 1 < currentStep ? (
                <TickGreen />
              ) : (
                <View
                  style={[
                    styles.innerStepCircle,
                    currentStep === index + 1 && styles.activeStep,
                  ]}
                />
              )}
            </View>
            {index < steps.length - 1 && (
              <View style={[styles.stepConnector, {width: connectorWidth}]} />
            )}
          </View>
        ))}
      </View>
      <View style={[styles.stepsWrapper, {paddingHorizontal: 40}]}>
        {steps.map((step, index) => (
          <Text
            key={index}
            style={[
              styles.stepLabel, 
              {left: step === 'Pay' ? 15 : 0},
              index + 1 !== currentStep && styles.hiddenStepLabel
            ]}>
            {step}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stepsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 50,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  outerStepCircle: {
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerStepCircle: {
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: Colors.white,
  },
  activeStep: {
    width: 17,
    height: 17,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  stepConnector: {
    height: 1,
    backgroundColor: Colors.white,
  },
  stepLabel: {
    color: Colors.white,
    ...Typography.f_12_inter_medium,
    top: 5,
  },
  hiddenStepLabel: {
    opacity: 0,
  },
});

export default StepIndicator;
