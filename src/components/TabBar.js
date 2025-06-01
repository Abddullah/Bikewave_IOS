import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Colors from '../utilities/constants/colors';
import {Typography} from '../utilities/constants/constant.style';

export default function TabBar({tabs, activeTab, onTabChange}) {
  return (
    <View style={styles.container}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.key}
          activeOpacity={0.8}
          style={styles.tab}
          onPress={() => onTabChange(tab.key)}>
          <Text
            style={[
              styles.tabText,
              {color: activeTab === tab.key ? Colors.white : '#ffffff40'},
            ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent:"space-between",
    backgroundColor: Colors.primary,
    paddingBottom: 30,
    paddingHorizontal:40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  tab: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    ...Typography.f_20_inter_semi_bold,
    fontWeight: '700',
  },
});
