import {createSlice} from '@reduxjs/toolkit';
import {
  getAllBicycles,
  getFavorites,
  updateFavorites,
  getBicycleById,
  addBicycle,
  createAccount,
  createAccountSession,
  deleteBicycle,
  getBicyclesNearCity,
  updateBicycle,
  bookBicycle,
  confirmBooking,
  setInvoiceAddress,
  getBookingsAsClient,
  getBookingsAsOwner,
  confirmPayment,
  cancelPayment,
  checkAccount,
  createStripeSubscriptionSession,
  checkUserSubscription,
  getReviewsByUserId,
  getBicycleReviews,
  updateBookingReviewModalShown,
} from './mainThunks';
import { pickupBicycle, returnBicycle } from './pickupReturnThunks';

const initialState = {
  bicycles: [],
  bicycleDetails: null,
  favorites: [],
  loading: false,
  error: null,
  filters: {
    dateEnd: null,
    dateFrom: null,
    location: null,
    minPrice: null,
    maxPrice: null,
  },
  account: null,
  accountSession: null,
  bicyclesNearCity: [],
  clientSecret: null,
  bookingDetails: null,
  bookingLoading: false,
  bookingError: null,
  confirmBookingDetails: null,
  confirmBookingLoading: false,
  confirmBookingError: null,
  invoiceAddress: null,
  invoiceLoading: false,
  invoiceError: null,
  clientBookings: [],
  ownerBookings: [],
  clientBookingsLoading: false,
  ownerBookingsLoading: false,
  clientBookingsError: null,
  ownerBookingsError: null,
  confirmPaymentDetails: null,
  confirmPaymentLoading: false,
  confirmPaymentError: null,
  cancelPaymentDetails: null,
  cancelPaymentLoading: false,
  cancelPaymentError: null,
  accountStatus: null,
  accountStatusLoading: false,
  accountStatusError: null,
  pickupDetails: null,
  pickupLoading: false,
  pickupError: null,
  returnDetails: null,
  returnLoading: false,
  returnError: null,
  returnBicycleStatus: null,
  subscriptionSession: null,
  subscriptionSessionLoading: false,
  subscriptionSessionError: null,
  subscriptionStatus: {
    loading: false,
    hasActiveSubscription: false,
    details: null,
    error: null
  },
  userReviews: [],
  reviewsLoading: false,
  bicycleReviews: [],
  bicycleReviewsLoading: false,
};

