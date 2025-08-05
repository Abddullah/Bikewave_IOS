import React, {useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import Colors from '../utilities/constants/colors';
import {Typography} from '../utilities/constants/constant.style';
import {DEFAULT_LANGUAGE} from '../utilities';
import screenResolution from '../utilities/constants/screenResolution';
import {RFValue} from 'react-native-responsive-fontsize';
import {CrossBlack, Star} from '../assets/svg';
import BottomSheet from './BottomSheet';
import {colors} from '../utilities/constants';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {getReviewsByUserId} from '../redux/features/main/mainThunks';

export default function ProfileHeader({user}) {
  const sheetRef = useRef(null);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const userId = useSelector(state => state.auth.user?._id);
  const userReviews = useSelector(state => state.main.userReviews);
  const reviewsLoading = useSelector(state => state.main.reviewsLoading);

  useEffect(() => {
    if (userId) {
      dispatch(getReviewsByUserId());
    }
  }, [userId, dispatch]);

  const handleOpenReviews = () => {
    if (sheetRef.current) sheetRef.current.open();
  };

  let averageRating = '0';
  if (userReviews && userReviews.length > 0) {
    const avg = userReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / userReviews.length;
    averageRating = avg === 0 ? '0' : (Math.round(avg * 10) / 10).toString().replace(/\.0$/, '');
  }

  return (
    <>
      <View style={styles.shadowContainer}>
        <Image
          source={user.avatar}
          style={styles.avatar}
          resizeMode="contain"
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.userName}>{user.name}</Text>
          <View style={styles.ratingContainer}>
            <Star />
            <Text style={[Typography.f_14_extra_bold, {color: Colors.black}]}>{averageRating}</Text>
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={handleOpenReviews}>
              <Text
                style={[Typography.f_14_extra_bold, {color: Colors.primary}]}>
                ({t('SeeReviews')})
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.userBio}>{user.bio[DEFAULT_LANGUAGE]}</Text>
        </View>
      </View>
      <BottomSheet ref={sheetRef}  HEIGHT={400} backgroundColor={colors.white}>
        <View style={{paddingHorizontal: 15}}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => sheetRef.current && sheetRef.current.close()}
            style={{alignSelf: 'flex-end'}}>
            <CrossBlack />
          </TouchableOpacity>
          <Text
            style={[
              Typography.f_18_inter_bold,
              {marginBottom: 20, color: Colors.black, alignSelf: 'center'},
            ]}>
            {t('Reviewabout')} {user.name}
          </Text>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 30 : 20 }}
          >
            {reviewsLoading ? (
              <Text style={{alignSelf: 'center', marginTop: 20}}>{t('Loading...')}</Text>
            ) : userReviews && userReviews.length > 0 ? (
              userReviews.map((review, idx) => (
                <View
                  key={review._id || idx}
                  style={{
                    backgroundColor: Colors.white,
                    borderRadius: 12,
                    margin: 5,
                    padding: 15,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                    marginBottom:idx===userReviews.length-1?40:16
                  }}>
                  <View style={{flexDirection: 'row', marginBottom: 8}}>
                    {[...Array(review.rating || 0)].map((_, i) => (
                      <Star key={i} style={{marginRight: 2}} />
                    ))}
                    {[...Array(5 - (review.rating || 0))].map((_, i) => (
                      <Star key={i + (review.rating || 0)} style={{marginRight: 2, opacity: 0.3}} />
                    ))}
                  </View>
                  <Text
                    style={[
                      Typography.f_16_inter_regular,
                      {color: Colors.black, marginBottom: 12, lineHeight: 24},
                    ]}>
                    {review.comment || review.text || t('No review text')}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 4,
                    }}>
                    <Image
                      source={review.user && review.user.avatar ? { uri: review.user.avatar } : user.avatar}
                      style={styles.avatarSmall}
                      resizeMode="contain"
                    />
                    <View>
                      <Text
                        style={[
                          Typography.f_14_inter_semi_bold,
                          {color: Colors.black, marginRight: 8},
                        ]}>
                        {review.author ? `${review.author.firstName || ''} ${review.author.secondName || ''}`.trim() : t('Anonymous')}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                          marginTop: 5,
                        }}>
                        <Star />
                        <Text
                          style={[
                            Typography.f_14_inter_bold,
                            {color: Colors.black},
                          ]}>
                          {review.rating || '-'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text style={[Typography.f_14_inter_bold,{alignSelf: 'center', marginTop: 20,color:colors.primary}]}>{t('no_reviews_found')}</Text>
            )}
          </ScrollView>
        </View>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 10,
    flexDirection: 'row',
    marginTop: -25,
    width: '90%',
    alignSelf: 'center',
    gap: 10,
  },
  avatar: {
    borderRadius: 15,
    width: 104,
    height: 104,
  },
  avatarSmall: {
    borderRadius: 8,
    width: 50,
    height: 50,
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1,
  },
  userName: {
    ...Typography.f_18_inter_semi_bold,
    color: Colors.black,
    top: RFValue(-6, screenResolution.screenHeight),
  },
  userBio: {
    color: Colors.black,
    ...Typography.f_12_inter_regular,
    top: RFValue(-6, screenResolution.screenHeight),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
    marginTop: -5,
  },
  reviewButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
