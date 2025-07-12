import { createAsyncThunk } from '@reduxjs/toolkit';
import ApiManager from '../../../api/ApiManager';
import getErrorMessage from '../../../services/errorHandler';
import axios from 'axios';
import { EnvConfig } from '../../../config/envConfig';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import { appleAuth } from '@invertase/react-native-apple-authentication';
// import { AppleAuthProvider } from 'firebase/auth';
import { AppleAuthProvider, getAuth, signInWithCredential } from '@react-native-firebase/auth';
import { appleAuth } from '@invertase/react-native-apple-authentication';


GoogleSignin.configure({
  webClientId:
    '67869384366-odtikn5gueg3pkn6khoke2kiv98u20lk.apps.googleusercontent.com',
  offlineAccess: true,
  forceCodeForRefreshToken: true,
});

// Login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }) => {
    try {
      const response = await ApiManager.post('/users/login', { email, password });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(
          `login-${error.response.status}`,
        );
        throw new Error(customMessage);
      } else {
        throw new Error(getErrorMessage('Failed to login'));
      }
    }
  },
);

// Register
export const register = createAsyncThunk(
  'auth/register',
  async ({ email, firstName, secondName, password }) => {
    try {
      const response = await ApiManager.post('/users/', {
        email,
        firstName,
        secondName,
        password,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.err) {
        const sequelizeError = error.response.data.err;
        if (sequelizeError.errors && sequelizeError.errors.length > 0) {
          const customMessage = await getErrorMessage(
            `register-${error.response.status}`,
          );
          throw new Error(customMessage);
        }
      }
      throw new Error(getErrorMessage('Failed to register'));
    }
  },
);

// Send Email After Registration
export const sendEmailAfterRegister = createAsyncThunk(
  'auth/sendEmailAfterRegister',
  async email => {
    try {
      const response = await ApiManager.post('/users/send-email', { email });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else {
        throw new Error('Failed to Send Email');
      }
    }
  },
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async email => {
    try {
      const response = await ApiManager.put('/users/forgot-password', { email });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(
          `forgot-${error.response.status}`,
        );
        throw new Error(customMessage);
      } else {
        throw new Error(getErrorMessage('Failed to Send link'));
      }
    }
  },
);

// change password
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (newPassword, { getState }) => {
    const token = getState().auth.userToken;
    const data = JSON.stringify({
      password: newPassword,
    });
    const config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: `${EnvConfig.api.baseUrl}/users/reset-password/${token}`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      if (error.response) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error('Failed to reset password');
      }
    }
  },
);

// fetch approved info
export const fetchApprovedInfo = createAsyncThunk(
  'auth/fetchApprovedInfo',
  async (userId, { getState }) => {
    const token = getState().auth.userToken;
    try {
      const response = await ApiManager.get(`/users/${userId}/approvedInfo`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error('Failed to fetch approved info');
      }
    }
  },
);

// fetching the user info
export const fetchUserInfo = createAsyncThunk(
  'auth/fetchUserInfo',
  async userId => {
    try {
      const response = await ApiManager.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error('Failed to fetch user info');
      }
    }
  },
);

// fetching user bicyles
export const fetchUserBicycles = createAsyncThunk(
  'auth/fetchUserBicycles',
  async (_, { getState }) => {
    const token = getState().auth.userToken;
    try {
      const response = await ApiManager.get('/users/mybicycles', {
        headers: { Authorization: `${token}` },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error('Failed to fetch bicycles');
      }
    }
  },
);
// update user
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async ({ userId, firstName, secondName, email }, { getState }) => {
    const token = getState().auth.userToken;
    try {
      const response = await ApiManager.patch(
        `/users/${userId}`,
        { firstName, secondName, email },
        { headers: { Authorization: `${token}` } },
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error('Failed to update user details');
      }
    }
  },
);

