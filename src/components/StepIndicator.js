import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TickGreen, CrossRed } from '../assets/svg';
import Colors from '../utilities/constants/colors';
import { Typography } from '../utilities/constants/constant.style';

const StepIndicator = ({ currentStep, steps, failedStepIndex }) => {
  const screenWidth = Dimensions.get('window').width;

  const stepWidth = 27;
  const totalStepWidth = stepWidth * steps.length;
  const availableSpace = screenWidth - totalStepWidth - 23;

  const connectorWidth = availableSpace / (steps.length - 0.3);

  return (
    <View>
      <View style={styles.stepsWrapper}>
        {steps.map((step, index) => (
          <View style={styles.stepItem} key={index}>
            <View style={[styles.stepConnector, {left:index === steps.length - 1 ?  -30: 30}]} />
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
            <Text
              key={index}
              style={[
                styles.stepLabel,
                { left: step === 'Pay' ? 15 : 0 },
                index + 1 !== currentStep && styles.hiddenStepLabel
              ]}>
              {step}
            </Text>
           </View>
        ))}
      </View>
      {/* <View style={[styles.stepsWrapper, {paddingHorizontal: 40,borderWidth: 1}]}>
        {steps.map((step, index) => (
          <Text
            key={index}
            style={[
              styles.stepLabel, 
              {left: step === 'Pay' ? 15 : 0},
              // index + 1 !== currentStep && styles.hiddenStepLabel
            ]}>
            {step}
          </Text>
        ))}
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  stepsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50,
   },
  stepItem: {
    // flexDirection: 'row',
    minWidth: 60,
    height: 40,
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
    position: 'absolute',
    top: 10,
    left: 30,
    width: '100%',
    // marginLeft: 'auto',
    // marginRight: 'auto',
    backgroundColor: Colors.white,
  },
  stepLabel: {
    color: Colors.white,
    ...Typography.f_12_inter_medium,
    top: 5,
    textAlign: 'center',
  },
  hiddenStepLabel: {
    opacity: 0,
  },
});

export default StepIndicator;
