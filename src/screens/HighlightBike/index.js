import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AppStatusBar from '../../components/AppStatusBar';
import Colors from '../../utilities/constants/colors';
import {PrevWhite} from '../../assets/svg';
import {Typography} from '../../utilities/constants/constant.style';
import DropShadow from 'react-native-drop-shadow';
import ProductCard from '../../components/ProductCard';
import Images from '../../assets/images';
import {DEFAULT_LANGUAGE} from '../../utilities';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {fetchUserBicycles} from '../../redux/features/auth/authThunks';
import {selectAuthLoading, selectUserBicycles} from '../../redux/features/auth/authSelectors';

export default function HighlightBike({navigation}) {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const userBicycles = useSelector(selectUserBicycles);

  useEffect(() => {
    dispatch(fetchUserBicycles());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <AppStatusBar />
      <View style={styles.headerContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}>
          <PrevWhite />
        </TouchableOpacity>
        <Text style={styles.headerText}>{t('choose_bike')}</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>
        <DropShadow style={styles.shadow}>
          <View style={styles.cardContainer}>
            {loading ? (
              <ActivityIndicator color={Colors.primary} style={styles.loader} />
            ) : (
              userBicycles?.map(bike => (
                <ProductCard
                  key={bike._id}
                  productId={bike._id}
                  brand={bike.brand}
                  model={bike.model}
                  location={`${bike.location?.city}, ${bike.location?.country}`}
                  price={bike.price}
                  image={bike.photo ? bike.photo.replace(/\.avif$/, '.jpg') : Images.bicycle}
                  data={bike}
                  onPress={() => navigation.navigate('Promotion', {
                    selectedBike: {
                      id: bike._id,
                      brand: bike.brand,
                      model: bike.model,
                      location: `${bike.location?.city}, ${bike.location?.country}`,
                      price: bike.price,
                      rating: '4.8',
                      photo: bike.photo ? { uri: bike.photo.replace(/\.avif$/, '.jpg') } : Images.bicycle
                    }
                  })}
                />
              ))
            )}
          </View>
        </DropShadow>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingBottom: 90,
  },
  headerText: {
    ...Typography.f_22_inter_semi_bold,
    color: Colors.white,
  },
  scrollView: {
    marginTop: -75,
  },
  shadow: {
    shadowColor: Colors.gray,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    paddingBottom: 40,
  },
  cardContainer: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginHorizontal: 15,
  },
  sectionTitle: {
    ...Typography.f_20_inter_semi_bold,
    color: Colors.black,
    paddingLeft: 15,
    paddingTop: 15,
  },
  loader: {
    marginVertical: 20,
  },
});
