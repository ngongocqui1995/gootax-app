import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import profileSlice from "../slices/profileSlice";

export const store = configureStore({
  reducer: {
    profile: profileSlice,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
  // devTools: true,
});
