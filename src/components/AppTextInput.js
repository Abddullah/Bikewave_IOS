import React from 'react';
import {TextInput, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Typography} from '../utilities/constants/constant.style';
import Colors from '../utilities/constants/colors';

const AppTextInput = ({
  value,
  onChangeText,
  placeholder,
  placeholderTextColor = Colors.gray,
  style = {},
  icon,
  iconPress,
  fieldStyle,
  ...props
}) => {
  return (
    <View style={[styles.container, styles.inputWrapper,style]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        style={[styles.inputField,fieldStyle]}
        {...props}
      />
      {icon && (
        <TouchableOpacity onPress={iconPress} activeOpacity={0.8}>
          {icon}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    borderWidth: 0.3,
    minHeight: 43,
    borderColor: Colors.gray,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  inputField: {
    ...Typography.f_16_inter_medium,
    color: Colors.black,
    flex: 1,
  },
});

export default AppTextInput;