const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
  },
  extraReducers(builder) {
    // fetch all bicyles
    builder.addCase(getAllBicycles.pending, state => {
      state.loading = true;
    });
    builder.addCase(getAllBicycles.fulfilled, (state, action) => {
      state.loading = false;
      state.bicycles = action.payload;
    });
    builder.addCase(getAllBicycles.rejected, (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    });

    // fetch all Favorites
    builder.addCase(getFavorites.pending, state => {
      state.loading = true;
    });
    builder.addCase(getFavorites.fulfilled, (state, action) => {
      state.loading = false;
      state.favorites = action.payload;
    });
    builder.addCase(getFavorites.rejected, (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    });

    // Update Favorites (add/remove to favorites)
    builder.addCase(updateFavorites.pending, state => {
      state.loading = true;
    });
    builder.addCase(updateFavorites.fulfilled, state => {
      state.loading = false;
    });
    builder.addCase(updateFavorites.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // fetch bicycle by ID
    builder.addCase(getBicycleById.pending, state => {
      state.loading = true;
    });
    builder.addCase(getBicycleById.fulfilled, (state, action) => {
      state.loading = false;
      state.bicycleDetails = action.payload;
    });
    builder.addCase(getBicycleById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Add Bicycle
    builder.addCase(addBicycle.pending, state => {
      state.loading = true;
    });
    builder.addCase(addBicycle.fulfilled, (state, action) => {
      state.loading = false;
      state.bicycles.push(action.payload);
    });
    builder.addCase(addBicycle.rejected, (state, action) => {
      state.loading = false;
      // state.error = action.error.message;
      state.error = action.error.message;
    });

    // Handle create account
    builder.addCase(createAccount.pending, state => {
      state.loading = true;
    });
    builder.addCase(createAccount.fulfilled, (state, action) => {
      state.loading = false;
      state.account = action.payload.account;
    });
    builder.addCase(createAccount.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Handle create account session
    builder.addCase(createAccountSession.pending, state => {
      state.loading = true;
    });
    builder.addCase(createAccountSession.fulfilled, (state, action) => {
      state.loading = false;
      state.accountSession = action.payload;
    });
    builder.addCase(createAccountSession.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Delete Bicycle
    builder.addCase(deleteBicycle.pending, state => {
      state.loading = true;
    });
    builder.addCase(deleteBicycle.fulfilled, (state, action) => {
      state.loading = false;
      state.bicycles = state.bicycles.filter(
        bicycle => bicycle.id !== action.payload.id,
      );
    });
    builder.addCase(deleteBicycle.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Get bicycles near city
    builder.addCase(getBicyclesNearCity.pending, state => {
      state.loading = true;
    });
    builder.addCase(getBicyclesNearCity.fulfilled, (state, action) => {
      state.loading = false;
      state.bicyclesNearCity = action.payload;
    });
    builder.addCase(getBicyclesNearCity.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // update bicyle
    builder.addCase(updateBicycle.pending, state => {
      state.loading = true;
    });
    builder.addCase(updateBicycle.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(updateBicycle.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Handle booking states
    builder
      .addCase(bookBicycle.pending, (state) => {
        state.bookingLoading = true;
        state.bookingError = null;
      })
      .addCase(bookBicycle.fulfilled, (state, action) => {
        state.bookingLoading = false;
        state.bookingDetails = action.payload;
      })
      .addCase(bookBicycle.rejected, (state, action) => {
        state.bookingLoading = false;
        state.bookingError = action.error.message;
      });

    // Handle confirm booking states
    builder
      .addCase(confirmBooking.pending, (state) => {
        state.confirmBookingLoading = true;
        state.confirmBookingError = null;
      })
      .addCase(confirmBooking.fulfilled, (state, action) => {
        state.confirmBookingLoading = false;
        state.confirmBookingDetails = action.payload;
      })
      .addCase(confirmBooking.rejected, (state, action) => {
        state.confirmBookingLoading = false;
        state.confirmBookingError = action.error.message;
      });

    // Handle invoice address states
    builder
      .addCase(setInvoiceAddress.pending, (state) => {
        state.invoiceLoading = true;
        state.invoiceError = null;
      })
      .addCase(setInvoiceAddress.fulfilled, (state, action) => {
        state.invoiceLoading = false;
        state.invoiceAddress = action.payload;
      })
      .addCase(setInvoiceAddress.rejected, (state, action) => {
        state.invoiceLoading = false;
        state.invoiceError = action.error.message;
      });

    // Handle client bookings states
    builder
      .addCase(getBookingsAsClient.pending, (state) => {
        state.clientBookingsLoading = true;
        state.clientBookingsError = null;
      })
      .addCase(getBookingsAsClient.fulfilled, (state, action) => {
        state.clientBookingsLoading = false;
        state.clientBookings = action.payload;
      })
      .addCase(getBookingsAsClient.rejected, (state, action) => {
        state.clientBookingsLoading = false;
        state.clientBookingsError = action.error.message;
      });

    // Handle owner bookings states
    builder
      .addCase(getBookingsAsOwner.pending, (state) => {
        state.ownerBookingsLoading = true;
        state.ownerBookingsError = null;
      })
      .addCase(getBookingsAsOwner.fulfilled, (state, action) => {
        state.ownerBookingsLoading = false;
        state.ownerBookings = action.payload;
      })
      .addCase(getBookingsAsOwner.rejected, (state, action) => {
        state.ownerBookingsLoading = false;
        state.ownerBookingsError = action.error.message;
      });

    // Handle confirm payment states
    builder
      .addCase(confirmPayment.pending, (state) => {
        state.confirmPaymentLoading = true;
        state.confirmPaymentError = null;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.confirmPaymentLoading = false;
        state.confirmPaymentDetails = action.payload;
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.confirmPaymentLoading = false;
        state.confirmPaymentError = action.error.message;
      });

    // Handle cancel payment states
    builder
      .addCase(cancelPayment.pending, (state) => {
        state.cancelPaymentLoading = true;
        state.cancelPaymentError = null;
      })
      .addCase(cancelPayment.fulfilled, (state, action) => {
        state.cancelPaymentLoading = false;
        state.cancelPaymentDetails = action.payload;
      })
      .addCase(cancelPayment.rejected, (state, action) => {
        state.cancelPaymentLoading = false;
        state.cancelPaymentError = action.error.message;
      });

    // Handle check account status
    builder
      .addCase(checkAccount.pending, (state) => {
        state.accountStatusLoading = true;
        state.accountStatusError = null;
      })
      .addCase(checkAccount.fulfilled, (state, action) => {
        state.accountStatusLoading = false;
        state.accountStatus = action.payload;
      })
      .addCase(checkAccount.rejected, (state, action) => {
        state.accountStatusLoading = false;
        state.accountStatusError = action.error.message;
      });

    // Handle pickup bicycle states
    builder
      .addCase(pickupBicycle.pending, (state) => {
        state.pickupLoading = true;
        state.pickupError = null;
      })
      .addCase(pickupBicycle.fulfilled, (state, action) => {
        state.pickupLoading = false;
        state.pickupDetails = action.payload;
        // Update the booking status in the client bookings list
        if (state.clientBookings.length > 0) {
          state.clientBookings = state.clientBookings.map(booking => 
            booking._id === action.payload.bookingId 
              ? { ...booking, statusId: 3 } 
              : booking
          );
        }
      })
      .addCase(pickupBicycle.rejected, (state, action) => {
        state.pickupLoading = false;
        state.pickupError = action.error.message;
      });

    // Handle return bicycle states
    builder
      .addCase(returnBicycle.pending, (state) => {
        state.returnLoading = true;
        state.returnError = null;
        state.returnBicycleStatus = 'loading';
      })
      .addCase(returnBicycle.fulfilled, (state, action) => {
        state.returnLoading = false;
        state.returnDetails = action.payload;
        state.returnBicycleStatus = 'success';
        // Update the booking status in the owner bookings list
        if (state.ownerBookings.length > 0) {
          state.ownerBookings = state.ownerBookings.map(booking => 
            booking._id === action.payload.bookingId 
              ? { ...booking, statusId: 4 } 
              : booking
          );
        }
      })
      .addCase(returnBicycle.rejected, (state, action) => {
        state.returnLoading = false;
        state.returnError = action.error.message;
        state.returnBicycleStatus = 'failed';
      });

    // Handle create stripe subscription session states
    builder
      .addCase(createStripeSubscriptionSession.pending, (state) => {
        state.subscriptionSessionLoading = true;
        state.subscriptionSessionError = null;
      })
      .addCase(createStripeSubscriptionSession.fulfilled, (state, action) => {
        state.subscriptionSessionLoading = false;
        state.subscriptionSession = action.payload;
      })
      .addCase(createStripeSubscriptionSession.rejected, (state, action) => {
        state.subscriptionSessionLoading = false;
        state.subscriptionSessionError = action.error.message;
      });

    // Handle check user subscription states
    builder
      .addCase(checkUserSubscription.pending, (state) => {
        state.subscriptionStatus.loading = true;
        state.subscriptionStatus.error = null;
      })
      .addCase(checkUserSubscription.fulfilled, (state, action) => {
        state.subscriptionStatus.loading = false;
        state.subscriptionStatus.hasActiveSubscription = action.payload.hasActiveSubscription;
        state.subscriptionStatus.details = action.payload.subscriptionDetails;
      })
      .addCase(checkUserSubscription.rejected, (state, action) => {
        state.subscriptionStatus.loading = false;
        state.subscriptionStatus.error = action.error.message;
      });

    // Handle getReviewsByUserId
    builder
      .addCase(getReviewsByUserId.pending, (state) => {
        state.reviewsLoading = true;
      })
      .addCase(getReviewsByUserId.fulfilled, (state, action) => {
        state.reviewsLoading = false;
        state.userReviews = action.payload;
      })
      .addCase(getReviewsByUserId.rejected, (state, action) => {
        state.reviewsLoading = false;
      });

    // Handle getBicycleReviews
    builder
      .addCase(getBicycleReviews.pending, (state) => {
        state.bicycleReviewsLoading = true;
      })
      .addCase(getBicycleReviews.fulfilled, (state, action) => {
        state.bicycleReviewsLoading = false;
        state.bicycleReviews = action.payload;
      })
      .addCase(getBicycleReviews.rejected, (state, action) => {
        state.bicycleReviewsLoading = false;
      });

    // Handle updateBookingReviewModalShown
    builder
      .addCase(updateBookingReviewModalShown.pending, (state) => {
        // No need to set loading state for this operation
      })
      .addCase(updateBookingReviewModalShown.fulfilled, (state, action) => {
        // Update the booking in state if it exists
        if (state.clientBookings.length > 0) {
          state.clientBookings = state.clientBookings.map(booking => 
            booking._id === action.payload.bookingId 
              ? { ...booking, isReviewModalShown: action.payload.isReviewModalShown } 
              : booking
          );
        }
        if (state.ownerBookings.length > 0) {
          state.ownerBookings = state.ownerBookings.map(booking => 
            booking._id === action.payload.bookingId 
              ? { ...booking, isReviewModalShown: action.payload.isReviewModalShown } 
              : booking
          );
        }
      })
      .addCase(updateBookingReviewModalShown.rejected, (state, action) => {
        // No need to handle errors for this operation in the UI
      });
  },
});

export const {setFilters} = mainSlice.actions;
export default mainSlice.reducer;
