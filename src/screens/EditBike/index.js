import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Colors from '../../utilities/constants/colors';
import images from '../../assets/images';
import AppTextInput from '../../components/AppTextInput';
import { Typography } from '../../utilities/constants/constant.style';
import AppStatusBar from '../../components/AppStatusBar';
import {
  CityGreen,
  DropDown,
  Edit,
  PrevWhite,
  AllGreen,
  RoadGreen,
  MountainGreen,
  GravelGreen,
  ElectricalGreen,
  Competition,
  Component,
  DropUp,
} from '../../assets/svg';

import CheckBox from '@react-native-community/checkbox';
import RNCheckBox from 'react-native-check-box';
import AppButton from '../../components/AppButton';
import { useTranslation } from 'react-i18next';
import BottomSheet from '../../components/BottomSheet';
import { deleteBicycle, getAllBicycles, updateBicycle } from '../../redux/features/main/mainThunks';
import { useDispatch, useSelector } from 'react-redux';
import { selectMainLoading } from '../../redux/features/main/mainSelectors';
import { launchImageLibrary } from 'react-native-image-picker';
import { fetchUserInfo } from '../../redux/features/auth/authThunks';
import { selectAuthUserId } from '../../redux/features/auth/authSelectors';

const categories = [
  { id: 1, icon: AllGreen, label: { en: 'All', sp: 'Todos' } },
  { id: 2, icon: RoadGreen, label: { en: 'Road', sp: 'Carretera' } },
  { id: 3, icon: CityGreen, label: { en: 'City', sp: 'Ciudad' } },
  { id: 4, icon: MountainGreen, label: { en: 'Mountain', sp: 'Montaña' } },
  { id: 5, icon: GravelGreen, label: { en: 'Gravel', sp: 'Gravel' } },
  { id: 6, icon: ElectricalGreen, label: { en: 'Electrical', sp: 'Electrica' } },
  { id: 7, icon: Competition, label: { en: 'Competition', sp: 'Competición' } },
  { id: 8, icon: Component, label: { en: 'Component', sp: 'Componente' } },
];

