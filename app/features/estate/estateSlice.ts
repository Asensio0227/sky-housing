import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ToastAndroid } from 'react-native';
import customFetch from '../../utils/axios';
import { customD } from '../../utils/globals';
import { leaveReview } from '../reviews/reviewsSlice';
import { categoryOption, sortOptions, UIEstateDocument } from './types';

interface Houses {
  isLoading: boolean;
  houses: UIEstateDocument[];
  filteredHouses: UIEstateDocument[];
  featuredAds: UIEstateDocument[];
  singleHouse: UIEstateDocument | null | any;
  singleHouseWithComments: UIEstateDocument | null | any;
  userAds: UIEstateDocument[];
  userAdsTotal: Number;
  numOfUserAdsPages: Number;
  userAdsPage: Number;
  search: string;
  page: Number;
  userPage: Number;
  sort: string;
  sortOption: sortOptions[];
  category: string;
  categoryOptions: categoryOption[];
  totalAds: Number;
  numOfPages: Number;
  isRefreshing: Boolean | any;
  hasMore: Boolean;
}

const initialState: Houses = {
  hasMore: true,
  isLoading: false,
  houses: [],
  filteredHouses: [],
  singleHouse: null,
  singleHouseWithComments: null,
  featuredAds: [],
  userAds: [],
  userAdsTotal: 0,
  userAdsPage: 1,
  numOfUserAdsPages: 0,
  page: 1,
  userPage: 1,
  search: '',
  isRefreshing: false,
  sort: sortOptions.Newest,
  sortOption: Object.values(sortOptions),
  category: categoryOption.All,
  categoryOptions: Object.values(categoryOption),
  totalAds: 0,
  numOfPages: 0,
} satisfies Houses as Houses;

//  create ad
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
// retrieve all ads
export const retrieveAllAds = createAsyncThunk<
  any,
  string,
  { rejectValue: any }
>('estate/retrieve-all', async (_, thunkApi: any) => {
  const { search, page, sort, category } = thunkApi.getState().ESTATE;
  const params = new URLSearchParams({
    sort,
    category,
    page: String(page),
    ...(search && { search }),
  });
  const url = `estate?${params.toString()}`;
  try {
    const response = await customFetch.get(url);
    return response.data;
  } catch (error: any) {
    return thunkApi.rejectWithValue(`Error retrieving ad: ${error}`);
  }
});
// retrieve all ads
export const retrieveFilterAds = createAsyncThunk<
  any,
  string,
  { rejectValue: any }
>('estate/filter-all', async (_, thunkApi: any) => {
  const { search, page, sort, category } = thunkApi.getState().ESTATE;
  const params = new URLSearchParams({
    sort,
    category,
    page: String(page),
    ...(search && { search }),
  });
  const url = `estate?${params.toString()}`;
  try {
    const response = await customFetch.get(url);
    return response.data;
  } catch (error: any) {
    return thunkApi.rejectWithValue(`Error retrieving ad: ${error}`);
  }
});
// retrieve ad
export const retrieveAd = createAsyncThunk<any, string, { rejectValue: any }>(
  'estate/retrieve-ad',
  async (productId, thunkApi: any) => {
    try {
      const response = await customFetch.get(`estate/${productId}`);
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(`Error retrieving ad: ${error}`);
    }
  }
);
// retrieve ad with comments
export const retrieveAdWithComments = createAsyncThunk<
  any,
  string,
  { rejectValue: any }
