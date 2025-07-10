import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { AppConfigsType } from "@/lib/interfaces-types";
import { baseAddr } from "@/lib/resuable-data";

interface ResponseType {
  data: AppConfigsType;
  message: string;
  success: boolean;
}

export const appConfigApi = createApi({
  reducerPath: "appConfigApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseAddr + "/api/v1/app-config/active-gateways",
    credentials: "include",
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
