import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AppButton from '../../components/AppButton';
import {ListProductHeader} from '../../components/ListProductHeader';
import Colors from '../../utilities/constants/colors';
import AppStatusBar from '../../components/AppStatusBar';

import {Typography} from '../../utilities/constants/constant.style';
import {
  AllGreen,
  RoadGreen,
  CityGreen,
  MountainGreen,
  GravelGreen,
  ElectricalGreen,
  Competition,
  Component,
} from '../../assets/svg';
import {useTranslation} from 'react-i18next';

export const Step2 = ({formData, updateFormData, onNext, onBack}) => {
  const {t, i18n} = useTranslation();
  const currentLanguage = i18n.language === 'sp' ? 'sp' : 'en';
  const [error, setError] = useState('');

  const steps = [
    t('steps.model'),
    t('steps.category'),
    t('steps.direction'),
    t('steps.photo'),
    t('steps.price'),
    t('steps.preview'),
  ];

  const categories = [
    {id: 1, icon: AllGreen, label: {en: 'All', sp: 'Todos'}},
    {
      id: 2,
      icon: RoadGreen,
      label: {en: 'Road', sp: 'Carretera'},
    },
    {
      id: 3,
      icon: CityGreen,
      label: {en: 'City', sp: 'Ciudad'},
    },
    {
      id: 4,
      icon: MountainGreen,
      label: {en: 'Mountain', sp: 'Montaña'},
    },
    {
      id: 5,
      icon: GravelGreen,
      label: {en: 'Gravel', sp: 'Gravel'},
    },
    {
      id: 6,
      icon: ElectricalGreen,
      label: {en: 'Electrical', sp: 'Electrica'},
    },
    {
      id: 7,
      icon: Competition,
      label: {en: 'Competition', sp: 'Competición'},
    },
    {
      id: 8,
      icon: Component,
      label: {en: 'Component', sp: 'Componente'},
    },
  ];

  const handleNext = () => {
    if (!formData.category) {
      setError(t('validation.category_required'));
      setTimeout(() => {
        setError('');
      }, 3000);
      return;
    }
    setError('');
    onNext();
  };

  const handleCategorySelect = category => {
    updateFormData('category', category);
    if (error) setError(''); // Clear error when a category is selected
  };

  return (
    <View style={styles.container}>
      <AppStatusBar />
      <ListProductHeader
        title={``}
        currentStep={2}
        onBack={onBack}
        steps={steps}
        desc={`${t('select_category_description')}`}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.categoryContainer}>
          <Text style={styles.label}>
            {t('category')} <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.categoryListContainer}>
            {categories.map(({id, icon: Icon, label}) => {
              const isSelected =
                formData.category === label['en'].toLowerCase();
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={id}
                  style={[
                    styles.categoryItem,
                    isSelected && styles.selectedCategoryItem,
                  ]}
                  onPress={() =>
                    handleCategorySelect(label['en'].toLowerCase())
                  }>
                  <Icon />
                  <Text
                    style={[
                      styles.categoryLabel,
                      isSelected && styles.selectedCategoryLabel,
                    ]}>
                    {label[currentLanguage]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
        <AppButton
          title={t('following')}
          btnColor={Colors.primary}
          btnTitleColor={Colors.white}
          style={styles.followBtn}
          onPress={handleNext}
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
  label: {
    ...Typography.f_18_inter_semi_bold,
    color: Colors.black,
  },
  required: {
    color: Colors.error,
  },
  followBtn: {
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  categoryContainer: {
    paddingHorizontal: 20,
  },
  categoryShadow: {
    shadowColor: Colors.gray,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    marginTop: 10,
  },
  categoryListContainer: {
    backgroundColor: Colors.white,
    borderRadius: 17,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 11,
    padding: 10,
    gap: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    padding: 10,
    borderRadius: 10,
  },
  selectedCategoryItem: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  categoryLabel: {
    ...Typography.f_16_inter_regular,
    color: Colors.black,
  },
  selectedCategoryLabel: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 5,
    marginBottom: 5,
  },
});
