import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
    baseUrl: "https://revallusion.onrender.com/api/v1/",
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
