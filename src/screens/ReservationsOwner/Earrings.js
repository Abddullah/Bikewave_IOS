import React, { useState, useEffect } from 'react';
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
import { PrevWhite, Cross } from '../../assets/svg';
import DropShadow from 'react-native-drop-shadow';
import { Reserve } from '../../assets/svg';
import AppButton from '../../components/AppButton';
import ReservationCard from '../../components/ReservationCard';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { confirmPayment, getBookingsAsOwner, cancelPayment, checkAccount, addReview, checkBookingReview, updateBookingReviewModalShown } from '../../redux/features/main/mainThunks';
import { returnBicycle } from '../../redux/features/main/pickupReturnThunks';
import moment from 'moment';
import PopUp from '../../components/PopUp';
import { SendMessageNotifications } from '../../utilities/notificationService';
import { getAllFCMTokens } from '../../utilities/fcmTokenManager';
import { platform } from '../../utilities';
import ReviewBottomSheet from '../../components/ReviewBottomSheet';
import Toast from 'react-native-toast-message';
import { getItem, setItem } from '../../services/assynsStorage';
import { selectAuthUserId } from '../../redux/features/auth/authSelectors';

// Key for storing modal state
const MODAL_STATE_KEY = 'modalState_Earrings';

export default function Earrings({ navigation }) {
  const [activeTab, setActiveTab] = useState('earrings');
  const [cancellingBookingId, setCancellingBookingId] = useState(null);
  const [confirmingBookingId, setConfirmingBookingId] = useState(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [popupAction, setPopupAction] = useState(null);
  const [showReviewSheet, setShowReviewSheet] = useState(false);
  const [reviewDismissed, setReviewDismissed] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [isClientReview, setIsClientReview] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.main.ownerBookings);
  const returnStatus = useSelector((state) => state.main.returnBicycleStatus);
  const returnLoading = useSelector((state) => state.main.returnLoading);
  const userId = useSelector(selectAuthUserId);
  
  useEffect(() => {
    dispatch(getBookingsAsOwner());
  }, [dispatch, returnStatus, activeTab]);

  useEffect(() => {
    if (!reviewDismissed) {
      setShowReviewSheet(true);
    }
  }, [reviewDismissed]);

  // On mount, read modalState from AsyncStorage
  useEffect(() => {
    (async () => {
      const storedModalState = await getItem(MODAL_STATE_KEY, false);
      setModalState(!!storedModalState);
    })();
  }, []);

  // Whenever modalState changes, persist it
  useEffect(() => {
    (async () => {
      await setItem(MODAL_STATE_KEY, modalState);
    })();
  }, [modalState]);

  // Check for completed bookings without reviews
  useEffect(() => {
    const checkBookingsForReview = async () => {
      if (!userId || !bookings || bookings.length === 0) return;

      try {
        // Find completed bookings (status 4)
        const completedBookings = bookings.filter(booking => booking.statusId === 4);
        
        // Check each completed booking for reviews
        for (const booking of completedBookings) {
          try {
            const reviews = await dispatch(checkBookingReview(booking._id)).unwrap();
            
            // If user hasn't reviewed yet
            const userHasReviewed = reviews && reviews.some(review => review.authorId === userId);
            if (!userHasReviewed) {
              // Check if isOwnerReviewModalShown property exists and is true
              // If the property doesn't exist, we'll still show the modal for backward compatibility
              const shouldShowReviewModal = booking.isOwnerReviewModalShown === undefined || booking.isOwnerReviewModalShown === true;
              
              if (shouldShowReviewModal) {
                // Make sure we have all the necessary information
                if (booking.bicycle && booking.bicycle.brand && booking.bicycle.model) {
                  // For owner reviewing client
                  setIsClientReview(false);
                  setReviewBooking({
                    ...booking,
                    bikeName: booking.bicycle.brand + ' ' + booking.bicycle.model,
                    clientName: booking.user?.firstName + ' ' + booking.user?.secondName || 'User'
                  });
                  setModalState(true);
                  break;
                }
              }
            }
          } catch (error) {
            console.error('Error checking booking review:', error);
          }
        }
      } catch (error) {
        console.error('Error checking bookings for review:', error);
      }
    };

    if (userId && bookings) {
      checkBookingsForReview();
    }
  }, [userId, bookings, activeTab, dispatch]);

  const earringsBookings = bookings?.filter(booking => {
    if (activeTab === 'earrings') {
      return booking.statusId === 1;
    } else if (activeTab === 'confirmed') {
      return booking.statusId === 2 || booking.statusId === 3;
    } else if (activeTab === 'record') {
      return booking.statusId === 4;
    }
    return false;
  }) || [];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return moment(dateString).format('DD MMM YYYY');
  };

  const handleConfirm = async (bookingId) => {
    setConfirmingBookingId(bookingId);
    try {
      const checkAccountResult = await dispatch(checkAccount());
      console.log(checkAccountResult, 'checkAccountResult');

      if (checkAccountResult?.payload?.accountCompleted === false) {
        setErrorMessage(t('stripe_capabilities_required'));
        setPopupAction(() => () => {
          navigation.navigate('PaymentPreferences')
          setShowErrorPopup(false);
        });
        setShowErrorPopup(true);
        return;
      }
      if (checkAccountResult?.error && Object.keys(checkAccountResult.error).length > 0) {
        setErrorMessage(t('something_went_wrong'));
        setPopupAction(() => () => {
          navigation.navigate('PaymentPreferences')
          setShowErrorPopup(false);
        });
        setShowErrorPopup(true);
        return;
      }

      const result = await dispatch(confirmPayment(bookingId));
      if (result?.error?.payload?.data?.error?.code === 'account_capabilities_required' ||
        result?.error?.response?.data?.error?.code === 'account_capabilities_required' ||
        result?.payload?.error?.code === 'insufficient_capabilities_for_transfer') {
        setErrorMessage(t('payment_setup_required'));
        setPopupAction(() => () => {
          navigation.navigate('PaymentPreferences')
          setShowErrorPopup(false);
        });
        setShowErrorPopup(true);
      }
      else if (
        (result?.error && Object.keys(result.error).length > 0) ||
        (result?.payload?.error && Object.keys(result.payload.error).length > 0) ||
        (result?.payload && result.payload.success === false)
      ) {
        const errorMsg =
          result?.error?.message ||
          result?.error?.payload?.message ||
          result?.error?.response?.data?.message ||
          result?.payload?.error?.message ||
          t('something_went_wrong');

        setErrorMessage(errorMsg);
        setPopupAction(null);
        setShowErrorPopup(true);
      } else {
        await dispatch(getBookingsAsOwner());

        try {
          const allTokens = await getAllFCMTokens();
          const booking = bookings.find(b => b._id === bookingId);
          if (booking && booking.userId) {
            const clientTokenObj = allTokens.find(tokenObj => tokenObj.userId === booking.userId);
            if (clientTokenObj && clientTokenObj.token) {
              await SendMessageNotifications(
                [clientTokenObj.token],
                t('notifications.booking_confirmed'),
                t('notifications.booking_confirmed_message'),
                null
              );
            }
          }
        } catch (notificationError) {
          console.error('Error sending confirmation notification:', notificationError);
        }
      }
    } catch (error) {
      console.log('Error in handleConfirm:', error);
      setErrorMessage(error.message || t('something_went_wrong'));
      setPopupAction(null);
      setShowErrorPopup(true);
    } finally {
      setConfirmingBookingId(null);
    }
  };

  const handleDecline = async (bookingId) => {
    setCancellingBookingId(bookingId);
    try {
      const result = await dispatch(cancelPayment(bookingId));

      if (
        (result?.error && Object.keys(result.error).length > 0) ||
        (result?.payload?.error && Object.keys(result.payload.error).length > 0) ||
        (result?.payload && result.payload.success === false)
      ) {
        const errorMsg =
          result?.error?.message ||
          result?.error?.payload?.message ||
          result?.error?.response?.data?.message ||
          result?.payload?.error?.message ||
          t('something_went_wrong');

        setErrorMessage(errorMsg);
        setPopupAction(null);
        setShowErrorPopup(true);
      } else {
        await dispatch(getBookingsAsOwner());

        try {
          const allTokens = await getAllFCMTokens();
          const booking = bookings.find(b => b._id === bookingId);
          if (booking && booking.userId) {
            const clientTokenObj = allTokens.find(tokenObj => tokenObj.userId === booking.userId);
            if (clientTokenObj && clientTokenObj.token) {
              await SendMessageNotifications(
                [clientTokenObj.token],
                t('notifications.booking_declined'),
                t('notifications.booking_declined_message'),
                null
              );
            }
          }
        } catch (notificationError) {
          console.error('Error sending decline notification:', notificationError);
        }
      }
    } catch (error) {
      console.log('Error in handleDecline:', error);
      setErrorMessage(error.message || t('something_went_wrong'));
      setPopupAction(null);
      setShowErrorPopup(true);
    } finally {
      setCancellingBookingId(null);
    }
  };

  const handleReturn = async (booking) => {
    try {
      const result = await dispatch(returnBicycle(booking._id));
      if (!result.error && (result.payload?.success || result.payload?.status === 'success' || result.payload)) {
        setReviewBooking({
          ...booking,
          bikeName: booking.bicycle?.brand + ' ' + booking.bicycle?.model,
          clientName: booking.user?.firstName + ' ' + booking.user?.secondName
        });
        setModalState(true);
      } else {
        console.log('Return error:', result.error || result);
      }
    } catch (error) {
      console.log('Error in handleReturn:', error);
    }
  };

  const handleClosePopup = () => {
    setShowErrorPopup(false);
    setErrorMessage('');
  };

  const handleReviewSubmit = async ({ rating, comment }) => {
    if (!reviewBooking) return;
    try {
      const res = await dispatch(addReview({
        bookingId: reviewBooking._id,
        bicycleId: reviewBooking.bicycle?._id,
        rating,
        comment,
        ownerId: reviewBooking.ownerId || reviewBooking.bicycle?.ownerId,
      }));
      if (reviewBooking && reviewBooking._id) {
        // Update the booking to not show the review modal again
        // Use the appropriate flag based on whether it's a client or owner review
        await dispatch(updateBookingReviewModalShown({
          bookingId: reviewBooking._id,
          ...(isClientReview 
            ? { isClientReviewModalShown: false } 
            : { isOwnerReviewModalShown: false })
        }));
      }
      if (!res.error && (res.payload?.success || res.payload?.status === 'success' || res.payload)) {
        Toast.show({ type: 'success', text1: 'Review added successfully', position: 'bottom' });
        
        setReviewBooking(null);
        setModalState(false);
      } else {
        Toast.show({ type: 'error', text1: 'Failed to add review', position: 'bottom' });
      }
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Failed to add review', position: 'bottom' });
      console.error('Review add error:', err);
    }
  };

  const handleReviewClose = async () => {
    if (reviewBooking && reviewBooking._id) {
      // Update the booking to not show the review modal again
      await dispatch(updateBookingReviewModalShown({
        bookingId: reviewBooking._id,
        ...(isClientReview 
          ? { isClientReviewModalShown: false } 
          : { isOwnerReviewModalShown: false })
      }));
    }
    
    setTimeout(() => {
      setReviewBooking(null);
      setModalState(false);
    }, 3000);
  };

  const bookingInfo = {
    clientName: 'John Doe',
    bikeName: 'Mountain Bike',
  };

  const tabs = [
    {
      key: 'earrings',
      label: t('earrings'),
      navTarget: { screen: 'Earrings' },
    },
    {
      key: 'confirmed',
      label: t('confirmed'),
      navTarget: { screen: 'Confirmed' },
    },
    {
      key: 'record',
      label: t('record'),
      navTarget: { screen: 'Record' },
    },
  ];

  return (
    <View style={styles.container}>
      <AppStatusBar />
      {showErrorPopup ? (
        <PopUp
          icon={<Cross />}
          title={t('payment_setup_msg')}
          description={errorMessage}
          buttonTitle={popupAction ? t('setup_now') : t('ok')}
          iconPress={handleClosePopup}
          onButtonPress={popupAction || handleClosePopup}
        />
      ) : (
        <>
          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.goBack()}
              style={styles.backButton}>
              <PrevWhite />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t('reservations_owner')}</Text>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.backButton}>
             </TouchableOpacity>
          </View>
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollContainer}>
            {earringsBookings.length === 0 ? (
              <View style={styles.emptyStateContainer}>
                <View style={styles.emptyStateContent}>
                  <Text style={styles.emptyStateText}>{t('no_bookings')}</Text>
                  <AppButton
                    title={t('check_our_bikes')}
                    btnColor={Colors.primary}
                    btnTitleColor={Colors.white}
                    onPress={() => navigation.navigate('Home')}
                    style={styles.emptyStateButton}
                  />
                </View>
              </View>
            ) : (
              earringsBookings.map((booking) => {
                console.log(booking, 'booking');
                return (
                  <View key={booking.id} style={styles.mainContent}>
                    <View style={styles.productDetails}>
                      <ReservationCard
                        brand={booking?.bicycle?.brand || 'Brand'}
                        model={booking?.bicycle?.model || 'Model'}
                        photo={{ uri: booking?.bicycle?.photo?.replace(/\.avif$/, '.jpg') || booking?.bicycle?.photo }}
                        category={activeTab === 'confirmed' ? '' : booking?.bicycle?.category|| 'User'}
                        city={booking?.bicycle?.city }
                      />
                      {booking.statusId === 1 && (
                        <DropShadow style={styles.dateCardShadow}>
                          <View style={styles.dateCard}>
                            <Text style={styles.dateLabel}>{formatDate(booking?.dateFrom) || t('date_range.0')}</Text>
                            <Reserve />
                            <Text style={styles.dateLabel}>{formatDate(booking?.dateEnd) || t('date_range.1')}</Text>
                          </View>
                        </DropShadow>
                      )}
                    </View>
                    {booking.statusId === 1 ? (
                      <View style={styles.buttonsContainer}>
                        <AppButton
                          title={confirmingBookingId === booking._id ? t('loading') : t('confirm')}
                          btnColor={Colors.primary}
                          btnTitleColor={Colors.white}
                          onPress={() => handleConfirm(booking._id)}
                          disabled={confirmingBookingId === booking._id}
                          icon={confirmingBookingId === booking._id ? <ActivityIndicator color={Colors.white} /> : null}
                        />
                        <AppButton
                          title={cancellingBookingId === booking._id ? t('loading') : t('decline')}
                          btnColor={Colors.white}
                          btnTitleColor={Colors.primary}
                          style={styles.declineButton}
                          onPress={() => handleDecline(booking._id)}
                          disabled={cancellingBookingId === booking._id}
                          icon={cancellingBookingId === booking._id ? <ActivityIndicator color={Colors.primary} /> : null}
                        />
                      </View>
                    ) : (
                      <View style={styles.buttonsContainer}>
                        {booking.statusId === 3 && (
                          <AppButton
                            title={t('return')}
                            btnColor={Colors.primary}
                            btnTitleColor={Colors.white}
                            onPress={() => handleReturn(booking)}
                          />
                        )}
                      </View>
                    )}
                  </View>
                )
              })
            )}
          </ScrollView>
          <ReviewBottomSheet
            visible={modalState}
            bookingInfo={reviewBooking}
            onClose={handleReviewClose}
            onSubmit={handleReviewSubmit}
            isClientReview={isClientReview}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: Colors.white,
    ...Typography.f_20_inter_semi_bold,
    textAlign:"center",
     width:'85%'
  },
  scrollContainer: {
    marginTop: -30,
  },
  mainContent: {
    gap:platform=='ios'?0: 20,
    paddingBottom:platform=='ios'?0: 20,
  },
  productDetails: {
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
  buttonsContainer: {
    gap: 15,
    marginHorizontal: 20,
    paddingBottom: 20,
  },
  declineButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  statusText: {
    ...Typography.f_18_inter_semi_bold,
    color: Colors.primary,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 40,
  },
  emptyStateContent: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    shadowColor: Colors.gray,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyStateText: {
    ...Typography.f_18_inter_semi_bold,
    color: Colors.black,
    marginBottom: 25,
    textAlign: 'center',
  },
  emptyStateButton: {
    width: '100%',
    marginTop: 10,
  },
});
