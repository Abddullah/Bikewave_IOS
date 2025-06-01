import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AppStatusBar from '../../components/AppStatusBar';
import Colors from '../../utilities/constants/colors';
import {PrevWhite, BIKES_UNAVAILABLE} from '../../assets/svg';
import {Typography} from '../../utilities/constants/constant.style';
import BikeCard from '../../components/BikeCard';
import AppButton from '../../components/AppButton';
import {useDispatch, useSelector} from 'react-redux';
import {fetchUserBicycles} from '../../redux/features/auth/authThunks';
import Images from '../../assets/images';
import {
  selectAuthLoading,
  selectUserBicycles,
} from '../../redux/features/auth/authSelectors';
import {useTranslation} from 'react-i18next';

export default function FeaturedBikes({navigation}) {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const userBicycles = useSelector(selectUserBicycles);
  const {t} = useTranslation();

  useEffect(() => {
    dispatch(fetchUserBicycles());
  }, [dispatch]);

  const bikes =
    userBicycles?.map(bike => ({
      id: bike._id,
      brand: bike.brand,
      model: bike.model,
      location: `${bike.location?.city}, ${bike.location?.country}`,
      price: bike.price.toString(),
      rating: 4.5,
      image: bike.photo ? {uri: bike.photo} : Images.bicycle,
    })) || [];

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateContent}>
        <View style={styles.emptyStateIconWrapper}>
          <BIKES_UNAVAILABLE />
        </View>
        <Text style={styles.emptyStateTitle}>
          {t('highlight_bikes_to_increase_reservations')}
        </Text>
        <Text style={styles.emptyStateMessage}>{t('no_bikes_msg')}</Text>
        <Text />
        <Text style={styles.emptyStateMessage}>{t('no_bikes_reminder')}</Text>
      </View>
      <AppButton
        title={t('highlight_bicycle')}
        btnColor={Colors.black}
        btnTitleColor={Colors.white}
        onPress={() => navigation.navigate('HighlightBike')}
        style={styles.highlightBtn}
      />
    </View>
  );

  const handleDeleteBike = () => {
    dispatch(fetchUserBicycles());
  };

  return (
    <View style={styles.screenContainer}>
      <AppStatusBar />
      <View
        style={[
          styles.headerContainer,
          {
            borderBottomLeftRadius: bikes.length > 0 ? 25 : 0,
            borderBottomRightRadius: bikes.length > 0 ? 25 : 0,
            paddingBottom: bikes.length > 0 ? 90 : 0,
          },
        ]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Configuration')}>
          <PrevWhite />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>{t('featured_bikes')}</Text>
      </View>
      {bikes.length > 0 ? (
        <View style={styles.flatListContainer}>
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <FlatList
              data={bikes}
              renderItem={({item}) => (
                <BikeCard bike={item} onDelete={handleDeleteBike} />
              )}
              keyExtractor={item => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={styles.bikeGridStyle}
              contentContainerStyle={styles.flatListContent}
            />
          )}
        </View>
      ) : (
        renderEmptyState()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 35,
    paddingHorizontal: 15,
    backgroundColor: Colors.primary,
    paddingTop: 40,
  },
  pageTitle: {
    ...Typography.f_22_inter_semi_bold,
    color: Colors.white,
  },
  flatListContainer: {
    marginTop: -50,
  },
  bikeGridStyle: {
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  flatListContent: {
    paddingBottom: 140,
  },
  emptyStateContainer: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: Colors.primary,
  },
  emptyStateContent: {
    justifyContent: 'center',
    flex: 1,
  },
  emptyStateIconWrapper: {
    alignSelf: 'center',
  },
  emptyStateTitle: {
    ...Typography.f_24_inter_bold,
    color: Colors.white,
    marginVertical: 20,
  },
  emptyStateMessage: {
    ...Typography.f_16_inter_regular,
    color: Colors.white,
    lineHeight: 23,
  },
  highlightBtn: {
    marginBottom: 20,
  },
});
