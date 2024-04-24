import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const creatingListing = createAsyncThunk(
  "listings/creatingListing",
  async (request) => {
    try {
      const token = localStorage.getItem("jwt_token");
      const headers = {
        Authorization: token,
      };
      const response = await axios.post(`${BASE_URL}/v1/listings`, request, {
        headers: headers,
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const fetchListingsByUserId = createAsyncThunk(
  "listings/fetchListingsByUserId",
  async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      const headers = {
        Authorization: token,
      };
      const response = await axios.get(`${BASE_URL}/v1/listings`, {
        headers: headers,
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const deleteListing = createAsyncThunk(
  "listings/deleteListing",
  async (listing_id) => {
    try {
      const token = localStorage.getItem("jwt_token");
      const headers = {
        Authorization: token,
      };
      const response = await axios.delete(
        `${BASE_URL}/v1/listings/${listing_id}`,
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

export const updateListing = createAsyncThunk(
  "listings/updateListing",
  async (newformData) => {
    const token = localStorage.getItem("jwt_token");
    const headers = {
      Authorization: token,
    };
    const { id, ...updatedData } = newformData;
    try {
      const response = await axios.put(
        `${BASE_URL}/v1/listings/${id}`,
        updatedData,
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

export const fetchListing = createAsyncThunk(
  "listings/fetchlisting",
  async (listing_id) => {
    try {
      const token = localStorage.getItem("jwt_token");
      const headers = {
        Authorization: token,
      };
      const response = await axios.get(
        `${BASE_URL}/v1/listings/${listing_id}`,
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

const listingsSlice = createSlice({
  name: "listings",
  initialState: {
    listings: [],
    selectedListing: null,
    loading: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchListingsByUserId.fulfilled, (state, action) => {
        state.listings = action.payload;
        state.loading = false;
      })
      .addCase(creatingListing.fulfilled, (state, action) => {
        state.listings = [action.payload, ...state.listings];
        state.loading = false;
      })
      .addCase(deleteListing.fulfilled, (state, action) => {
        state.listings = state.listings.filter(
          (listing) => listing.id !== action.payload.id
        );
        state.loading = false;
      })
      .addCase(updateListing.fulfilled, (state, action) => {
        const updatedListingIndex = state.listings.findIndex(
          (listing) => listing.id === action.payload.id
        );
        if (updatedListingIndex !== -1) {
          state.listings[updatedListingIndex] = action.payload;
        }
      })
      .addCase(fetchListing.fulfilled, (state, action) => {
        state.selectedListing = action.payload;
        state.loading = false;
        state.error = false;
      });
  },
});

export default listingsSlice.reducer;
