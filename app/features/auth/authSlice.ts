import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ToastAndroid } from 'react-native';
import { UserDocument } from '../../components/form/FormInput';
import customFetch from '../../utils/axios';
import { customData } from '../../utils/globals';

interface authState {
  user: UserDocument | any;
  isLoading: boolean;
  error: string | null;
}

const initialState = {
  user: null,
  isLoading: false,
  error: '',
} satisfies authState as authState;

// create account
export const createUserAccount = createAsyncThunk(
  'auth/sign-up',
  async (userData: UserDocument | any, thunkAPi) => {
    try {
      const data = customData(userData);
      const response: any = await customFetch.post(`auth/register`, data);
      if (!response.ok) {
        console.log(response.data?.msg);
      }
      return response.data;
    } catch (error: any) {
      return thunkAPi.rejectWithValue(
        `Could not register user: ${error.response.data}`
      );
    }
  }
);
// resend code
export const resendAccountCode = createAsyncThunk(
  'auth/resend-code',
  async (email: string, thunkApi) => {
    try {
      const response = await customFetch.post(`auth/resend-code`, email);
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(
        `Error resending code: ${error.response.data}`
      );
    }
  }
);
// verify-email
export const verifyEmail = createAsyncThunk(
  'auth/verify-email',
  async (data: any, thunkApi) => {
    try {
      const { email, token } = data;
      const response = await customFetch.post('auth/verify-email', {
        email,
        verificationToken: Number(token),
      });
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(
        `Error verifying email: ${error.response.data}`
      );
    }
  }
);
// sign-in
export const signInUser = createAsyncThunk(
  'auth/sign-in',
  async (userData: UserDocument, thunkApi) => {
    try {
      const response = await customFetch.post('auth/login', userData);
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(`Error sign-in: ${error.response.data}`);
    }
  }
);
// forgot password
export const requestResetPassword = createAsyncThunk(
  'auth/forgot-password',
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      const response = await customFetch.post('auth/forgot-password', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(`Error forgot password: ${error.response.data}`);
    }
  }
);
// reset password
export const ResetUserPassword = createAsyncThunk(
  'auth/reset-password',
  async (data: any, thunkApi) => {
    try {
      const { email, token, password } = data;
      const response = await customFetch.post(`auth/reset-password`, {
        email,
        token: Number(token),
        password,
      });
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(
        `Error resetting password: ${error.response.data}`
      );
    }
  }
);
// sign out
export const signOutUser = createAsyncThunk(
  'auth/logout',
  async (_, thunkApi) => {
    try {
      await customFetch.delete('auth/logout');
    } catch (error: any) {
      return thunkApi.rejectWithValue(
        `Error logging out: ${error.response.data}`
      );
    }
  }
);
// show current user
export const currentUser = createAsyncThunk(
  'auth/show',
  async (_, thunkApi) => {
    try {
      const response = await customFetch.get('user/showMe');
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(
        `Error retrieving current user: ${error.response.data}`
      );
    }
  }
);
// update user
export const updateUser = createAsyncThunk(
  'auth/update',
  async (data: UserDocument, thunkApi) => {
    try {
      console.log(`===data====`);
      console.log(data);
      console.log(`===data====`);
      // const userData = customData(data);
      console.log(`===userData====`);
      // console.log(userData);
      console.log(`===userData====`);
      const response = await customFetch.put('user/update-user', data);
      console.log(`=====response=====`);
      console.log(response);
      console.log(`=====response=====`);
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(
        `Error updating user: ${error.response.data}`
      );
    }
  }
);

const authSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    removeUser: (state) => {
      state.user = null;
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
        ToastAndroid.showWithGravity(
          action.payload || 'Success! logging out....',
          15000,
          0
        );
      })
      .addCase(signOutUser.rejected, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity(action.payload.msg, 15000, 0);
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
        // state.user = action.payload.user;
        console.log(`===fulfilled====`);
        console.log(action);
        console.log(`===fulfilled====`);
        ToastAndroid.showWithGravity('Success! user updated.', 15000, 0);
      })
      .addCase(updateUser.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
        console.log(`===rejected====`);
        console.log(action);
        console.log(`===rejected====`);
        ToastAndroid.showWithGravity('Success! user updated.', 15000, 0);
      });
    // ********* change password *********
  },
});

export const { setUser, removeUser } = authSlice.actions;
export default authSlice.reducer;
