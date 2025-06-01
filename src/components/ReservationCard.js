import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Typography} from '../utilities/constants/constant.style';
import {Activity, Reserve} from '../assets/svg';
import DropShadow from 'react-native-drop-shadow';
import Colors from '../utilities/constants/colors';
import Images from '../assets/images';
import { useTranslation } from 'react-i18next';

const ReservationCard = ({brand, model, onPress, reserverName, photo, dateFrom, dateEnd}) => {
   const {  t } = useTranslation();
  return (
    <DropShadow style={styles.productCardShadow}>
      <TouchableOpacity
        style={styles.productCard}
        activeOpacity={0.8}
        onPress={onPress}>
        <Image
          source={photo || Images.bicycle}
          resizeMode="cover"
          style={styles.productImage}
        />
        <View style={styles.productDetails}>
          <View style={styles.productInfo}>
            <Text
              style={[Typography.f_18_inter_semi_bold, styles.productBrand]}>
              {brand}
            </Text>
            <Activity />
          </View>
          <Text style={[Typography.f_16_inter_regular, styles.productModel]}>
            {model}
          </Text>
          {reserverName ? (
            <View style={{paddingTop:10}}>
              <Text
                style={[Typography.f_14_inter_medium, {color: Colors.black}]}>
                {t('reserved_by')}
              </Text>
              <Text
                style={[
                  Typography.f_14_inter_semi_bold,
                  {color: Colors.black},
                ]}>
                {reserverName}
              </Text>
            </View>
          ) : (
            <View style={styles.productInfo}>
              <Text style={styles.dateLabel}>{dateFrom || t('date_range.0')}</Text>
              <Reserve />
              <Text style={styles.dateLabel}>{dateEnd || t('date_range.2')}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </DropShadow>
  );
};

const styles = StyleSheet.create({
  productCardShadow: {
    shadowColor: Colors.gray,
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  productCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  productImage: {
    height: 100,
    width: 100,
    borderRadius: 10,
  },
  productDetails: {
    flex: 1,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productBrand: {
    color: Colors.black,
  },
  productModel: {
    color: Colors.black,
  },
  dateLabel: {
    ...Typography.f_12_inter_semi_bold,
    color: Colors.black,
    width: '25%',
    paddingTop: 5,
  },
});

export default ReservationCard;
