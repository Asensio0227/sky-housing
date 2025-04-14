import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { ToastAndroid } from 'react-native';
import customFetch from '../../utils/axios';

interface notifyState {
  isLoading: boolean;
  notify: any;
  totalNotify: number;
  page: number;
  numOfPage: number;
}

const initialState = {
  isLoading: false,
  notify: [],
  totalNotify: 0,
  page: 1,
  numOfPage: 1,
} satisfies notifyState as notifyState;

export const sendNotifications = createAsyncThunk(
  'notify/create',
  async (data: any, thunkApi) => {
    try {
      const response = await customFetch.post('notify', data);
      return response.data;
    } catch (err: any) {
      const error = err as AxiosError;
      const message =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        'An unknown error occurred while retrieving messages';

      return thunkApi.rejectWithValue(`Error retrieving messages: ${message}`);
    }
  }
);

export const retrieveNotification = createAsyncThunk(
  'notify/retrieve',
  async (_, thunkApi) => {
    try {
      const response = await customFetch.get('notify');
      return response.data;
    } catch (err: any) {
      const error = err as AxiosError;
      const message =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        'An unknown error occurred while retrieving messages';

      return thunkApi.rejectWithValue(`Error retrieving messages: ${message}`);
    }
  }
);

const notifySlice = createSlice({
  name: 'NOTIFY',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(retrieveNotification.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(retrieveNotification.fulfilled, (state, action: any) => {
        state.isLoading = false;
        const { notifications, totalNotifications, numOfPages } =
          action.payload;
        state.notify = notifications;
        state.numOfPage = numOfPages;
        state.totalNotify = totalNotifications;
      })
      .addCase(retrieveNotification.rejected, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity(
          action.payload || action.payload.msg || 'An error occurred',
          15000,
          0
        );
      });
  },
});

export const {} = notifySlice.actions;
export default notifySlice.reducer;
