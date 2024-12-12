import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import generalReducer from "./features/generalSlice";
import heroSectionApi from "./apis/content-mangement/hero-section-apis";
import faqApi from "./apis/content-mangement/faq-apis";
import carousalApi from "./apis/content-mangement/carousal-apis";
import mentorApi from "./apis/content-mangement/mentor-apis";
import certificateApi from "./apis/content-mangement/certificate-apis";
import pagesApi from "./apis/content-mangement/static-pages-apis";
import plansApi from "./apis/content-mangement/plans-apis";
import moduleApi from "./apis/modules-apis";

export const store = configureStore({
  reducer: {
    general: generalReducer,
    [heroSectionApi.reducerPath]: heroSectionApi.reducer,
    [faqApi.reducerPath]: faqApi.reducer,
    [carousalApi.reducerPath]: carousalApi.reducer,
    [mentorApi.reducerPath]: mentorApi.reducer,
    [certificateApi.reducerPath]: certificateApi.reducer,
    [pagesApi.reducerPath]: pagesApi.reducer,
    [plansApi.reducerPath]: plansApi.reducer,
    [moduleApi.reducerPath]: moduleApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(heroSectionApi.middleware)
      .concat(faqApi.middleware)
      .concat(carousalApi.middleware)
      .concat(mentorApi.middleware)
      .concat(certificateApi.middleware)
      .concat(pagesApi.middleware)
      .concat(plansApi.middleware)
      .concat(moduleApi.middleware),

  // devTools: process.env.NODE_ENV !== "production",

  devTools: true,
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
