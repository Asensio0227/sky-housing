import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { UserDocument } from '../../components/form/FormInput';
import customFetch from '../../utils/axios';
import { Messages, Room } from './types';

interface roomState {
  conversations: Room[];
  filteredConversations: Room[];
  conversationsWithNewMessages: Messages[] | Room[] | any;
  messages: Messages[];
  contact: UserDocument[];
  isLoading: boolean;
  page: number;
  unreadCount: number;
}

const initialState: roomState = {
  conversations: [],
  filteredConversations: [],
  conversationsWithNewMessages: [],
  messages: [],
  contact: [],
  isLoading: true,
  page: 1,
  unreadCount: 0,
} satisfies roomState as roomState;

// =========ROOM=======
// create conversation
export const createConversation = createAsyncThunk(
  'room/create',
  async (data: any, thunkApi) => {
    try {
      const response = await customFetch.post('room', data);
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(`Error creating room ${error}`);
    }
  }
);
// retrieve all room (user)
export const retrieveUserConversation = createAsyncThunk(
  'room/user',
  async (_, thunkApi: any) => {
    try {
      const { page } = thunkApi.getState().Chats;
      const params = new URLSearchParams({
        page: String(page),
      });
      let url = `room?${params.toString()}`;
      const response = await customFetch.get(url);
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(`Error fetch user room ${error}`);
    }
  }
);
// updated room
export const updateConversation = createAsyncThunk(
  'room/update',
  async (data: any, thunkApi: any) => {
    try {
      const user = thunkApi.getState.Auth.user;
      const { id, lastMessage } = data;
      const { data: resp } = await customFetch.put(`room/${id}`, {
        lastMessage,
      });
      return { user, resp };
    } catch (error: any) {
      return thunkApi.rejectWithValue(`Error updating room ${error}`);
    }
  }
);
// remove room
export const removeRoom = createAsyncThunk(
  'room/remove',
  async (id, thunkApi: any) => {
    try {
      const response = await customFetch.delete(`room/${id}`);
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(`Error removing room ${error}`);
    }
  }
);
// a room
export const retrieveRoom = createAsyncThunk(
  'room/retrieve',
  async (id, thunkApi: any) => {
    try {
      const response = await customFetch.get(`room/${id}`);
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(`Error retrieving room ${error}`);
    }
  }
);
// ========MESSAGE======
// create
export const createMsg = createAsyncThunk(
  'message/create',
  async (data: any, thunkApi: any) => {
    try {
      const response = await customFetch.post('message', data);
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(`Error creating msg ${error}`);
    }
  }
);
// retrieve msg
export const retrieveMsg = createAsyncThunk(
  'message/retrieve',
  async (roomId: any, thunkApi: any) => {
    try {
      const response = await customFetch.get(`message/${roomId}`);
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(`Error retrieving msg ${error}`);
    }
  }
);
// update msg
export const updateMsg = createAsyncThunk(
  'message/update',
  async (data: any, thunkApi: any) => {
    try {
      const response = await customFetch.put(`message/${data._id}`, data);
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(`Error updating msg ${error}`);
    }
  }
);
// delete msg
export const deleteMsg = createAsyncThunk(
  'message/delete',
  async (id: any, thunkApi: any) => {
    try {
      const response = await customFetch.delete(`message/${id}`);
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(`Error deleting msg ${error}`);
    }
  }
);

const chatsSlice = createSlice({
  name: 'Chats',
  initialState,
  reducers: {},
  extraReducers(builder) {},
});

export const {} = chatsSlice.actions;
export default chatsSlice.reducer;
