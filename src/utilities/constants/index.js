import DeviceInfo from 'react-native-device-info';
import { Platform, StatusBar } from 'react-native';
export const DEFAULT_LANGUAGE = 'sp';
export { default as colors } from './colors';
export const paginationLimit = 10;
export const version = DeviceInfo.getVersion();
export const systemVersion = DeviceInfo.getSystemVersion();
export const platform = Platform.OS;
export const deviceUId = DeviceInfo.getUniqueId();
export const deviceType = DeviceInfo.getDeviceType();
export const hasNotch = DeviceInfo.hasNotch();
export const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : StatusBar.currentHeight;
