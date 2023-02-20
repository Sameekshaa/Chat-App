import { createSlice } from "@reduxjs/toolkit";

import appApi from "../services/appApi";

export type UserType = {
  id: string;
  name: string;
  picture: string;
  password: string;
  status: string;
  newMessages: any;
  email: string;
};

export type UserStateType = UserType | null;

export type SliceState = { user?: UserType };

const initialState = null as UserStateType;

// create a slice for user management
export const userSlice = createSlice({
  name: "user",
  initialState, // inititally no users

  // reducers to manage user notifications
  reducers: {
    addNotifications: (state, { payload }) => {
      if (!state) {
        return;
      }

      // if the notification already exists, increment the count
      if (state.newMessages?.[payload]) {
        state.newMessages[payload] = state.newMessages[payload] + 1;
        // if the notification does not exist, set its count to 1
      } else {
        state.newMessages[payload] = 1;
      }
    },
    resetNotifications: (state, { payload }) => {
      if (!state) {
        return;
      }
      // remove the notification from the state
      delete state.newMessages[payload];
    },
  },

  // extra reducers for handling user signup, login and logout
  extraReducers: (builder) => {
    // save user after successful signup
    builder.addMatcher(
      appApi.endpoints.signupUser.matchFulfilled,
      (state, { payload }) => payload
    );
    // save user after successful login
    builder.addMatcher(
      appApi.endpoints.loginUser.matchFulfilled,
      (state, { payload }) => payload
    );
    // logout the user & destroy user session
    builder.addMatcher(appApi.endpoints.logoutUser.matchFulfilled, () => null);
  },
});

// exported actions for managing user notifications
export const { addNotifications, resetNotifications } = userSlice.actions;

// export the reducer for use in the store
export default userSlice.reducer;
