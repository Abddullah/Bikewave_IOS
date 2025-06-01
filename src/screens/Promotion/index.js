import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import AppStatusBar from '../../components/AppStatusBar';
import Colors from '../../utilities/constants/colors';
import {PrevWhite, Reserve} from '../../assets/svg';
import {Typography} from '../../utilities/constants/constant.style';
import ProductCardDetails from '../../components/ProductCardDetails';
import AppButton from '../../components/AppButton';
import DropShadow from 'react-native-drop-shadow';
import { useTranslation } from 'react-i18next';
import Images from '../../assets/images';

const Promotion = ({navigation, route}) => {
  const {  t } = useTranslation();
  const [subsDays, setSubsDays] = useState(4);
  const { selectedBike } = route.params || {};

  const subscriptionOptions = [4, 7];

  const renderSubscriptionButtons = () =>
    subscriptionOptions.map((days, index) => (
      <AppButton
        key={index}
        title={`${days} ${t('days')}`}
        btnColor={subsDays === days ? Colors.black : Colors.platinum}
        btnTitleColor={subsDays === days ? Colors.white : Colors.black}
        style={[
          styles.subscriptionButton,
          {
            marginRight: days === 4 ? (subsDays === days ? -25 : 0) : 0,
            marginLeft: days === 7 ? (subsDays === days ? -25 : 0) : 0,
            zIndex: subsDays === days ? 1 : 0,
          },
        ]}
        onPress={() => setSubsDays(days)}
      />
    ));

  const handleStartPromotion = () => {
    Alert.alert(
      t('start_promotion'),
      `${t('bike_highlight_label')} ${subsDays} ${t('days')}`,
      [
        {
          text: t('confirm'),
          onPress: () => navigation.navigate('Tabs'),
        },
        {
          text: t('decline'),
          style: 'cancel',
        },
      ]
    );
  };
  console.log(selectedBike,'selectedBike');
  return (
    <View style={styles.container}>
      <AppStatusBar />
      <View style={styles.headerContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}>
          <PrevWhite />
        </TouchableOpacity>
        <Text style={styles.headerText}>{t('choose_promo')}</Text>
      </View>
      <View style={styles.productDetailsContainer}>
        <ProductCardDetails
          brand={selectedBike?.brand || 'Brand'}
          model={selectedBike?.model || 'Explorer X1'}
          location={selectedBike?.location || 'Madrid'}
          price={selectedBike?.price}
          rating={selectedBike?.rating || '4.8'}
          photo={selectedBike?.photo || Images.bicycle}
          productId={selectedBike?.id}
          onPress={() => {}}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.subscriptionContainer}>
          {renderSubscriptionButtons()}
        </View>
        <View style={styles.shadowContainer}>
          <DropShadow style={styles.dropShadowStyle}>
            <TouchableOpacity
              onPress={() => setSubsDays(4)}
              activeOpacity={0.8}
              style={[
                styles.promotionCard,
                {borderWidth: subsDays === 4 ? 2 : 0},
              ]}>
              <Text style={styles.cardLabel}>{t('bike_highlight_label')}</Text>
              <View style={styles.cardDateRow}>
                <Text style={styles.cardDateText}>{t('date_range.0')}</Text>
                <Reserve />
                <Text style={styles.cardDateText}>{t('date_range.1')}</Text>
              </View>
              <Text style={styles.cardDescription}>
                {t('weekend_customer_label')}
              </Text>
              <Text style={styles.cardPrice}>4€</Text>
            </TouchableOpacity>
          </DropShadow>
          <DropShadow style={styles.dropShadowStyle}>
            <TouchableOpacity
              onPress={() => setSubsDays(7)}
              activeOpacity={0.8}
              style={[
                styles.promotionCard,
                {borderWidth: subsDays === 7 ? 2 : 0},
              ]}>
              <Text style={styles.cardLabel}>{t('bike_highlight_label')}</Text>
              <View style={styles.cardDateRow}>
                <Text style={styles.cardDateText}>{t('date_range.0')}</Text>
                <Reserve />
                <Text style={styles.cardDateText}>{t('date_range.2')}</Text>
              </View>
              <Text style={styles.cardDescription}>
                {t('weekly_visibility_label')}
              </Text>
              <View style={styles.cardButtonRow}>
                <AppButton
                  title={`${t('limited_promotion')}`}
                  btnColor={Colors.primary}
                  btnTitleColor={Colors.white}
                  style={styles.limitedPromotionButton}
                />
                <Text style={styles.cardPrice}>6€</Text>
              </View>
            </TouchableOpacity>
          </DropShadow>
        </View>
        <AppButton
          title={`${t('start_promotion')}`}
          btnColor={Colors.primary}
          btnTitleColor={Colors.white}
          style={styles.startPromoBTn}
          onPress={handleStartPromotion}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 35,
    paddingHorizontal: 20,
    backgroundColor: Colors.primary,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 25,
    paddingBottom: 90,
  },
  headerText: {
    ...Typography.f_22_inter_semi_bold,
    color: Colors.white,
  },
  productDetailsContainer: {
    marginTop: -70,
  },
  subscriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  subscriptionButton: {
    paddingVertical: 5,
    width: '35%',
  },
  shadowContainer: {
    gap: 15,
  },
  dropShadowStyle: {
    shadowColor: Colors.gray,
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  promotionCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 15,
    marginHorizontal: 20,
    borderColor: Colors.black,
    gap: 20,
  },
  cardLabel: {
    ...Typography.f_16_inter_semi_bold,
    color: Colors.black,
  },
  cardDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  cardDateText: {
    ...Typography.f_16_inter_semi_bold,
    color: Colors.black,
    width: '25%',
  },
  cardDescription: {
    ...Typography.f_16_inter_regular,
    color: Colors.black,
  },
  cardPrice: {
    ...Typography.f_28_inter_bold,
    color: Colors.black,
    textAlign: 'right',
  },
  cardButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  limitedPromotionButton: {
    paddingVertical: 5,
  },
  startPromoBTn: {
    marginHorizontal: 20,
    marginVertical: 40,
  },
});

export default Promotion;
