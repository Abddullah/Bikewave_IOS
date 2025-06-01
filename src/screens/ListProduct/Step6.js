import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import AppButton from '../../components/AppButton';
import { ListProductHeader } from '../../components/ListProductHeader';
import Colors from '../../utilities/constants/colors';
import AppStatusBar from '../../components/AppStatusBar';

import ProductCard from '../../components/ProductCard';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectMainLoading } from '../../redux/features/main/mainSelectors';

export const Step6 = ({ formData, onFinish, onBack }) => {
  const { t } = useTranslation();
  const loading = useSelector(selectMainLoading);

  const steps = [
    t('steps.model'),
    t('steps.category'),
    t('steps.direction'),
    t('steps.photo'),
    t('steps.price'),
    t('steps.preview'),
  ];
  return (
    <View style={styles.container}>
      <AppStatusBar />
      <ListProductHeader
        title={`${t('summary')}`}
        onBack={onBack}
        currentStep={6}
        steps={steps}
        desc={`${t('product_preview_desc')}`}
        titleStyle={{ paddingLeft: 100 }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: -10 }}>
          <ProductCard
            brand={formData.brand}
            model={formData.model}
            location={JSON.parse(formData?.location)?.city || ""}
            price={formData.price}
            // rating={''}
            image={
              formData.photo && formData.photo.uri ? formData.photo.uri : null
            }
          />
        </View>
        <AppButton
          title={
            loading ? <ActivityIndicator color={Colors.white} /> : t('get_bike')
          }
          btnColor={Colors.primary}
          btnTitleColor={Colors.white}
          style={styles.getBikeBtn}
          onPress={onFinish}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  getBikeBtn: {
    marginHorizontal: 20,
    marginVertical: 40,
  },
});
