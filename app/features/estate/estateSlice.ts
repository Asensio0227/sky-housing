import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { ToastAndroid } from 'react-native';
import customFetch, { url } from '../../utils/axios';
import { customD } from '../../utils/globals';
import { IPhoto, sortOptions, UIEstateDocument } from './types';

interface Houses {
  isLoading: boolean;
  houses: UIEstateDocument[];
  singleHouse: UIEstateDocument | null | any;
  search: string;
  page: Number;
  sort: string;
  sortOption: sortOptions[];
  totalAds: Number;
  numOfPages: Number;
}

const initialState: Houses = {
  isLoading: false,
  houses: [],
  singleHouse: null,
  page: 1,
  search: '',
  sort: sortOptions.Newest,
  sortOption: Object.values(sortOptions),
  totalAds: 0,
  numOfPages: 0,
} satisfies Houses as Houses;

export const createAd = createAsyncThunk(
  'estate/create',
  async (
    { data, onUploadProgress }: { data: any; onUploadProgress?: any },
    thunkApi
  ) => {
    try {
      const listing = customD(data);
      const response: any = await customFetch.post('estate', listing, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progress: any) =>
          onUploadProgress(progress.loaded / progress.total),
      });
      if (!response.ok) {
        throw new Error(response.originalError.message);
      }

      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(`Error creating ad: ${error}`);
    }
  }
);

const estateSlice = createSlice({
  name: 'estate',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAd.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAd.fulfilled, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity('Ad created successfully', 15000, 0);
      })
      .addCase(createAd.rejected, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity(
          `Error creating ad: ${action.payload}`,
          15000,
          0
        );
      });
  },
});

export const {} = estateSlice.actions;
export default estateSlice.reducer;
