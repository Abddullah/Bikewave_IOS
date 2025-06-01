import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Colors from '../utilities/constants/colors';
import {Edit, Location, Star} from '../assets/svg';
import {useTranslation} from 'react-i18next';
import {Typography} from '../utilities/constants/constant.style';
import {useDispatch} from 'react-redux';
import {deleteBicycle} from '../redux/features/main/mainThunks';
import {useNavigation} from '@react-navigation/native';

export default function BikeCard({bike, promote, onDelete}) {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const handleDelete = async () => {
    // dispatch(deleteBicycle(bike.id));
    setModalVisible(false);
    // if (onDelete) {
    //   onDelete();
    // }
  };
  return (
    <View style={styles.shadowContainer}>
      <View style={styles.card}>
        <View>
          <Image source={bike.image} style={styles.image} resizeMode="cover" />
          <View style={styles.details}>
            <View style={styles.rowContainer}>
              <Text style={styles.brand}>{bike.brand}</Text>
              <Text style={styles.price}>
                {bike.price}€{t('per_day')}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.model}>{bike.model}</Text>
              <View style={styles.location}>
                <Location />
                <Text style={styles.locationText}>{bike.location}</Text>
              </View>
            </View>
            {/* <View style={styles.ratingContainer}>
              <Star />
              <Text style={styles.rating}>{bike.rating}</Text>
            </View> */}
          </View>
        </View>
        {promote && (
          <TouchableOpacity
            onPress={() => navigation.navigate('HighlightBike')}
            style={styles.promoteButton}
            activeOpacity={0.8}>
            <Text style={styles.promoteText}>{t('promote')}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.btnView}>
        <TouchableOpacity
          activeOpacity={0.8}
          // style={styles.btn}
          onPress={() => navigation.navigate('EditBike', {bike})}>
          <Edit />
        </TouchableOpacity>
        {/* <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setModalVisible(true)}
          style={styles.btn}>
          <DeleteIcon />
        </TouchableOpacity> */}
      </View>
      {/* <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{t('confirm_delete')}</Text>
            <Text style={styles.modalText}>{t('delete_warning')}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.modalButton, styles.okButton]}
                onPress={handleDelete}>
                <Text style={styles.okText}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}
    </View>
  );
}

const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: 10,
  },
  card: {
    overflow: 'hidden',
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 130,
  },
  details: {
    padding: 8,
    gap: 2,
  },
  brand: {
    ...Typography.f_14_inter_semi_bold,
    color: Colors.black,
    width: '48%',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  model: {
    ...Typography.f_12_inter_medium,
    color: Colors.black,
    width: '48%',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    width: '48%',
  },
  locationText: {
    ...Typography.f_12_inter_medium,
    color: Colors.black,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rating: {
    ...Typography.f_12_inter_medium,
    color: Colors.black,
    flex: 1,
  },
  price: {
    ...Typography.f_14_inter_semi_bold,
    color: Colors.black,
    width: '48%',
  },
  promoteButton: {
    backgroundColor: Colors.primary,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginHorizontal: 8,
  },
  promoteText: {
    color: Colors.white,
    ...Typography.f_14_inter_bold,
  },
  btnView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    position: 'absolute',
    padding: 10,
    alignSelf: 'flex-end',
  },
  btn: {
    paddingVertical: 5,
    paddingHorizontal: 13,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBox: {
    width: '80%',
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    ...Typography.f_16_inter_bold,
    marginBottom: 10,
    color: Colors.black,
  },
  modalText: {
    ...Typography.f_14_inter_medium,
    textAlign: 'center',
    marginBottom: 20,
    color: Colors.black,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: Colors.light_gray,
    marginRight: 5,
  },
  okButton: {
    backgroundColor: Colors.primary,
    marginLeft: 5,
  },
  cancelText: {
    color: Colors.black,
    ...Typography.f_14_inter_medium,
  },
  okText: {
    color: Colors.white,
    ...Typography.f_14_inter_medium,
  },
});
