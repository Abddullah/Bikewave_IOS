import React from 'react';
import {StatusBar} from 'react-native';

const AppStatusBar = ({
  barStyle = 'dark-content',
  translucent = true,
  backgroundColor = 'transparent',
}) => {
  return (
    <StatusBar
      barStyle={barStyle}
      translucent={translucent}
      backgroundColor={backgroundColor}
    />
  );
};

export default AppStatusBar;
