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
    pagesCount?: number;
  };
}

export const assignmentApi = createApi({
  reducerPath: "assignmentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/",
  }),
  tagTypes: ["Assignments", "SubmittedAssignments"],
  endpoints: (builder) => ({
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

    // Revoke assignment
    revokeAssignment: builder.mutation<ResponseType, string>({
      query: (id) => ({
        url: `submitted-assignment/${id}/revoke`,
        method: "PUT",
      }),
      invalidatesTags: [{ type: "SubmittedAssignments", id: "LIST" }],
    }),
  }),
});

export const {
  useGetSubmittedAssignmentsQuery,
  useUpdateAssignmentScoreMutation,
  useRevokeAssignmentMutation,
} = assignmentApi;

export default assignmentApi;
