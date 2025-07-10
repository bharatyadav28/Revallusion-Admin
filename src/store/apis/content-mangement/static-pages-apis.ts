import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { staticPageType } from "@/lib/interfaces-types";
import { baseAddr } from "@/lib/resuable-data";

interface ResponseType {
  data: {
    pages: staticPageType[];
  };
  message: string;
  success: boolean;
}

export const pagesApi = createApi({
  reducerPath: "pagesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseAddr + "/api/v1/",
    credentials: "include",
  }),
  tagTypes: ["Pages"],
  endpoints: (builder) => ({
    // Fetch Pages data
    getPages: builder.query<ResponseType, void>({
      query: () => "content/page",
      providesTags: [{ type: "Pages", id: "LIST" }],
    }),

    // Update Pages data
    updatePages: builder.mutation<
      ResponseType,
      { page: staticPageType; id: string }
    >({
      query: ({ page, id }) => ({
        url: `content/page/${id}`,
        method: "PUT",
        body: { ...page },
      }),

      invalidatesTags: [{ type: "Pages", id: "LIST" }],
    }),
  }),
});

export const { useGetPagesQuery, useUpdatePagesMutation } = pagesApi;
export default pagesApi;
