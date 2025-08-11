import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import AppStatusBar from '../../components/AppStatusBar';
import {
  All,
  Electrical,
  ElectricalBlack,
  ElectricalGreen,
  Filter,
  Gravel,
  GravelBlack,
  GravelGreen,
  Mountain,
  MountainBlack,
  MountainGreen,
  Road,
  RoadBlack,
  RoadGreen,
  Search,
  City,
  CityBlack,
  CityGreen,
  Map,
  List,
  ComponentGray,
  ComponentBlack,
  CompetitionBlack,
  CompetitionGray,
  AllGray,
  AllGreen,
  Bike,
} from '../../assets/svg';

import { Typography } from '../../utilities/constants/constant.style';
import Colors from '../../utilities/constants/colors';
import { DEFAULT_LANGUAGE, platform } from '../../utilities';
import ProductCard from '../../components/ProductCard';
import AppButton from '../../components/AppButton';
import ProductCardDetails from '../../components/ProductCardDetails';
import screenResolution, {
  heightFlex1,
} from '../../utilities/constants/screenResolution';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllBicycles,
  getBicyclesNearCity,
  getFavorites,
  getBookingsAsClient,
  checkBookingReview,
  addReview,
  getBookingsAsOwner,
  updateBookingReviewModalShown,
} from '../../redux/features/main/mainThunks';
import { selectBicycles } from '../../redux/features/main/mainSelectors';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import axios from 'axios';
import { setFilters } from '../../redux/features/main/mainSlice';
import { RFValue } from 'react-native-responsive-fontsize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { saveFCMToken } from '../../utilities/fcmTokenManager';
import { selectAuthToken, selectAuthUserId } from '../../redux/features/auth/authSelectors';
import { EnvConfig } from '../../config/envConfig';
import { colors } from '../../utilities/constants';
import { fetchUserInfo } from '../../redux/features/auth/authThunks';
import ReviewBottomSheet from '../../components/ReviewBottomSheet';
import Toast from 'react-native-toast-message';
import { getItem, setItem } from '../../services/assynsStorage';
import { useAuth } from '../../utilities/authUtils';

// Key for storing dismissed booking IDs
const DISMISSED_BOOKINGS_KEY = 'dismissed_review_bookings';

const categories = [
  { id: 1, icon: AllGray, iconBlack: All, iconGreen: AllGreen, label: { en: 'All', sp: 'Todos' } },
  {
    id: 2,
    icon: Road,
    iconBlack: RoadBlack,
    iconGreen: RoadGreen,
    label: { en: 'Road', sp: 'Carretera' },
  },
  {
    id: 3,
    icon: City,
    iconBlack: CityBlack,
    iconGreen: CityGreen,
    label: { en: 'City', sp: 'Ciudad' },
  },
  {
    id: 4,
    icon: Mountain,
    iconBlack: MountainBlack,
    iconGreen: MountainGreen,
    label: { en: 'Mountain', sp: 'Montaña' },
  },
  {
    id: 5,
    icon: Gravel,
    iconBlack: GravelBlack,
    iconGreen: GravelGreen,
    label: { en: 'Gravel', sp: 'Gravel' },
  },
  {
    id: 6,
    icon: Electrical,
    iconBlack: ElectricalBlack,
    iconGreen: ElectricalGreen,
    label: { en: 'Electric', sp: 'Electrica' },
  },
  {
    id: 7,
    icon: CompetitionGray,
    iconBlack: CompetitionBlack,
    label: { en: 'Pro', sp: 'Pro' },
  },
  {
    id: 8,
    icon: ComponentGray,
    iconBlack: ComponentBlack,
    label: { en: 'Component', sp: 'Componente' },
  },
];

