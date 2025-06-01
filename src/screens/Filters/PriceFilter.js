import React, {useState, useCallback} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import AppStatusBar from '../../components/AppStatusBar';
import Colors from '../../utilities/constants/colors';
import {CrossBlack} from '../../assets/svg';
import {t} from 'i18next';
import {Typography} from '../../utilities/constants/constant.style';
import AppButton from '../../components/AppButton';
import AppTextInput from '../../components/AppTextInput';
import RangeSlider from 'rn-range-slider';
import {setFilters} from '../../redux/features/main/mainSlice';
import {useDispatch} from 'react-redux';
import {getAllBicycles} from '../../redux/features/main/mainThunks';

export default function PriceFilter({navigation}) {
  const dispatch = useDispatch();
  const [lowValue, setLowValue] = useState(0);
  const [highValue, setHighValue] = useState(3000);

  const Thumb = () => <View style={styles.thumb} />;
  const Rail = () => <View style={styles.rail} />;
  const RailSelected = () => <View style={styles.railSelected} />;

  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);

  const handleValueChange = useCallback((low, high) => {
    setLowValue(low);
    setHighValue(high);
  }, []);

  const handleApplyFilter = () => {
    dispatch(
      setFilters({
        maxPrice: highValue,
        minPrice: lowValue,
      }),
    );
    dispatch(
      getAllBicycles({
        category: '',
      }),
    );
    navigation.navigate('Home');
  };

  return (
    <View style={styles.safeAreaContainer}>
      <AppStatusBar />
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{t('choose_price')}</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Home')}>
          <CrossBlack />
        </TouchableOpacity>
      </View>
      <RangeSlider
        style={styles.slider}
        min={0}
        max={3000}
        step={100}
        renderThumb={renderThumb}
        renderRail={renderRail}
        renderRailSelected={renderRailSelected}
        low={lowValue}
        high={highValue}
        onValueChanged={handleValueChange}
      />
      <View style={styles.inputsContainer}>
        <View style={{width: '40%'}}>
          <AppTextInput
            placeholder={'€0'}
            value={String(lowValue)}
            onChangeText={text => setLowValue(Number(text))}
            keyboardType="numeric"
          />
        </View>
        <Text style={[Typography.f_16_inter_medium, {color: Colors.gray}]}>
          _
        </Text>
        <View style={{width: '40%'}}>
          <AppTextInput
            placeholder={'€3000'}
            value={String(highValue)}
            onChangeText={text => setHighValue(Number(text))}
            keyboardType="numeric"
          />
        </View>
      </View>
      <AppButton
        title={t('apply_filter')}
        btnColor={Colors.primary}
        btnTitleColor={Colors.white}
        style={styles.applyButton}
        onPress={handleApplyFilter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  headerTitle: {
    ...Typography.f_24_inter_bold,
    color: Colors.black,
  },
  slider: {
    marginBottom: 10,
    backgroundColor: Colors.light_gray,
    height: 12,
    justifyContent: 'center',
    borderRadius: 25,
  },
  thumb: {
    height: 25,
    width: 25,
    borderRadius: 50,
    backgroundColor: Colors.primary,
  },
  rail: {
    height: 10,
    borderRadius: 4,
    backgroundColor: Colors.light_gray,
  },
  railSelected: {
    height: 10,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  inputsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  applyButton: {
    marginTop: 35,
  },
});
