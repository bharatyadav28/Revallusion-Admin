import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { mentorType } from "@/lib/interfaces-types";
import { baseAddr } from "@/lib/resuable-data";

interface ResponseType {
  data: {
    mentor: mentorType;
  };
  message: string;
  success: boolean;
}

interface CurriculumType {
  data: {
    curriculum: string;
  };
  message: string;
  success: boolean;
}

export const mentorApi = createApi({
  reducerPath: "mentorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseAddr + "/api/v1/",
    credentials: "include",
  }),
  tagTypes: ["Mentor", "Curriculum"],
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

    // Fetch Curriculum data
    getCurriculum: builder.query<CurriculumType, void>({
      query: () => "content/mentor/curriculum",
      providesTags: [{ type: "Curriculum", id: "LIST" }],
    }),

    // Edit Curriculum
    editCurriculum: builder.mutation<CurriculumType, FormData>({
      query: (formData) => ({
        url: `content/mentor/curriculum`,
        method: "PUT",
        body: formData,
      }),

      invalidatesTags: [{ type: "Curriculum", id: "LIST" }],
    }),
  }),
});

export const {
  useUpdateMentorMutation,
  useGetMentorQuery,
  useGetCurriculumQuery,
  useEditCurriculumMutation,
} = mentorApi;
export default mentorApi;
