import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

// define a service user a base URL

const appApi = createApi({
  reducerPath : "appApi",
  baseQuery : fetchBaseQuery({
    baseUrl : "http://localhost:5001",
    // baseUrl: "https://chat-app-backend-bwff.onrender.com",
  }),

  endpoints : (builder) => ({
    // creating the user
    signupUser : builder.mutation({
      query : (user) => ({
        url : "/users",
        method : "POST",
        body : user,
      }),
    }),

    // login
    loginUser : builder.mutation({
      query : (user) => ({
        url : "users/login",
        method : "POST",
        body : user,
      }),
    }),

    // logout

    logoutUser : builder.mutation({
      query : (payload) => ({
        url : "/logout",
        method : "POST",
        body : payload,
      }),
    }),
  }),
});

export const {
  useSignupUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
} = appApi;

export default appApi;
