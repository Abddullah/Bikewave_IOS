import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from '../utilities/constants/constant.style';
import { Star, Activity, HeartFill } from '../assets/svg';
import Colors from '../utilities/constants/colors';
import Images from '../assets/images';
import { useTranslation } from 'react-i18next';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useDispatch, useSelector } from 'react-redux';
import { selectFavorites } from '../redux/features/main/mainSelectors';
import { getFavorites, updateFavorites } from '../redux/features/main/mainThunks';
import { colors } from '../utilities/constants';
import { RFValue } from 'react-native-responsive-fontsize';
import screenResolution from '../utilities/constants/screenResolution';
import FastImage from 'react-native-fast-image';

const ProductCardDetails = ({
  brand,
  model,
  location,
  price,
  rating,
  onPress,
  photo,
  productId
}) => {
  const { t } = useTranslation(); 
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);
  const [fav, setFav] = useState(false)
  const handleFavoriteToggle = async () => {
    await dispatch(updateFavorites(productId));
    setFav(!fav)
    await dispatch(getFavorites());
  };
  useEffect(() => {
    const isFavorite = favorites.findIndex((e) => e._id == productId)
    if (isFavorite !== -1) setFav(true)
    else { setFav(false) }
  }, [favorites])
  return (
    <View style={styles.productCardShadow}>
      <TouchableOpacity
        style={styles.productCard}
        activeOpacity={0.8}
        onPress={onPress}>
        <FastImage
          style={styles.productImage}
          source={photo}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View style={styles.productDetails}>
          <View style={styles.productInfo}>
            <Text
              style={[Typography.f_18_inter_semi_bold, styles.productBrand]}>
              {brand}
            </Text>
            {price ? (
              <View style={styles.rowContainer}>
                <Star />
                <Text
                  style={[
                    Typography.f_14_inter_medium,
                    styles.productRatingText,
                  ]}>
                  {rating}
                </Text>
                <Activity />
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.heartIconWrapper}
                onPress={handleFavoriteToggle}>
                <AntDesign name={fav ? "heart" : "hearto"} color={colors.primary} size={RFValue(25, screenResolution.screenHeight)} />
              </TouchableOpacity>
              // <HeartFill />
            )}
          </View>
          <Text style={[Typography.f_16_inter_regular, styles.productModel]}>
            {model}
          </Text>
          <Text style={[Typography.f_16_inter_medium, styles.productLocation]}>
            {location}
          </Text>
          <View style={styles.productPriceContainer}>
            {price ? (
              <Text
                style={[Typography.f_18_inter_semi_bold, styles.productPrice]}>
                {`${price}€${t('per_day')}`}
              </Text>
            ) : (
              <Activity />
            )}
            {price ? (
              // <HeartFill />
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.heartIconWrapper}
                onPress={handleFavoriteToggle}>
                <AntDesign name={fav ? "heart" : "hearto"} color={colors.primary} size={RFValue(25, screenResolution.screenHeight)} />
              </TouchableOpacity>
            ) : (
              <View style={styles.rowContainer}>
                <Star />
                <Text
                  style={[
                    Typography.f_14_inter_medium,
                    styles.productRatingText,
                  ]}>
                  {rating}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  productCardShadow: {
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
    borderRadius: 20,
    marginHorizontal: 20
  },
  productCard: {
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
    gap: 3,
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
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  productRatingText: {
    color: Colors.black,
  },
  productModel: {
    color: Colors.black,
  },
  productLocation: {
    color: Colors.black,
  },
  productPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    color: Colors.black,
  },
});

export default ProductCardDetails;