const Home = React.memo(({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [showMap, setShowMap] = useState(false);
  const dispatch = useDispatch();
  const bicycles = useSelector(selectBicycles);
  const { isAuthenticated, userId, token } = useAuth();
  const clientBookings = useSelector((state) => state.main.clientBookings);
  const ownerBookings = useSelector((state) => state.main.ownerBookings);
  const { dateFrom, dateEnd } = useSelector(state => state.main.filters);
  const [selectedBike, setSelectedBike] = useState(null);
  const [city, setCity] = useState('');
  const [loader, setloader] = useState('');
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language === 'sp' ? 'sp' : 'en';
  const regionTimeout = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [isClientReview, setIsClientReview] = useState(false);
  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [bookingToReview, setBookingToReview] = useState(null);
  const [reviewModalState, setReviewModalState] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 40.41347712579202,
    longitude: -3.706052240765947,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const formattedDateRange = useMemo(() => {
    if (dateFrom && dateEnd) {
      return `${new Date(dateFrom).toLocaleDateString([], {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      })} - ${new Date(dateEnd).toLocaleDateString([], {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      })}`;
    }
    return t('dates');
  }, [dateFrom, dateEnd, t]);

  const handleMarkerPress = useCallback(bike => {
    setSelectedBike(bike);
  }, []);

  const handleRegionChange = useCallback(region => {
    if (regionTimeout.current) {
      clearTimeout(regionTimeout.current);
    }

    // regionTimeout.current = setTimeout(() => {
    //   setMapRegion(region);
    // }, 300);
  }, []);
  useEffect(() => {
    const getData = async () => {
      await setloader(true);
      await dispatch(
        getAllBicycles({
          category:
            selectedCategory === 1
              ? ''
              : categories[selectedCategory - 1].label['en'].toLowerCase(),
        }),
      );
      // Only fetch favorites if user is authenticated
      if (isAuthenticated) {
        await dispatch(getFavorites());
      }
      await setloader(false);
    };
    getData();
  }, [dispatch, selectedCategory, isAuthenticated]);

  const handleCategoryPress = useCallback(
    id => {
      if (selectedCategory !== id) {
        setSelectedCategory(id);
      }
    },
    [selectedCategory],
  );

  const placesRef = useRef(null);
  useEffect(() => {
    const markersData = bicycles.filter(item => item?.lat && item?.lng);
    setMarkers(markersData);
  }, [bicycles]);

  useEffect(() => {
    if (isAuthenticated && userId) {
      dispatch(fetchUserInfo(userId));
      saveFCMToken(userId);
    }
  }, [userId, isAuthenticated]);
  const handlePlaceSelect = useCallback(
    async (data, details = null) => {
      const { northeast, southwest } = details?.geometry?.viewport;
      const latitudeDelta = Math.abs(northeast.lat - southwest.lat);
      const longitudeDelta = Math.abs(northeast.lng - southwest.lng);
      const { lat, lng } = details?.geometry?.location;

      try {
        const response = await axios.get(
          `${EnvConfig.googleMaps.geocodeUrl}?latlng=${lat},${lng}&key=${EnvConfig.googleMaps.apiKey}`,
        );

        if (response.data.status === 'OK') {
          const addressComponents = response.data.results[0].address_components;
          let city = '';

          for (let component of addressComponents) {
            if (component.types.includes('locality')) {
              city = component.long_name;
              break;
            }
          }
          dispatch(getBicyclesNearCity(city));
          if (!showMap) {
            await dispatch(
              setFilters({
                location: {
                  cityName: city,
                  lat: lat,
                  lng: lng
                },
              }),
            );
            await dispatch(
              getAllBicycles({
                category: '',
              }),
            );
          }
          setCity(city);
        } else {
          console.error('Geocoding failed:', response.data.status);
        }
      } catch (error) {
        console.error('Error with reverse geocoding:', error);
      }

      setMapRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta,
        longitudeDelta,
      });
    },
    [dispatch],
  );

  const clearInput = async () => {
    setCity('');
    await dispatch(
      setFilters({
        location: {
          cityName: ``,
        },
      }),
    );
    await dispatch(
      getAllBicycles({
        category:
          selectedCategory === 1
            ? ''
            : categories[selectedCategory - 1].label['en'].toLowerCase(),
      }),
    );
    await dispatch(getFavorites());
    placesRef.current?.setAddressText('');
  };

  const renderCategoryItem = useCallback(
    ({ item }) => {
      const isSelected = selectedCategory === item.id;
      const Icon = isSelected ? (item.iconGreen || item.iconBlack) : item.icon;
      const textColor = isSelected ? Colors.primary : Colors.gray;
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleCategoryPress(item.id)}>
          <View style={[
            styles.categoryItem,
            isSelected && styles.selectedCategoryItem
          ]}>
            <Icon />
            <Text style={[Typography.f_12_inter_medium, { color: textColor }]}>
              {item.label[currentLanguage]}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [handleCategoryPress, selectedCategory, currentLanguage],
  );

  const renderProductItem = useCallback(
    ({ item, index }) => {
      const imageUrl = item.photo
        ? item.photo.replace(/\.avif$/, '.jpg')
        : item.photo;
      return (
        <ProductCard
          style={{
            marginBottom: index === bicycles.length - 1 ? 380 : 0,
          }}
          key={item._id}
          productId={item._id}
          data={item}
          brand={item.brand}
          model={item.model}
          location={`${item.location?.city},${item.location?.country}`}
          price={item.price}
          image={imageUrl}
        />
      );
    },
    [bicycles],
  );
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getBookingsAsOwner());
      dispatch(getBookingsAsClient());
    }
  }, [dispatch, isAuthenticated]);

  // Check for completed bookings without reviews - only for authenticated users
  useEffect(() => {
    const checkBookingsForReview = async () => {
      if (!isAuthenticated || !userId || !token) return;

      try {
        // Use clientBookings state instead of API call
        if (clientBookings && clientBookings.length > 0) {
          // Find completed bookings (status 4)
          const completedBookings = clientBookings.filter(booking => booking.statusId === 4);
          // Check each completed booking for reviews
          for (const booking of completedBookings) {
            try {
              const reviews = await dispatch(checkBookingReview(booking._id)).unwrap();
              // If user hasn't reviewed yet
              const userHasReviewed = reviews && reviews.some(review => review.authorId === userId);
              if (!userHasReviewed) {
                // Check if isClientReviewModalShown property exists and is true
                // If the property doesn't exist, we'll still show the modal for backward compatibility
                const shouldShowReviewModal = booking.isClientReviewModalShown === undefined || booking.isClientReviewModalShown === true;

                if (shouldShowReviewModal) {
                   // Make sure we have all the necessary information
                  if (booking.bicycle && booking.bicycle.brand && booking.bicycle.model) {
                    setIsClientReview(true);
                    setBookingToReview({
                      ...booking,
                      bikeName: booking.bicycle.brand + ' ' + booking.bicycle.model,
                      ownerName: booking.userName || 'Owner'
                    });
                    setReviewModalState(true);
                    return; // Found a booking to review
                  }
                }
              }
            } catch (error) {
              console.error('Error checking booking review:', error);
            }
          }
        }

        // Use ownerBookings state if no client bookings need review
        if (ownerBookings && ownerBookings.length > 0) {
          // Find completed bookings (status 4)
          const completedBookings = ownerBookings.filter(booking => booking.statusId === 4);

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
                  setIsClientReview(false); // Owner is reviewing client
                  if (booking.bicycle && booking.bicycle.brand && booking.bicycle.model) {
                    setBookingToReview({
                      ...booking,
                      bikeName: booking.bicycle.brand + ' ' + booking.bicycle.model,
                      clientName: booking.userName || 'User'
                    });
                    setReviewModalState(true);
                    break;
                  }
                }
              }
            } catch (error) {
              console.error('Error checking owner booking review:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error checking bookings for review:', error);
      }
    };

    if (isAuthenticated && userId && token) {
      if (ownerBookings.length > 0 || clientBookings.length > 0) {
        checkBookingsForReview();
      }
    }
  }, [userId, token, dispatch, ownerBookings, clientBookings, isAuthenticated]);

  // Remove the effect that updates AsyncStorage based on reviewModalState
  // since we now track dismissed bookings by ID

  // Handle review submission
  const handleReviewSubmit = async ({ rating, comment }) => {
    if (!bookingToReview) return;

    try {
      const res = await dispatch(addReview({
        bookingId: bookingToReview._id,
        bicycleId: bookingToReview.bicycle?._id,
        rating,
        comment,
        ownerId: bookingToReview.bicycle?.ownerId || bookingToReview.ownerId,
      }));
      if (bookingToReview && bookingToReview._id) {
        // Update the booking to not show the review modal again
        // Use the appropriate flag based on whether it's a client or owner review
        await dispatch(updateBookingReviewModalShown({
          bookingId: bookingToReview._id,
          ...(isClientReview 
            ? { isClientReviewModalShown: false } 
            : { isOwnerReviewModalShown: false })
        }));
      }
      if (!res.error && (res.payload?.success || res.payload?.status === 'success' || res.payload)) {
        Toast.show({ type: 'success', text1: 'Review added successfully', position: 'bottom' });
        setBookingToReview(null);
        setReviewModalState(false);
      } else {
        Toast.show({ type: 'error', text1: 'Failed to add review', position: 'bottom' });
      }
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Failed to add review', position: 'bottom' });
      console.error('Review add error:', err);
    }
  };

  // Handle review modal close
  const handleReviewClose = async () => {
    if (bookingToReview && bookingToReview._id) {
      // Update the booking to not show the review modal again
      // Use the appropriate flag based on whether it's a client or owner review
      await dispatch(updateBookingReviewModalShown({
        bookingId: bookingToReview._id,
        ...(isClientReview 
          ? { isClientReviewModalShown: false } 
          : { isOwnerReviewModalShown: false })
      }));
    }
    setTimeout(() => {
      setBookingToReview(null);
      setReviewModalState(false);
    }, 2000);

  };

  return (
    <View style={styles.container}>
      <View>
        <AppStatusBar />
        <View style={styles.headerContainer}>
          {/* Search Input Row */}
          <View style={styles.searchRow}>
            <View style={styles.searchContainer}>
              <GooglePlacesAutocomplete
                ref={placesRef}
                placeholder={t('your_city')}
                onPress={handlePlaceSelect}
                textInputProps={{
                  placeholderTextColor: colors.black
                }}
                query={{
                  key: EnvConfig.googleMaps.apiKey,
                  language: [DEFAULT_LANGUAGE],
                }}
                fetchDetails={true}
                minLength={2}
                enablePoweredByContainer={false}
                renderLeftButton={() => (
                  <View style={styles.searchIconContainer}>
                    <Search />
                  </View>
                )}
                renderRightButton={() =>
                  city?.length > 0 && (
                    <TouchableOpacity
                      onPress={clearInput}
                      style={styles.clearButtonContainer}>
                      <AntDesign
                        name={'close'}
                        size={RFValue(18, screenResolution.screenHeight)}
                      />
                    </TouchableOpacity>
                  )
                }
                styles={{
                  container: {
                    backgroundColor: Colors.white,
                    borderRadius: 15,
                    paddingHorizontal: 15,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 3,
                  },
                  textInput: {
                    backgroundColor: Colors.white,
                    borderRadius: 15,
                    ...Typography.f_16_inter_medium,
                    color: Colors.black,
                    height: 48,
                    paddingLeft: 10,
                  },
                  listView: {
                    backgroundColor: Colors.white,
                    borderRadius: 12,
                    position: 'absolute',
                    top: '100%',
                    marginTop: 8,
                    paddingHorizontal: 20,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 5,
                  },
                  description: {
                    ...Typography.f_14_inter_medium,
                    color: Colors.black,
                    paddingVertical: 5,
                  },
                  separator: {
                    height: 1,
                    backgroundColor: Colors.lightGray,
                  },
                }}
              />
            </View>
            
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.filterButton}
              onPress={() => navigation.navigate('PriceFilter')}>
              <Filter />
            </TouchableOpacity>
          </View>
          
          {/* Date and Actions Row */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              onPress={() => navigation.navigate('DateFilter')}
              style={styles.dateButton}>
              <AntDesign 
                name="calendar" 
                size={RFValue(16, screenResolution.screenHeight)} 
                color={Colors.primary} 
                style={styles.dateIcon}
              />
              <Text style={[Typography.f_14_inter_medium, styles.dateText]}>
                {formattedDateRange}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.categoryShadow}>
          <View style={styles.categoryContainer}>
            <FlatList
              horizontal
              data={categories}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id.toString()}
              renderItem={renderCategoryItem}
              contentContainerStyle={styles.categoryListContainer}
            />
          </View>
        </View>
        {showMap ? (
          <>
            <MapView
              // provider={PROVIDER_GOOGLE}
              style={{
                height: screenResolution.screenHeight * 0.67,
                width: screenResolution.screenWidth,
                zIndex: -1,
              }}
              region={mapRegion}
              onRegionChange={handleRegionChange}>
              {markers.map(item => {
                return item?.lat && item?.lng ? (
                  <Marker
                    tracksViewChanges={false}
                    key={item._id}
                    onPress={() => handleMarkerPress(item)}
                    coordinate={{
                      latitude: parseFloat(item.lat),
                      longitude: parseFloat(item.lng),
                    }}>
                    <Bike />
                  </Marker>
                ) : null;
              })}
            </MapView>
            <View
              style={{
                position: 'absolute',
                width: '100%',
                top: platform.isIOS ? screenResolution.screenHeight * 0.2 : screenResolution.screenHeight * 0.25,
                zIndex: -1,
                elevation: 5,
              }}>
              <AppButton
                title={t('show_list')}
                btnColor={Colors.primary}
                btnTitleColor={Colors.white}
                icon={<List />}
                onPress={() => setShowMap(false)}
                style={{
                  alignSelf: 'center',
                }}
              />
            </View>
            {selectedBike && (
              <View
                style={{
                  position: 'absolute',
                  width: '100%',
                  bottom: heightFlex1 * 1,
                }}>
                <ProductCardDetails
                  brand={selectedBike?.brand}
                  model={selectedBike?.model}
                  productId={selectedBike?._id}
                  onPress={() =>
                    navigation.navigate('Product', {
                      productId: selectedBike?._id,
                      ownerId: selectedBike?.owner?._id,
                    })
                  }
                  price={selectedBike?.price}
                  location={selectedBike?.location?.city}
                  rating={'4.8'}
                  photo={{
                    uri:
                      selectedBike.photo.replace(/\.avif$/, '.jpg') ||
                      selectedBike.photo,
                  }}
                />
              </View>
            )}
          </>
        ) : (
          <View style={styles.productListContainer}>
            {loader ? (
              <ActivityIndicator
                color={Colors.primary}
                size={'large'}
                style={{ marginTop: 50 }}
              />
            ) : bicycles.length === 0 ? (
              <View style={styles.noBicyclesContainer}>
                <Text style={styles.noBicyclesText}>
                  {t('no_bicycles_found_for_this_category')}
                </Text>
              </View>
            ) : (
              <FlatList
                data={bicycles}
                keyExtractor={item => item._id}
                renderItem={renderProductItem}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        )}
      </View>
      {!showMap && (
        <View style={styles.mapButtonContainer}>
          <AppButton
            title={t('show_map')}
            btnColor={Colors.primary}
            btnTitleColor={Colors.white}
            icon={<Map />}
            onPress={() => setShowMap(true)}
          />
        </View>
      )}

      {/* Review Bottom Sheet */}
      <ReviewBottomSheet
        visible={reviewModalState}
        bookingInfo={{
          bikeName: bookingToReview?.bicycle?.brand + ' ' + bookingToReview?.bicycle?.model,
          ownerName: bookingToReview?.userName,
          clientName: bookingToReview?.userName
        }}
        isClientReview={isClientReview}
        onClose={handleReviewClose}
        onSubmit={handleReviewSubmit}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.white,
  },
  searchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  searchContainer: {
    flex: 1,
    marginRight: 12,
  },
  searchIconContainer: {
    alignSelf: 'center',
    paddingLeft: 8,
  },
  clearButtonContainer: {
    alignSelf: 'center',
    paddingRight: 8,
    padding: 4,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    zIndex: -1,
    alignItems: 'center',
    width: '100%',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  dateIcon: {
    marginRight: 8,
  },
  dateText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  categoryListContainer: {
    marginVertical: 10,
    paddingHorizontal: 20,
    gap: 20,
  },
  categoryContainer: {
    // backgroundColor: 'red',
  },
  categoryItem: {
    gap: 5,
    alignItems: 'center',
  },
  selectedCategoryItem: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    paddingBottom: 3,
  },
  productListContainer: {
    backgroundColor: Colors.white,
    marginTop: 10,
    zIndex: -1,
  },
  categoryShadow: {
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
    borderTopWidth: 0,
    zIndex: -1,
  },
  mapButtonContainer: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  noBicyclesContainer: {
    marginTop: 50,
  },
  noBicyclesText: {
    ...Typography.f_18_inter_medium,
    color: Colors.primary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default Home;
