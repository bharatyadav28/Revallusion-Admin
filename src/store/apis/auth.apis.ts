import { credentialType, userType } from "@/lib/interfaces-types";
import { baseAddr } from "@/lib/resuable-data";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface ResponseType {
  message: string;
  success: boolean;
  data: { user: userType };
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseAddr + "/api/v1",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    // Signin user
    signinQuery: builder.mutation<ResponseType, credentialType>({
      query: (credentials) => ({
        url: `admin/signin`,
        method: "POST",
        body: { ...credentials },
      }),
    }),

    // Current user details
    sendMe: builder.query<ResponseType, void>({
      query: () => ({
        url: `admin/send-me`,
        method: "GET",
      }),
    }),

    // Update user profile
    updateProfile: builder.mutation<ResponseType, userType>({
      query: (user) => ({
        url: `admin/update-profile`,
        method: "PUT",
        body: { ...user },
      }),
    }),

    // Logout
    logoutQuery: builder.mutation<ResponseType, void>({
      query: () => ({
        url: `user/logout`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useSigninQueryMutation,
  useSendMeQuery,
  useLogoutQueryMutation,
  useUpdateProfileMutation,
} = authApi;

export default authApi;
