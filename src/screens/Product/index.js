import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import {
  getBicycleById,
  getFavorites,
  updateFavorites,
  getBicycleReviews,
} from '../../redux/features/main/mainThunks';
import { useTranslation } from 'react-i18next';
import Images from '../../assets/images';
import Colors from '../../utilities/constants/colors';
import AppButton from '../../components/AppButton';
import BottomSheet from '../../components/BottomSheet';
import AppStatusBar from '../../components/AppStatusBar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import screenResolution from '../../utilities/constants/screenResolution';
import { Typography } from '../../utilities/constants/constant.style';
import {
  fetchApprovedInfo,
  fetchUserInfo,
} from '../../redux/features/auth/authThunks';
import { RFValue } from 'react-native-responsive-fontsize';
import DateRangePickerModal from '../../components/DateRangePickerModal';
import {
  createAccount,
  createAccountSession,
} from '../../redux/features/main/mainThunks';
import {
  selectApprovedInfo,
  selectAuthLoading,
  selectAuthToken,
  selectAuthUserId,
  selectUserDetails,
} from '../../redux/features/auth/authSelectors';
import {
  selectAccount,
  selectClientSecret,
  selectFavorites,
  selectBicycleReviews,
  selectBicycleReviewsLoading,
} from '../../redux/features/main/mainSelectors';
import {
  HeartFill,
  ArrowLeft,
  CityGreen,
  Location,
  Calendar,
  CalendarWhite,
  Star,
  Cross,
  Tick,
} from '../../assets/svg';
import {
  selectMainLoading,
  selectBicycleDetails,
} from '../../redux/features/main/mainSelectors';
import axios from 'axios';
import { createChat, getAllChats, getOneChat } from '../../redux/features/chat/chatThunks';
import { clearCurrentChat } from '../../redux/features/chat/chatSlice';
import PopUp from '../../components/PopUp';

