import React, {useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
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

export default function ProfileHeader({user, userReviews, reviewsLoading, fetchReviews}) {
  const sheetRef = useRef(null);
  const {t} = useTranslation();

  const handleOpenReviews = () => {
    if (fetchReviews) fetchReviews();
    if (sheetRef.current) sheetRef.current.open();
  };

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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              marginBottom: 10,
              marginTop: -5,
            }}>
            <Star />
            <Text style={[Typography.f_14_extra_bold, {color: Colors.black}]}>
              4.8
            </Text>
            <TouchableOpacity onPress={handleOpenReviews}>
              <Text
                style={[Typography.f_14_extra_bold, {color: Colors.primary}]}>
                ({t('SeeReviews')})
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.userBio}>{user.bio[DEFAULT_LANGUAGE]}</Text>
        </View>
      </View>
      <BottomSheet ref={sheetRef} HEIGHT={400} backgroundColor={colors.white}>
        <View style={{paddingHorizontal: 15, paddingTop: 10}}>
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
          <ScrollView showsVerticalScrollIndicator={false} style={{maxHeight: 300}}>
            {reviewsLoading ? (
              <ActivityIndicator color={Colors.primary} />
            ) : userReviews && userReviews.length > 0 ? (
              userReviews.map((review, idx) => (
                <View key={review._id || idx} style={{marginBottom: 16, borderBottomWidth: 1, borderColor: '#eee', paddingBottom: 8}}>
                  <View style={{flexDirection: 'row', marginBottom: 8}}>
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} style={{marginRight: 2}} />
                    ))}
                  </View>
                  <Text
                    style={[
                      Typography.f_16_inter_regular,
                      {color: Colors.black, marginBottom: 12, lineHeight: 24},
                    ]}>
                    {review.comment}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={[Typography.f_14_inter_bold,{color:colors.primary,textAlign:'center'}]}>{t('no_reviews_found')}</Text>
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
});
