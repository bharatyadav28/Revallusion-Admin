import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { FooterLinkType } from "@/lib/interfaces-types";
import { baseAddr } from "@/lib/resuable-data";

interface ResponseType {
  data: {
    footers: [FooterLinkType];
  };
  message: string;
  success: boolean;
}

export const footerApi = createApi({
  reducerPath: "footerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseAddr + "/api/v1/",
    credentials: "include",
  }),
  tagTypes: ["Footer"],
  endpoints: (builder) => ({
    getFooterLinks: builder.query<ResponseType, void>({
      query: () => "footer",
      providesTags: [{ type: "Footer", id: "LIST" }],
    }),

    addFooterLink: builder.mutation<
      ResponseType,
      { footerLink: FooterLinkType }
    >({
      query: ({ footerLink }) => ({
        url: `footer`,
        method: "POST",
        body: { ...footerLink },
      }),

      invalidatesTags: [{ type: "Footer", id: "LIST" }],
    }),

    updateFooterLink: builder.mutation<
      ResponseType,
      {
        footerLinkId: string;
        footerLink: FooterLinkType;
      }
    >({
      query: ({ footerLinkId, footerLink }) => ({
        url: `footer/${footerLinkId}`,
        method: "PUT",
        body: { ...footerLink },
      }),

      invalidatesTags: [{ type: "Footer", id: "LIST" }],
    }),

    deleteFooterLink: builder.mutation<ResponseType, { footerLinkId: string }>({
      query: ({ footerLinkId }) => ({
        url: `footer/${footerLinkId}`,
        method: "DELETE",
      }),

      invalidatesTags: [{ type: "Footer", id: "LIST" }],
    }),
  }),
});

export const {
  useGetFooterLinksQuery,
  useAddFooterLinkMutation,
  useUpdateFooterLinkMutation,
  useDeleteFooterLinkMutation,
} = footerApi;
export default footerApi;
