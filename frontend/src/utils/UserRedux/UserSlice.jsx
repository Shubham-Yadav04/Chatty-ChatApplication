import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getUserFromUserId = createAsyncThunk(
  'user/getUserFromUserId',
  async ( thunkAPI) => {
    try {
    
      const response = await axios.get('http://localhost:8080/authenticated/user', {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchChatrooms = createAsyncThunk(
  'user/fetchChatrooms',
  async (userId, thunkAPI) => {
    try {
      
      const response = await axios.get(`http://localhost:8080/chatroom/user/${userId}`, {
        withCredentials: true,
      });
      
      return response.data; // should be a list of chatrooms
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
   chatroom:[],
   currentChatRoom:null,
   currentChatRoomMsg:[]
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setChatroom: (state, action) => {
      state.chatroom = [...state.chatroom, action.payload];
    },
    setCurrentChatRoom: (state, action) => {
      state.currentChatRoom = action.payload;
    },
    setCurrentChatRoomMsg:(state,action)=>{
state.currentChatRoomMsg= action.payload
    },
    addNewMessageToCurrentChatRoomMsg: (state, action) => {
      state.currentChatRoomMsg.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserFromUserId.fulfilled, (state, action) => {
      state.user = action.payload;
    })
    .addCase(fetchChatrooms.fulfilled, (state, action) => {
      state.chatroom = action.payload;
    });
  },
});


export const { setUser ,setChatroom,setCurrentChatRoom,setCurrentChatRoomMsg,addNewMessageToCurrentChatRoomMsg} = userSlice.actions;
export default userSlice.reducer;
