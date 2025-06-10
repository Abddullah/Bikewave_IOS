import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../utilities/constants/colors';
import AppButton from '../../components/AppButton';
import ProductCard from '../../components/ProductCard';
import AppStatusBar from '../../components/AppStatusBar';
import { Empty } from '../../assets/svg';
import { Typography } from '../../utilities/constants/constant.style';

import { useTranslation } from 'react-i18next';
import { getFavorites } from '../../redux/features/main/mainThunks';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectMainLoading,
  selectFavorites,
} from '../../redux/features/main/mainSelectors';

export default function Favorites({ navigation }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);
  const loading = useSelector(selectMainLoading);
  const [loader, setLoader] = useState(false)
  useEffect(() => {
    const recieveData = async () => {
      await setLoader(true)
      await dispatch(getFavorites());
      await setLoader(false)
    }
    recieveData()
  }, [dispatch]);

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateContent}>
        <View style={styles.emptyStateIconWrapper}>
          <Empty />
        </View>
        <Text style={styles.emptyStateTitle}>{t('no_favorites_title')}</Text>
        <Text style={styles.emptyStateMessage}>
          {t('no_favorites_message')}
        </Text>
      </View>
      <AppButton
        title={t('back_to_home')}
        btnColor={Colors.black}
        btnTitleColor={Colors.white}
        onPress={() => navigation.navigate('Home')}
        style={styles.backToHomeButton}
      />
    </View>
  );

  const renderItem = ({ item, index }) => {
    const imageUrl = item.photo ? item.photo.replace(/\.avif$/, '.jpg') : item.photo;

    return (
      <ProductCard
        productId={item._id}
        key={item._id}
        brand={item.brand}
        model={item.model}
        location={item?.location?.city}
        price={item.price}
        image={imageUrl}
        style={{ marginBottom: index === favorites.length - 1 ? 120 : 20 }}
      />
    );
  };

  const renderFavoritesList = () => (
    <View style={styles.favoritesListContainer}>
      <View style={styles.favoritesListTitleContainer}>
        <Text style={styles.favoritesListTitle}>{t('favorites_list_title')}</Text>
      </View>
      {loader ? (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          style={styles.flatListContent}

        />
      )}
    </View>
  );

  return (
    <View style={styles.safeAreaBackground}>
      <AppStatusBar />
      {favorites.length > 0 ? renderFavoritesList() : renderEmptyState()}
    </View>
  );
}

const styles = StyleSheet.create({
  safeAreaBackground: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  emptyStateContainer: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContent: {
    alignItems: 'center',
  },
  emptyStateIconWrapper: {
    marginBottom: 20,
  },
  emptyStateTitle: {
    ...Typography.f_24_inter_bold,
    color: Colors.white,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateMessage: {
    ...Typography.f_16_inter_regular,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 20,
  },
  backToHomeButton: {
    marginTop: 20,
  },
  favoritesListContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  favoritesListTitleContainer: {
    position: "absolute",
    zIndex: -1,
    top: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },
  favoritesListTitle: {
    ...Typography.f_20_inter_semi_bold,
    color: Colors.white,
    backgroundColor: Colors.primary,
    textAlign: 'center',
    paddingVertical: 20,
    paddingBottom: 100,
    width: "100%",
    paddingHorizontal: '15%',
  },
  loader: {
    marginTop: 50,
  },
  flatListContent: {
    marginTop: 70,
  },
});