import React, {useState,useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AppStatusBar from '../../components/AppStatusBar';
import {Typography} from '../../utilities/constants/constant.style';
import Colors from '../../utilities/constants/colors';
import TabBar from '../../components/TabBar';
import {PrevWhite} from '../../assets/svg';
import ReservationCard from '../../components/ReservationCard';
import { useTranslation } from 'react-i18next';

export default function Record({navigation}) {
  const [activeTab, setActiveTab] = useState('record');
  const {  t } = useTranslation();

  useEffect(() => {
    setActiveTab('record');
  }, [activeTab]);


  const tabs = [
    {
      key: 'earrings',
      label: t('earrings'),
      navTarget: {screen: 'Earrings'},
    },
    {
      key: 'confirmed',
      label: t('confirmed'),
      navTarget: {screen: 'Confirmed'},
    },
    {
      key: 'record',
      label: t('record'),
      navTarget: {screen: 'Record'},
    },
  ];

  return (
    <View style={styles.container}>
      <AppStatusBar />
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <PrevWhite />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('reservations_owner')}</Text>
      </View>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}>
        <View style={styles.mainContent}>
          <ReservationCard
            brand={'Brand'}
            model={'Explorer X1'}
          />
          <ReservationCard
            brand={'Brand'}
            model={'Explorer X1'}
          />
          <ReservationCard
            brand={'Brand'}
            model={'Explorer X1'}
          />
          <ReservationCard
            brand={'Brand'}
            model={'Explorer X1'}
          />
        </View>
      </ScrollView>
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
    gap: 25,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: Colors.white,
    ...Typography.f_20_inter_semi_bold,
  },
  scrollContainer: {
    marginTop: -30,
  },
  mainContent: {
    gap: 20,
    paddingBottom: 20,
  },
});
