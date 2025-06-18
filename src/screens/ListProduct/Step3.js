import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
// import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import AppButton from '../../components/AppButton';
import {ListProductHeader} from '../../components/ListProductHeader';
import Colors from '../../utilities/constants/colors';
import AppStatusBar from '../../components/AppStatusBar';

import {Typography} from '../../utilities/constants/constant.style';
import {useTranslation} from 'react-i18next';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {DEFAULT_LANGUAGE} from '../../utilities';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { EnvConfig } from '../../config/envConfig';

export const Step3 = ({formData, updateFormData, onNext, onBack}) => {
  const {t} = useTranslation();
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [marker, setMarker] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(''); // State for validation error

  const steps = [
    t('steps.model'),
    t('steps.category'),
    t('steps.direction'),
    t('steps.photo'),
    t('steps.price'),
    t('steps.preview'),
  ];

  const placesRef = useRef(null);

  useEffect(() => {
    if (formData.location) {
      const location = JSON.parse(formData.location);
      if (placesRef.current) placesRef.current.setAddressText(location.address);
      setInputValue(location.address);
      updateMapAndMarker(location.lat, location.long);
      setError(''); // Clear any existing error when location is pre-filled
    }
  }, [formData.location]);

  const validateForm = () => {
    if (!formData.location) {
      setError(t('validation.direction_required'));
      setTimeout(() => {
        setError(t(''));
      }, 3000);
      return false;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const onPlaceSelected = (data, details = null) => {
    if (!details) {
      console.error('Place details are undefined');
      return;
    }

    const location = {
      address: details.formatted_address || '',
      city:
        details.address_components.find(component =>
          component.types.includes('locality'),
        )?.long_name || '',
      country:
        details.address_components.find(component =>
          component.types.includes('country'),
        )?.long_name || '',
      street:
        details.address_components.find(component =>
          component.types.includes('route'),
        )?.long_name || '',
      streetNumber:
        details.address_components.find(component =>
          component.types.includes('street_number'),
        )?.long_name || '',
      lat: details.geometry?.location?.lat || 0,
      long: details.geometry?.location?.lng || 0,
    };

    updateMapAndMarker(location.lat, location.long);
    updateFormDataWithLocation(location);
    setInputValue(details.formatted_address);
    setError(''); // Clear error when location is selected
  };

  const handleMapPress = async event => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    clearInput();
    try {
      const response = await axios.get(
        `${EnvConfig.googleMaps.geocodeUrl}?latlng=${latitude},${longitude}&key=${EnvConfig.googleMaps.apiKey}`,
      );

      const addressComponents =
        response.data.results[0]?.address_components || [];
      const formattedAddress =
        response.data.results[0]?.formatted_address || '';

      const location = {
        address: formattedAddress,
        city:
          addressComponents.find(component =>
            component.types.includes('locality'),
          )?.long_name || '',
        country:
          addressComponents.find(component =>
            component.types.includes('country'),
          )?.long_name || '',
        street:
          addressComponents.find(component => component.types.includes('route'))
            ?.long_name || '',
        streetNumber:
          addressComponents.find(component =>
            component.types.includes('street_number'),
          )?.long_name || '',
        lat: latitude,
        long: longitude,
      };

      updateMapAndMarker(latitude, longitude);
      updateFormDataWithLocation(location);
      setInputValue(formattedAddress);
      setError(''); // Clear error when location is selected via map
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    }
  };

  const updateMapAndMarker = (lat, long) => {
    setMapRegion({
      latitude: lat,
      longitude: long,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setMarker({
      latitude: lat,
      longitude: long,
    });
  };

  const updateFormDataWithLocation = location => {
    updateFormData('location', JSON.stringify(location));
  };

  const clearInput = () => {
    setInputValue('');
    placesRef.current?.setAddressText('');
    updateFormData('location', '');
    setMarker(null);
    setError(''); // Clear error when input is cleared
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.screenContainer}>
        <AppStatusBar />
        <ListProductHeader
          title={``}
          currentStep={3}
          steps={steps}
          onBack={onBack}
          desc={`${t('address_description')}`}
        />
        <ScrollView 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contentWrapper}>
            <View>
              <Text style={styles.inputLabel}>
                {t('direction')} <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <View style={styles.autocompleteContainer}>
                <GooglePlacesAutocomplete
                  ref={placesRef}
                  placeholder={t('direction_placeholder')}
                  query={{
                    key: 'AIzaSyAN1-XDuQSu2O6V4nwbQP7M-U3xWO1ENDM',
                    language: [DEFAULT_LANGUAGE],
                  }}
                  fetchDetails={true}
                  minLength={2}
                  onPress={onPlaceSelected}
                  enablePoweredByContainer={false}
                  textInputProps={{
                    value: inputValue,
                    onChangeText: setInputValue,
                  }}
                  keyboardShouldPersistTaps="handled"
                  listViewDisplayed="auto"
                  returnKeyType="search"
                  styles={{
                    textInput: {
                      ...Typography.f_16_inter_medium,
                      color: Colors.black,
                      paddingHorizontal: 14,
                      borderWidth: 0.3,
                      borderColor: Colors.gray,
                      borderRadius: 8,
                      backgroundColor: Colors.white,
                    },
                    listView: {
                      backgroundColor: Colors.white,
                      borderWidth: 0.3,
                      borderColor: Colors.gray,
                      borderRadius: 8,
                      zIndex: 1000,
                    },
                    row: {
                      padding: 13,
                      height: 44,
                      flexDirection: 'row',
                    },
                    separator: {
                      height: 0.5,
                      backgroundColor: Colors.gray,
                    },
                  }}
                />
                {inputValue ? (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={clearInput}>
                    <Icon name="close" size={20} color={Colors.gray} />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
            <View
              style={[
                styles.map,
                {
                  borderWidth: error.length > 0 ? 2 : 0,
                  overflow: 'hidden',
                  borderColor: Colors.error,
                },
              ]}>
              {/* <MapView
                style={{height: '100%', width: '100%'}}
                // provider={PROVIDER_GOOGLE}
                region={mapRegion}
                onPress={handleMapPress}>
                {marker && (
                  <Marker
                    coordinate={{
                      latitude: marker.latitude,
                      longitude: marker.longitude,
                    }}
                    title="Selected Location"
                  />
                )}
              </MapView> */}
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
          <AppButton
            title={t('following')}
            btnColor={Colors.primary}
            btnTitleColor={Colors.white}
            style={styles.nextButton}
            onPress={handleNext} // Changed from onNext to handleNext
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentWrapper: {
    paddingHorizontal: 20,
  },
  inputLabel: {
    ...Typography.f_18_inter_semi_bold,
    color: Colors.black,
  },
  requiredAsterisk: {
    color: Colors.error,
  },
  autocompleteContainer: {
    position: 'relative',
    marginTop: 10,
    zIndex: 1000,
  },
  map: {
    height: 290,
    width: '100%',
    borderRadius: 15,
    marginTop: 20,
  },
  nextButton: {
    margin: 20,
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    backgroundColor: 'white',
    top: 10,
    zIndex: 1001,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 5,
  },
});

export default Step3;
