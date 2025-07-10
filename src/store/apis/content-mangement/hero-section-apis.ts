import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { baseAddr } from "@/lib/resuable-data";

interface ResponseType {
  data: {
    heroSection: {
      _id: string;
      caption: string;
      description: string;
    };
  };
  message: string;
  success: boolean;
}

export const heroSectionApi = createApi({
  reducerPath: "heroSectionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseAddr + "/api/v1/",
    credentials: "include",
  }),
  tagTypes: ["HeroSection"],
  endpoints: (builder) => ({
    // Fetch hero section
    getHeroSection: builder.query<ResponseType, void>({
      query: () => "content/hero-section",
      providesTags: [{ type: "HeroSection", id: "LIST" }],
    }),

    // Update hero section
    updateHeroSection: builder.mutation<
      ResponseType,
      { caption: string; description: string }
    >({
      query: ({ caption, description }) => ({
        url: "content/hero-section",
        method: "PUT",
        body: { caption, description },
      }),

      invalidatesTags: [{ type: "HeroSection", id: "LIST" }],
    }),
  }),
});

export const { useGetHeroSectionQuery, useUpdateHeroSectionMutation } =
  heroSectionApi;
export default heroSectionApi;
