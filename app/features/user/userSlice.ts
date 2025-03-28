import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ToastAndroid } from 'react-native';
import { UserDocument } from '../../components/form/FormInput';
import customFetch from '../../utils/axios';

interface userState {
  isLoading: boolean;
  users: UserDocument[];
  singleUser: UserDocument | null | any;
  page: Number;
  search: string;
  sort: string;
  sortOption: sortOptions[];
  totalUsers: Number;
  numOfPages: Number;
}

enum sortOptions {
  Az = 'a-z',
  Za = 'z-a',
  Newest = 'newest',
  Oldest = 'oldest',
}

const initialState = {
  isLoading: false,
  users: [],
  singleUser: null,
  page: 1,
  sort: sortOptions.Newest,
  search: '',
  sortOption: Object.values(sortOptions),
  totalUsers: 0,
  numOfPages: 0,
} satisfies userState as userState;

export const retrieveAllUsers = createAsyncThunk(
  'users/all',
  async (_, thunkApi: any) => {
    const { page, search, sort } = thunkApi.getState().user;
    const params = new URLSearchParams({
      page: String(page),
      sort,
      ...(search && { search }),
    });
    const url = `user?${params.toString()}`;
    try {
      const response: any = await customFetch.get(url);
      if (!response.ok) {
        throw new Error(response.data.msg);
      }
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(`Error fetching user: ${error}`);
    }
  }
);

export const retrieveUser = createAsyncThunk(
  'users/id',
  async (id: string, thunkApi) => {
    try {
      const response: any = await customFetch.get(`user/${id}`);
      if (!response.ok) {
        throw new Error(response.data.msg);
      }
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(`Error retrieving user: ${error}`);
    }
  }
);

const userSlice = createSlice({
  name: 'USER',
  initialState,
  reducers: {
    handleChange: (state: any, { payload: { name, value } }) => {
      state.page = 1;
      state[name] = value;
    },
    handlePage: (state, { payload }) => {
      state.page = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(retrieveAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(retrieveAllUsers.fulfilled, (state, action: any) => {
        state.isLoading = false;
        const { users, numOfPages, totalUsers } = action.payload;
        state.users = users;
        state.numOfPages = numOfPages;
        state.totalUsers = totalUsers;
        console.log(`====fulfilled all====`);
        console.log(action);
        console.log(`====fulfilled all====`);
      })
      .addCase(retrieveAllUsers.rejected, (state, action: any) => {
        state.isLoading = false;
        console.log(`=====rejected all=====`);
        console.log(action);
        console.log(`=====rejected all=====`);
        ToastAndroid.showWithGravity(action.payload, 15000, 0);
      });
    builder
      .addCase(retrieveUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(retrieveUser.fulfilled, (state, action: any) => {
        state.isLoading = false;
        state.singleUser = action.payload.user;
        console.log(`==== fulfilled retrieve==== `);
        console.log(action);
        console.log(`====fulfilled retrieve====`);
      })
      .addCase(retrieveUser.rejected, (state, action: any) => {
        state.isLoading = false;
        console.log(`=====rejected retrieve=====`);
        console.log(action);
        console.log(`=====rejected retrieve=====`);
        ToastAndroid.showWithGravity(action.payload, 15000, 0);
      });
  },
});

export const {} = userSlice.actions;
export default userSlice.reducer;
