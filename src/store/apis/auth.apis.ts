import { credentialType } from "@/lib/interfaces-types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface ResponseType {
  message: string;
  success: boolean;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/admin",
  }),
  endpoints: (builder) => ({
    // Signin user
    signinQuery: builder.mutation<ResponseType, credentialType>({
      query: (credentials) => ({
        url: `signin`,
        method: "POST",
        body: { ...credentials },
      }),
    }),
  }),
});

export const { useSigninQueryMutation } = authApi;

export default authApi;
