import {useState, useEffect} from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {useTranslation} from 'react-i18next';
import Colors from '../utilities/constants/colors';
import {Typography} from '../utilities/constants/constant.style';
import {DEFAULT_LANGUAGE} from '../utilities';
import {Next, PrevGray} from '../assets/svg';

const DateRangePickerModal = ({
  visible,
  onClose,
  onSelectRange,
  existingBookings = [],
}) => {
  const {t} = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isLocaleReady, setIsLocaleReady] = useState(false);

  useEffect(() => {
    if (
      t('calendarData.monthNames') &&
      t('calendarData.monthNamesShort') &&
      t('calendarData.dayNames') &&
      t('calendarData.dayNamesShort') &&
      t('calendarData.today')
    ) {
      LocaleConfig.locales[DEFAULT_LANGUAGE] = {
        monthNames: t('calendarData.monthNames', {returnObjects: true}),
        monthNamesShort: t('calendarData.monthNamesShort', {
          returnObjects: true,
        }),
        dayNames: t('calendarData.dayNames', {returnObjects: true}),
        dayNamesShort: t('calendarData.dayNamesShort', {returnObjects: true}),
        today: t('calendarData.today'),
      };
      LocaleConfig.defaultLocale = DEFAULT_LANGUAGE;
      setIsLocaleReady(true);
    }
  }, [t]);

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
    if (isDateDisabled(day.dateString)) {
      return;
    }
    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString);
      setEndDate(null);
    } else if (day.dateString > startDate) {
      setEndDate(day.dateString);
    } else {
      setStartDate(day.dateString);
      setEndDate(null);
    }
  };

  const isDateDisabled = date => {
    return existingBookings.some(booking => {
      const bookingStart = new Date(booking.dateFrom);
      const bookingEnd = new Date(booking.dateEnd);
      const checkDate = new Date(date);
      return checkDate >= bookingStart && checkDate <= bookingEnd;
    });
  };

  const getMarkedDates = () => {
    const markedDates = {};

    existingBookings.forEach(booking => {
      const start = new Date(booking.dateFrom);
      const end = new Date(booking.dateEnd);
      for (
        let date = new Date(start);
        date <= end;
        date.setDate(date.getDate() + 1)
      ) {
        const dateString = date.toISOString().split('T')[0];
        markedDates[dateString] = {disabled: true, disableTouchEvent: true};
      }
    });

    if (startDate) {
      markedDates[startDate] = {
        ...markedDates[startDate],
        startingDay: true,
        color: Colors.primary,
        textColor: Colors.white,
      };
    }
    if (endDate) {
      markedDates[endDate] = {
        ...markedDates[endDate],
        endingDay: true,
        color: Colors.primary,
        textColor: Colors.white,
      };
    }
    if (startDate && endDate) {
      const currentDate = new Date(startDate);
      const lastDate = new Date(endDate);
      while (currentDate < lastDate) {
        currentDate.setDate(currentDate.getDate() + 1);
        const dateString = currentDate.toISOString().split('T')[0];
        if (dateString !== endDate && !markedDates[dateString]?.disabled) {
          markedDates[dateString] = {
            ...markedDates[dateString],
            color: Colors.primary,
            textColor: Colors.white,
          };
        }
      }
    }
    return markedDates;
  };

  const todayDateString = new Date().toISOString().split('T')[0];

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t('select_date_range')}</Text>
          {isLocaleReady && (
            <Calendar
              key={currentDate.toISOString()}
              hideExtraDays={true}
              onDayPress={onDayPress}
              markedDates={getMarkedDates()}
              markingType={'period'}
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
              minDate={todayDateString}
              renderHeader={() => (
                <View style={styles.calendarHeader}>
                  <Text style={styles.calendarHeaderText}>
                    {formatMonthYear(currentDate)}
                  </Text>
                  <View style={styles.monthNavigation}>
                    <TouchableOpacity activeOpacity={0.8}>
                      <PrevGray />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleNextMonth}
                      activeOpacity={0.8}>
                      <Next />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.button}
              onPress={onClose}>
              <Text style={styles.buttonText}>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.button, styles.applyButton]}
              onPress={() => onSelectRange(startDate, endDate)}
              disabled={!startDate || !endDate}>
              <Text style={[styles.buttonText, styles.applyButtonText]}>
                {t('apply')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    width: '90%',
  },
  modalTitle: {
    ...Typography.f_20_inter_bold,
    color: Colors.black,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  buttonText: {
    ...Typography.f_16_inter_medium,
    color: Colors.primary,
    textAlign: 'center',
  },
  applyButton: {
    backgroundColor: Colors.primary,
  },
  applyButtonText: {
    color: Colors.white,
  },
  calendarTheme: {
    todayTextColor: Colors.primary,
    dayTextColor: Colors.black,
    textDayFontFamily: Platform.OS === 'ios' ? null : 'Inter-Regular',
    textMonthFontFamily: Platform.OS === 'ios' ? null : 'Inter-Bold',
    textDayHeaderFontFamily: Platform.OS === 'ios' ? null : 'Inter-Medium',
    textDisabledColor: Colors.gray,
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
    gap: 30,
  },
});

export default DateRangePickerModal;
