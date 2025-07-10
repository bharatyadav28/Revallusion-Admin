import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { ResourceType } from "@/lib/interfaces-types";
import { baseAddr } from "@/lib/resuable-data";

interface ResponseType {
  data: {
    resources: [ResourceType];
  };
  message: string;
  success: boolean;
}

export const resourceApi = createApi({
  reducerPath: "resourceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseAddr + "/api/v1",
    credentials: "include",
  }),
  tagTypes: ["Resources"],
  endpoints: (builder) => ({
    // Fetch submodule resources
    getResources: builder.query<ResponseType, string>({
      query: (id) => `/course/submodule/${id}/resource`,
      providesTags: [{ type: "Resources", id: "LIST" }],
    }),

    // Add resource
    addResource: builder.mutation<ResponseType, { id: string; file: FormData }>(
      {
        query: ({ id, file }) => ({
          url: `/course/submodule/${id}/resource`,
          method: "POST",
          body: file,
        }),
        invalidatesTags: [{ type: "Resources", id: "LIST" }],
      }
    ),

    // Delete Resources
    deleteResource: builder.mutation<
      ResponseType,
      { id: string; resourceId: string }
    >({
      query: ({ id, resourceId }) => ({
        url: `/course/submodule/${id}/resource/${resourceId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Resources", id: "LIST" }],
    }),
  }),
});

export const {
  useGetResourcesQuery,
  useAddResourceMutation,
  useDeleteResourceMutation,
} = resourceApi;

export default resourceApi;
