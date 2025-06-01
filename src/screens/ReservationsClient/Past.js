import React, {useState, useRef,useEffect} from 'react';
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
import ProductCard from '../../components/ProductCard';
import ReservationCard from '../../components/ReservationCard';
import BottomSheet from '../../components/BottomSheet';
import AppButton from '../../components/AppButton';
import Images from '../../assets/images';
import { useTranslation } from 'react-i18next';

export default function Past({navigation}) {
  const {  t } = useTranslation();
  const [activeTab, setActiveTab] = useState('past');
  const refRBSheet = useRef();

  const openBottomSheet = () => {
    if (refRBSheet.current) {
      refRBSheet.current.open();
    }
  };

  useEffect(() => {
    setActiveTab('past');
  }, [activeTab]);


  const tabs = [
    {
      key: 'in_progress',
      label: t('in_progress'),
      navTarget: {screen: 'InProgress'},
    },
    {
      key: 'past',
      label: t('past'),
      navTarget: {screen: 'Past'},
    },
  ];

  return (
    <View style={styles.container}>
      <AppStatusBar />
      <View style={styles.headerContainer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.goBack()}>
          <PrevWhite />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('reservations')}</Text>
        <Text />
      </View>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.mainScrollView}>
        <View style={styles.productListContainer}>
          <ReservationCard
            brand={'Brand'}
            model={'Explorer X1'}
            onPress={openBottomSheet}
          />
          <ReservationCard
            brand={'Brand'}
            model={'Explorer X1'}
            onPress={openBottomSheet}
          />
        </View>
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
            <ProductCard
              brand={`${t('brand_value')}`}
              model={`${t('model_value')}`}
              location={'Madrid'}
              price={'50'}
              rating={'4.8'}
              image={Images.bicycle}
            />
            <AppButton
              title={t('reserve')}
              btnColor={Colors.white}
              btnTitleColor={Colors.primary}
              style={styles.reserveButton}
              onPress={()=>navigation.navigate('Step1')}
            />
          </ScrollView>
        </BottomSheet>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    backgroundColor: Colors.primary,
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: Colors.white,
    ...Typography.f_20_inter_semi_bold,
  },
  mainScrollView: {
    marginTop: -30,
  },
  productListContainer: {
    gap: 20,
    paddingBottom: 20,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  bottomSheetTitle: {
    color: Colors.white,
    ...Typography.f_20_inter_semi_bold,
  },
  reserveButton: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
});
