import { Dimensions } from 'react-native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
export const heightFlex1 = screenHeight / 10;

const screenResolution = {
  screenHeight,
  screenWidth,
};

export default screenResolution;
