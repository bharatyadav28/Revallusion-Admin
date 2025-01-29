import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import {
  courseVideoType,
  // latestTutorialSectionType,
} from "@/lib/interfaces-types";

interface ResponseType {
  data: {
    tutorials: { videos: [courseVideoType] };
  };
  message: string;
  success: boolean;
}

export const latestTutorialsApi = createApi({
  reducerPath: "latestTutorials",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/",
  }),
  tagTypes: ["LatestTutorials"],
  endpoints: (builder) => ({
    // Fetch latest tutorials data
    getLatestTutorials: builder.query<ResponseType, void>({
      query: () => "content/latest-tutorials",
      providesTags: [{ type: "LatestTutorials", id: "LIST" }],
    }),

    // Update video sequence
    updateTutorialVideoSequence: builder.mutation<
      ResponseType,
      {
        videoId: string;
        sequence: number;
      }
    >({
      query: ({ videoId, sequence }) => ({
        url: `content/latest-tutorials/${videoId}`,
        method: "PUT",
        body: { sequence },
      }),

      invalidatesTags: [{ type: "LatestTutorials", id: "LIST" }],
    }),

    // Add videos to latest tutorials
    addVideosToTutorials: builder.mutation<
      ResponseType,
      { videos: { videoId: string; sequence: number }[] }
    >({
      query: ({ videos }) => ({
        url: `content/latest-tutorials`,
        method: "POST",
        body: { videos },
      }),
      invalidatesTags: [{ type: "LatestTutorials", id: "LIST" }],
    }),

    // Delete section video
    deleteVideoFromTutorials: builder.mutation<
      ResponseType,
      { videoId: string }
    >({
      query: ({ videoId }) => ({
        url: `content/latest-tutorials/${videoId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "LatestTutorials", id: "LIST" }],
    }),
  }),
});

export const {
  useGetLatestTutorialsQuery,
  useUpdateTutorialVideoSequenceMutation,
  useAddVideosToTutorialsMutation,
  useDeleteVideoFromTutorialsMutation,
} = latestTutorialsApi;
export default latestTutorialsApi;
