import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { AppConfigsType } from "@/lib/interfaces-types";

interface ResponseType {
  data: AppConfigsType;
  message: string;
  success: boolean;
}

export const appConfigApi = createApi({
  reducerPath: "appConfigApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/app-config/active-gateways",
  }),
  tagTypes: ["AppConfig"],
  endpoints: (builder) => ({
    getAppConfigs: builder.query<ResponseType, void>({
      query: () => ``,
      providesTags: [{ type: "AppConfig", id: "LIST" }],
    }),

    updateActiveGateway: builder.mutation<ResponseType, string[]>({
      query: (gateways) => ({
        url: ``,
        method: "PUT",
        body: { gateways },
      }),

      invalidatesTags: [{ type: "AppConfig", id: "LIST" }],
    }),
  }),
});

export const { useGetAppConfigsQuery, useUpdateActiveGatewayMutation } =
  appConfigApi;

export default appConfigApi;
