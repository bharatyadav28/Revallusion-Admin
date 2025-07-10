import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { LeaderBoardItemType } from "@/lib/interfaces-types";
import { baseAddr } from "@/lib/resuable-data";

interface ResponseType {
  data: {
    leaderBoard: LeaderBoardItemType[];
    pagesCount: number;
  };
  message: string;
  success: boolean;
}

export const leaderBoardApi = createApi({
  reducerPath: "leaderBoardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseAddr + "/api/v1/",
    credentials: "include",
  }),
  tagTypes: ["LeaderBoard"],
  endpoints: (builder) => ({
    getLeaderBoard: builder.query<ResponseType, string>({
      query: (extra) => `user-certificate/leader-board${extra}`,
      providesTags: [{ type: "LeaderBoard", id: "LIST" }],
    }),
  }),
});

export const { useGetLeaderBoardQuery } = leaderBoardApi;

export default leaderBoardApi;
