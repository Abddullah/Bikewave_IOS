import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import AppStatusBar from '../../components/AppStatusBar';
import Colors from '../../utilities/constants/colors';
import { CrossBlack, Next, Prev } from '../../assets/svg';
import { Typography } from '../../utilities/constants/constant.style';
import AppButton from '../../components/AppButton';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import DropShadow from 'react-native-drop-shadow';
import { DEFAULT_LANGUAGE } from '../../utilities';
import { useTranslation } from 'react-i18next';
import { setFilters } from '../../redux/features/main/mainSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBicycles } from '../../redux/features/main/mainThunks';

export default function DateFilter({ navigation }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [markedDates, setMarkedDates] = useState({});
  const [isLocaleReady, setIsLocaleReady] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { dateFrom, dateEnd } = useSelector(state => state.main.filters);

  useEffect(() => {
    if (dateFrom && dateEnd) {
      const startDate = new Date(dateFrom);
      const endDate = new Date(dateEnd);
      let newMarkedDates = {};

      while (startDate <= endDate) {
        const dateString = startDate.toISOString().split('T')[0];
        if (dateString === new Date(dateFrom).toISOString().split('T')[0]) {
          newMarkedDates[dateString] = {
            startingDay: true,
            color: Colors.primary,
            textColor: Colors.white,
          };
        } else if (
          dateString === new Date(dateEnd).toISOString().split('T')[0]
        ) {
          newMarkedDates[dateString] = {
            endingDay: true,
            color: Colors.primary,
            textColor: Colors.white,
          };
        } else {
          newMarkedDates[dateString] = {
            color: Colors.primary,
            textColor: Colors.white,
          };
        }
        startDate.setDate(startDate.getDate() + 1);
      }
      setMarkedDates(newMarkedDates);
    }
  }, [dateFrom, dateEnd]);

  useEffect(() => {
    if (
      t('calendarData.monthNames') &&
      t('calendarData.monthNamesShort') &&
      t('calendarData.dayNames') &&
      t('calendarData.dayNamesShort') &&
      t('calendarData.today')
    ) {
      LocaleConfig.locales[DEFAULT_LANGUAGE] = {
        monthNames: t('calendarData.monthNames', { returnObjects: true }),
        monthNamesShort: t('calendarData.monthNamesShort', {
          returnObjects: true,
        }),
        dayNames: t('calendarData.dayNames', { returnObjects: true }),
        dayNamesShort: t('calendarData.dayNamesShort', { returnObjects: true }),
        today: t('calendarData.today'),
      };
      LocaleConfig.defaultLocale = DEFAULT_LANGUAGE;
      setIsLocaleReady(true);
    }
  }, [DEFAULT_LANGUAGE]);

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const formatMonthYear = date => {
    const month =
      LocaleConfig.locales[DEFAULT_LANGUAGE]?.monthNames?.[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  const onDayPress = day => {
    if (
      Object.keys(markedDates).length === 0 ||
      Object.keys(markedDates).length === 4
    ) {
      setMarkedDates({
        [day.dateString]: {
          startingDay: true,
          color: Colors.primary,
          textColor: Colors.white,
        },
      });
    } else {
      const startDate = Object.keys(markedDates)[0];
      let newMarkedDates = {};
      let currentDate = new Date(startDate);
      const endDate = new Date(day.dateString);

      while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split('T')[0];
        if (dateString === startDate) {
          newMarkedDates[dateString] = {
            startingDay: true,
            color: Colors.primary,
            textColor: Colors.white,
          };
        } else if (dateString === day.dateString) {
          newMarkedDates[dateString] = {
            endingDay: true,
            color: Colors.primary,
            textColor: Colors.white,
          };
        } else {
          newMarkedDates[dateString] = {
            color: Colors.primary,
            textColor: Colors.white,
          };
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      setMarkedDates(newMarkedDates);
    }
  };

  const handleApplyFilter = () => {
    const dates = Object.keys(markedDates);
    if (dates.length > 1) {
      const dateFrom = new Date(dates[0]).toISOString();
      const dateEnd = new Date(dates[dates.length - 1]).toISOString();

      dispatch(
        setFilters({
          dateFrom: dateFrom,
          dateEnd: dateEnd,
        }),
      );
    }
    dispatch(
      getAllBicycles({
        category: '',
      }),
    );
    navigation.navigate('Home');
  };

  return (
    <View style={styles.safeAreaContainer}>
      <AppStatusBar />
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{t('choose_date')}</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Home')}>
          <CrossBlack />
        </TouchableOpacity>
      </View>
      <DropShadow style={styles.calendarShadow}>
        <View style={styles.calendarContainer}>
          {isLocaleReady && (
            <Calendar
              key={currentDate.toISOString()}
              hideExtraDays={true}
              onDayPress={onDayPress}
              theme={{
                ...styles.calendarTheme,
                'stylesheet.calendar.header': {
                  dayHeader: {
                    ...Typography.f_14_inter_semi_bold,
                    color: Colors.black,
                  },
                },
              }}
              hideArrows={true}
              current={currentDate.toISOString().split('T')[0]}
              markedDates={markedDates}
              markingType={'period'}
              renderHeader={() => (
                <View style={styles.calendarHeader}>
                  <Text style={styles.calendarHeaderText}>
                    {formatMonthYear(currentDate)}
                  </Text>
                  <View style={styles.monthNavigation}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.arrowContainer}
                      onPress={handlePrevMonth}>
                      <Prev />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleNextMonth}
                      activeOpacity={0.8}
                      style={styles.arrowContainer}
                    >
                      <Next />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </DropShadow>
      <AppButton
        title={t('apply_filter')}
        btnColor={Colors.primary}
        btnTitleColor={Colors.white}
        onPress={handleApplyFilter}
        style={styles.applyButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  headerTitle: {
    ...Typography.f_24_inter_bold,
    color: Colors.black,
  },
  calendarShadow: {
    shadowColor: Colors.gray,
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  calendarContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 10,
  },
  calendarTheme: {
    todayTextColor: Colors.primary,
    dayTextColor: Colors.black,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  calendarHeaderText: {
    ...Typography.f_20_inter_bold,
    color: Colors.black,
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  applyButton: {
    marginTop: 35,
  },

  arrowContainer: {
    height: 30,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

});
