import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { courseType } from "@/lib/interfaces-types";
import libraryApi from "./library-apis";
import { baseAddr } from "@/lib/resuable-data";

interface ResponseType {
  data: {
    courses: [courseType];
  };
  message: string;
  success: boolean;
}

interface courseResponseType {
  data: {
    course: courseType;
  };
  message: string;
  success: boolean;
}

export const courseApi = createApi({
  reducerPath: "courseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseAddr + "/api/v1",
    credentials: "include",
  }),
  tagTypes: ["Courses", "Course"],
  endpoints: (builder) => ({
    // Fetch Courses data
    getCourses: builder.query<ResponseType, void>({
      query: () => "/course/names",
      providesTags: [{ type: "Courses", id: "LIST" }],
    }),

    // Fetch single course
    getCourse: builder.query<courseResponseType, string>({
      query: (id) => `/course/${id}`,
      providesTags: (_, __, id) => [{ type: "Course", id }],
    }),

    // Add module
    addCourseModule: builder.mutation<
      ResponseType,
      { name: string; courseId: string; thumbnailUrl: string }
    >({
      query: ({ name, courseId, thumbnailUrl }) => ({
        url: `/course/module`,
        method: "POST",
        body: { name, courseId, thumbnailUrl },
      }),
      invalidatesTags: (_, __, { courseId }) => [
        { type: "Course", id: courseId },
      ],
    }),

    // Update module name
    updateCourseModuleName: builder.mutation<
      ResponseType,
      { id: string; name: string; courseId: string; thumbnailUrl: string }
    >({
      query: ({ id, name, courseId, thumbnailUrl }) => ({
        url: `/course/module/${id}`,
        method: "PUT",
        body: { name, courseId, thumbnailUrl },
      }),
      invalidatesTags: (_, __, { courseId }) => [
        { type: "Course", id: courseId },
      ],

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            libraryApi.util.invalidateTags([{ type: "Videos", id: "LIST" }])
          );
        } catch {}
      },
    }),

    deleteModule: builder.mutation<
      ResponseType,
      { courseId: string; moduleId: string }
    >({
      query: ({ moduleId }) => ({
        url: `/course/module/${moduleId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { courseId }) => [
        { type: "Course", id: courseId },
      ],

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            libraryApi.util.invalidateTags([{ type: "Videos", id: "LIST" }])
          );
        } catch {}
      },
    }),

    // Add module
    addSubmodule: builder.mutation<
      ResponseType,
      {
        name: string;
        thumbnailUrl: string;
        courseId: string;
        moduleId: string;
        resource?: string;
      }
    >({
      query: ({ name, thumbnailUrl, courseId, moduleId, resource }) => ({
        url: `/course/submodule`,
        method: "POST",
        body: { name, thumbnailUrl, courseId, moduleId, resource },
      }),
      invalidatesTags: (_, __, { courseId }) => [
        { type: "Course", id: courseId },
      ],
    }),

    // Update submodule
    updateSubmodule: builder.mutation<
      ResponseType,
      {
        id: string;
        thumbnailUrl: string;
        name: string;
        courseId: string;
        moduleId: string;
        newModuleId?: string;
        sequence?: number;
        resource?: string;
      }
    >({
      query: ({
        id,
        name,
        thumbnailUrl,
        courseId,
        moduleId,
        newModuleId,
        sequence,
        resource,
      }) => ({
        url: `/course/submodule/${id}`,
        method: "PUT",
        body: {
          name,
          thumbnailUrl,
          courseId,
          moduleId,
          newModuleId,
          sequence,
          resource,
        },
      }),
      invalidatesTags: (_, __, { courseId }) => [
        { type: "Course", id: courseId },
      ],

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            libraryApi.util.invalidateTags([{ type: "Videos", id: "LIST" }])
          );
        } catch {}
      },
    }),

    deleteSubmodule: builder.mutation<
      ResponseType,
      { courseId: string; submoduleId: string }
    >({
      query: ({ submoduleId }) => ({
        url: `/course/submodule/${submoduleId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { courseId }) => [
        { type: "Course", id: courseId },
      ],

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            libraryApi.util.invalidateTags([{ type: "Videos", id: "LIST" }])
          );
        } catch {}
      },
    }),

    // update video sequence
    updateVideoSequence: builder.mutation<
      ResponseType,
      {
        id: string;
        sequence: number;
        courseId: string;
        moduleId?: string;
        submoduleId?: string;
      }
    >({
      query: ({ id, sequence, courseId, moduleId, submoduleId }) => ({
        url: `/course/video-sequence/${id}`,
        method: "PUT",
        body: { sequence, courseId, moduleId, submoduleId },
      }),
      invalidatesTags: (_, __, { courseId }) => [
        { type: "Course", id: courseId },
      ],
    }),

    // Update video status (active/inactive)
    updateVideoStatus: builder.mutation<
      ResponseType,
      { id: string; isActive: boolean; courseId: string }
    >({
      query: ({ id, isActive }) => ({
        url: `/video/active-status/${id}`,
        method: "PUT",
        body: { isActive },
      }),

      invalidatesTags: (_, __, { courseId }) => [
        { type: "Course", id: courseId },
      ],
    }),

    // Get course title
    getCourseTitle: builder.query<courseResponseType, string>({
      query: (id) => `/course/${id}/title`,
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseQuery,
  useAddCourseModuleMutation,
  useUpdateCourseModuleNameMutation,
  useDeleteModuleMutation,
  useAddSubmoduleMutation,
  useUpdateSubmoduleMutation,
  useDeleteSubmoduleMutation,
  useUpdateVideoSequenceMutation,
  useUpdateVideoStatusMutation,
  useGetCourseTitleQuery,
} = courseApi;

export default courseApi;
