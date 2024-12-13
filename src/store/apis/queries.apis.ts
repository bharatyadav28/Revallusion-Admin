import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { queryType } from "@/lib/interfaces-types";

interface ResponseType {
  data: {
    queries: [queryType];
    totalQueryCount: number;
  };
  message: string;
  success: boolean;
}

export const queriesApi = createApi({
  reducerPath: "queriesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/",
  }),
  tagTypes: ["Queries"],
  endpoints: (builder) => ({
    // Fetch queries data
    getQueries: builder.query<ResponseType, string>({
      query: (extra) => `query${extra}`,
      providesTags: [{ type: "Queries", id: "LIST" }],
    }),

    // Delete queries data
    deleteQuery: builder.mutation<ResponseType, string>({
      query: (id) => ({
        url: `query/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [{ type: "Queries", id: "LIST" }],
    }),
  }),
});

export const { useGetQueriesQuery, useDeleteQueryMutation } = queriesApi;

export default queriesApi;
