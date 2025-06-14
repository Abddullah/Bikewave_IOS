import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Typography} from '../utilities/constants/constant.style';
import {Activity, Reserve} from '../assets/svg';
import {
  AllGreen,
  RoadGreen,
  CityGreen,
  MountainGreen,
  GravelGreen,
  ElectricalGreen,
  Competition,
  Component,
} from '../assets/svg';
import DropShadow from 'react-native-drop-shadow';
import Colors from '../utilities/constants/colors';
import Images from '../assets/images';
import { useTranslation } from 'react-i18next';

const ReservationCard = ({brand, model, onPress, reserverName, category,city, photo, dateFrom, dateEnd}) => {
  const { t } = useTranslation();

  const getCategoryIcon = (category) => {
    const categoryMap = {
      'all': AllGreen,
      'road': RoadGreen,
      'city': CityGreen,
      'mountain': MountainGreen,
      'gravel': GravelGreen,
      'electrical': ElectricalGreen,
      'competition': Competition,
      'component': Component,
    };
    return categoryMap[category?.toLowerCase()] || AllGreen;
  };

  const CategoryIcon = getCategoryIcon(category);

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
          {city&&
          <Text style={[Typography.f_16_inter_regular, styles.productModel]}>
            {city}
          </Text>
          }
          {category ? (
            <View style={styles.categoryContainer}>
              <View style={styles.iconContainer}>
                <CategoryIcon width={20} height={20} />
              </View>
              <Text
                style={[
                  Typography.f_14_inter_semi_bold,
                  {color: Colors.black},
                ]}>
                {category}
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
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 10,
  },
  iconContainer: {
    width: 20,
    height: 20,
  },
});

export default ReservationCard;
