import { createAsyncThunk } from '@reduxjs/toolkit';
import ApiManager from '../../../api/ApiManager';
import getErrorMessage from '../../../services/errorHandler';
import axios from 'axios';
import { getAllFCMTokens } from '../../../utilities/fcmTokenManager';
import { SendMessageNotifications } from '../../../utilities/notificationService';
import { t } from 'i18next';
import { EnvConfig } from '../../../config/envConfig';
import geohash from 'ngeohash';

// Get all bicycles
export const getAllBicycles = createAsyncThunk(
  'bicycles/fetchAll',
  async ({ category }, { getState }) => {
    const { filters } = getState().main;
    let location = null;
    // console.log(filters, 'filters')
    if (filters?.location?.cityName) {
      const geoHash = filters.location.lat && filters.location.lng
        ? geohash.encode(filters.location.lat, filters.location.lng)
        : null;

      location = geoHash
    }

    const payload = {
      category,
      dateFrom: filters.dateFrom,
      dateEnd: filters.dateEnd,
      location: location,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    };
    try {
      console.log(payload,'payload')
      const response = await ApiManager.post('/bicycles', payload);
      // console.log(response, 'responseresponseresponse')
      return response.data;
    } catch (error) {
      console.log(error, 'errorerrorerror')
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error(getErrorMessage('Failed to fetch bicycles'));
      }
    }
  },
);

// Get favorites
export const getFavorites = createAsyncThunk(
  'users/fetchFavorites',
  async (_, { getState }) => {
    const token = getState().auth.userToken;
    try {
      const response = await ApiManager.get('/users/favorites', {
        headers: { Authorization: `${token}` },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error(getErrorMessage('Failed to fetch favorites'));
      }
    }
  },
);

// Update favorites
export const updateFavorites = createAsyncThunk(
  'users/updateFavorites',
  async (bicycleId, { getState }) => {
    const token = getState().auth.userToken;
    const url = `${EnvConfig.api.baseUrl}/users/favorites/${bicycleId}`;

    const config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: url,
      headers: {
        Authorization: token,
      },
      data: '',
    };

    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error('Failed to update favorites');
      }
    }
  },
);

// Get Bicycle by ID
export const getBicycleById = createAsyncThunk(
  'bicycles/fetchById',
  async bicycleId => {
    try {
      const response = await ApiManager.get(`/bicycles/${bicycleId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error(getErrorMessage('Failed to fetch bicycle'));
      }
    }
  },
);

// add bicycle
export const addBicycle = createAsyncThunk(
  'bicycles/add',
  async (
    {
      brand,
      model,
      category,
      photo,
      price,
      deposit,
      location,
      description,
      lat,
      lng,
      city,
      country,
      myUserId
    },
    { getState },
  ) => {
    const token = getState().auth.userToken;
    const userId = getState().auth.user?._id || myUserId;
    if (!token) {
      throw new Error(await getErrorMessage('Authentication token missing.'));
    }

    // Generate geohash from latitude and longitude
    const geoHash = geohash.encode(lat, lng);

    console.log({ userId, lng, lat, location, country, city, description, deposit, price, category, brand, model, geoHash }, '________________');

    let formData = new FormData();
    formData.append('brand', brand);
    formData.append('model', model);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('deposit', deposit && deposit > 0 ? deposit : 0);
    formData.append('description', description);
    formData.append('city', city);
    formData.append('country', country);
    formData.append('location', location);
    formData.append('lat', lat);
    formData.append('lng', lng);
    formData.append('userId', userId);
    formData.append('geoHash', geoHash);

    if (photo?.uri) {
      formData.append('photo', {
        uri: photo.uri,
        type: photo.type || 'image/jpeg',
        name: photo.fileName || `photo_${Date.now()}.jpg`,
      });
    } else {
      throw new Error(await getErrorMessage('Photo is required.'));
    }
    try {
      const response = await ApiManager.post('/bicycles/add', formData, {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        if (
          error.response.data.msg ==
          'Solo las cuentas premium pueden crear mas de dos bicicletas'
        ) {
          const customMessage = await getErrorMessage(
            'Faild To Upload more then 2 Bikes',
          );
          throw new Error(customMessage);
        } else {
          const customMessage = await getErrorMessage(error.response.status);
          throw new Error(customMessage);
        }
      } else {
        console.log(error, 'error');
        throw new Error(getErrorMessage('Failed to add bicycle'));
      }
    }
  },
);

// create account
export const createAccount = createAsyncThunk(
  'transactions/createAccount',
  async (_, { getState }) => {
    const token = getState().auth.userToken;
    const accountType = 'individual'

    try {
      const response = await axios.post(
        `${EnvConfig.api.baseUrl}/transactions/create-account`,
        // null,
        { accountType }, // send accountType in the body

        { headers: { Authorization: `${token}` } },
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error('Failed to create account');
      }
    }
  },
);

// Create the new async thunk for creating the account session
export const createAccountSession = createAsyncThunk(
  'transactions/createAccountSession',
  async (accountId, { getState }) => {
    const token = getState().auth.userToken;
    const data = JSON.stringify({ account: accountId });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${EnvConfig.api.baseUrl}/transactions/create-account-session`,
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json',
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error('Failed to create account session');
      }
    }
  },
);