export default function EditBike({ route, navigation }) {
  const [categoryDropDown, setCategoryDropDown] = useState(false);
  const selectedBike = route.params?.bike;
  const [selectedCategory, setSelectedCategory] = useState(
    selectedBike?.category,
  );
  const [selectedCategoryIcon, setSelectedCategoryIcon] = useState(
    categories.find(c => c.label.en === selectedBike?.category)?.icon ||
    CityGreen,
  );
  console.log(selectedBike, 'selectedBike');
  const dispatch = useDispatch();
  const loading = useSelector(selectMainLoading);
  const user_id = useSelector(selectAuthUserId);
  const { t, i18n } = useTranslation();
  const refRBSheet = useRef();

  const handleCategorySelect = category => {
    setSelectedCategory(category.label[i18n.language === 'en' ? 'en' : 'sp']);
    setSelectedCategoryIcon(category.icon);
    setCategoryDropDown(false);
  };

  const openBottomSheet = () => {
    if (refRBSheet.current) {
      refRBSheet.current.open();
    }
  };

  const [formData, setFormData] = useState({
    brand: selectedBike?.brand || '',
    model: selectedBike?.model || '',
    description: selectedBike?.description || '',
    category: selectedBike?.category || '',
    location: selectedBike?.location || '',
    price: selectedBike?.price || '',
    deposit: selectedBike?.deposit | '',
    photo: selectedBike?.image?.uri ? selectedBike?.image : images.bicycle,
  });

  console.log(selectedCategory, 'cate');

  console.log(formData, 'FORM');

  const handleSave = async () => {
    try {
      const res = await dispatch(
        updateBicycle({
          bicycleId: selectedBike.id,
          formData: {
            ...formData,
            category: selectedCategory,
            photo: formData.photo.uri || selectedBike.image,
          },
        }),
      );
      await dispatch(getAllBicycles({ category: '', }));
      await dispatch(fetchUserInfo(user_id));

      if (res?.meta?.requestStatus === 'fulfilled') {
        navigation.navigate('Profile1');
      } else {
        console.error('Failed to update bike');
      }
    } catch (error) {
      console.error('Error updating bike:', error.message);
    }
  };

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo', includeBase64: false }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const selectedImage = response.assets[0].uri;
        setFormData({ ...formData, photo: { uri: selectedImage } });
      }
    });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <AppStatusBar />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}>
          <PrevWhite />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('edit_bike')}</Text>
        <Text />
      </View>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <Image
            source={
              formData.photo?.uri
                ? { uri: formData.photo.uri }
                : selectedBike?.image?.uri
                  ? { uri: selectedBike.image.uri }
                  : images.bicycle
            }
            style={styles.bikeImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.editIcon}
            activeOpacity={0.8}
            onPress={handleImagePick}>
            <Edit />
          </TouchableOpacity>
        </View>
        <View style={styles.form}>
          <View style={styles.formField}>
            <Text style={styles.label}>
              {t('brand')} <Text style={styles.required}>*</Text>
            </Text>
            <AppTextInput
              placeholder={t('brand_placeholder')}
              value={formData.brand}
              onChangeText={text => setFormData({ ...formData, brand: text })}
            />
          </View>
          <View style={styles.formField}>
            <Text style={styles.label}>
              {t('model')} <Text style={styles.required}>*</Text>
            </Text>
            <AppTextInput
              placeholder={t('model_placeholder')}
              value={formData.model}
              onChangeText={text => setFormData({ ...formData, model: text })}
            />
          </View>
          <View style={styles.formField}>
            <Text style={styles.label}>{t('description')}</Text>
            <AppTextInput
              placeholder={t('description_placeholder')}
              value={formData.description}
              onChangeText={text =>
                setFormData({ ...formData, description: text })
              }
              multiline
              numberOfLines={4}
              fieldStyle={{ textAlignVertical: 'top' }}
            />
          </View>
          <View style={styles.formField}>
            <Text style={[styles.label, { marginBottom: 0 }]}>
              {t('category')} <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                {
                  borderBottomLeftRadius: categoryDropDown ? 0 : 8,
                  borderBottomRightRadius: categoryDropDown ? 0 : 8,
                },
              ]}
              activeOpacity={0.8}
              onPress={() => setCategoryDropDown(!categoryDropDown)}>
              {selectedCategoryIcon}
              <Text style={styles.categoryText}>{selectedCategory}</Text>
              {categoryDropDown ? <DropDown /> : <DropDown />}
            </TouchableOpacity>
          </View>
          {categoryDropDown && (
            <View style={styles.dropdownMenu}>
              {categories.map(category => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={category.id}
                  style={styles.dropdownItem}
                  onPress={() => handleCategorySelect(category)}>
                  <category.icon />
                  <Text style={styles.dropdownItemText}>
                    {category.label[i18n.language === 'en' ? 'en' : 'sp']}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <View style={styles.formField}>
            <Text style={styles.label}>
              {t('direction')} <Text style={styles.required}>*</Text>
            </Text>
            <AppTextInput
              placeholder={t('direction_placeholder')}
              value={formData.location}
              onChangeText={text => setFormData({ ...formData, location: text })}
            />
          </View>
          <View style={styles.formField}>
            <Text style={styles.label}>
              {t('price_per_day')} <Text style={styles.required}>*</Text>
            </Text>
            <AppTextInput
              placeholder={t('price_per_day_placeholder')}
              value={formData.price}
              onChangeText={text => setFormData({ ...formData, price: text })}
            />
          </View>
          <View>
            <View style={styles.depositContainer}>
              {Platform.OS === 'ios' ? (
                <RNCheckBox
                  onClick={() => {
                    if (formData.deposit > 0) {
                      setFormData({ ...formData, deposit: 0 });
                    } else {
                      setFormData({ ...formData, deposit: formData.deposit || 0 });
                    }
                  }}
                  isChecked={formData.deposit > 0}
                  checkBoxColor={Colors.primary}
                />
              ) : (
                <CheckBox
                  tintColors={{ true: Colors.primary, false: Colors.primary }}
                  value={formData.deposit > 0}
                  onValueChange={value => {
                    if (!value) {
                      setFormData({ ...formData, deposit: 0 });
                    } else {
                      setFormData({ ...formData, deposit: formData.deposit || 0 });
                    }
                  }}
                />
              )}
              <Text style={[styles.label, { marginBottom: 0 }]}>{t('bill')}</Text>
            </View>
            <AppTextInput
              placeholder={t('bill_placeholder')}
              value={formData.deposit ? formData.deposit.toString() : ''}
              onChangeText={text => setFormData({ ...formData, deposit: text })}
              style={{ marginTop: 6 }}
              keyboardType="numeric"
            />
            <Text
              style={[
                styles.depositDescription,
                { color: formData.deposit > 0 ? Colors.black : Colors.gray },
              ]}>
              {t('deposit_text')}
            </Text>
          </View>
          <Text
            onPress={openBottomSheet}
            style={{
              ...Typography.f_14_inter_medium,
              color: Colors.primary,
              textDecorationLine: 'underline',
              textDecorationColor: Colors.primary,
            }}>
            {t('eliminate_bike')}
          </Text>
          <AppButton
            title={
              loading ? <ActivityIndicator color={Colors.white} /> : t('keep')
            }
            btnColor={Colors.primary}
            btnTitleColor={Colors.white}
            onPress={handleSave}
            style={{ marginTop: 10 }}
          />
        </View>
        <BottomSheet ref={refRBSheet} HEIGHT={450}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.bottomSheetContentWrapper}>
              <Text style={styles.confirmTitle}>{t('del_bike_title')}</Text>
              <Text style={styles.confirmMessage}>{t('del_bike_msg')}</Text>
              <View style={styles.bottomSheetButtonWrapper}>
                <AppButton
                  title={t('cancel')}
                  btnTitleColor={Colors.white}
                  style={styles.cancelButton}
                  onPress={() => {
                    if (refRBSheet.current) {
                      refRBSheet.current.close();
                    }
                  }}
                />
                <AppButton
                  title={t('eliminate')}
                  btnColor={Colors.white}
                  btnTitleColor={Colors.primary}
                  onPress={async () => {
                    if (refRBSheet.current) {
                      refRBSheet.current.close();
                      const res = await dispatch(deleteBicycle(selectedBike.id));
                      await dispatch(getAllBicycles({ category: '', }));
                      await dispatch(fetchUserInfo(user_id));
                      if (res?.meta?.requestStatus === 'fulfilled') {
                        navigation.navigate('Profile1');
                      } else {
                        console.error('Failed to update bike');
                      }
                      // dispatch(deleteBicycle(selectedBike.id));

                    }
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </BottomSheet>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: Colors.white,
    ...Typography.f_20_inter_semi_bold,
  },
  bikeImage: {
    height: 350,
    margin: 20,
    borderRadius: 12,
    width: '93%',
    alignSelf: 'center',
  },
  editIcon: {
    position: 'absolute',
    right: 0,
    padding: 30,
    top: 5,
  },
  form: {
    gap: 15,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  formField: {
    gap: 12,
  },
  label: {
    ...Typography.f_18_inter_semi_bold,
    color: Colors.black,
    marginBottom: -18,
  },
  required: {
    color: Colors.error,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 0.3,
    borderColor: Colors.gray,
    borderRadius: 8,
    gap: 15,
  },
  categoryText: {
    flex: 1,
    color: Colors.black,
    ...Typography.f_18_inter_regular,
  },
  depositContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  depositDescription: {
    ...Typography.f_12_inter_regular,
    marginTop: 10,
  },
  bottomSheetContentWrapper: {
    padding: 20,
  },
  confirmTitle: {
    ...Typography.f_18_inter_semi_bold,
    color: Colors.white,
    lineHeight: 21,
  },
  confirmMessage: {
    ...Typography.f_16_inter_regular,
    color: Colors.white,
    lineHeight: 24,
    marginTop: 10,
  },
  bottomSheetButtonWrapper: {
    gap: 10,
    marginTop: 35,
  },
  cancelButton: {
    borderWidth: 0.5,
    borderColor: Colors.white,
  },
  dropdownMenu: {
    padding: 10,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginTop: -22,
    borderWidth: 0.3,
    borderTopWidth: 0,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  dropdownItemText: {
    color: Colors.black,
    ...Typography.f_16_inter_medium,
    marginLeft: 10,
  },
});
