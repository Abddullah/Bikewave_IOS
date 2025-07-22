export const selectBicycles = state => state.main.bicycles;
export const selectBicycleDetails = state => state.main.bicycleDetails;
export const selectMainLoading = state => state.main.loading;
export const selectMainError = state => state.main.error;
export const selectFavorites = state => state.main.favorites;
export const selectAccount = state => state.main.account;
export const selectAccountSession = state => state.main.accountSession;
export const selectClientSecret = state => state.main.accountSession?.client_secret;
export const selectBicyclesNearCity = state => state.main.bicyclesNearCity;
export const selectBookingDetails = state => state.main.bookingDetails;
export const selectBookingLoading = state => state.main.bookingLoading;
export const selectBookingError = state => state.main.bookingError;
export const selectInvoiceAddress = state => state.main.invoiceAddress;
export const selectInvoiceLoading = state => state.main.invoiceLoading;
export const selectInvoiceError = state => state.main.invoiceError;

export const selectClientBookings = state => state.main.clientBookings;
export const selectClientBookingsLoading = state => state.main.clientBookingsLoading;
export const selectClientBookingsError = state => state.main.clientBookingsError;

export const selectOwnerBookings = state => state.main.ownerBookings;
export const selectOwnerBookingsLoading = state => state.main.ownerBookingsLoading;
export const selectOwnerBookingsError = state => state.main.ownerBookingsError;

export const selectConfirmPaymentDetails = state => state.main.confirmPaymentDetails;
export const selectConfirmPaymentLoading = state => state.main.confirmPaymentLoading;
export const selectConfirmPaymentError = state => state.main.confirmPaymentError;

export const selectCancelPaymentDetails = state => state.main.cancelPaymentDetails;
export const selectCancelPaymentLoading = state => state.main.cancelPaymentLoading;
export const selectCancelPaymentError = state => state.main.cancelPaymentError;

export const selectConfirmBookingDetails = state => state.main.confirmBookingDetails;
export const selectConfirmBookingLoading = state => state.main.confirmBookingLoading;
export const selectConfirmBookingError = state => state.main.confirmBookingError;

export const selectAccountStatus = state => state.main.accountStatus;
export const selectAccountStatusLoading = state => state.main.accountStatusLoading;
export const selectAccountStatusError = state => state.main.accountStatusError;

export const selectPickupDetails = state => state.main.pickupDetails;
export const selectPickupLoading = state => state.main.pickupLoading;
export const selectPickupError = state => state.main.pickupError;

export const selectReturnDetails = state => state.main.returnDetails;
export const selectReturnLoading = state => state.main.returnLoading;
export const selectReturnError = state => state.main.returnError;

export const selectSubscriptionSession = (state) => state.main.subscriptionSession;
export const selectSubscriptionSessionLoading = (state) => state.main.subscriptionSessionLoading;
export const selectSubscriptionSessionError = (state) => state.main.subscriptionSessionError;

export const selectBikeImage = (state) => state.main.bikeImage;
export const selectCreateBikeImage = (state) => state.main.createBikeImage;

export const selectSubscriptionStatus = (state) => state.main.subscriptionStatus;

export const selectBicycleReviews = (state) => state.main.bicycleReviews;
export const selectBicycleReviewsLoading = (state) => state.main.bicycleReviewsLoading;

