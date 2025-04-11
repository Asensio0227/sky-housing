import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { ToastAndroid } from 'react-native';
import { UserDocument } from '../../components/form/FormInput';
import customFetch from '../../utils/axios';
import { customMsg } from '../../utils/globals';
import { Messages, Room } from './types';

interface roomState {
  conversations: Room[];
  filteredConversations: Room[];
  selectedRoom: Room | null;
  conversationsWithNewMessages: Messages[] | Room[] | any;
  messages: Messages[];
  contact: UserDocument[];
  isLoading: boolean;
  page: number;
  unreadCount: number;
  hasMore: boolean;
}

const initialState: roomState = {
  conversations: [],
  hasMore: true,
  filteredConversations: [],
  conversationsWithNewMessages: [],
  selectedRoom: null,
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
      const { user } = thunkApi.getState().AUTH;
      const params = new URLSearchParams({
        page: String(page),
      });
      let url = `room?${params.toString()}`;
      const { data } = await customFetch.get(url);
      return { data, user };
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
      console.log(`==== data create msg====`);
      console.log(data);
      console.log(`==== data create msg====`);
      const formData = customMsg(data);
      console.log(`===formData===`);
      console.log(formData);
      console.log(`===formData===`);
      const response = await customFetch.post('message', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(`Error creating msg ${error}`);
    }
  }
);
// retrieve msg
interface RetrieveMsgArgs {
  roomId: string;
  page: number;
}

