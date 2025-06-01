import { createSlice } from '@reduxjs/toolkit';
import {
  login,
  register,
  sendEmailAfterRegister,
  forgotPassword,
  changePassword,
  fetchApprovedInfo,
  fetchUserInfo,
  fetchUserBicycles,
  updateUser,
  deleteUser,
  sendApprovalImages,
} from './authThunks';
import { setItem } from '../../../services/assynsStorage';

const initialState = {
  user: null,
  auth_loading: false,
  edit_loading: false,
  error: null,
  userToken: null,
  approvedInfo: null,
  userDetails: null,
  userBicycles: [],
  sendApprovalLoading: false,
  approvalStatus: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserToken(state, action) {
      state.userToken = action.payload;
    },
    clearUserToken(state) {
      state.userToken = null;
    },
    setUser(state, action) {
      state.user = action.payload;
      state.user.id = action.payload.userId;
      state.user.name = action.payload.userName;
    },
  },
  extraReducers: builder => {
    // Login

    builder.addCase(login.pending, state => {
      state.auth_loading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.auth_loading = false;
      const { userId, userName, unseenNotifications, token } = action.payload;
      state.user = { id: userId, name: userName, unseenNotifications };
      state.userToken = token;
      setItem('userToken', JSON.stringify(action.payload));
    });
    builder.addCase(login.rejected, (state, action) => {
      state.error = action.error.message;
      state.auth_loading = false;
    });

    // Register

    builder.addCase(register.pending, state => {
      state.auth_loading = true;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.auth_loading = false;
      state.user = action.payload.userToAdd;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.error = action.error.message;
      state.auth_loading = false;
    });

    // Send Email After Registration

    builder.addCase(sendEmailAfterRegister.pending, state => {
      state.auth_loading = true;
    });
    builder.addCase(sendEmailAfterRegister.fulfilled, state => {
      state.auth_loading = false;
    });
    builder.addCase(sendEmailAfterRegister.rejected, (state, action) => {
      state.auth_loading = false;
      state.error = action.error.message;
    });

    // Forgot Password

    builder.addCase(forgotPassword.pending, state => {
      state.auth_loading = true;
    });
    builder.addCase(forgotPassword.fulfilled, state => {
      state.auth_loading = false;
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.error = action.error.message;
      state.auth_loading = false;
    });

    // Change Password

    builder.addCase(changePassword.pending, state => {
      state.auth_loading = true;
    });
    builder.addCase(changePassword.fulfilled, state => {
      state.auth_loading = false;
      state.error = null;
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      state.auth_loading = false;
      state.error = action.error.message;
    });

    // Fetch Approved Info
    builder.addCase(fetchApprovedInfo.pending, state => {
      state.auth_loading = true;
    });
    builder.addCase(fetchApprovedInfo.fulfilled, (state, action) => {
      state.auth_loading = false;
      state.approvedInfo = action.payload;
    });
    builder.addCase(fetchApprovedInfo.rejected, (state, action) => {
      state.auth_loading = false;
      state.error = action.error.message;
    });

    // Fetch User Info
    builder.addCase(fetchUserInfo.pending, state => {
      state.auth_loading = true;
    });
    builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
      state.auth_loading = false;
      state.userDetails = action.payload;
    });
    builder.addCase(fetchUserInfo.rejected, (state, action) => {
      state.auth_loading = false;
      state.error = action.error.message;
    });

    // Fetch User Bicycles
    builder.addCase(fetchUserBicycles.pending, state => {
      state.auth_loading = true;
    });
    builder.addCase(fetchUserBicycles.fulfilled, (state, action) => {
      state.auth_loading = false;
      state.userBicycles = action.payload;
    });
    builder.addCase(fetchUserBicycles.rejected, (state, action) => {
      state.auth_loading = false;
      state.error = action.error.message;
    });

    // update user
    builder.addCase(updateUser.pending, state => {
      state.edit_loading = true;
    });
    builder.addCase(updateUser.fulfilled, state => {
      state.edit_loading = false;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.edit_loading = false;
      state.error = action.error.message;
    });

    // Delete User
    builder.addCase(deleteUser.pending, state => {
      state.auth_loading = true;
    });
    builder.addCase(deleteUser.fulfilled, state => {
      state.auth_loading = false;
      state.user = null;
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.auth_loading = false;
      state.error = action.error.message;
    });

    // Send Approval Images
    builder.addCase(sendApprovalImages.pending, state => {
      state.sendApprovalLoading = true;
    });
    builder.addCase(sendApprovalImages.fulfilled, (state, action) => {
      state.sendApprovalLoading = false;
      state.approvalStatus = 'Success';
    });
    builder.addCase(sendApprovalImages.rejected, (state, action) => {
      state.sendApprovalLoading = false;
      state.error = action.error.message;
    });
  },
});

export const { setUserToken, clearUserToken, setUser } = authSlice.actions;
export default authSlice.reducer;
