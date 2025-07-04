import {StyleSheet, Platform} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import screenResolution from './screenResolution';

// export const Typography = StyleSheet.create({
//   f_12_roboto_medium: {
//     fontFamily: 'Roboto-Medium',
//     fontSize: RFValue(8, screenResolution.screenWidth),
//   },
//   f_12_roboto_regular: {
//     fontFamily: 'Roboto-Regular',
//     fontSize: RFValue(8, screenResolution.screenWidth),
//   },
//   f_12_inter_semi_bold: {
//     fontFamily: 'Inter_18pt-SemiBold',
//     fontSize: RFValue(7, screenResolution.screenWidth),
//   },
//   f_18_roboto_medium: {
//     fontFamily: 'Roboto-Medium',
//     fontSize: RFValue(10, screenResolution.screenWidth),
//   },
//   f_18_inter_light: {
//     fontFamily: 'Inter_18pt-Light',
//     fontSize: RFValue(9, screenResolution.screenWidth),
//   },
//   f_15_inter_light: {
//     fontFamily: 'Inter_18pt-Light',
//     fontSize: RFValue(8, screenResolution.screenWidth),
//   },
//   f_14_roboto_medium: {
//     fontFamily: 'Roboto-Medium',
//     fontSize: RFValue(9, screenResolution.screenWidth),
//   },
//   f_24_inter_bold: {
//     fontFamily: 'Inter_18pt-Bold',
//     fontSize: RFValue(13, screenResolution.screenWidth),
//   },
//   f_28_inter_bold: {
//     fontFamily: 'Inter_18pt-Bold',
//     fontSize: RFValue(15, screenResolution.screenWidth),
//   },
//   f_14_inter_bold: {
//     fontFamily: 'Inter_18pt-Bold',
//     fontSize: RFValue(8, screenResolution.screenWidth),
//   },
//   f_20_inter_bold: {
//     fontFamily: 'Inter_18pt-Bold',
//     fontSize: RFValue(11, screenResolution.screenWidth),
//   },
//   f_38_inter_bold: {
//     fontFamily: 'Inter_18pt-Bold',
//     fontSize: RFValue(18, screenResolution.screenWidth),
//   },
//   f_20_inter_semi_bold: {
//     fontFamily: 'Inter_18pt-SemiBold',
//     fontSize: RFValue(10, screenResolution.screenWidth),
//   },
//   f_24_inter_semi_bold: {
//     fontFamily: 'Inter_18pt-SemiBold',
//     fontSize: RFValue(12, screenResolution.screenWidth),
//   },
//   f_22_inter_semi_bold: {
//     fontFamily: 'Inter_18pt-SemiBold',
//     fontSize: RFValue(11, screenResolution.screenWidth),
//   },
//   f_18_inter_semi_bold: {
//     fontFamily: 'Inter_18pt-SemiBold',
//     fontSize: RFValue(9, screenResolution.screenWidth),
//   },
//   f_16_inter_semi_bold: {
//     fontFamily: 'Inter_18pt-SemiBold',
//     fontSize: RFValue(8, screenResolution.screenWidth),
//   },
//   f_14_inter_semi_bold: {
//     fontFamily: 'Inter_18pt-SemiBold',
//     fontSize: RFValue(7, screenResolution.screenWidth),
//   },
//   f_14_inter_medium: {
//     fontFamily: 'Inter_18pt-Medium',
//     fontSize: RFValue(7, screenResolution.screenWidth),
//   },
//   f_16_inter_bold: {
//     fontFamily: 'Inter_18pt-Bold',
//     fontSize: RFValue(9, screenResolution.screenWidth),
//   },
//   f_16_inter_regular: {
//     fontFamily: 'Inter_18pt-Regular',
//     fontSize: RFValue(8, screenResolution.screenWidth),
//   },
//   f_18_inter_regular: {
//     fontFamily: 'Inter_18pt-Regular',
//     fontSize: RFValue(9, screenResolution.screenWidth),
//   },
//   f_12_inter_regular: {
//     fontFamily: 'Inter_18pt-Regular',
//     fontSize: RFValue(7, screenResolution.screenWidth),
//   },
//   f_16_inter_extra_bold_italic: {
//     fontFamily: 'Inter_18pt-ExtraBoldItalic',
//     fontSize: RFValue(8, screenResolution.screenWidth),
//   },
//   f_16_inter_medium: {
//     fontFamily: 'Inter_18pt-Medium',
//     fontSize: RFValue(8, screenResolution.screenWidth),
//   },
//   f_18_inter_medium: {
//     fontFamily: 'Inter_18pt-Medium',
//     fontSize: RFValue(9, screenResolution.screenWidth),
//   },
//   f_12_inter_medium: {
//     fontFamily: 'Inter_18pt-Medium',
//     fontSize: RFValue(6, screenResolution.screenWidth),
//   },
// });


