import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import generalReducer from "./features/generalSlice";
import heroSectionApi from "./apis/content-management";
import faqApi from "./apis/faq-apis";
import carousalApi from "./apis/carousal-apis";
import mentorApi from "./apis/mentor-apis";
import certificateApi from "./apis/certificate-apis";

export const store = configureStore({
  reducer: {
    general: generalReducer,
    [heroSectionApi.reducerPath]: heroSectionApi.reducer,
    [faqApi.reducerPath]: faqApi.reducer,
    [carousalApi.reducerPath]: carousalApi.reducer,
    [mentorApi.reducerPath]: mentorApi.reducer,
    [certificateApi.reducerPath]: certificateApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(heroSectionApi.middleware)
      .concat(faqApi.middleware)
      .concat(carousalApi.middleware)
      .concat(mentorApi.middleware)
      .concat(certificateApi.middleware),

  devTools: true,
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
