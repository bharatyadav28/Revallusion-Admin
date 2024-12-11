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
    addCarousal: builder.mutation<ResponseType, carousalType>({
      query: (carousal) => ({
        url: `content/carousal`,
        method: "POST",
        body: { ...carousal },
      }),

      invalidatesTags: [{ type: "Carousal", id: "LIST" }],
    }),

    // Update Carousal
    updateCarousal: builder.mutation<
      ResponseType,
      { carousal: carousalType; id: string }
    >({
      query: ({ carousal, id }) => ({
        url: `content/carousal/${id}`,
        method: "PUT",
        body: { ...carousal },
      }),

      invalidatesTags: [{ type: "Carousal", id: "LIST" }],
    }),

    // Delete Carousal
    deleteCarousal: builder.mutation<ResponseType, string>({
      query: (id) => ({
        url: `content/carousal/${id}`,
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
