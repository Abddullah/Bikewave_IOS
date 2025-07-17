import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AppButton from '../../components/AppButton';
import Colors from '../../utilities/constants/colors';
import AppStatusBar from '../../components/AppStatusBar';

import {CheckoutHeader} from '../../components/CheckoutHeader';
import ProductCardDetails from '../../components/ProductCardDetails';
import {Typography} from '../../utilities/constants/constant.style';
import DropShadow from 'react-native-drop-shadow';
import {Reserve} from '../../assets/svg';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {bookBicycle} from '../../redux/features/main/mainThunks';
import {
  selectBookingLoading,
  selectBookingError,
} from '../../redux/features/main/mainSelectors';
import {colors} from '../../utilities/constants';

export const Step1 = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const {bicycle, selectedDateRange, totalPrice} = route.params;
  const bookingLoading = useSelector(selectBookingLoading);
  const bookingError = useSelector(selectBookingError);

  const checkoutSteps = [
    t('checkoutSteps.booking'),
    t('checkoutSteps.billing'),
    t('checkoutSteps.pay'),
    t('checkoutSteps.confirmation'),
  ];

  const calculateDays = () => {
    if (!selectedDateRange) return 0;
    const startDate = new Date(selectedDateRange.startDate);
    const endDate = new Date(selectedDateRange.endDate);
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
  };

  const days = calculateDays();
  const basePrice = bicycle.price * days;
  const insuranceFee = 4.2;
  const serviceFee = 4;

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePaymentProceed = async () => {
    try {
      const bookingRes = await dispatch(
        bookBicycle({
          bicycleId: bicycle._id,
          dateFrom: selectedDateRange.startDate,
          dateEnd: selectedDateRange.endDate,
          price: totalPrice.replace('€', ''),
        }),
      );
      console.log(bookingRes, 'bookingRes');

      if (bookingRes.payload) {
        navigation.navigate('Step2', {
          bicycle,
          selectedDateRange,
          totalPrice,
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  const getHighlightedRentTitle = () => {
    const rentTitle = t('rentTitle');
    const lang = i18n.language;
    const highlightWord = lang === 'sp' ? 'candado' : 'lock';

    if (!rentTitle.includes(highlightWord)) {
      return (
        <Text
          style={[
            Typography.f_14_roboto_medium,
            {
              color: colors.black,
              paddingHorizontal: 20,
              paddingBottom: 35,
              lineHeight: 22,
            },
          ]}>
          <Text style={[Typography.f_14_inter_bold]}>{t('reminder')}</Text>{' '}
          {rentTitle}
        </Text>
      );
    }

    const parts = rentTitle.split(highlightWord);
    return (
      <Text
        style={[
          Typography.f_14_roboto_medium,
          {
            color: colors.black,
            paddingHorizontal: 20,
            paddingBottom: 35,
            lineHeight: 22,
          },
        ]}>
        <Text style={[Typography.f_14_inter_bold]}>{t('reminder')}</Text>{' '}
        {parts[0]}
        <Text style={[Typography.f_14_inter_bold,{color:'red'}]}>{highlightWord}</Text>
        {parts[1]}
      </Text>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <AppStatusBar />
      <ScrollView showsVerticalScrollIndicator={false}>
        <CheckoutHeader
          title={`${t('reservation_details')}`}
          currentStep={1}
          steps={checkoutSteps}
          children={
            <ProductCardDetails
              brand={bicycle?.brand}
              productId={bicycle?._id}
              model={bicycle?.model}
              location={
                bicycle?.location
                  ? `${bicycle?.location?.city}, ${bicycle?.location?.country}`
                  : bicycle?.city + ', ' + bicycle?.country
              }
              rating={bicycle?.rating}
              photo={{
                uri:
                  bicycle?.photo?.replace(/\.avif$/, '.jpg') || bicycle?.photo,
              }}
            />
          }
        />
        {getHighlightedRentTitle()}
        <View style={styles.dateSectionContainer}>
          <Text style={styles.sectionTitle}>{t('dates')}</Text>
          <DropShadow style={styles.dateCardShadow}>
            <View style={styles.dateCardContainer}>
              <Text style={styles.dateLabel}>
                {formatDate(selectedDateRange?.startDate)}
              </Text>
              <Reserve />
              <Text style={styles.dateLabel}>
                {formatDate(selectedDateRange?.endDate)}
              </Text>
            </View>
          </DropShadow>
        </View>
        <View style={styles.priceSectionContainer}>
          <Text style={styles.sectionTitle}>{t('price_details')}</Text>
          <DropShadow style={styles.priceCardShadow}>
            <View style={styles.priceCardContainer}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>
                  {bicycle?.price}€ x {days} {t('day')}(s)
                </Text>
                <Text style={styles.priceValue}>{`${basePrice}€`}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>{t('bicycle_insurance')}</Text>
                <Text style={styles.priceValue}>{insuranceFee}€</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>{t('service_fee')}</Text>
                <Text style={styles.priceValue}>{serviceFee}€</Text>
              </View>
              <View style={styles.totalRowContainer}>
                <View style={styles.totalLabelContainer}>
                  <Text style={styles.totalLabel}>TOTAL</Text>
                  <Text style={styles.taxText}>{t('VAT_included')}</Text>
                </View>
                <Text style={styles.totalValue}>{totalPrice}</Text>
              </View>
            </View>
          </DropShadow>
        </View>
        <AppButton
          title={
            bookingLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              t('payment_proceed')
            )
          }
          btnColor={Colors.primary}
          btnTitleColor={Colors.white}
          style={styles.paymentButton}
          onPress={handlePaymentProceed}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  paymentButton: {
    margin: 20,
    marginTop: Platform.OS === 'ios' ? 20 : 60,
  },
  dateSectionContainer: {
    gap: 15,
    marginHorizontal: 25,
    marginTop: -10,
  },
  sectionTitle: {
    ...Typography.f_20_inter_semi_bold,
    color: Colors.black,
  },
  dateCardShadow: {
    shadowColor: Colors.gray,
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  dateCardContainer: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateLabel: {
    ...Typography.f_18_inter_semi_bold,
    width: '30%',
    color: Colors.black,
  },
  priceSectionContainer: {
    gap: 15,
    margin: 25,
  },
  priceCardShadow: {
    shadowColor: Colors.gray,
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  priceCardContainer: {
    gap: 10,
    paddingVertical: 15,
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 20,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLabel: {
    ...Typography.f_18_inter_light,
    color: Colors.black,
  },
  priceValue: {
    ...Typography.f_18_inter_light,
    color: Colors.black,
  },
  totalRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderTopWidth: 0.2,
    borderColor: Colors.gray,
    marginTop: 10,
  },
  totalLabelContainer: {
    gap: -5,
  },
  totalLabel: {
    ...Typography.f_20_inter_bold,
    color: Colors.black,
  },
  taxText: {
    ...Typography.f_12_inter_regular,
    color: Colors.dark_gray,
  },
  totalValue: {
    ...Typography.f_20_inter_bold,
    color: Colors.black,
  },
});