// Delete User
export const deleteUser = createAsyncThunk(
  'auth/deleteUser',
  async (userId, { getState }) => {
    const token = getState().auth.userToken;
    try {
      const response = await ApiManager.delete(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error('Failed to delete user');
      }
    }
  },
);

// send doc approval
export const sendApprovalImages = createAsyncThunk(
  'users/sendApprovalImages',
  async (photos, { getState }) => {
    const token = getState().auth.userToken;
    const userId = getState().auth.user?.id;

    if (!token) {
      throw new Error(await getErrorMessage('Authentication token missing.'));
    }

    let formData = new FormData();
    formData.append('userId', userId);
    photos.forEach(photo => {
      formData.append('photos', {
        uri: photo.uri,
        type: photo.type || 'image/jpeg',
        name: photo.name || `photo_${Date.now()}.jpg`,
      });
    });

    try {
      const response = await ApiManager.post(
        '/users/send-approval-image',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error(getErrorMessage('Failed to upload images'));
      }
    }
  },
);

export const googleSignIn = createAsyncThunk(
  'auth/googleSignIn',
  async (_, { rejectWithValue }) => {
    try {
      let signInResult;
      let tokens;
      try {
        signInResult = await GoogleSignin.signIn();
        tokens = await GoogleSignin.getTokens();
      } catch (error) {
        throw error;
      }
      const access_token = tokens?.accessToken;
      if (!access_token) {
        throw new Error('No accessToken received from Google');
      }
      try {
        const response = await axios.post(
          `https://nfsd-bikewave-backend.onrender.com/api/auth/google-login`,
          { access_token },
        );
        return response;
      } catch (apiError) {
        let message = 'Google login API failed';
        if (
          apiError.response &&
          apiError.response.data &&
          apiError.response.data.msg
        ) {
          message = apiError.response.data.msg;
        } else if (apiError.message) {
          message = apiError.message;
        }
        return rejectWithValue(message);
      }
    } catch (error) {
      let message = 'Google Sign-In failed';
      if (error.response && error.response.data && error.response.data.msg) {
        message = error.response.data.msg;
      } else if (error.message) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  },
);

export const appleSignIn = createAsyncThunk(
  'auth/appleSignIn',
  async (_, { rejectWithValue }) => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        // As per the FAQ of react-native-apple-authentication, the name should come first in the following array.
        // See: https://github.com/invertase/react-native-apple-authentication#faqs
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });
      console.log(appleAuthRequestResponse, 'appleAuthRequestResponse');
      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned');
      }
      
      // Create a Firebase credential from the response
      const { identityToken, nonce, fullName, email } = appleAuthRequestResponse;
      console.log(identityToken, 'identityToken');
      
      // Extract user information
      let firstName = '';
      let lastName = '';
      
      if (fullName) {
        firstName = fullName.givenName || '';
        lastName = fullName.familyName || '';
        console.log('Apple Full Name:', fullName);
        console.log('First Name:', firstName);
        console.log('Last Name:', lastName);
      }
      
      // Send the data to your backend API
      try {
        const response = await axios.post(
          // 'https://nfsd-bikewave-backend.onrender.com/api/auth/apple-login',
          'http://192.168.100.12:4000/api/auth/apple-login',
          { 
            identityToken,
            email,
            firstName, 
            lastName,
            appleId: appleAuthRequestResponse.user // This is the Apple user identifier
          },
        );
        console.log('Apple login API response:', response.data);
        return response;
      } catch (apiError) {
        let message = 'Apple login API failed';
        if (
          apiError.response &&
          apiError.response.data &&
          apiError.response.data.msg
        ) {
          message = apiError.response.data.msg;
        } else if (apiError.message) {
          message = apiError.message;
        }
        return rejectWithValue(message);
      }
    } catch (error) {
      console.log(error, 'error');
      let message = 'Apple Sign-In failed';
      if (error.response && error.response.data && error.response.data.msg) {
        message = error.response.data.msg;
      } else if (error.message) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  },
);
