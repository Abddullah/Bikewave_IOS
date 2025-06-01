import Toast from 'react-native-toast-message';

export const allLetter = (data) => {
    let letters = /^[a-zA-Z\s]*$/;  
    if (letters.test(data)) {
        return true;
    } else {
        Toast.show({ type: 'error', text1: 'You can type only alphabet characters.', position: 'bottom' })
        return false;
    }
};
