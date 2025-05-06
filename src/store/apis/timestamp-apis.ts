import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { TimeStampType } from "@/lib/interfaces-types";

interface ResponseType {
  message: string;
  success: boolean;
  data: {
    timestamps: TimeStampType[];
  };
}

export const timestampApi = createApi({
  reducerPath: "timestamp",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
  }),
  tagTypes: ["Timestamp"],
  endpoints: (builder) => ({
    getTimestamps: builder.query<ResponseType, string>({
      query: (videoId) => `timestamp/video/${videoId}`,
      providesTags: [{ type: "Timestamp", id: "LIST" }],
    }),

    addTimeStamp: builder.mutation<
      ResponseType,
      { videoId: string; data: TimeStampType }
    >({
      query: ({ videoId, data }) => ({
        url: `timestamp/video/${videoId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Timestamp", id: "LIST" }],
    }),

    updateTimestamp: builder.mutation<
      ResponseType,
      { timestampId: string; data: TimeStampType }
    >({
      query: ({ timestampId, data }) => ({
        url: `timestamp/${timestampId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "Timestamp", id: "LIST" }],
    }),

    deleteTimestamp: builder.mutation<ResponseType, string>({
      query: (timestampId) => ({
        url: `timestamp/${timestampId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Timestamp", id: "LIST" }],
    }),
  }),
});

export const {
  useGetTimestampsQuery,
  useAddTimeStampMutation,
  useUpdateTimestampMutation,
  useDeleteTimestampMutation,
} = timestampApi;

export default timestampApi;
