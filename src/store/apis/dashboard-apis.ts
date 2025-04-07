import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { dashboardType } from "@/lib/interfaces-types";

interface ResponseType {
  data: dashboardType;
  message: string;
  success: boolean;
}

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/admin",
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
