import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { courseType, videoType } from "@/lib/interfaces-types";
import courseApi from "./course-apis";
import { baseAddr } from "@/lib/resuable-data";

interface ResponseType {
  data: {
    videos: [videoType];
    courses?: [courseType];
    pagesCount?: number;
  };
  message: string;
  success: boolean;
}

export const libraryApi = createApi({
  reducerPath: "libraryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseAddr + "/api/v1/video",
    credentials: "include",
  }),
  tagTypes: ["Videos", "VideoList"],
  endpoints: (builder) => ({
    // Fetch Videos data
    getVideos: builder.query<ResponseType, void>({
      query: () => "",
      providesTags: [{ type: "Videos", id: "LIST" }],
    }),

    // Add Video
    addVideo: builder.mutation<ResponseType, videoType>({
      query: (video) => ({
        url: "",
        method: "POST",
        body: { ...video },
      }),

      invalidatesTags: [{ type: "Videos", id: "LIST" }],

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(courseApi.util.invalidateTags([{ type: "Course" }]));
        } catch {}
      },
    }),

    // Update video
    updateVideo: builder.mutation<
      ResponseType,
      { video: videoType; id: string }
    >({
      query: ({ video, id }) => ({
        url: `${id}`,
        method: "PUT",
        body: { ...video },
      }),

      invalidatesTags: [{ type: "Videos", id: "LIST" }],

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(courseApi.util.invalidateTags([{ type: "Course" }]));
        } catch {}
      },
    }),

    // Delete video
    deleteVideo: builder.mutation<ResponseType, string>({
      query: (id) => ({
        url: `${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [{ type: "Videos", id: "LIST" }],

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(courseApi.util.invalidateTags([{ type: "Course" }]));
        } catch {}
      },
    }),

    // Get video list
    getVideoList: builder.mutation<
      ResponseType,
      { searchQuery: string; excludeVideos?: string[] }
    >({
      query: ({ searchQuery, excludeVideos }) => ({
        url: `list?${searchQuery}`,
        method: "POST",
        body: { excludeVideos },
      }),

      invalidatesTags: [{ type: "Videos", id: "LIST" }],
    }),
  }),
});

export const {
  useGetVideosQuery,
  useAddVideoMutation,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
  // useGetVideoListQuery,
  useGetVideoListMutation,
} = libraryApi;

export default libraryApi;
