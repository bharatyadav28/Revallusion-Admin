import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { carousalType } from "@/lib/interfaces-types";

interface ResponseType {
  data: {
    carousals: [carousalType];
  };
  message: string;
  success: boolean;
}

export const carousalApi = createApi({
  reducerPath: "carousalApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/",
  }),
  tagTypes: ["Carousal"],
  endpoints: (builder) => ({
    // Fetch Carousals
    getCarousal: builder.query<ResponseType, void>({
      query: () => "content/carousal",
      providesTags: [{ type: "Carousal", id: "LIST" }],
    }),

    // Add Carousal
    addCarousal: builder.mutation<
      ResponseType,
      { videos: { videoId: string; sequence: number }[] }
    >({
      query: ({ videos }) => ({
        url: `content/carousal`,
        method: "POST",
        body: { videos },
      }),

      invalidatesTags: [{ type: "Carousal", id: "LIST" }],
    }),

    // Update Carousal
    updateCarousal: builder.mutation<
      ResponseType,
      {
        videoId: string;
        sequence: number;
      }
    >({
      query: ({ videoId, sequence }) => ({
        url: `content/carousal/${videoId}`,
        method: "PUT",
        body: { sequence },
      }),

      invalidatesTags: [{ type: "Carousal", id: "LIST" }],
    }),

    // Delete Carousal
    deleteCarousal: builder.mutation<ResponseType, { videoId: string }>({
      query: ({ videoId }) => ({
        url: `content/carousal/${videoId}`,
        method: "DELETE",
      }),

      invalidatesTags: [{ type: "Carousal", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCarousalQuery,
  useAddCarousalMutation,
  useUpdateCarousalMutation,
  useDeleteCarousalMutation,
} = carousalApi;
export default carousalApi;