// Delete bicycle
export const deleteBicycle = createAsyncThunk(
  'bicycles/delete',
  async (bicycleId, { getState }) => {
    const token = getState().auth.userToken;
    if (!token) {
      throw new Error(await getErrorMessage('Authentication token missing.'));
    }
    const config = {
      method: 'delete',
      url: `${EnvConfig.api.baseUrl}/bicycles/${bicycleId}`,
      headers: {
        Authorization: `${token}`,
      },
    };
    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error(getErrorMessage('Failed to delete bicycle'));
      }
    }
  },
);

// Get bicycles near the city
export const getBicyclesNearCity = createAsyncThunk(
  'bicycles/fetchNearCity',
  async cityName => {
    const data = JSON.stringify({
      cityName: cityName,
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${EnvConfig.api.baseUrl}/bicycles/items-near-city`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error('Failed to fetch bicycles near city');
      }
    }
  },
);

// Update Bicycle
export const updateBicycle = createAsyncThunk(
  'bicycles/update',
  async ({ bicycleId, formData }, { getState }) => {
    const token = getState().auth.userToken;

    if (!token) {
      throw new Error(await getErrorMessage('Authentication token missing.'));
    }

    const data = JSON.stringify(formData);

    const config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: `${EnvConfig.api.baseUrl}/bicycles/${bicycleId}`,
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error('Failed to update bicycle');
      }
    }
  },
);

// Book a bicycle
export const bookBicycle = createAsyncThunk(
  'bicycles/book',
  async ({ bicycleId, dateFrom, dateEnd, price }, { getState }) => {
    const token = getState().auth.userToken;
    try {
      const response = await ApiManager.put(
        '/bookings/startBooking/',
        {
          bicycleId,
          dateFrom,
          dateEnd,
          price,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error(getErrorMessage('Failed to book bicycle'));
      }
    }
  },
);

// Confirm booking
export const confirmBooking = createAsyncThunk(
  'bicycles/confirmBooking',
  async (bookingId, { getState }) => {
    const token = getState().auth.userToken;
    try {
      const response = await ApiManager.put(
        '/bookings/confirmBooking/',
        {
          bookingId,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );

      // Get the booking details to find the owner's ID
      const bookingResponse = await ApiManager.get(`/bookings/${bookingId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      const booking = bookingResponse.data;
      const ownerId = booking.bicycle.owner._id;

      try {
        // Get all FCM tokens
        const allTokens = await getAllFCMTokens();
        // Filter the token for the bike owner
        const ownerTokenObj = allTokens.find(
          tokenObj => tokenObj.userId === ownerId,
        );

        if (ownerTokenObj && ownerTokenObj.token) {
          const ownerToken = ownerTokenObj.token;
          await SendMessageNotifications(
            [ownerToken],
            t('notifications.new_booking_title'),
            t('notifications.new_booking_message'),
            null,
          );
        }
      } catch (notificationError) {
        console.error('Error sending notification:', notificationError);
        // Continue with the booking confirmation even if notification fails
      }

      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error(getErrorMessage('Failed to confirm booking'));
      }
    }
  },
);

// Set invoice address
export const setInvoiceAddress = createAsyncThunk(
  'users/setInvoiceAddress',
  async (invoiceData, { getState }) => {
    const token = getState().auth.userToken;

    const invoiceAddress = {
      address1: invoiceData.street,
      address2: invoiceData.door,
      city: invoiceData.city,
      country: invoiceData.country,
      postalCode: invoiceData.postCode,
      name: invoiceData.name,
      surname: invoiceData.surname,
      email: invoiceData.emailBuyer,
      phone: invoiceData.phoneBuyer,
    };

    try {
      const response = await ApiManager.post(
        '/users/invoice-address/',
        invoiceAddress,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error(getErrorMessage('Failed to set invoice address'));
      }
    }
  },
);

// Get bookings as client
export const getBookingsAsClient = createAsyncThunk(
  'bookings/fetchAsClient',
  async (_, { getState }) => {
    const token = getState().auth.userToken;
    try {
      const response = await ApiManager.get('/bookings/client', {
        headers: { Authorization: `${token}` },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error(getErrorMessage('Failed to fetch client bookings'));
      }
    }
  },
);

// Get bookings as owner
export const getBookingsAsOwner = createAsyncThunk(
  'bookings/fetchAsOwner',
  async (_, { getState }) => {
    const token = getState().auth.userToken;
    try {
      const response = await ApiManager.get('/bookings/owner', {
        headers: { Authorization: `${token}` },
      });

      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error(getErrorMessage('Failed to fetch owner bookings'));
      }
    }
  },
);

// Confirm payment for booking
export const confirmPayment = createAsyncThunk(
  'bookings/confirmPayment',
  async (bookingId, { getState }) => {
    const token = getState().auth.userToken;
    try {
      const response = await ApiManager.put(
        '/bookings/confirmPayment/',
        {
          bookingId,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error(getErrorMessage('Failed to confirm payment'));
      }
    }
  },
);

// Cancel payment for booking
export const cancelPayment = createAsyncThunk(
  'bookings/cancelPayment',
  async (bookingId, { getState }) => {
    const token = getState().auth.userToken;
    try {
      const response = await ApiManager.put(
        '/bookings/cancelPayment/',
        {
          bookingId,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error(getErrorMessage('Failed to cancel payment'));
      }
    }
  },
);

// Check account status
export const checkAccount = createAsyncThunk(
  'transactions/checkAccount',
  async (_, { getState }) => {
    const token = getState().auth.userToken;
    const { accountId } = getState().auth.userDetails;

    if (!accountId) {
      throw new Error('Account ID not found');
    }

    try {
      const response = await axios.get(
        `${EnvConfig.api.baseUrl}/transactions/check-account/${accountId}`,
        { headers: { Authorization: `${token}` } },
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error('Failed to check account status');
      }
    }
  },
);

// Create Stripe subscription session
export const createStripeSubscriptionSession = createAsyncThunk(
  'transactions/createStripeSubscriptionSession',
  async ({ priceId, successUrl, cancelUrl }, { getState }) => {
    const token = getState().auth.userToken; // Retrieve token from Redux state
    try {
      const response = await fetch(
        `${EnvConfig.api.baseUrl}/transactions/create-suscription-session/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({ priceId, successUrl, cancelUrl }),
        },
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('Error:', error);
      throw new Error('Failed to create Stripe subscription session');
    }
  },
);

// Check if user has an active subscription
export const checkUserSubscription = createAsyncThunk(
  'transactions/checkUserSubscription',
  async (accountId, { getState }) => {
    // const { accountId } = getState().auth.userDetails;

    if (!accountId) {
      return { hasActiveSubscription: false };
    }
    try {
      const response = await fetch(`${EnvConfig.stripe.baseUrl}/subscriptions`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${EnvConfig.stripe.secretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subscription data from Stripe');
      }
      const data = await response.json();
      const activeSubscription = data.data.find(sub => sub.status === 'active');
      return {
        hasActiveSubscription: !!activeSubscription,
        subscriptionDetails: activeSubscription || null,
      };
    } catch (error) {
      console.log('Error checking subscription:', error);
      throw new Error('Failed to check subscription status');
    }
  },
);

// Add Review
export const addReview = createAsyncThunk(
  'reviews/add',
  async ({ bookingId, bicycleId, rating, comment, ownerId }, { getState }) => {
    const token = getState().auth.userToken;
    try {
      const response = await ApiManager.post(
        '/reviews',
        { bookingId, bicycleId, rating, comment, ownerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error(getErrorMessage('Failed to add review'));
      }
    }
  }
);

// Get reviews by user ID
export const getReviewsByUserId = createAsyncThunk(
  'reviews/getByUserId',
  async (_, { getState }) => {
    const token = getState().auth.userToken;
    const userId = getState().auth.user?._id;
    if (!userId) {
      throw new Error('User ID not found');
    }
    try {
      const response = await ApiManager.get(`/reviews/getByUser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error(getErrorMessage('Failed to fetch user reviews'));
      }
    }
  }
);
