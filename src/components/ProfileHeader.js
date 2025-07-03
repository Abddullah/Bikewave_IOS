import React, {useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Colors from '../utilities/constants/colors';
import {Typography} from '../utilities/constants/constant.style';
import {DEFAULT_LANGUAGE} from '../utilities';
import screenResolution from '../utilities/constants/screenResolution';
import {RFValue} from 'react-native-responsive-fontsize';
import {CrossBlack, Star} from '../assets/svg';
import BottomSheet from './BottomSheet';
import {colors} from '../utilities/constants';

export default function ProfileHeader({user}) {
  const sheetRef = useRef(null);

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
            <TouchableOpacity
              onPress={() => sheetRef.current && sheetRef.current.open()}>
              <Text
                style={[Typography.f_14_extra_bold, {color: Colors.primary}]}>
                (Ver reseñas)
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.userBio}>{user.bio[DEFAULT_LANGUAGE]}</Text>
        </View>
      </View>
      <BottomSheet ref={sheetRef} HEIGHT={400} backgroundColor={colors.white}>
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
            Reseñas sobre Marcos Marcos
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                backgroundColor: Colors.white,
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}>
              <View style={{flexDirection: 'row', marginBottom: 8}}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} style={{marginRight: 10}} />
                ))}
              </View>
              <Text
                style={[
                  Typography.f_16_inter_regular,
                  {color: Colors.black, marginBottom: 12, lineHeight: 24},
                ]}>
                Marcos fue puntual en la recogida y devolución. Cuidó bien la
                bici y la dejó limpia. Solo faltó un poco de comunicación en la
                entrega, pero todo bien en general.
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 4,
                }}>
                <Image
                  source={user.avatar}
                  style={styles.avatarSmall}
                  resizeMode="contain"
                />
                <View>
                  <Text
                    style={[
                      Typography.f_14_inter_semi_bold,
                      {color: Colors.black, marginRight: 8},
                    ]}>
                    Nombre Apellido
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
                      4.8
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                backgroundColor: Colors.white,
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
                marginTop: 20,
                marginBottom: 100,
              }}>
              <View style={{flexDirection: 'row', marginBottom: 8}}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} style={{marginRight: 10}} />
                ))}
              </View>
              <Text
                style={[
                  Typography.f_16_inter_regular,
                  {color: Colors.black, marginBottom: 12, lineHeight: 24},
                ]}>
                Marcos fue puntual en la recogida y devolución. Cuidó bien la
                bici y la dejó limpia. Solo faltó un poco de comunicación en la
                entrega, pero todo bien en general.
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 4,
                }}>
                <Image
                  source={user.avatar}
                  style={styles.avatarSmall}
                  resizeMode="contain"
                />
                <View>
                  <Text
                    style={[
                      Typography.f_14_inter_semi_bold,
                      {color: Colors.black, marginRight: 8},
                    ]}>
                    Nombre Apellido
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
                      4.8
                    </Text>
                  </View>
                </View>
              </View>
            </View>
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
