import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { courseType } from "@/lib/interfaces-types";

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
    baseUrl: "/api/v1",
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
      { name: string; courseId: string }
    >({
      query: ({ name, courseId }) => ({
        url: `/course/module`,
        method: "POST",
        body: { name, courseId },
      }),
      invalidatesTags: (_, __, { courseId }) => [
        { type: "Course", id: courseId },
      ],
    }),

    // Update module name
    updateCourseModuleName: builder.mutation<
      ResponseType,
      { id: string; name: string; courseId: string }
    >({
      query: ({ id, name, courseId }) => ({
        url: `/course/module/${id}`,
        method: "PUT",
        body: { name, courseId },
      }),
      invalidatesTags: (_, __, { courseId }) => [
        { type: "Course", id: courseId },
      ],
    }),

    // Add module
    addSubmodule: builder.mutation<
      ResponseType,
      { name: string; thumbnailUrl: string; courseId: string; moduleId: string }
    >({
      query: ({ name, thumbnailUrl, courseId, moduleId }) => ({
        url: `/course/submodule`,
        method: "POST",
        body: { name, thumbnailUrl, courseId, moduleId },
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
      }) => ({
        url: `/course/submodule/${id}`,
        method: "PUT",
        body: { name, thumbnailUrl, courseId, moduleId, newModuleId, sequence },
      }),
      invalidatesTags: (_, __, { courseId }) => [
        { type: "Course", id: courseId },
      ],
    }),

    // update video sequence
    updateVideoSequence: builder.mutation<
      ResponseType,
      {
        id: string;
        sequence: number;
        courseId: string;
        moduleId?: string;
        subModuleId?: string;
      }
    >({
      query: ({ id, sequence, courseId, moduleId, subModuleId }) => ({
        url: `/course/video-sequence/${id}`,
        method: "PUT",
        body: { sequence, courseId, moduleId, subModuleId },
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
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseQuery,
  useAddCourseModuleMutation,
  useUpdateCourseModuleNameMutation,
  useAddSubmoduleMutation,
  useUpdateSubmoduleMutation,
  useUpdateVideoSequenceMutation,
  useUpdateVideoStatusMutation,
} = courseApi;

export default courseApi;
