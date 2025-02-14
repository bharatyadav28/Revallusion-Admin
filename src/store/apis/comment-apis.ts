import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { CommentType } from "@/lib/interfaces-types";

interface ResponseType {
  data: {
    comments: CommentType[];
    pagesCount?: number;
  };
  message: string;
  success: boolean;
}

export const commentApi = createApi({
  reducerPath: "commentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/comment",
  }),
  tagTypes: ["Comments"],
  endpoints: (builder) => ({
    // Fetch Comments data
    getComments: builder.query<ResponseType, string>({
      query: (query) => "" + query,
      providesTags: [{ type: "Comments", id: "LIST" }],
    }),

    // Reply to comment
    replyToComment: builder.mutation<
      ResponseType,
      { id: string; reply: string }
    >({
      query: ({ id, reply }) => ({
        url: `${id}/reply`,
        method: "PUT",
        body: { reply },
      }),

      invalidatesTags: [{ type: "Comments", id: "LIST" }],
    }),

    // Delete comment
    deleteComment: builder.mutation<ResponseType, string>({
      query: (id) => ({
        url: `${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [{ type: "Comments", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useReplyToCommentMutation,
  useDeleteCommentMutation,
} = commentApi;

export default commentApi;
