import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import Colors from '../utilities/constants/colors';
import {Typography} from '../utilities/constants/constant.style';
import {DEFAULT_LANGUAGE} from '../utilities';
import screenResolution from '../utilities/constants/screenResolution';
import { RFValue } from 'react-native-responsive-fontsize';

export default function ProfileHeader({user}) {
  return (
    <View style={styles.shadowContainer}>
      <Image source={user.avatar} style={styles.avatar} resizeMode="contain" />
      <View style={styles.detailsContainer}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userBio}>{user.bio[DEFAULT_LANGUAGE]}</Text>
      </View>
    </View>
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
    padding:10,
    flexDirection: 'row',
    marginTop: -25,
    width: '90%',
    alignSelf: 'center',
    gap:10,
  },
  avatar: {
    borderRadius: 15,
    width:104,
    height:104
  },
  detailsContainer: {
    flex:1
      },
  userName: {
    ...Typography.f_18_inter_semi_bold,
    color: Colors.black,
    top:RFValue(-6, screenResolution.screenHeight)
  },
  userBio: {
    color: Colors.black,
    ...Typography.f_12_inter_regular,
    top:RFValue(-6, screenResolution.screenHeight)
  },
});
