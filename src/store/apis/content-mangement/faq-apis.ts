import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { faqType } from "@/lib/interfaces-types";

interface ResponseType {
  data: {
    faqs: [faqType];
  };
  message: string;
  success: boolean;
}

export const faqApi = createApi({
  reducerPath: "faqApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/",
  }),
  tagTypes: ["Faq"],
  endpoints: (builder) => ({
    // Fetch FAQs
    getFaqs: builder.query<ResponseType, void>({
      query: () => "content/faq",
      providesTags: [{ type: "Faq", id: "LIST" }],
    }),

    // Add FAQ
    addFaq: builder.mutation<ResponseType, faqType>({
      query: (faq) => ({
        url: `content/faq`,
        method: "POST",
        body: { ...faq },
      }),

      invalidatesTags: [{ type: "Faq", id: "LIST" }],
    }),

    // Update FAQ
    updateFaq: builder.mutation<ResponseType, { faq: faqType; id: string }>({
      query: ({ faq, id }) => ({
        url: `content/faq/${id}`,
        method: "PUT",
        body: { ...faq },
      }),

      invalidatesTags: [{ type: "Faq", id: "LIST" }],
    }),

    // Delete FAQ
    deleteFaq: builder.mutation<ResponseType, string>({
      query: (id) => ({
        url: `content/faq/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [{ type: "Faq", id: "LIST" }],
    }),
  }),
});

export const {
  useGetFaqsQuery,
  useAddFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqApi;
export default faqApi;
