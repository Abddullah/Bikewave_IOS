export const selectAuthUser = state => state.auth.user;
export const selectAuthUserId = state => state.auth.user?.id;
export const selectAuthUserName = state => state.auth.user?.name;
export const selectAuthLoading = state => state.auth.auth_loading;
export const selectUnseenNotifications = state =>
  state.auth.user?.unseenNotifications;
export const selectEditLoading = state => state.auth.edit_loading;
export const selectAuthError = state => state.auth.error;
export const selectAuthToken = state => state.auth.userToken;
export const selectApprovedInfo = state => state.auth.approvedInfo;
export const selectUserDetails = state => state.auth.userDetails;
export const selectUserBicycles = state => state.auth.userBicycles;
export const selectSendApprovalLoading = state => state.auth.sendApprovalLoading; 
export const selectApprovalStatus = state => state.auth.approvalStatus; 
