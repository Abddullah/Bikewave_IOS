import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Location, FavouriteActive, Star, HeartFill } from '../assets/svg';
import Colors from '../utilities/constants/colors';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Typography } from '../utilities/constants/constant.style';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { getFavorites, updateFavorites } from '../redux/features/main/mainThunks';
import { useDispatch, useSelector } from 'react-redux';
import { selectFavorites } from '../redux/features/main/mainSelectors';
import { RFValue } from 'react-native-responsive-fontsize';
import screenResolution from '../utilities/constants/screenResolution';
import { colors } from '../utilities/constants';

const ProductCard = ({
  productId,
  brand,
  model,
  location,
  data,
  price,
  image,
  style,
  onPress,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
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
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.cardShadow, style]}
      onPress={onPress ? onPress : () => {
         productId && navigation.navigate('Product', { productId, ownerId: data.ownerId})
       }}>
      <View>
        <FastImage
          style={styles.cardImage}
          source={{ uri: image, priority: FastImage.priority.high }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={styles.cardDetails}>
          <View style={styles.rowSpaceBetween}>
            <View style={styles.rowAligned}>
              {/* <Text style={[Typography.f_18_inter_semi_bold, styles.text]}>
                {t(`Brand`)}
              </Text> */}
              <Text style={[Typography.f_16_inter_regular, styles.text]}>
                {brand}
              </Text>
            </View>
            <Text
              style={[
                Typography.f_18_inter_semi_bold,
                styles.text,
              ]}>{`${price}€${t('per_day')}`}</Text>
          </View>
          <View style={styles.rowSpaceBetween}>
            <Text style={[Typography.f_16_inter_medium, styles.text]}>
              {model}
            </Text>
            <View style={styles.rowAligned}>
              <Location />
              <Text style={[Typography.f_16_inter_medium, styles.text]}>
                {location}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              marginTop: 5,
            }}>
            <Star />
            <Text
              style={{ ...Typography.f_14_inter_medium, color: Colors.black }}>
              4.8
            </Text>
          </View>
        </View>
      </View>
      {productId &&
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.heartIconWrapper}
          onPress={handleFavoriteToggle}>
          <AntDesign name={fav ? "heart" : "hearto"} color={colors.primary} size={RFValue(25, screenResolution.screenHeight)} />
        </TouchableOpacity>
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 25,
  },
  cardImage: {
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    aspectRatio: 1,
    height: undefined,
  },
  cardDetails: {
    padding: 10,
    paddingBottom: 15,
    gap: 3,
  },
  text: {
    color: Colors.black,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowAligned: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  heartIconWrapper: {
    position: 'absolute',
    padding: 10,
    right: 0,
  },
});

export default ProductCard;
