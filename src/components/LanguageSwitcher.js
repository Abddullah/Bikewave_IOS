import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Typography } from '../utilities/constants/constant.style';
import Colors from '../utilities/constants/colors';
import { appLanguages } from '../utilities/languageData/data';
import { onLanguageSelect } from '../utilities/languageData';
import { useTranslation } from 'react-i18next';

const MenuItem = ({ title, onPress, isSelected }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    style={styles.menuItemContainer}>
    <View style={styles.titleContainer}>
      <Text style={[styles.menuItemText, isSelected && styles.selectedText]}>
        {title}
      </Text>
    </View>
    {isSelected && <View style={styles.selectedDot} />}
  </TouchableOpacity>
);

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [flag, setFlag] = useState(false)
  return (
    <View style={styles.menuSectionContainer}>
      <View style={styles.menuCardContainer}>
        <Text style={styles.sectionTitleText}>{t('language_switch')}</Text>
        {appLanguages.map(lang => (
          <MenuItem
            key={lang.id}
            title={lang.name}
            isSelected={i18n.language === lang.code}
            onPress={() => {
              onLanguageSelect(lang.code, setFlag, flag)
            }}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  menuSectionContainer: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  menuCardContainer: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 15,
    gap: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,

    elevation: 8,
  },
  sectionTitleText: {
    ...Typography.f_18_inter_semi_bold,
    color: Colors.black,
  },
  menuItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    ...Typography.f_16_inter_medium,
    color: Colors.black,
    width: '80%',
  },
  selectedText: {
    color: Colors.primary,
    ...Typography.f_16_inter_semi_bold,
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
});