>('estate/retrieve-ad-with-comments', async (productId, thunkApi) => {
  try {
    const response = await customFetch.get(`estate/${productId}/reviews`);
    return response.data;
  } catch (error: any) {
    return thunkApi.rejectWithValue(
      `Error fetching ad with comments: ${error}`
    );
  }
});
// retrieve user ads
export const retrieveUserAds = createAsyncThunk(
  'estate/retrieve-user-ads',
  async (_, thunkApi: any) => {
    const { userPage, sort, category } = thunkApi.getState().ESTATE;
    const params = new URLSearchParams({
      sort,
      category,
      page: String(userPage),
    });
    let url = `estate/user-ads?${params.toString()}`;
    try {
      const response = await customFetch.get(url);
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(`Error fetching user's ads : ${error}`);
    }
  }
);
// update ad
export const updateAd = createAsyncThunk(
  'estate/update-ad',
  async (data: any, thunkApi) => {
    try {
      const listing = customD(data);
      const response = await customFetch.put(
        `estate/update-ad/${data.id}`,
        listing,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (!response.ok) {
        throw new Error(response.originalError.message);
      }
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(`Error updating ${data.id},${error}`);
    }
  }
);
// delete ad
export const deleteAd = createAsyncThunk(
  'estate/remove-ad',
  async (productId, thunkApi) => {
    try {
      const response = await customFetch.delete(`estate/${productId}`);
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(`Error deleting ${productId}, ${error}`);
    }
  }
);
// mark as taken
export const markAdAsTaken = createAsyncThunk(
  'estate/taken',
  async (productId, thunkApi) => {
    try {
      const response = await customFetch.patch(`estate/${productId}`);
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(
        `Error changing ad status ${productId}, ${error}`
      );
    }
  }
);

const estateSlice = createSlice({
  name: 'ESTATE',
  initialState,
  reducers: {
    handleChange: (state: any, { payload: { name, value } }) => {
      state.page = 1;
      state[name] = value;
    },
    setPage: (state, action) => {
      state.page = action.payload;
      state.houses = [];
    },
    clearFilters: (state) => {
      return { ...state };
    },
    resetAds: (state) => {
      return { ...initialState };
    },
    setIsReFreshing: (state, action) => {
      state.isRefreshing = action.payload;
    },
    removeAd: (state, action) => {
      state.userAds.filter((ad: any) => ad._id_ !== action.payload);
      state.houses.filter((ad: any) => ad._id_ !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // create ad
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
    // retrieve all ads
    builder
      .addCase(retrieveAllAds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(retrieveAllAds.fulfilled, (state: any, action: any) => {
        const { totalAds, numOfPages, ads } = action.payload;

        if (ads && ads.length === 0) {
          state.hasMore = false;
        } else {
          const houseMap = new Map(state.houses.map((h: any) => [h.id, h]));
          ads.forEach((newAd: UIEstateDocument) => {
            houseMap.set(newAd.id, newAd);
          });
          state.houses = Array.from(houseMap.values());
          // state.houses.sort(
          //   (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          // );
          state.totalAds = totalAds;
          state.numOfPages = numOfPages;
          state.page += 1;

          state.featuredAds = state.houses.filter(
            (item: UIEstateDocument) => item.featured
          );
        }

        state.isLoading = false;
      })
      .addCase(retrieveAllAds.rejected, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity(
          `Error retrieving ads: ${action.payload}`,
          15000,
          0
        );
      });
    // retrieve filter ads
    builder
      .addCase(retrieveFilterAds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(retrieveFilterAds.fulfilled, (state: any, action: any) => {
        const { filteredAds } = action.payload;
        state.isLoading = false;
        state.filteredHouses = filteredAds;
      })
      .addCase(retrieveFilterAds.rejected, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity(
          `Error retrieving ads: ${action.payload}`,
          15000,
          0
        );
      });
    // retrieve ad
    builder
      .addCase(retrieveAd.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(retrieveAd.fulfilled, (state, action) => {
        state.isLoading = false;
        const { ad }: any = action.payload;
        state.singleHouse = ad;
      })
      .addCase(retrieveAd.rejected, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity(
          `Error retrieving ad: ${action.payload}`,
          15000,
          0
        );
      });
    // retrieve ad with comments
    builder
      .addCase(retrieveAdWithComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(retrieveAdWithComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.singleHouseWithComments = action.payload;
      })
      .addCase(retrieveAdWithComments.rejected, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity(
          `Error retrieving ad: ${action.payload}`,
          15000,
          0
        );
      });
    builder
      .addCase(retrieveUserAds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(retrieveUserAds.fulfilled, (state: any, action) => {
        if (action.payload.ads.length === 0) {
          state.hasMore = false;
        } else {
          const { totalAds, numOfPages, ads } = action.payload;
          const newAds = ads;
          state.userAds = [
            ...state.userAds,
            ...newAds.filter(
              (newAd: UIEstateDocument) =>
                !state.userAds.some(
                  (existingAd: UIEstateDocument) => existingAd._id === newAd._id
                )
            ),
          ];
          state.numOfUserAdsPages = numOfPages;
          state.userAdsTotal = totalAds;
          state.userPage += 1;
        }
        state.isLoading = false;
      })
      .addCase(retrieveUserAds.rejected, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity(
          `Error retrieving ad: ${action.payload.msg}`,
          15000,
          0
        );
      });
    builder
      .addCase(updateAd.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAd.fulfilled, (state, action: any) => {
        state.isLoading = false;
        state.houses = action.payload;
      })
      .addCase(updateAd.rejected, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity(
          `Error retrieving ad: ${action.payload}`,
          15000,
          0
        );
      });
    builder
      .addCase(deleteAd.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAd.fulfilled, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity(
          action.payload.msg || `Success! Ad removed from the list`,
          15000,
          0
        );
      })
      .addCase(deleteAd.rejected, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity(
          `Error retrieving ad: ${action.payload}`,
          15000,
          0
        );
      });
    builder
      .addCase(markAdAsTaken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(markAdAsTaken.fulfilled, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity(
          action.payload.msg || `Success! Ad marked as taken`,
          15000,
          0
        );
      })
      .addCase(markAdAsTaken.rejected, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity(
          `Error changing ad status: ${action.payload}`,
          15000,
          0
        );
      });
    builder
      .addCase(leaveReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(leaveReview.fulfilled, (state, action) => {
        state.isLoading = false;
        const { review, houseId } = action.payload;

        const index = state.houses.findIndex(
          (h) => h._id === houseId || h.id === houseId
        );

        if (index !== -1) {
          const existingHouse: UIEstateDocument | any = state.houses[index];
          const numOfReviews = (existingHouse.numOfReviews || 0) + 1;
          const rating = review.rating || 0;

          const totalRating =
            (existingHouse.average_rating || 0) * (numOfReviews - 1) + rating;

          const updatedHouse = {
            ...existingHouse,
            numOfReviews,
            average_rating: totalRating / numOfReviews,
            reviews: Array.isArray(existingHouse.reviews)
              ? [...existingHouse.reviews, review]
              : [review],
          };

          state.houses[index] = updatedHouse;
        }

        const updateSingleHouse = (house: any) => {
          if (house && (house._id === houseId || house.id === houseId)) {
            house.numOfReviews = (house.numOfReviews || 0) + 1;

            if (typeof house.average_rating === 'number' && review.rating) {
              const totalRating =
                house.average_rating * (house.numOfReviews - 1) + review.rating;
              house.average_rating = totalRating / house.numOfReviews;
            }

            if (Array.isArray(house.reviews)) {
              house.reviews.push(review);
            }
          }
        };

        updateSingleHouse(state.singleHouse);
        updateSingleHouse(state.singleHouseWithComments);
      })
      .addCase(leaveReview.rejected, (state, action: any) => {
        state.isLoading = false;
      });
  },
});

export const {
  handleChange,
  setPage,
  clearFilters,
  resetAds,
  setIsReFreshing,
  removeAd,
} = estateSlice.actions;
export default estateSlice.reducer;
