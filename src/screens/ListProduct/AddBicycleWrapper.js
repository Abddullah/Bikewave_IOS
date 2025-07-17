import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { Step4 } from './Step4';
import { Step5 } from './Step5';
import { Step6 } from './Step6';
import { launchImageLibrary } from 'react-native-image-picker';
import { addBicycle, getAllBicycles, checkAccount, validateUser } from '../../redux/features/main/mainThunks';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import PopUp from '../../components/PopUp';
import { Cross, Tick } from '../../assets/svg';
import { t } from 'i18next';
import { selectMainError } from '../../redux/features/main/mainSelectors';
import { selectApprovalStatus, selectUserDetails, selectAuthUserId } from '../../redux/features/auth/authSelectors';
import { fetchApprovedInfo, fetchUserInfo } from '../../redux/features/auth/authThunks';
import { getItem } from '../../services/assynsStorage';

export const AddBicycleWrapper = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [showApprovalPopup, setShowApprovalPopup] = useState(false);
  const [showAccountSetupPopup, setShowAccountSetupPopup] = useState(false);
  const [showAccountIncompletePopup, setShowAccountIncompletePopup] = useState(false);
  const approvalStatus = useSelector(selectUserDetails)?.isApproved;
  const userDetails = useSelector(selectUserDetails);
  const user_id = useSelector(selectAuthUserId);

  useEffect(() => {
    dispatch(fetchUserInfo(user_id));
    setTimeout(() => {
      checkUserAccount();
    }, 0);
  }, [user_id,userDetails?.accountId, dispatch]);

  // Check if user has a Stripe account before showing the form
  const checkUserAccount = async () => {
    try {
      // Try to get account ID from AsyncStorage first
      const storedAccountId = await getItem('stripeAccountId');
      // If we don't have a stored account ID or one from Redux, show account setup popup
       if (!storedAccountId && !userDetails?.accountId) {
        setShowAccountSetupPopup(true);
        return;
      }else{
        setShowAccountSetupPopup(false);
      }
      
      // If we have an account ID, check its status
      const accountToUse = userDetails?.accountId || storedAccountId;
      
      // Check account status
      const response = await dispatch(checkAccount(accountToUse)).catch(error => {
        console.log('Error checking account status:', error);
      });
       
      // If account is not completed, show incomplete popup
      if (!response?.payload?.accountCompleted) {
        setShowAccountIncompletePopup(true);
      }
    } catch (error) {
      console.error('Error checking account:', error);
    }
  };

  const handleApprovalPopupClose = () => {
    navigation.navigate('MyDocuments');
    setShowApprovalPopup(false);
  };

  const handleAccountSetupPress = () => {
    setShowAccountSetupPopup(false);
    navigation.navigate('PaymentPreferences', { fromListing: true });
  };

  const handleAccountIncompletePress = () => {
    setShowAccountIncompletePopup(false);
    navigation.navigate('PaymentPreferences', { fromListing: true });
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
    serialNum:'',
    myUserId: user_id,
  });
 
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const error = useSelector(selectMainError)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNextStep = async () => {
    try {
      // First check if user has a valid Stripe account
      const storedAccountId = await getItem('stripeAccountId');
      const accountToUse = storedAccountId || userDetails?.accountId;
      
      // If no account ID, show account setup popup
      if (!accountToUse) {
        setShowAccountSetupPopup(true);
        return;
      }
      
      // Check account status
      const accountResponse = await dispatch(checkAccount(accountToUse)).catch(error => {
        console.log('Error checking account status:', error);
      });
      
      // If account is not completed, show incomplete popup
      if (!accountResponse?.payload?.accountCompleted) {
        setShowAccountIncompletePopup(true);
        return;
      }
      
      // Then check approval status
      // const approvalRes = await dispatch(fetchApprovedInfo(user_id));
      setCurrentStep(currentStep + 1);
      // if (approvalRes.payload.isApproved) {
      // } else {
      //   setShowApprovalPopup(true);
      // }
    } catch (error) {
      console.error('Error checking status:', error);
      setShowErrorPopup(true);
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
                // const approvalRes = await dispatch(fetchApprovedInfo(user_id));
                // if (approvalRes.payload.isApproved) {
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
                      serialNum:'',
                      myUserId: user_id,
                    })
                    dispatch(fetchUserInfo(user_id));

                    setShowSuccessPopup(true);
                  } else {
                    setShowErrorPopup(true);
                  }
                // } else {
                //   setShowErrorPopup(true);
                // }
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
      {showAccountSetupPopup ? (
        <PopUp
          icon={<Cross />}
          title={t('account_setup_required') || 'Account Setup Required'}
          description={t('account_setup_message') || 'You need to set up your payment account before listing a bicycle'}
          buttonTitle={t('setup_now') || 'Setup Now'}
          iconPress={() => setShowAccountSetupPopup(false)}
          onButtonPress={handleAccountSetupPress}
        />
      ) : showAccountIncompletePopup ? (
        <PopUp
          icon={<Cross />}
          title={t('account_incomplete') || 'Account Setup Incomplete'}
          description={t('complete_account_setup_message') || 'Please complete your account setup before listing a bicycle'}
          buttonTitle={t('complete_setup') || 'Complete Setup'}
          iconPress={() => setShowAccountIncompletePopup(false)}
          onButtonPress={handleAccountIncompletePress}
        />
      ) : showApprovalPopup ? (
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
