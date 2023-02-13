import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
// persist our store
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

import userSlice from "./features/userSlice";
import appApi from "./services/appApi";

// reducers
const reducer = combineReducers({
  user: userSlice,
  [appApi.reducerPath]: appApi.reducer,
});

// Set up persist configuration for storage
const persistConfig = {
  key: "root",
  storage,
  blackList: [appApi.reducerPath],
};

// persist our store
const persistedReducer = persistReducer(persistConfig, reducer);

// creating the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk, appApi.middleware],
});

export default store;
