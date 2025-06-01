import AsyncStorage from '@react-native-async-storage/async-storage';

export const getItem = async (key, defaultValue) => {
  try {
    const value = await AsyncStorage.getItem(`${key}`);

    if (value) {
      return JSON.parse(value);
    } else {
      return defaultValue;
    }
  } catch (error) {
    return null;
  }
};

export const setItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(`${key}`, JSON.stringify(value));
    return true;
  } catch (error) {
    return null;
  }
};

export const deleteItem = async key => {
  try {
    await AsyncStorage.removeItem(`${key}`);
    return true;
  } catch (error) {
    return null;
  }
};