export const Typography = StyleSheet.create({
  f_12_roboto_medium: {
    fontFamily: Platform.OS === 'ios' ? null : 'Roboto-Medium',
    fontWeight: Platform.OS === 'ios' ? '500' : null,
    fontSize: RFValue(12, screenResolution.screenHeight),
  },
  f_12_roboto_regular: {
    fontFamily: Platform.OS === 'ios' ? null : 'Roboto-Regular',
    fontWeight: Platform.OS === 'ios' ? '400' : null,
    fontSize: RFValue(12, screenResolution.screenHeight),
  },
  f_12_inter_semi_bold: {
    fontFamily: Platform.OS === 'ios' ? null : 'Inter_18pt-SemiBold',
    fontWeight: Platform.OS === 'ios' ? '600' : null,
    fontSize: RFValue(12, screenResolution.screenHeight),
  },
  f_18_roboto_medium: {
    fontFamily: Platform.OS === 'ios' ? null : 'Roboto-Medium',
    fontWeight: Platform.OS === 'ios' ? '500' : null,
    fontSize: RFValue(18, screenResolution.screenHeight),
  },
  f_18_inter_light: {
    fontFamily: Platform.OS === 'ios' ? null : 'Inter_18pt-Light',
    fontWeight: Platform.OS === 'ios' ? '300' : null,
    fontSize: RFValue(18, screenResolution.screenHeight),
  },
  f_15_inter_light: {
    fontFamily: Platform.OS === 'ios' ? null : 'Inter_18pt-Light',
    fontWeight: Platform.OS === 'ios' ? '300' : null,
    fontSize: RFValue(15, screenResolution.screenHeight),
  },
  f_14_roboto_medium: {
    fontFamily: Platform.OS === 'ios' ? null : 'Roboto-Medium',
    fontWeight: Platform.OS === 'ios' ? '500' : null,
    fontSize: RFValue(14, screenResolution.screenHeight),
  },
  f_24_inter_bold: {
    fontFamily: Platform.OS === 'ios' ? null : 'Inter_18pt-Bold',
    fontWeight: Platform.OS === 'ios' ? '700' : null,
    fontSize: RFValue(24, screenResolution.screenHeight),
  },
  f_28_inter_bold: {
    fontFamily: Platform.OS === 'ios' ? null : 'Inter_18pt-Bold',
    fontWeight: Platform.OS === 'ios' ? '700' : null,
    fontSize: RFValue(28, screenResolution.screenHeight),
  },
  f_14_inter_bold: {
    fontFamily: Platform.OS === 'ios' ? null : 'Inter_18pt-Bold',
    fontWeight: Platform.OS === 'ios' ? '700' : null,
    fontSize: RFValue(14, screenResolution.screenHeight),
  },
  f_20_inter_bold: {
    fontFamily: Platform.OS === 'ios' ? null : 'Inter_18pt-Bold',
    fontWeight: Platform.OS === 'ios' ? '700' : null,
    fontSize: RFValue(20, screenResolution.screenHeight),
  },
  f_38_inter_bold: {
    fontFamily: Platform.OS === 'ios' ? null : 'Inter_18pt-Bold',
    fontWeight: Platform.OS === 'ios' ? '700' : null,
    fontSize: RFValue(38, screenResolution.screenHeight),
  },
  f_20_inter_semi_bold: {
    fontFamily: Platform.OS === 'ios' ? null : 'Inter_18pt-SemiBold',
    fontWeight: Platform.OS === 'ios' ? '600' : null,
    fontSize: RFValue(20, screenResolution.screenHeight),
  },
  f_24_inter_semi_bold: {
    fontFamily: Platform.OS === 'ios' ? null : 'Inter_18pt-SemiBold',
    fontWeight: Platform.OS === 'ios' ? '600' : null,
    fontSize: RFValue(24, screenResolution.screenHeight),
  },
  f_22_inter_semi_bold: {
    fontFamily: Platform.OS === 'ios' ? null : 'Inter_18pt-SemiBold',
    fontWeight: Platform.OS === 'ios' ? '600' : null,
    fontSize: RFValue(22, screenResolution.screenHeight),
  },
  f_18_inter_semi_bold: {
    fontFamily: Platform.OS === 'ios' ? null : 'Inter_18pt-SemiBold',
    fontWeight: Platform.OS === 'ios' ? '600' : null,
    fontSize: RFValue(18, screenResolution.screenHeight),
  },
  f_18_inter_bold: {
    fontFamily: Platform.OS === 'ios' ? null : 'Inter_18pt-Bold',
    fontWeight: Platform.OS === 'ios' ? '700' : null,
    fontSize: RFValue(18, screenResolution.screenHeight),
  },
  f_16_inter_semi_bold: {
    fontFamily: Platform.OS === 'ios' ? null : 'Inter_18pt-SemiBold',
    fontWeight: Platform.OS === 'ios' ? '600' : null,
    fontSize: RFValue(16, screenResolution.screenHeight),
  },
  f_14_inter_semi_bold: {
    fontFamily: Platform.OS === 'ios' ? null : 'Inter_18pt-SemiBold',
    fontWeight: Platform.OS === 'ios' ? '600' : null,
    fontSize: RFValue(14, screenResolution.screenHeight),
  },
  f_14_inter_medium: {
    fontFamily: Platform.OS === 'ios' ? null : 'Inter_18pt-Medium',
    fontWeight: Platform.OS === 'ios' ? '500' : null,
    fontSize: RFValue(14, screenResolution.screenHeight),
  },
  f_14_extra_bold: {
    fontFamily: Platform.OS === 'ios' ? null : 'Inter_18pt-ExtraBold',
    fontWeight: Platform.OS === 'ios' ? '800' : null,
    fontSize: RFValue(14, screenResolution.screenHeight),
  },
  f_13_inter_medium: {
    fontFamily: Platform.OS === 'ios' ? null : 'Inter_18pt-Medium',
    fontWeight: Platform.OS === 'ios' ? '500' : null,
    fontSize: RFValue(13, screenResolution.screenHeight),
  },
  f_16_inter_bold: {
    fontFamily: Platform.OS === 'ios' ? null : 'Inter_18pt-Bold',
    fontWeight: Platform.OS === 'ios' ? '700' : null,
    fontSize: RFValue(16, screenResolution.screenHeight),
  },
  f_16_inter_regular: {
    fontFamily: Platform.OS === 'ios' ? null : 'Inter_18pt-Regular',
    fontWeight: Platform.OS === 'ios' ? '400' : null,
    fontSize: RFValue(16, screenResolution.screenHeight),
  },
  f_18_inter_regular: {
    fontFamily: Platform.OS === 'ios' ? null : 'Inter_18pt-Regular',
    fontWeight: Platform.OS === 'ios' ? '400' : null,
    fontSize: RFValue(18, screenResolution.screenHeight),
  },
  f_12_inter_regular: {
    fontFamily: Platform.OS === 'ios' ? null : 'Inter_18pt-Regular',
    fontWeight: Platform.OS === 'ios' ? '400' : null,
    fontSize: RFValue(12, screenResolution.screenHeight),
  },
  f_16_inter_extra_bold_italic: {
    fontFamily: Platform.OS === 'ios' ? null : 'Inter_18pt-ExtraBoldItalic',
    fontWeight: Platform.OS === 'ios' ? '800' : null,
    fontStyle: Platform.OS === 'ios' ? 'italic' : null,
    fontSize: RFValue(16, screenResolution.screenHeight),
  },
  f_16_inter_medium: {
    fontFamily: Platform.OS === 'ios' ? null : 'Inter_18pt-Medium',
    fontWeight: Platform.OS === 'ios' ? '500' : null,
    fontSize: RFValue(16, screenResolution.screenHeight),
  },
  f_18_inter_medium: {
    fontFamily: Platform.OS === 'ios' ? null : 'Inter_18pt-Medium',
    fontWeight: Platform.OS === 'ios' ? '500' : null,
    fontSize: RFValue(18, screenResolution.screenHeight),
  },
  f_12_inter_medium: {
    fontFamily: Platform.OS === 'ios' ? null : 'Inter_18pt-Medium',
    fontWeight: Platform.OS === 'ios' ? '500' : null,
    fontSize: RFValue(12, screenResolution.screenHeight),
  },
});