import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { mentorType } from "@/lib/interfaces-types";

interface ResponseType {
  data: {
    mentor: mentorType;
  };
  message: string;
  success: boolean;
}

export const mentorApi = createApi({
  reducerPath: "mentorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://revallusion.onrender.com/api/v1/",
  }),
  tagTypes: ["Mentor"],
  endpoints: (builder) => ({
    // Fetch Mentor data
    getMentor: builder.query<ResponseType, void>({
      query: () => "content/mentor",
      providesTags: [{ type: "Mentor", id: "LIST" }],
    }),

    // Update Mentor data
    updateMentor: builder.mutation<ResponseType, mentorType>({
      query: (mentor) => ({
        url: `content/mentor`,
        method: "PUT",
        body: { ...mentor },
      }),

      invalidatesTags: [{ type: "Mentor", id: "LIST" }],
    }),
  }),
});

export const { useUpdateMentorMutation, useGetMentorQuery } = mentorApi;
export default mentorApi;
