import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { transactionType } from "@/lib/interfaces-types";

interface ResponseType {
  data: {
    transactions: transactionType[];
    pagesCount: number;
  };
  message: string;
  success: boolean;
}

export const transactionsApi = createApi({
  reducerPath: "transactionsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/",
  }),
  tagTypes: ["Transactions", "Filtered-Transactions", "UserTransactions"],
  endpoints: (builder) => ({
    getTransactions: builder.query<ResponseType, string>({
      query: (extra) => `transaction${extra}`,
      providesTags: [{ type: "Transactions", id: "LIST" }],
    }),

    getUserTransactions: builder.query<ResponseType, string>({
      query: (extra) => `transaction/user/${extra}`,
      providesTags: [{ type: "UserTransactions", id: "LIST" }],
    }),

    getAllFilteredTransactions: builder.query<ResponseType, string>({
      query: (extra) => `transaction/filtered${extra}`,
      providesTags: [{ type: "Filtered-Transactions", id: "LIST" }],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetAllFilteredTransactionsQuery,
  useGetUserTransactionsQuery,
} = transactionsApi;

export default transactionsApi;