export const retrieveMsg = createAsyncThunk(
  'message/retrieve',
  async ({ roomId, page }: RetrieveMsgArgs, thunkApi) => {
    try {
      if (__DEV__) {
        console.log(
          `🔁 Retrieving messages for roomId: ${roomId}, page: ${page}`
        );
      }

      const params = new URLSearchParams({ page: String(page) });
      const url = `message/${roomId}?${params.toString()}`;

      const response = await customFetch.get(url);

      return response.data;
    } catch (err: unknown | any) {
      const error = err as AxiosError;
      const message =
        error.response?.data?.message ||
        error.message ||
        'An unknown error occurred while retrieving messages';

      return thunkApi.rejectWithValue(`Error retrieving messages: ${message}`);
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
  reducers: {
    resetConversations: (state) => {
      state.conversations = [];
      state.filteredConversations = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers(builder) {
    // create conversation
    builder
      .addCase(createConversation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createConversation.fulfilled, (state, action: any) => {
        state.isLoading = false;
        const room = action.payload.newRoom || action.payload.existingRoom;
        const roomId = room._id;
        const roomExists = state.filteredConversations.some(
          (conv: any) => conv._id === roomId
        );
        const conExist = state.conversations.some(
          (conv: any) => conv._id === roomId
        );
        if (!roomExists && !conExist) {
          state.filteredConversations = [...state.filteredConversations, room];
          state.conversations = [...state.conversations, room];
        } else {
          state.conversations = state.conversations.map((conv: any) =>
            conv._id === roomId ? { ...conv, ...room } : conv
          );
          state.filteredConversations = state.filteredConversations.map(
            (conv: any) => (conv._id === roomId ? { ...conv, ...room } : conv)
          );
        }
        state.conversations = state.conversations.map((conv: any) =>
          conv._id === room._id ? { ...conv, ...room } : conv
        );
        console.log(`===fulfilled retrieve user rooms=-=`);
        console.log(action);
        console.log(`===fulfilled retrieve user rooms=-=`);
      })
      .addCase(createConversation.rejected, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity(
          `Error while creating conversation: ${action.payload}`,
          1000,
          0
        );
      });
    // retrieve User Conversation
    builder
      .addCase(retrieveUserConversation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(retrieveUserConversation.fulfilled, (state, action: any) => {
        state.isLoading = false;

        console.log(`===action===`);
        console.log(action);
        console.log(`===action===`);
        const {
          user,
          data: { rooms, page },
        } = action.payload;

        const email = user.email;

        const parsedChat =
          email &&
          rooms.map((doc: any) => ({
            ...doc,
            userB: doc.participants.find((p: any) => p.email !== email),
          }));

        const filtered = parsedChat.filter((doc: any) => doc.lastMessage);

        const existingIds = new Set(state.conversations.map((c: any) => c._id));
        const newFiltered = filtered.filter(
          (doc: any) => !existingIds.has(doc._id)
        );
        state.filteredConversations.push(...newFiltered);
        state.conversations.push(...newFiltered);

        state.page += 1;
        state.hasMore = newFiltered.length > 0;
        console.log(`==== create room fulfilled===`);
        console.log(action);
        console.log(`==== create room fulfilled===`);
      })
      .addCase(retrieveUserConversation.rejected, (state, action: any) => {
        state.isLoading = false;
        ToastAndroid.showWithGravity(
          `Error retrieving user's conversation history: ${action.payload}`,
          1000,
          0
        );
        console.log(`===Error retrieving user's conversation rejected=== `);
        console.log(action);
        console.log(`===Error retrieving user's conversation rejected=== `);
      });
    // update room
    builder
      .addCase(updateConversation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateConversation.fulfilled, (state, action: any) => {
        state.isLoading = false;
        const updatedRoom = action.payload.rooms;
        state.conversations = state.conversations.map((conv: any) =>
          conv._id === updatedRoom._id ? { ...conv, ...updatedRoom } : conv
        );
        state.filteredConversations = state.filteredConversations.map((conv) =>
          conv._id === updatedRoom._id ? { ...conv, ...updatedRoom } : conv
        );
      })
      .addCase(updateConversation.rejected, (state, action: any) => {
        state.isLoading = false;
        console.error('Update failed:', action.payload);
      });
    // remove room
    builder
      .addCase(removeRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        const removedId = action.payload._id || action.meta.arg;

        state.conversations = state.conversations.filter(
          (conv) => conv._id !== removedId
        );

        state.filteredConversations = state.filteredConversations.filter(
          (conv) => conv._id !== removedId
        );

        state.conversationsWithNewMessages =
          state.conversationsWithNewMessages.filter(
            (conv: any) => conv._id !== removedId
          );
      })
      .addCase(removeRoom.rejected, (state, action) => {
        state.isLoading = false;
        console.error('Remove failed:', action.payload);
      });
    // a room
    builder
      .addCase(retrieveRoom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(retrieveRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedRoom = action.payload;
      })
      .addCase(retrieveRoom.rejected, (state, action) => {
        state.isLoading = false;
        console.error('Fetching single room failed:', action.payload);
      });
    // create msg
    builder
      .addCase(createMsg.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createMsg.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.push(action.payload.newMsg);
      })
      .addCase(createMsg.rejected, (state, action) => {
        state.isLoading = false;
        console.error('Message creation failed:', action.payload);
      });
    // retrieve msg
    builder
      .addCase(retrieveMsg.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(retrieveMsg.fulfilled, (state, action) => {
        state.isLoading = false;
        const { messages, page } = action.payload;

        if (page === 1) {
          state.messages = messages;
        } else {
          state.messages = [...state.messages, ...messages];
        }

        state.page = page;
        state.hasMore = messages.length > 0;
      })
      .addCase(retrieveMsg.rejected, (state, action: any) => {
        state.isLoading = false;
        console.error('Message retrieving failed:', action.payload);
      });
    // update room
    builder
      .addCase(updateMsg.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateMsg.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedMsg = action.payload.message || action.meta.arg;

        state.messages = state.messages.map((msg) =>
          msg._id === updatedMsg._id ? { ...msg, ...updatedMsg } : msg
        );
      })
      .addCase(updateMsg.rejected, (state, action) => {
        state.isLoading = false;
        console.error('Failed to update message:', action.payload);
      });
    // delete msg
    builder
      .addCase(deleteMsg.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteMsg.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedMsgId = action.payload._id || action.meta.arg;
        state.messages = state.messages.filter(
          (msg) => msg._id !== deletedMsgId
        );
      })
      .addCase(deleteMsg.rejected, (state, action) => {
        state.isLoading = false;
        console.error('Failed to delete message:', action.payload);
      });
  },
});

export const { resetConversations } = chatsSlice.actions;
export default chatsSlice.reducer;
