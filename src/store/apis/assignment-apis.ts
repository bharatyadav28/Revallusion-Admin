import {
  assignmentType,
  SubmittedAssignmentType,
} from "@/lib/interfaces-types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface ResponseType {
  message: string;
  success: boolean;
  data: {
    assignments: assignmentType[];
  };
}

interface SubmittedResponseType {
  message: string;
  success: boolean;
  data: {
    submittedAssignments: SubmittedAssignmentType[];
    submodules: {
      key: string;
      value: string;
    }[];
  };
}

export const assignmentApi = createApi({
  reducerPath: "assignmentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/",
  }),
  tagTypes: ["Assignments", "SubmittedAssignments"],
  endpoints: (builder) => ({
    // Fetch submodule assignments
    getSubmoduleAssignments: builder.query<ResponseType, string>({
      query: (submoduleId) => `assignment/submodule/${submoduleId}`,
      providesTags: [{ type: "Assignments", id: "LIST" }],
    }),

    // Submit assignment
    addAssignment: builder.mutation<
      ResponseType,
      {
        name: string;
        courseId: string;
        submoduleId: string;
        moduleId: string;
        fileUrl: string;
      }
    >({
      query: (assignment) => ({
        url: `assignment`,
        method: "POST",
        body: { ...assignment },
      }),

      invalidatesTags: [{ type: "Assignments", id: "LIST" }],
    }),

    // Update assignment name
    updateAssignmentName: builder.mutation<
      ResponseType,
      { name: string; id: string }
    >({
      query: ({ name, id }) => ({
        url: `assignment/${id}`,
        method: "PUT",
        body: { name },
      }),

      invalidatesTags: [{ type: "Assignments", id: "LIST" }],
    }),

    // Delete assignment
    deleteAssignment: builder.mutation<ResponseType, string>({
      query: (id) => ({
        url: `assignment/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [{ type: "Assignments", id: "LIST" }],
    }),

    // Get submitted assignments by course
    getSubmittedAssignments: builder.query<SubmittedResponseType, string>({
      query: (courseId) => `submitted-assignment/course/${courseId}`,
      providesTags: [{ type: "SubmittedAssignments", id: "LIST" }],
    }),

    // Update assignment score
    updateAssignmentScore: builder.mutation<
      ResponseType,
      { score: number; id: string }
    >({
      query: ({ score, id }) => ({
        url: `submitted-assignment/${id}`,
        method: "PUT",
        body: { score },
      }),

      invalidatesTags: [{ type: "SubmittedAssignments", id: "LIST" }],
    }),
  }),
});

export const {
  useGetSubmoduleAssignmentsQuery,
  useAddAssignmentMutation,
  useUpdateAssignmentNameMutation,
  useDeleteAssignmentMutation,

  useGetSubmittedAssignmentsQuery,
  useUpdateAssignmentScoreMutation,
} = assignmentApi;

export default assignmentApi;
