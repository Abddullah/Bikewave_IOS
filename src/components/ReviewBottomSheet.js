import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Colors from '../utilities/constants/colors';
import { CrossBlack } from '../assets/svg';
import { Typography } from '../utilities/constants/constant.style';
import { colors } from '../utilities/constants';

const Star = ({ filled, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.starButton}>
    <Text style={[styles.star, filled ? styles.starFilled : styles.starEmpty]}>{filled ? '★' : '☆'}</Text>
  </TouchableOpacity>
);

export default function ReviewBottomSheet({ visible, onClose, onSubmit, bookingInfo }) {
  const { t, i18n } = useTranslation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const bike = bookingInfo?.bikeName || t('review.bike');
  const client = bookingInfo?.clientName || t('review.client');

  function renderDesc() {
    if (i18n.language === 'sp') {
      return (
        <Text style={styles.desc}>
          Tu bicicleta <Text style={Typography.f_14_inter_bold}>{bike}</Text> ha sido devuelta por <Text style={Typography.f_14_inter_bold}>{client}</Text>. Tu valoración ayudará a otros propietarios a tomar decisiones sobre sus alquileres.
        </Text>
      );
    }
    return (
      <Text style={styles.desc}>
        Your bike <Text style={Typography.f_14_inter_bold}>{bike}</Text> has been returned by <Text style={Typography.f_14_inter_bold}>{client}</Text>. Your rating will help other owners make decisions about their rentals.
      </Text>
    );
  }

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <CrossBlack/>
          </TouchableOpacity>
          <Text style={styles.title}>
            {t('review.how_was_experience', { client: bookingInfo?.clientName || t('review.client') })}
          </Text>
          {renderDesc()}
          <View style={styles.starsRow}>
            {[1,2,3,4,5].map(i => (
              <Star key={i} filled={i <= rating} onPress={() => setRating(i)} />
            ))}
          </View>
          <TextInput
            style={styles.input}
            placeholder={t('review.comment_placeholder')}
            placeholderTextColor={colors.gray}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: Colors.primary, opacity: rating ? 1 : 0.5 }]}
            onPress={() => rating && onSubmit({ rating, comment })}
            disabled={!rating}
          >
            <Text style={styles.submitText}>{t('review.submit')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.notNowBtn} onPress={onClose}>
            <Text style={styles.notNowText}>{t('review.not_now')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
  },
  title: {
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 12,
    ...Typography.f_18_inter_bold,
    color:colors.black
  },
  desc: {
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 16,
    ...Typography.f_14_inter_bold,
    lineHeight:22
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  starButton: {
    padding: 4,
  },
  star: {
    fontSize: 32,
  },
  starFilled: {
    color: Colors.primary,
  },
  starEmpty: {
    color: Colors.gray,
  },
  input: {
    width: '100%',
    minHeight: 60,
    borderRadius: 10,
    color:colors.black,
    backgroundColor:colors.white,
    padding: 10,
    marginBottom: 16,
    textAlignVertical: 'top',
   shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  submitBtn: {
    width: '100%',
    padding: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  notNowBtn: {
    width: '100%',
    padding: 14,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    marginBottom: 8,
  },
  notNowText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 