import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { certificateType } from "@/lib/interfaces-types";
import { baseAddr } from "@/lib/resuable-data";

interface ResponseType {
  data: {
    certificate: certificateType;
  };
  message: string;
  success: boolean;
}

export const certificateApi = createApi({
  reducerPath: "certificateApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseAddr + "/api/v1/",
    credentials: "include",
  }),
  tagTypes: ["Certificate"],
  endpoints: (builder) => ({
    // Fetch Certificate data
    getCertificate: builder.query<ResponseType, void>({
      query: () => "content/certificate",
      providesTags: [{ type: "Certificate", id: "LIST" }],
    }),

    // Update Certificate data
    updateCertificate: builder.mutation<ResponseType, certificateType>({
      query: (certificate) => ({
        url: `content/certificate`,
        method: "PUT",
        body: { ...certificate },
      }),

      invalidatesTags: [{ type: "Certificate", id: "LIST" }],
    }),
  }),
});

export const { useUpdateCertificateMutation, useGetCertificateQuery } =
  certificateApi;
export default certificateApi;
