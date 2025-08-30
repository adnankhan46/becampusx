// authApi.js

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const BASE_URL = "/api";

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    // Sign UP
    signUp: builder.mutation({
      query: (formData) => ({
        url: `/auth/signup`,
        method: 'POST',
        body: formData,
      }),
    }),
    // Sign IN
    signIn: builder.mutation({
      query: (credentials) => ({
        url: `/auth/signin`,
        method: 'POST',
        body: credentials,
      }),
    }),
  // UpdatePassword
  updatePassword: builder.mutation({
      query: (newPassword) => ({
        url: `/auth/updatepassword`,
        method: 'POST',
        body: { newPassword }, // Correctly wrapping in an object
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
  // Define the middleware to handle the response and set cookies

});

export const { useSignUpMutation, useSignInMutation, useUpdatePasswordMutation, useLogoutMutation } = authApi;
