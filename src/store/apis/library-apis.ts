import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { courseType, videoType } from "@/lib/interfaces-types";

interface ResponseType {
  data: {
    videos: [videoType];
    courses?: [courseType];
  };
  message: string;
  success: boolean;
}

export const libraryApi = createApi({
  reducerPath: "libraryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/video",
  }),
  tagTypes: ["Videos"],
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
    }),

    // Delete video
    deleteVideo: builder.mutation<ResponseType, string>({
      query: (id) => ({
        url: `${id}`,
        method: "DELETE",
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
} = libraryApi;

export default libraryApi;
