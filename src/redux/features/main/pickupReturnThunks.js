import { createAsyncThunk } from '@reduxjs/toolkit';
import ApiManager from '../../../api/ApiManager';
import getErrorMessage from '../../../services/errorHandler';

// Pickup bicycle
export const pickupBicycle = createAsyncThunk(
  'bookings/pickup',
  async (bookingId, { getState }) => {
    const token = getState().auth.userToken;
    try {
      const response = await ApiManager.put('/bookings/pickup/', {
        bookingId
      }, {
        headers: {
          Authorization: `${token}`
        }
      });
      return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error(getErrorMessage('Failed to pickup bicycle'));
      }
    }
  }
);

// Return bicycle
export const returnBicycle = createAsyncThunk(
  'bookings/return',
  async (bookingId, { getState }) => {
    const token = getState().auth.userToken;
    try {
      const response = await ApiManager.put('/bookings/return/', {
        bookingId
      }, {
        headers: {
          Authorization: `${token}`
        }
      });
      return response.data;
    } catch (error) {
       if (error.response && error.response.data && error.response.data.msg) {
        const customMessage = await getErrorMessage(error.response.status);
        throw new Error(customMessage);
      } else {
        throw new Error(getErrorMessage('Failed to return bicycle'));
      }
    }
  }
); 