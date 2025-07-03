import React, {forwardRef} from 'react';
import {View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Colors from '../utilities/constants/colors';

const BottomSheet = forwardRef(({children, HEIGHT,backgroundColor,...props}, ref) => {
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
          backgroundColor: Colors.white,
          width: 35,
          height: 3,
        },
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor:backgroundColor|| Colors.primary,
          borderWidth:1,
          borderColor:Colors.white,
        },
      }}
      height={HEIGHT || 365}
      {...props}>
      <View style={{flex: 1}}>{children}</View>
    </RBSheet>
  );
});

export default BottomSheet;
