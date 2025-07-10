import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { planType } from "@/lib/interfaces-types";
import { baseAddr } from "@/lib/resuable-data";

interface ResponseType {
  data: {
    plans: planType[];
  };
  message: string;
  success: boolean;
}

export const plansApi = createApi({
  reducerPath: "plansApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseAddr + "/api/v1/",
    credentials: "include",
  }),
  tagTypes: ["Plans"],
  endpoints: (builder) => ({
    // Fetch Plans data
    getPlans: builder.query<ResponseType, void>({
      query: () => "content/plan",
      providesTags: [{ type: "Plans", id: "LIST" }],
    }),

    // Update Plans data
    updatePlans: builder.mutation<ResponseType, { plan: planType; id: string }>(
      {
        query: ({ plan, id }) => ({
          url: `content/plan/${id}`,
          method: "PUT",
          body: { ...plan },
        }),

        invalidatesTags: [{ type: "Plans", id: "LIST" }],
      }
    ),
  }),
});

export const { useGetPlansQuery, useUpdatePlansMutation } = plansApi;
export default plansApi;
