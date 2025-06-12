import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { Step4 } from './Step4';
import { Step5 } from './Step5';
import { Step6 } from './Step6';
import { launchImageLibrary } from 'react-native-image-picker';
import { addBicycle, getAllBicycles } from '../../redux/features/main/mainThunks';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import PopUp from '../../components/PopUp';
import { Cross, Tick } from '../../assets/svg';
import { t } from 'i18next';
import { selectMainError } from '../../redux/features/main/mainSelectors';
import { selectApprovalStatus, selectUserDetails, selectAuthUserId } from '../../redux/features/auth/authSelectors';
import { fetchApprovedInfo, fetchUserInfo } from '../../redux/features/auth/authThunks';

export const AddBicycleWrapper = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [showApprovalPopup, setShowApprovalPopup] = useState(false);
  const approvalStatus = useSelector(selectUserDetails)?.isApproved;
  console.log(approvalStatus, 'approvalStatus');
  const user_id = useSelector(selectAuthUserId);

  useEffect(() => {
    dispatch(fetchUserInfo(user_id));
  }, [user_id, dispatch]);

  // useEffect(() => {
  //   if (approvalStatus === false) {
  //     setShowApprovalPopup(true);
  //   }
  // }, [approvalStatus]);

  const handleApprovalPopupClose = () => {
    navigation.navigate('MyDocuments');
    setShowApprovalPopup(false);
  };

  const [formData, setFormData] = useState({
    // brand: 'my new bike',
    // model: '2025',
    // description: 'this is my new bike description',
    // category: 'component',
    // location: '',
    // lng: '',
    // lat: '',
    // country: '',
    // city: '',
    // photo: null,
    // price: '20',
    // deposit: '10',
    brand: '',
    model: '',
    description: '',
    category: '',
    location: '',
    lng: '',
    lat: '',
    country: '',
    city: '',
    photo: null,
    price: '',
    deposit: '',
    myUserId: user_id,
  });
  console.log(formData, 'formData');

  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const error = useSelector(selectMainError)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNextStep = async () => {
    const approvalRes = await dispatch(fetchApprovedInfo(user_id));
    console.log(approvalRes, 'approvalRes')
    if (approvalRes.payload.isApproved) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowApprovalPopup(true);
    }
  };
  const handleBackStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleUpdateFormData = (key, value) => {
    if (key == 'location') {
      if (Object.keys(value).length > 0) {
        const location = value
        const obj = { ...formData, [key]: value, }
        const parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;
        obj.lat = parsedLocation.lat;
        obj.lng = parsedLocation.long;
        obj.city = parsedLocation.city;
        obj.country = parsedLocation.country;
        setFormData(obj);
      } else {
        if (value.length > 0) {
          const parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;
          const obj = { ...formData, [key]: value, }
          obj.lat = parsedLocation.lat;
          obj.lng = parsedLocation.long;
          obj.city = parsedLocation.city;
          obj.country = parsedLocation.country;
          setFormData(obj);
        }
      }
    } else {
      setFormData({ ...formData, [key]: value });
    }
  };

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        handleUpdateFormData('photo', {
          uri: selectedImage.uri,
          type: selectedImage.type,
          name: selectedImage.fileName,
        });
      }
    });
  };

  const closeSuccessPopup = async () => {
    await dispatch(getAllBicycles({ category: '', }));
    setShowSuccessPopup(false);
    navigation.navigate('Home');
  };

  const closeErrorPopup = async () => {
    await dispatch(getAllBicycles({ category: '', }));
    setShowErrorPopup(false);
    navigation.navigate('Home');
  };


  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            formData={formData}
            updateFormData={handleUpdateFormData}
            onNext={handleNextStep}
            onBack={handleBackStep}
          />
        );
      case 2:
        return (
          <Step2
            formData={formData}
            updateFormData={handleUpdateFormData}
            onNext={handleNextStep}
            onBack={handleBackStep}
          />
        );
      case 3:
        return (
          <Step3
            formData={formData}
            updateFormData={handleUpdateFormData}
            onNext={handleNextStep}
            onBack={handleBackStep}
          />
        );
      case 4:
        return (
          <Step4
            formData={formData}
            updateFormData={handleUpdateFormData}
            onNext={handleNextStep}
            onBack={handleBackStep}
            onImagePick={handleImagePicker}
          />
        );
      case 5:
        return (
          <Step5
            formData={formData}
            updateFormData={handleUpdateFormData}
            onNext={handleNextStep}
            onBack={handleBackStep}
          />
        );
      case 6:
        return (
          <Step6
            formData={formData}
            onBack={handleBackStep}
            onFinish={async () => {
              if (isSubmitting) return;
              try {
                setIsSubmitting(true);
                const approvalRes = await dispatch(fetchApprovedInfo(user_id));
                if (approvalRes.payload.isApproved) {
                  const response = await dispatch(addBicycle(formData));
                  if (response?.payload?.success) {
                    setCurrentStep(1)
                    setFormData({
                      brand: '',
                      model: '',
                      description: '',
                      category: '',
                      location: '',
                      lng: '',
                      lat: '',
                      country: '',
                      city: '',
                      photo: null,
                      price: '',
                      deposit: '',
                      myUserId: user_id,
                    })
                    dispatch(fetchUserInfo(user_id));

                    setShowSuccessPopup(true);
                  } else {
                    setShowErrorPopup(true);
                  }
                } else {
                  setShowErrorPopup(true);
                }
              } catch (error) {
                console.log('Error adding bicycle:', error);
              } finally {
                setIsSubmitting(false);
              }
            }}
          />
        );
      default:
        return null;
    }
  };


  return (
    <View style={{ flex: 1 }}>
      {showApprovalPopup ? (
        <PopUp
          icon={<Cross />}
          title={t('approval_required')}
          description={t('approval_required_msg')}
          iconPress={handleApprovalPopupClose}
          onButtonPress={handleApprovalPopupClose}
          buttonTitle={t('upload_documents')}
        />
      ) : showSuccessPopup ? (
        <PopUp
          icon={<Tick />}
          title={t('upload_bike_success')}
          description={t('upload_bike_success_msg')}
          iconPress={closeSuccessPopup}
          onButtonPress={closeSuccessPopup}
        />
      ) : showErrorPopup ? (
        <PopUp
          icon={<Cross />}
          title={t('something_went_wrong')}
          description={error || t('upload_bike_fail_msg')}
          iconPress={closeErrorPopup}
          onButtonPress={closeErrorPopup}
        />
      ) :
        renderStep()}

    </View>
  );
};
