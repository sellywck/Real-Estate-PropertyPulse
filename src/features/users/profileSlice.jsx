import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;
// A (get localStorage) -> B -> C (Set localstorage) -> D -> E (fetchUserInfo)

export const fetchUserInfo = createAsyncThunk(
  "users/fetchUserInfo",
  async (id) => {
    try {
      const token = localStorage.getItem("jwt_token");
      const headers = {
        Authorization: token,
      };

      // console.log("Calling fetchUserInfo", token);

      const response = await axios.get(`${BASE_URL}/v1/profile/${id}`, {
        headers: headers,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "users/updateUserProfile",
  async (userInfo) => {
    const { id, username, profilepicture } = userInfo;

    try {
      const token = localStorage.getItem("jwt_token");
      const headers = {
        Authorization: token,
      };

      const response = await axios.patch(
        `${BASE_URL}/v1/profile/${id}`,
        { username, profilepicture },
        {
          headers: headers,
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: { profile: {}, loading: true, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload.data;
        state.loading = false;
      });
  },
});

export default profileSlice.reducer;
