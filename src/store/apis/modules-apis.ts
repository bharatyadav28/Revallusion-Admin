import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { moduleType } from "@/lib/interfaces-types";

interface ResponseType {
  data: {
    modules: [moduleType];
  };
  message: string;
  success: boolean;
}

export const moduleApi = createApi({
  reducerPath: "moduleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/",
  }),
  tagTypes: ["Modules"],
  endpoints: (builder) => ({
    // Fetch Modules data
    getModules: builder.query<ResponseType, void>({
      query: () => "module",
      providesTags: [{ type: "Modules", id: "LIST" }],
    }),

    // Add Module
    addModule: builder.mutation<ResponseType, moduleType>({
      query: (module) => ({
        url: `module`,
        method: "POST",
        body: { ...module },
      }),

      invalidatesTags: [{ type: "Modules", id: "LIST" }],
    }),

    // Update Module
    updateModule: builder.mutation<
      ResponseType,
      { module: moduleType; id: string }
    >({
      query: ({ module, id }) => ({
        url: `module/${id}`,
        method: "PUT",
        body: { ...module },
      }),

      invalidatesTags: [{ type: "Modules", id: "LIST" }],
    }),

    // Delete Module
    deleteModule: builder.mutation<ResponseType, string>({
      query: (id) => ({
        url: `module/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [{ type: "Modules", id: "LIST" }],
    }),
  }),
});

export const {
  useGetModulesQuery,
  useAddModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
} = moduleApi;

export default moduleApi;
