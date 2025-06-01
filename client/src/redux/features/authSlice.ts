import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { lastName: null, user: null, email: null, isAdmin: false, profileImage: null },
  reducers: {
    login: (state, action) => {
      state.lastName = action.payload.lastName
      state.profileImage = action.payload.profileImage
      state.user = action.payload._id;
      state.email = action.payload.email;
      state.isAdmin = action.payload.isAdmin;
    },
    logout: (state) => {
      state.lastName = null
      state.profileImage = null
      state.user = null;
      state.email = null;
      state.isAdmin = false;
    }


  },
});


export const { login, logout, } = authSlice.actions;
export default authSlice.reducer;