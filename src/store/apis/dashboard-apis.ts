import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { dashboardType } from "@/lib/interfaces-types";
import { baseAddr } from "@/lib/resuable-data";

interface ResponseType {
  data: dashboardType;
  message: string;
  success: boolean;
}

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseAddr + "/api/v1/admin",
    credentials: "include",
  }),
  tagTypes: ["Dashboard"],
  endpoints: (builder) => ({
    getDashboardData: builder.query<ResponseType, void>({
      query: () => `/dashboard`,
      providesTags: [{ type: "Dashboard", id: "LIST" }],
    }),
  }),
});

export const { useGetDashboardDataQuery } = dashboardApi;

export default dashboardApi;
