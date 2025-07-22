import React, { forwardRef } from 'react';
import { View, Platform } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Colors from '../utilities/constants/colors';

const BottomSheet = forwardRef(({ children, HEIGHT, backgroundColor, ...props }, ref) => {
  // Add extra height for iOS to account for home indicator
  const iosExtraHeight = Platform.OS === 'ios' ? 34 : 0;

  return (
    <RBSheet
      ref={ref}
      closeOnDragDown={true}
      closeOnPressMask={true}
      draggable={true}
      customStyles={{
        wrapper: {
          backgroundColor: 'transparent',
        },
        draggableIcon: {
          width: 35,
          height: 3,
        },
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: backgroundColor || Colors.primary,
          borderWidth: 3,
          borderColor: Colors.light_gray,
        },
      }}
      height={(HEIGHT || 365) + iosExtraHeight}
      {...props}>
      <View style={{
        flex: 1,
        paddingBottom: iosExtraHeight
      }}>
        {children}
      </View>
    </RBSheet>
  );
});

export default BottomSheet;