export default function Product({ navigation, route }) {
  const refRBSheet = useRef();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { productId, ownerId } = route.params;
  const bicycle = useSelector(selectBicycleDetails);
  const loading = useSelector(selectMainLoading);
  const auth_loading = useSelector(selectAuthLoading);
  const approvedInfo = useSelector(selectApprovedInfo);
  const user_id = useSelector(selectAuthUserId);
  const account = useSelector(selectAccount);
  const clientSec = useSelector(selectClientSecret);
  const token = useSelector(selectAuthToken);
  const userDetails = useSelector(selectUserDetails);
  const bicycleReviews = useSelector(selectBicycleReviews).filter(review => review?.author?._id !== user_id);
  const bicycleReviewsLoading = useSelector(selectBicycleReviewsLoading);

  const [modalVisible, setModalVisible] = useState(false);
  const [datePickerModalVisible, setDatePickerModalVisible] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [showApprovalPopup, setShowApprovalPopup] = useState(false);
  const [loadingReserve, setLoadingReserve] = useState(false);
  const isOwner = user_id === ownerId;

  const calculateDays = () => {
    if (!selectedDateRange) return 0;
    const startDate = new Date(selectedDateRange.startDate);
    const endDate = new Date(selectedDateRange.endDate);
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
  };

  const days = React.useMemo(() => calculateDays(), [selectedDateRange]);

  const calculateTotalPrice = React.useMemo(() => {
    if (!bicycle || !selectedDateRange) return '0€';

    const pricePerDay = Number.parseFloat(bicycle.price) || 0;
    const basePrice = pricePerDay * days;
    const insuranceFee = 4.2;
    const serviceFee = 4;

    return `${(basePrice + insuranceFee + serviceFee).toFixed(2)}€`;
  }, [bicycle, selectedDateRange, days]);

  const openBottomSheet = React.useCallback(() => {
    if (!selectedDateRange) {
      setDatePickerModalVisible(true);
      return;
    }
    if (refRBSheet.current) {
      refRBSheet.current.open();
    }
  }, [selectedDateRange]);

  useEffect(() => {
    dispatch(getBicycleById(productId));
    dispatch(fetchUserInfo(user_id));
    dispatch(getBicycleReviews(productId));
  }, [productId, user_id, dispatch]);

  const handleApprovalPopupClose = () => {
    refRBSheet?.current?.close();
    setShowApprovalPopup(false);
    navigation.navigate('MyDocuments');
  };

  const handleReservePress = async () => {
    setLoadingReserve(true);
    if (user_id) {
      const approvalRes = await dispatch(fetchApprovedInfo(user_id));
      if (
        approvalRes &&
        approvalRes.payload &&
        approvalRes.payload.isApproved
      ) {
        // if (userDetails.accountId) {
        await navigation.navigate('Step1', {
          bicycle,
          selectedDateRange,
          totalPrice: calculateTotalPrice,
        });
        await refRBSheet.current.close();
        // } else {
        //   const accountCreationRes = await dispatch(createAccount());
        //   if (accountCreationRes && accountCreationRes.payload) {
        //     const accountData = accountCreationRes.payload?.account;
        //     await dispatch(createAccountSession(accountData));
        //   }
        //   await navigation.navigate('Step1', {
        //     bicycle,
        //     selectedDateRange,
        //     totalPrice: calculateTotalPrice,
        //   });
        //   await refRBSheet.current.close();
        // }
      } else {
        // Show popup instead of directly navigating
        setShowApprovalPopup(true);
      }
    } else {
      await dispatch(createAccountSession(account));
      await navigation.navigate('Step1', {
        bicycle,
        selectedDateRange,
        totalPrice: calculateTotalPrice,
      });
      await refRBSheet.current.close();
    }
    setLoadingReserve(false);
  };

  const handleDateRangeSelect = (startDate, endDate) => {
    console.log('Selected Date Range:', startDate, endDate);
    setSelectedDateRange({ startDate, endDate });
    setDatePickerModalVisible(false);
  };

  const favorites = useSelector(selectFavorites);
  const [fav, setFav] = useState(false);
  const handleFavoriteToggle = async () => {
    await dispatch(updateFavorites(productId));
    setFav(!fav);
    await dispatch(getFavorites());
  };
  useEffect(() => {
    const isFavorite = favorites.findIndex(e => e._id == productId);
    if (isFavorite !== -1) setFav(true);
    else {
      setFav(false);
    }
  }, [favorites]);

  const handleChatPress = async () => {
    if (!route?.params?.ownerId) {
      alert('Chat can\'t be initialized because owner ID is missing');
      return;
    }
    dispatch(clearCurrentChat());
    navigation.navigate('Messages', {
      screen: 'Chat',
      params: {
        secondUserId: route?.params?.ownerId,
        reciepentData: bicycle?.owner,
        key: `chat-${route?.params?.ownerId}`,
      },
    });
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (!bicycleReviews || bicycleReviews.length === 0) return 0;
    const sum = bicycleReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / bicycleReviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating();

  return (
    <View style={styles.container}>
      <AppStatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      {showApprovalPopup && (
        <PopUp
          icon={<Cross />}
          title={t('approval_required')}
          description={t('approval_required_msg')}
          iconPress={handleApprovalPopupClose}
          onButtonPress={handleApprovalPopupClose}
          buttonTitle={t('upload_documents')}
        />
      )}
      {bicycle && !showApprovalPopup && (
        <>
          <View>
            <Modal visible={modalVisible} transparent={true}>
              <SafeAreaView style={{ flex: 1 }}>
                <TouchableOpacity style={styles.modalContainer} activeOpacity={1}>

                  <TouchableOpacity
                    style={styles.backIcon}
                    onPress={() => setModalVisible(false)}>
                    <ArrowLeft />
                  </TouchableOpacity>
                  <Image
                    source={{
                      uri:
                        bicycle.photo.replace(/\.avif$/, '.jpg') || bicycle.photo,
                    }}
                    resizeMode="contain"
                    style={styles.fullScreenImage}
                  />
                </TouchableOpacity>
              </SafeAreaView>
            </Modal>
            <View style={{ height: (screenResolution.screenHeight / 10) * 4.2 }}>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image
                  source={{
                    uri:
                      bicycle.photo.replace(/\.avif$/, '.jpg') || bicycle.photo,
                  }}
                  resizeMode="cover"
                  style={styles.productImage}
                />
              </TouchableOpacity>
              <View style={styles.headerContainer}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{ left: 0 }}
                  onPress={() => navigation.goBack()}>
                  <ArrowLeft />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    // style={styles.heartIconWrapper}
                    onPress={handleFavoriteToggle}>
                    <AntDesign
                      name={fav ? 'heart' : 'hearto'}
                      color={Colors.primary}
                      size={RFValue(25, screenResolution.screenHeight)}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.dropShadow}>
              <View style={styles.productDetailsContainer}>
                <View style={styles.brandPriceContainer}>
                  <Text style={styles.brandText}>{bicycle?.brand}</Text>
                  <Text style={styles.priceText}>
                    {bicycle.price}€{t('per_day')}
                  </Text>
                </View>
                <View style={styles.companySizeContainer}>
                  <Text style={styles.companyText}>{bicycle.model}</Text>
                  <Text style={styles.sizeText}>
                    {/* {t('size')}: S{bicycle.Size} */}
                  </Text>
                </View>
                <View style={styles.cityLocationContainer}>
                  <View style={styles.cityContainer}>
                    <CityGreen height={30} width={30} />
                    <Text style={styles.cityText}>{t('city')}</Text>
                  </View>
                  <View style={styles.locationContainer}>
                    <Location />
                    <Text style={styles.locationText}>
                      {bicycle.location?.city},{bicycle.location?.country}
                    </Text>
                  </View>
                </View>
                <View style={styles.ratingContainer}>
                  {bicycleReviews && bicycleReviews.length > 0 && (
                    <>
                      <Star />
                      <Text style={styles.ratingText}>{averageRating}</Text>
                    </>
                  )}
                </View>
                <Text style={styles.descriptionText}>{bicycle.description}</Text>

              </View>
            </View>
            <ScrollView
              // contentContainerStyle={styles.contentContainer}
              contentContainerStyle={{ paddingBottom: !isOwner ? Platform.OS === 'ios' ? 80 : 30 : 0 }}
              style={styles.overFlowContainer}>
              <Text style={styles.descriptionText}>{bicycle.desc}</Text>
              <View style={styles.ownerChatContainer}>
                <View style={styles.ownerInfoContainer}>
                  <Text style={styles.ownerLabel}>{t('owner')}:</Text>
                  <Text style={styles.ownerName}>
                    {bicycle.owner?.firstName} {bicycle.owner?.secondName}
                  </Text>
                </View>
                {!isOwner && (
                  <AppButton
                    title={t('chat')}
                    onPress={handleChatPress}
                    btnColor={Colors.white}
                    btnTitleColor={Colors.primary}
                    style={styles.chatButton}
                  />
                )}
              </View>
              <View style={styles.datesContainer}>
                <Text style={styles.datesLabel}>{t('dates')}</Text>
                <View style={styles.calendarContainer}>
                  <Calendar />
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setDatePickerModalVisible(true)}>
                    <Text style={styles.dateRange}>
                      {selectedDateRange
                        ? `${selectedDateRange.startDate} - ${selectedDateRange.endDate}`
                        : `${t('start_date')} - ${t('end_date')}`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Reviews Section */}
              <View style={styles.reviewsSection}>
                <Text style={styles.reviewsTitle}>{t('reviews_about_this_bicycle')}</Text>

                {bicycleReviewsLoading ? (
                  <ActivityIndicator color={Colors.primary} style={styles.reviewsLoading} />
                ) : bicycleReviews && bicycleReviews.length > 0 ? (
                  <View style={styles.reviewsList}>
                    {bicycleReviews.map((review, index) => {
                      return (
                        <View key={review._id || index} style={styles.reviewItem}>
                          <View style={styles.reviewHeader}>
                            <View style={styles.starRating}>
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  style={{
                                    marginRight: 2,
                                    opacity: i < review.rating ? 1 : 0.5
                                  }}
                                />
                              ))}
                            </View>
                          </View>
                          <Text style={styles.reviewText}>{review.text}</Text>
                          <View style={styles.reviewAuthor}>
                            <Image
                              source={review.author?.avatar ? { uri: review.author.avatar } : Images.profile}
                              style={styles.reviewAuthorImage}
                            />
                            <View style={{ gap: 2 }}>
                              <Text style={styles.reviewAuthorName}>
                                {review.author ? `${review.author.firstName || ''} ${review.author.secondName || ''}`.trim() : t('anonymous')}
                              </Text>
                              <View style={styles.ratingWrapper}>
                                <Star />
                                <Text style={styles.reviewAuthorName}>
                                  {review.rating}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      )
                    })}
                  </View>
                ) : (
                  <Text style={styles.noReviews}>{t('no_reviews_yet')}</Text>
                )}
              </View>
            </ScrollView>
          </View>
          {!isOwner && (
            <View style={styles.reserveBtnContainer}>
              <AppButton
                title={t('reserve')}
                btnColor={Colors.white}
                btnTitleColor={Colors.primary}
                onPress={openBottomSheet}
              />
            </View>
          )}
          <BottomSheet
            ref={refRBSheet}
            HEIGHT={RFValue(450, screenResolution.screenHeight)}
            animationDuration={250}>
            {selectedDateRange && (
              <View style={styles.modaldatesContainer}>
                <Text style={styles.datesHeader}>{t('dates')}</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.dateRangeContainer}>
                  <CalendarWhite />
                  <Text style={styles.dateText}>
                    {selectedDateRange.startDate} - {selectedDateRange.endDate}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.priceDetailsContainer}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>
                  {bicycle.price}€ x{days} {t('day')}(s)
                </Text>
                <Text style={styles.priceValue}>
                  {`${(Number.parseFloat(bicycle.price) * days).toFixed(2)}€`}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>{t('bicycle_insurance')}</Text>
                <Text style={styles.priceValue}>4.20€</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>{t('service_fee')}</Text>
                <Text style={styles.priceValue}>4€</Text>
              </View>
            </View>
            <View style={styles.totalContainer}>
              <View style={styles.totalTextContainer}>
                <Text style={styles.totalLabel}>TOTAL</Text>
                <Text style={styles.taxIncluded}>{t('VAT_included')}</Text>
              </View>
              <Text style={styles.totalValue}>{calculateTotalPrice}</Text>
            </View>
            <View style={styles.reserveButtonContainer}>
              <SafeAreaView>
                <AppButton
                  title={
                    loadingReserve ? (
                      <ActivityIndicator color={Colors.primary} />
                    ) : (
                      t('reserve')
                    )
                  }
                  btnColor={Colors.white}
                  btnTitleColor={Colors.primary}
                  onPress={handleReservePress}
                />
              </SafeAreaView>
            </View>
          </BottomSheet>
          <DateRangePickerModal
            visible={datePickerModalVisible}
            onClose={() => setDatePickerModalVisible(false)}
            onSelectRange={handleDateRangeSelect}
            existingBookings={bicycle?.bookings || []}
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
  productImage: {
    width: '100%',
    height: 350,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    position: 'absolute',
    top: '5%',
    width: '100%',
  },
  dropShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
    backgroundColor: Colors.error,
  },
  productDetailsContainer: {
    backgroundColor: Colors.white,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -23,
    gap: 10,
  },
  brandPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandText: {
    ...Typography.f_20_inter_bold,
    color: Colors.black,
  },
  priceText: {
    ...Typography.f_20_inter_bold,
    color: Colors.black,
  },
  companySizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  companyText: {
    ...Typography.f_18_inter_regular,
    color: Colors.black,
    // marginTop: 5,

  },
  sizeText: {
    ...Typography.f_18_inter_regular,
    color: Colors.black,
  },
  cityLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  cityText: {
    ...Typography.f_16_inter_medium,
    color: Colors.black,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  locationText: {
    ...Typography.f_16_inter_medium,
    color: Colors.black,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingBottom: 10,
    paddingLeft: 5,
  },
  ratingText: {
    ...Typography.f_16_inter_medium,
    color: Colors.black,
  },
  descriptionText: {
    ...Typography.f_16_inter_regular,
    color: Colors.black,
    paddingVertical: 10,
    // paddingHorizontal: 15,
  },
  ownerChatContainer: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ownerInfoContainer: {
    gap: 5,
  },
  ownerLabel: {
    ...Typography.f_20_inter_bold,
    color: Colors.black,
  },
  ownerName: {
    ...Typography.f_18_inter_medium,
    color: Colors.black,
    marginTop: 5,
  },
  chatButton: {
    borderWidth: 0.5,
    borderColor: Colors.primary,
    width: '35%',
    borderRadius: 50,
    paddingVertical: 10,
  },
  datesContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  datesLabel: {
    ...Typography.f_20_inter_bold,
    color: Colors.black,
  },
  calendarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 5,
  },
  dateRange: {
    ...Typography.f_16_inter_medium,
    color: Colors.black,
  },
  reserveBtnContainer: {
    width: '100%',
    backgroundColor: Colors.primary,
    padding: 15,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    position: 'absolute',
    bottom: 0,
  },
  modaldatesContainer: {
    gap: 5,
    paddingHorizontal: 20,
  },
  datesHeader: {
    ...Typography.f_20_inter_bold,
    color: Colors.white,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.white,
    padding: 10,
  },
  dateText: {
    ...Typography.f_16_inter_medium,
    color: Colors.white,
  },
  priceDetailsContainer: {
    gap: 10,
    borderBottomWidth: 1,
    borderColor: Colors.white,
    paddingVertical: 15,
    marginHorizontal: 15,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLabel: {
    ...Typography.f_18_inter_light,
    color: Colors.white,
  },
  priceValue: {
    ...Typography.f_18_inter_light,
    color: Colors.white,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  totalTextContainer: {
    // gap: 5,
  },
  totalLabel: {
    ...Typography.f_20_inter_bold,
    color: Colors.white,
  },
  taxIncluded: {
    ...Typography.f_12_inter_regular,
    color: Colors.platinum,
    marginTop: 2,
    marginLeft: 5,
  },
  totalValue: {
    ...Typography.f_20_inter_bold,
    color: Colors.white,
  },
  contentContainer: {
    paddingBottom: Platform.OS === 'ios' ? 80 : 50,
  },
  overFlowContainer: {
    height: (screenResolution.screenHeight / 10) * 3.5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  backIcon: {
    position: 'absolute',
    left: 20,
    top: 20,
    zIndex: 1,
  },
  reserveButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
  reviewsSection: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.platinum,
    marginTop: 10,
  },
  reviewsTitle: {
    ...Typography.f_20_inter_bold,
    color: Colors.black,
    marginBottom: 15,
  },
  reviewsLoading: {
    marginVertical: 20,
  },
  reviewsList: {
    gap: 15,
  },
  reviewItem: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  starRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewText: {
    ...Typography.f_16_inter_regular,
    color: Colors.black,
    marginBottom: 12,
    lineHeight: 24,
  },
  reviewAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  reviewAuthorImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 12,
  },
  reviewAuthorName: {
    ...Typography.f_14_inter_semi_bold,
    color: Colors.black,
  },
  noReviews: {
    ...Typography.f_16_inter_regular,
    color: Colors.gray,
    textAlign: 'center',
    marginVertical: 20,
  },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});
