import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ToastAndroid } from 'react-native';
import customFetch from '../../utils/axios';
import { UIReviewDocument } from './types';

interface Reviews {
  isLoading: boolean;
  reviews: UIReviewDocument[];
  page: number;
  totalReviews: number;
  numOfPages: number;
  hasMore: boolean;
}

const initialState: Reviews = {
  isLoading: false,
  reviews: [],
  page: 1,
  totalReviews: 0,
  numOfPages: 0,
  hasMore: true,
} satisfies Reviews as Reviews;

// create review
export const leaveReview = createAsyncThunk(
  'review/create',
  async (data, thunkApi: any) => {
    try {
      const { houses } = thunkApi.getState().ESTATE;
      const { data: reviews } = await customFetch.post('review', data);
      return { reviews, houses };
    } catch (error: any) {
      return thunkApi.rejectWithValue('Error creating review' + error);
    }
  }
);
// retrieve ads
export const retrieveAllReviews = createAsyncThunk(
  'review/retrieveAllReviews',
  async (_, thunkApi: any) => {
    try {
      const { page, category } = thunkApi.getState().Reviews;
      const params = new URLSearchParams({
        category,
        page: String(page),
      });
      let url = `review?${params.toString()}`;
      const response = await customFetch.get(url);
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(`Error retrieving comments ${error}`);
    }
  }
);

const reviewsSlice = createSlice({
  name: 'Reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(leaveReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(leaveReview.fulfilled, (state, action: any) => {
        state.isLoading = false;
        state.reviews.unshift(action.payload);
        state.totalReviews++;
      })
      .addCase(leaveReview.rejected, (state, action) => {
        state.isLoading = false;
        console.error('Error creating review:', action.error.message);
      });
    builder
      .addCase(retrieveAllReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(retrieveAllReviews.fulfilled, (state, action: any) => {
        const { totalReviews, numOfPages, review } = action.payload;
        if (review && review.length === 0) {
          state.hasMore = false;
        } else {
          const newAds = review;
          state.reviews = [
            ...state.reviews,
            ...newAds.filter(
              (newAd: UIReviewDocument) =>
                !state.reviews.some(
                  (existingAd: UIReviewDocument) => existingAd.id === newAd.id
                )
            ),
          ];
          state.totalReviews = totalReviews;
          state.numOfPages = numOfPages;
          state.page += 1;
        }
        state.isLoading = false;
      })
      .addCase(retrieveAllReviews.rejected, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity(
          'Error fetching reviews' + action.payload,
          15000,
          0
        );
        console.log(`====action rejected while fetching reviews==`);
        console.log(action);
        console.log(`====action rejected while fetching reviews==`);
      });
  },
});

export const {} = reviewsSlice.actions;
export default reviewsSlice.reducer;
