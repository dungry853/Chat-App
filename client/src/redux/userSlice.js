import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    _id: "",
    name: "",
    email: "",
    profile_pic: "",
    token: "",
    onlineUser: [],
    socketConnection: null,
  },
  reducers: {
    setUser: (state, action) => {
      state._id = action.payload._id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.profile_pic = action.payload.profile_pic;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state._id = "";
      state.name = "";
      state.email = "";
      state.profile_pic = "";
      state.socketConnection = null;
    },
    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload;
    },
    setSocketConnection: (state, action) => {
      state.socketConnection = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, setToken, logout, setOnlineUser, setSocketConnection } =
  userSlice.actions;

export default userSlice.reducer;
