import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { certificateType } from "@/lib/interfaces-types";

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
    baseUrl: "/api/v1/",
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
