import { configureStore } from "@reduxjs/toolkit"
import profileReducer from './features/users/profileSlice'
import listingsReducer from './features/listings/listingsSlice'

export default configureStore({
  reducer: {
    profile: profileReducer, 
    listings : listingsReducer,
  }
});