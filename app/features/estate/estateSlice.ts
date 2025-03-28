import {
  createAsyncThunk,
  createSlice,
  GetThunkAPI,
  ThunkAction,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { ToastAndroid } from 'react-native';
import customFetch, { url } from '../../utils/axios';
import { customD } from '../../utils/globals';
import {
  AsyncThunkConfig,
  categoryOption,
  IPhoto,
  sortOptions,
  UIEstateDocument,
} from './types';

interface Houses {
  isLoading: boolean;
  houses: UIEstateDocument[];
  featuredAds: UIEstateDocument[];
  singleHouse: UIEstateDocument | null | any;
  singleHouseWithComments: UIEstateDocument | null | any;
  userAds: UIEstateDocument[];
  userAdsTotal: Number;
  numOfUserAdsPages: Number;
  userAdsPage: Number;
  search: string;
  page: Number;
  sort: string;
  sortOption: sortOptions[];
  category: string;
  categoryOptions: categoryOption[];
  totalAds: Number;
  numOfPages: Number;
}

const initialState: Houses = {
  isLoading: false,
  houses: [],
  singleHouse: null,
  singleHouseWithComments: null,
  featuredAds: [],
  userAds: [],
  userAdsTotal: 0,
  userAdsPage: 1,
  numOfUserAdsPages: 0,
  page: 1,
  search: '',
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
export const retrieveAllAds = createAsyncThunk(
  'estate/retrieve-all',
  async (_, thunkApi: any) => {
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
  }
);
// retrieve ad
export const retrieveAd = createAsyncThunk(
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
export const retrieveAdWithComments = createAsyncThunk(
  'estate/retrieve-ad-with-comments',
  async (productId, thunkApi) => {
    try {
      const response = await customFetch.get(`estate/${productId}/reviews`);
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(
        `Error fetching ad with comments: ${error}`
      );
    }
  }
);
// retrieve user ads
export const retrieveUserAds = createAsyncThunk(
  'estate/retrieve-user-ads',
  async (_, thunkApi: any) => {
    const { page, sort, category } = thunkApi.getState().ESTATE;
    const params = new URLSearchParams({
      sort,
      category,
      page: String(page),
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
      const response = await customFetch.put(
        `estate/update-ad/${data.id}`,
        data
      );
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
      .addCase(retrieveAllAds.fulfilled, (state, action: any) => {
        state.isLoading = false;
        const { numOfPages, ads, totalAds, page } = action.payload;
        state.houses = ads;
        state.totalAds = totalAds;
        state.numOfPages = numOfPages;
        state.page = page;
        state.featuredAds = ads.filter(
          (item: UIEstateDocument) => item.featured === true
        );
      })
      .addCase(retrieveAllAds.rejected, (state, action: any) => {
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
      .addCase(retrieveAd.pending, (state, action) => {
        state.isLoading = false;
        const { ad }: any = action.payload;
        state.singleHouse = ad;
        console.log(`=====retrieve ad fulfilled====`);
        console.log(action);
        console.log(`=====retrieve ad fulfilled====`);
      })
      .addCase(retrieveAd.rejected, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity(
          `Error retrieving ad: ${action.payload}`,
          15000,
          0
        );
        console.log(`=====retrieve ad rejected====`);
        console.log(action);
        console.log(`=====retrieve ad rejected====`);
      });
    // retrieve ad with comments
    builder
      .addCase(retrieveAdWithComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(retrieveAdWithComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.singleHouseWithComments = action.payload;
        console.log(`=====retrieve ad with comments fulfilled====`);
        console.log(action);
        console.log(`=====retrieve ad with comments fulfilled====`);
      })
      .addCase(retrieveAdWithComments.rejected, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity(
          `Error retrieving ad: ${action.payload}`,
          15000,
          0
        );
        console.log(`=====retrieve ad with comments rejected====`);
        console.log(action);
        console.log(`=====retrieve ad with comments rejected====`);
      });
    builder
      .addCase(retrieveUserAds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(retrieveUserAds.fulfilled, (state, action) => {
        state.isLoading = true;
        const { totalAds, numOfPages, ads } = action.payload;
        state.userAds = ads;
        state.numOfUserAdsPages = numOfPages;
        state.userAdsTotal = totalAds;
        console.log(`=====retrieve user ads fulfilled====`);
        console.log(action);
        console.log(`=====retrieve user ads fulfilled====`);
      })
      .addCase(retrieveUserAds.rejected, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity(
          `Error retrieving ad: ${action.payload}`,
          15000,
          0
        );
        console.log(`=====retrieve user ads rejected====`);
        console.log(action);
        console.log(`=====retrieve user ads  rejected====`);
      });
    builder
      .addCase(updateAd.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAd.fulfilled, (state, action: any) => {
        state.isLoading = false;
        state.houses = action.payload;
        console.log(`=====updating ad fulfilled====`);
        console.log(action);
        console.log(`=====updating ad  fulfilled====`);
      })
      .addCase(updateAd.rejected, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity(
          `Error retrieving ad: ${action.payload}`,
          15000,
          0
        );
        console.log(`=====updating ad rejected====`);
        console.log(action);
        console.log(`=====updating ad  rejected====`);
      });
    builder
      .addCase(deleteAd.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAd.fulfilled, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity(
          `Success! Ad removed ${action.payload} from the list`,
          15000,
          0
        );
        console.log(`=====removing ad fulfilled====`);
        console.log(action);
        console.log(`=====removing ad  fulfilled====`);
      })
      .addCase(deleteAd.rejected, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity(
          `Error retrieving ad: ${action.payload}`,
          15000,
          0
        );
        console.log(`=====removing ad rejected====`);
        console.log(action);
        console.log(`=====removing ad  rejected====`);
      });
  },
});

export const { handleChange } = estateSlice.actions;
export default estateSlice.reducer;
