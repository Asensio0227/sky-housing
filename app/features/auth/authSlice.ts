import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ToastAndroid } from 'react-native';
import { UserDocument } from '../../components/form/FormInput';
import customFetch from '../../utils/axios';
import { customData } from '../../utils/globals';

interface authState {
  user: UserDocument | any;
  isLoading: boolean;
  error: string | null | any;
  visible: boolean;
}

const initialState = {
  user: null,
  isLoading: false,
  error: '',
  visible: false,
} satisfies authState as authState;

// create account
export const createUserAccount = createAsyncThunk(
  'auth/sign-up',
  async (userData: UserDocument | any, thunkAPi) => {
    try {
      const data = customData(userData);
      const response: any = await customFetch.post(`auth/register`, data, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });
      if (!response.ok) {
        throw new Error(response.data.msg);
      }
      return response.data;
    } catch (error: any) {
      return thunkAPi.rejectWithValue(`Could not register user: ${error}`);
    }
  }
);
// resend code
export const resendAccountCode = createAsyncThunk(
  'auth/resend-code',
  async (email: string, thunkApi) => {
    try {
      const response: any = await customFetch.post(`auth/resend-code`, email);
      if (!response.ok) {
        throw new Error(response.data.msg);
      }
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(`Error resending code: ${error}`);
    }
  }
);
// verify-email
export const verifyEmail = createAsyncThunk(
  'auth/verify-email',
  async (data: any, thunkApi) => {
    try {
      const { email, token } = data;
      const response: any = await customFetch.post('auth/verify-email', {
        email,
        verificationToken: Number(token),
      });
      if (!response.ok) {
        throw new Error(response.data.msg);
      }
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(`Error verifying email: ${error}`);
    }
  }
);
// sign-in
export const signInUser = createAsyncThunk(
  'auth/sign-in',
  async (userData: UserDocument, thunkApi) => {
    try {
      const response: any = await customFetch.post('auth/login', userData);
      if (!response.ok) {
        throw new Error(response.data.msg);
      }
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(`Error sign-in: ${error}`);
    }
  }
);
// forgot password
export const requestResetPassword = createAsyncThunk(
  'auth/forgot-password',
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      const response: any = await customFetch.post(
        'auth/forgot-password',
        data
      );
      if (!response.ok) {
        throw new Error(response.data.msg);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(`Error forgot password: ${error}`);
    }
  }
);
// reset password
export const ResetUserPassword = createAsyncThunk(
  'auth/reset-password',
  async (data: any, thunkApi) => {
    try {
      const { email, token, password } = data;
      const response: any = await customFetch.post(`auth/reset-password`, {
        email,
        token: Number(token),
        password,
      });
      if (!response.ok) {
        throw new Error(response.data.msg);
      }
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(`Error resetting password: ${error}`);
    }
  }
);
// sign out
export const signOutUser = createAsyncThunk(
  'auth/logout',
  async (_, thunkApi) => {
    try {
      const response: any = await customFetch.delete('auth/logout');
      if (!response.ok) {
        throw new Error(response.data.msg);
      }
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(`Error logging out: ${error}`);
    }
  }
);
// show current user
export const currentUser = createAsyncThunk(
  'auth/show',
  async (_, thunkApi) => {
    try {
      const response: any = await customFetch.get('user/showMe');
      if (!response.ok) {
        throw new Error(response.data.msg);
      }
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(
        `Error retrieving current user: ${error}`
      );
    }
  }
);
// update user
export const updateUser = createAsyncThunk(
  'auth/update',
  async (data: UserDocument, thunkApi) => {
    try {
      const profile = true;
      const userData = customData(data, profile);
      const response: any = await customFetch.put(
        'user/update-user',
        userData,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (!response.ok) {
        throw new Error(response.data.msg);
      }
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(`Error updating user: ${error}`);
    }
  }
);
// change password
export const changePassword = createAsyncThunk(
  'auth/change-password',
  async (data: { oldPassword: string; newPassword: string }, thunkApi) => {
    try {
      const response: any = await customFetch.patch('user', data);
      if (!response.ok) {
        throw new Error(response.data.msg);
      }
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(`Error changing password: ${error}`);
    }
  }
);
// expo token
export const expoPushNotification = createAsyncThunk(
  'user/expoToken',
  async (expoPushToken: any, thunkApi) => {
    try {
      const response = await customFetch.post('user/expo-token', {
        expoToken: expoPushToken,
      });
      if (!response.ok) {
        throw new Error(response.problem);
      }
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(`Error posting expo token: ${error}`);
    }
  }
);

const authSlice = createSlice({
  name: 'AUTH',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    removeUser: (state) => {
      state.user = null;
    },
    showModal: (state) => {
      state.visible = true;
    },
    hideModal: (state) => {
      state.visible = false;
    },
  },
  extraReducers: (builder) => {
    // ********* sign-up *********
    builder
      .addCase(createUserAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUserAccount.fulfilled, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity(action.payload.msg, 15000, 0);
      })
      .addCase(createUserAccount.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
        ToastAndroid.showWithGravity(action.payload, 15000, 0);
      });
    // ********* resend code *********
    builder
      .addCase(resendAccountCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendAccountCode.fulfilled, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity(action.payload.msg, 15000, 0);
      })
      .addCase(resendAccountCode.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
        ToastAndroid.showWithGravity(action.payload, 15000, 0);
      });
    // ********* verify-email *********
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity(action.payload.msg, 15000, 0);
      })
      .addCase(verifyEmail.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
        ToastAndroid.showWithGravity(action.payload, 15000, 0);
      });

    // ********* sign-in *********
    builder
      .addCase(signInUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state, action: any) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(signInUser.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
        ToastAndroid.showWithGravity(action.payload, 15000, 0);
      });
    // ********* forgot password *********
    builder
      .addCase(requestResetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(requestResetPassword.fulfilled, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity(action.payload.msg, 15000, 0);
      })
      .addCase(requestResetPassword.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
        ToastAndroid.showWithGravity(action.payload, 15000, 0);
      });
    // ********* reset password *********
    builder
      .addCase(ResetUserPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ResetUserPassword.fulfilled, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity(action.payload.msg, 15000, 0);
      })
      .addCase(ResetUserPassword.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
        ToastAndroid.showWithGravity(action.payload, 15000, 0);
      });
    // ********* sign-out *********
    builder
      .addCase(signOutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signOutUser.fulfilled, (state, action: any) => {
        state.isLoading = false;
        state.user = null;
      })
      .addCase(signOutUser.rejected, (state, action: any) => {
        state.isLoading = false;
      });
    // ********* current user *********
    builder
      .addCase(currentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(currentUser.fulfilled, (state, action: any) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(currentUser.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
        ToastAndroid.showWithGravity(action.payload, 15000, 0);
      });
    // ********* update user *********
    builder
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action: any) => {
        state.isLoading = false;
        state.user = action.payload.user;
        ToastAndroid.showWithGravity('Success! user updated.', 15000, 0);
      })
      .addCase(updateUser.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
        ToastAndroid.showWithGravity(action.payload, 15000, 0);
      });
    // ********* change password *********
    builder
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity('Success! password changed.', 15000, 0);
      })
      .addCase(changePassword.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
        ToastAndroid.showWithGravity(action.payload, 15000, 0);
      });
    // expo token
    builder
      .addCase(expoPushNotification.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(expoPushNotification.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(expoPushNotification.rejected, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity(
          `Error! Expo token : ${action.payload}`,
          15000,
          0
        );
      });
  },
});

export const { setUser, removeUser, showModal, hideModal } = authSlice.actions;
export default authSlice.reducer;
