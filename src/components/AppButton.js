import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import {Typography} from '../utilities/constants/constant.style';

const AppButton = ({title, onPress, style, btnColor, btnTitleColor, icon, disabled}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button, 
        {backgroundColor: btnColor}, 
        style,
        disabled && styles.disabledButton
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}>
      <View style={icon ? styles.iconButton : null}>
        <Text style={[Typography.f_16_inter_bold, {color: btnTitleColor}]}>
          {title}
        </Text>
        {icon && <View>{icon}</View>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal:20  
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default AppButton;
