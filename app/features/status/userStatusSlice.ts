import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const setOnline = createAsyncThunk(
  'userStatus/setOnline',
  async (_, thunkAPI: any) => {
    try {
      return null;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

const userStatusSlice = createSlice({
  name: 'userStatus',
  initialState: {
    status: 'offline',
    lastSeen: null as string | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setOnline.pending, (state) => {
        state.loading = true;
      })
      .addCase(setOnline.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(setOnline.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to set online';
        state.loading = false;
      });
  },
});

export default userStatusSlice.reducer;
