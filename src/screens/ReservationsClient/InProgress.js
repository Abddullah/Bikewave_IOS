import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import AppStatusBar from '../../components/AppStatusBar';
import { Typography } from '../../utilities/constants/constant.style';
import Colors from '../../utilities/constants/colors';
import TabBar from '../../components/TabBar';
import { PrevWhite } from '../../assets/svg';
import ProductCardDetails from '../../components/ProductCardDetails';
import ReservationCard from '../../components/ReservationCard';
import DropShadow from 'react-native-drop-shadow';
import { Reserve } from '../../assets/svg';
import AppButton from '../../components/AppButton';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { pickupBicycle, } from '../../redux/features/main/pickupReturnThunks';
import { getBookingsAsClient } from '../../redux/features/main/mainThunks';
import BottomSheet from '../../components/BottomSheet';
import ProductCard from '../../components/ProductCard';
import Images from '../../assets/images';
import DateRangePickerModal from '../../components/DateRangePickerModal';

export default function InProgress({ navigation }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [pickingUpBookingId, setPickingUpBookingId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dateRangeModalVisible, setDateRangeModalVisible] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const refRBSheet = useRef();

  const dispatch = useDispatch();
  const clientBookings = useSelector(state => state.main.clientBookings);
  const clientBookingsLoading = useSelector(state => state.main.clientBookingsLoading);
  const pickupLoading = useSelector(state => state.main.pickupLoading);

  useEffect(() => {
    dispatch(getBookingsAsClient());
  }, [dispatch]);

  // Filter bookings based on tab
  const filteredBookings = clientBookings?.filter(booking => {
    const currentDate = new Date();
    const bookingStartDate = new Date(booking.dateFrom);

    if (activeTab === 'upcoming') {
      // return bookingStartDate > currentDate; // Futuras: bookings that haven't started yet
      return booking.statusId === 2; // En curso: bookings with statusId 2
    } else if (activeTab === 'in_progress') {
      return booking.statusId === 3; // En curso: bookings with statusId 2
    } else if (activeTab === 'past') {
      return booking.statusId === 4; // Pasadas: bookings with statusId 4
    }
    return false;
  }) || [];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return moment(dateString).format('DD MMM YYYY');
  };

  const handlePickup = (bookingId) => {
    setPickingUpBookingId(bookingId);
    dispatch(pickupBicycle(bookingId));
  };

  const handlePastBookingPress = (booking) => {
    setSelectedBooking(booking);
    if (refRBSheet.current) {
      refRBSheet.current.open();
    }
  };

  const handleOpenDateRangePicker = () => {
    setDateRangeModalVisible(true);
  };
  const handleSelectDateRange = (startDate, endDate) => {
    setSelectedDateRange({
      startDate,
      endDate
    });
    setDateRangeModalVisible(false);

    // If date range is selected, navigate to checkout
    if (startDate && endDate) {
      const calculateDaysDiff = (start, end) => {
        const startDateObj = new Date(start);
        const endDateObj = new Date(end);
        const timeDiff = endDateObj.getTime() - startDateObj.getTime();
         return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
      };

      navigation.navigate('Step1', {
        bicycle: selectedBooking?.bicycle,
        selectedDateRange: {
          startDate,
          endDate
        },
        totalPrice: "€"+selectedBooking?.bicycle?.price * calculateDaysDiff(startDate, endDate)
      });

      // Close the bottom sheet after navigation
      if (refRBSheet.current) {
        refRBSheet.current.close();
      }
    }
  };

  const tabs = [
    {
      key: 'upcoming',
      label: t('upcoming'),
      navTarget: { screen: 'Upcoming' },
    },
    {
      key: 'in_progress',
      label: t('in_progress'),
      navTarget: { screen: 'InProgress' },
    },
    {
      key: 'past',
      label: t('past'),
      navTarget: { screen: 'Past' },
    },
  ];
  return (
    <View style={styles.pageWrapper}>
      <AppStatusBar />
      <View style={styles.headerWrapper}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.goBack()}
          style={styles.headerBackButton}>
          <PrevWhite />
        </TouchableOpacity>
        <Text style={styles.headerTitle}></Text>
        <Text />
      </View>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>
        {clientBookingsLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>{t('loading')}</Text>
          </View>
        ) : filteredBookings.length > 0 ? (
          filteredBookings.map(booking => (
            <View key={booking._id} style={styles.contentWrapper}>
              {activeTab === 'past' ? (
                <ReservationCard
                  brand={booking?.bicycle?.brand || 'Brand'}
                  model={booking?.bicycle?.model || 'Model'}
                  location={booking?.bicycle?.city || 'Madrid'}
                  photo={{ uri: booking?.bicycle?.photo?.replace(/\.avif$/, '.jpg') || booking?.bicycle?.photo }}
                  dateFrom={formatDate(booking?.dateFrom)}
                  onPress={() => handlePastBookingPress(booking)}
                  dateEnd={formatDate(booking?.dateEnd)}
                />
              ) : (
                <View style={styles.productWrapper}>
                  <ProductCardDetails
                    brand={booking?.bicycle?.brand || 'Brand'}
                    model={booking?.bicycle?.model || 'Model'}
                    location={booking?.bicycle?.city || 'Madrid'}
                    photo={{ uri: booking?.bicycle?.photo?.replace(/\.avif$/, '.jpg') || booking?.bicycle?.photo }}
                    rating={'4.8'}
                  />
                  <DropShadow style={styles.dateCardShadow}>
                    <View style={styles.dateCard}>
                      <Text style={styles.dateLabel}>{formatDate(booking?.dateFrom)}</Text>
                      <Reserve />
                      <Text style={styles.dateLabel}>{formatDate(booking?.dateEnd)}</Text>
                    </View>
                  </DropShadow>
                </View>
              )}

              {/* Show "Recoger" button only for upcoming tab */}
              {activeTab === 'upcoming' && (
                <AppButton
                  title={pickupLoading && pickingUpBookingId === booking._id ? t('loading') : t('collect')}
                  btnColor={Colors.primary}
                  btnTitleColor={Colors.white}
                  style={styles.actionButton}
                  onPress={() => handlePickup(booking._id)}
                  disabled={pickupLoading && pickingUpBookingId === booking._id}
                  icon={pickupLoading && pickingUpBookingId === booking._id ? <ActivityIndicator color={Colors.white} /> : null}
                />
              )}
            </View>
          ))
        ) : (
          <View style={styles.noBookingsContainer}>
            <Text style={styles.noBookingsText}>{t('make_first_reservation')}</Text>
          </View>
        )}
      </ScrollView>

      <BottomSheet ref={refRBSheet} HEIGHT={580}>
        <View style={styles.bottomSheetHeader}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              if (refRBSheet.current) {
                refRBSheet.current.close();
              }
            }}>
            <PrevWhite />
          </TouchableOpacity>
          <Text style={styles.bottomSheetTitle}>{t('re_book')}</Text>
          <Text />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {selectedBooking && (
            <ProductCard
              brand={selectedBooking?.bicycle?.brand || t('brand_value')}
              model={selectedBooking?.bicycle?.model || t('model_value')}
              location={selectedBooking?.bicycle?.city || 'Madrid'}
              price={selectedBooking?.bicycle?.price || '50'}
              image={selectedBooking?.bicycle?.photo ? selectedBooking?.bicycle?.photo?.replace(/\.avif$/, '.jpg') : Images.bicycle}
            />
          )}
          <AppButton
            title={t('reserve')}
            btnColor={Colors.white}
            btnTitleColor={Colors.primary}
            style={styles.reserveButton}
            onPress={handleOpenDateRangePicker}
          />
        </ScrollView>
      </BottomSheet>

      <DateRangePickerModal
        visible={dateRangeModalVisible}
        onClose={() => setDateRangeModalVisible(false)}
        onSelectRange={handleSelectDateRange}
        existingBookings={[]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerWrapper: {
    backgroundColor: Colors.primary,
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBackButton: {
    padding: 5,
    paddingLeft: 15,
  },
  headerTitle: {
    color: Colors.white,
    ...Typography.f_20_inter_semi_bold,
  },
  scrollView: {
    marginTop: -30,
  },
  contentWrapper: {
    gap: 20,
    paddingBottom: 20,
    marginBottom: 10,
  },
  productWrapper: {
    gap: 20,
  },
  dateCardShadow: {
    shadowColor: Colors.gray,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    marginHorizontal: 20,
  },
  dateCard: {
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
  actionButton: {
    marginHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  loadingText: {
    ...Typography.f_16_inter_regular,
    color: Colors.darkGray,
  },
  noBookingsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noBookingsText: {
    ...Typography.f_16_inter_regular,
    color: Colors.darkGray,
  },
  bottomSheetHeader: {
    backgroundColor: Colors.primary,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomSheetTitle: {
    color: Colors.white,
    ...Typography.f_18_inter_semi_bold,
  },
  reserveButton: {
    marginHorizontal: 20,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
});
