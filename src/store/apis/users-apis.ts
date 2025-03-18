import { orderType, userDetailsType } from "@/lib/interfaces-types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface ResponseType {
  message: string;
  success: boolean;
  data: {
    users: userDetailsType[];
    pagesCount: number;
  };
}
interface DetailsResponseType {
  message: string;
  success: boolean;
  data: {
    user: userDetailsType;
    activeOrder: orderType;
  };
}

interface addUserType {
  _id?: string;
  email: string;
  name: string;
  mobile: string;
  plan?: string;
  isPlanUpdated?: boolean;
}

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/",
  }),
  tagTypes: ["users"],
  endpoints: (builder) => ({
    //  Fetch all users
    getUsers: builder.query<ResponseType, string>({
      query: (query) => `/admin/users?${query}`,
      providesTags: [{ type: "users", id: "LIST" }],
    }),

    // Fetch single user details
    getUserDetails: builder.query<DetailsResponseType, string>({
      query: (id) => `/admin/users/${id}`,
      providesTags: (_, __, id) => [{ type: "users", id }],
    }),

    // Add new user
    addUser: builder.mutation<ResponseType, addUserType>({
      query: (user) => ({
        url: `/admin/users`,
        method: "POST",
        body: user,
      }),
      invalidatesTags: [{ type: "users", id: "LIST" }],
    }),

    // Update a user
    updateUser: builder.mutation<
      ResponseType,
      { user: addUserType; id: string }
    >({
      query: ({ user, id }) => ({
        url: `/admin/users/${id}`,
        method: "PUT",
        body: user,
      }),
      invalidatesTags: [{ type: "users", id: "LIST" }],
    }),

    // Delete user
    deleteUser: builder.mutation<ResponseType, string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "users", id: "LIST" }],
    }),
  }),
});

export const {
  useAddUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} = usersApi;

export default usersApi;
