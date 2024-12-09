import { configureStore } from "@reduxjs/toolkit";

import generalReducer from "./features/generalSlice";
import heroSectionApi from "./apis/content-management";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    general: generalReducer,
    [heroSectionApi.reducerPath]: heroSectionApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(heroSectionApi.middleware),
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
