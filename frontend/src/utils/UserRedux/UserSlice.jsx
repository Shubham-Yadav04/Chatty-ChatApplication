import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getUserFromUserId = createAsyncThunk(
  'user/getUserFromUserId',
  async ( thunkAPI) => {
    try {
    
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}authenticated/user`, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
console.error("Error fetching user:", error);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
   currentChatRoom:null,
   isChatOpened:false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setChatroom: (state, action) => {
      state.chatroom = [...state.chatroom, action.payload];
    },
    setIsChatOpened:(state,action)=>{
     
      state.isChatOpened=action.payload
    },
    setCurrentChatRoom: (state, action) => {
      state.currentChatRoom = action.payload;
    },

  },
  extraReducers: (builder) => {
    builder.addCase(getUserFromUserId.fulfilled, (state, action) => {
      state.user = action.payload;
    })
    .addCase(getUserFromUserId.rejected, (state, action) => {
      state.user = null;
    })
 
  },
});


export const { setUser ,setChatroom,setCurrentChatRoom,isChatOpened,setIsChatOpened} = userSlice.actions;
export default userSlice.reducer;
