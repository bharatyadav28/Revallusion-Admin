import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import {
  dashboardCarousalType,
  dashboardSectionType,
} from "@/lib/interfaces-types";

interface ResponseType {
  data: {
    carousal?: [dashboardCarousalType];
    content?: [dashboardSectionType];
  };
  message: string;
  success: boolean;
}

export const primaryDashboardApi = createApi({
  reducerPath: "primaryDashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/dashboard",
  }),
  tagTypes: ["Carousal", "Content"],
  endpoints: (builder) => ({
    // Fetch Carousal data
    getCarousal: builder.query<ResponseType, void>({
      query: () => "/carousal",
      providesTags: [{ type: "Carousal", id: "LIST" }],
    }),

    // Add new image in carousal
    addCarousal: builder.mutation<ResponseType, { imageUrl: string }>({
      query: ({ imageUrl }) => ({
        url: "/carousal",
        method: "POST",
        body: { imageUrl },
      }),

      invalidatesTags: [{ type: "Carousal", id: "LIST" }],
    }),

    // Update image sequence in carousal
    updateCarousalSequence: builder.mutation<
      ResponseType,
      { sequence: number; id: string }
    >({
      query: ({ sequence, id }) => ({
        url: `/carousal/${id}`,
        method: "PUT",
        body: { sequence },
      }),

      invalidatesTags: [{ type: "Carousal", id: "LIST" }],
    }),

    // Delete an image in carousal
    deleteCarousalItem: builder.mutation<ResponseType, string>({
      query: (id) => ({
        url: `/carousal/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [{ type: "Carousal", id: "LIST" }],
    }),

    // Fetch Content (all sections)
    getContent: builder.query<ResponseType, void>({
      query: () => "/content",
      providesTags: [{ type: "Content", id: "LIST" }],
    }),

    // Add new section
    addSection: builder.mutation<ResponseType, string>({
      query: (name) => ({
        url: "/content",
        method: "POST",
        body: { name },
      }),

      invalidatesTags: [{ type: "Content", id: "LIST" }],
    }),

    // Update a section
    updateSection: builder.mutation<ResponseType, { name: string; id: string }>(
      {
        query: ({ name, id }) => ({
          url: `/content/${id}`,
          method: "PUT",
          body: { name },
        }),

        invalidatesTags: [{ type: "Content", id: "LIST" }],
      }
    ),

    // Add video to section
    addVideoToSection: builder.mutation<
      ResponseType,
      { videos: string[]; sectionId: string }
    >({
      query: ({ videos, sectionId }) => ({
        url: `/content/${sectionId}/video`,
        method: "PUT",
        body: { videos },
      }),

      invalidatesTags: [{ type: "Content", id: "LIST" }],
    }),

    // Remove video from section
    removeVideoFromSection: builder.mutation<
      ResponseType,
      { videoId: string; sectionId: string }
    >({
      query: ({ videoId, sectionId }) => ({
        url: `/content/${sectionId}/video`,
        body: { videoId },
        method: "DELETE",
      }),

      invalidatesTags: [{ type: "Content", id: "LIST" }],
    }),

    // Delete a section
    deleteSection: builder.mutation<ResponseType, string>({
      query: (id) => ({
        url: `/content/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [{ type: "Content", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCarousalQuery,
  useAddCarousalMutation,
  useUpdateCarousalSequenceMutation,
  useDeleteCarousalItemMutation,

  useGetContentQuery,
  useAddSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useAddVideoToSectionMutation,
  useRemoveVideoFromSectionMutation,
} = primaryDashboardApi;

export default primaryDashboardApi;
