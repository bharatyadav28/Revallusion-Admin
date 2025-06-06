import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import generalReducer from "./features/generalSlice";
import selectedPlanReducer from "./features/selectedPlanSlice";
import heroSectionApi from "./apis/content-mangement/hero-section-apis";
import faqApi from "./apis/content-mangement/faq-apis";
import carousalApi from "./apis/content-mangement/carousal-apis";
import latestTutorialsApi from "./apis/content-mangement/latest-tutorial-apis";
import mentorApi from "./apis/content-mangement/mentor-apis";
import certificateApi from "./apis/content-mangement/certificate-apis";
import pagesApi from "./apis/content-mangement/static-pages-apis";
import plansApi from "./apis/content-mangement/plans-apis";
import moduleApi from "./apis/modules-apis";
import queriesApi from "./apis/queries.apis";
import authApi from "./apis/auth.apis";
import libraryApi from "./apis/library-apis";
import courseApi from "./apis/course-apis";
import assignmentApi from "./apis/assignment-apis";
import resourceApi from "./apis/resources-apis";
import commentApi from "./apis/comment-apis";
import primaryDashboardApi from "./apis/primary-dashboard-apis";
import usersApi from "./apis/users-apis";
import transactionsApi from "./apis/transactions-apis";
import dashboardApi from "./apis/dashboard-apis";
import leaderBoardApi from "./apis/leaderboard-apis";
import appConfigApi from "./apis/app-congif-apis";
import timestampApi from "./apis/timestamp-apis";

export const store = configureStore({
  reducer: {
    general: generalReducer,
    selectedPlan: selectedPlanReducer,
    [heroSectionApi.reducerPath]: heroSectionApi.reducer,
    [faqApi.reducerPath]: faqApi.reducer,
    [carousalApi.reducerPath]: carousalApi.reducer,
    [latestTutorialsApi.reducerPath]: latestTutorialsApi.reducer,
    [mentorApi.reducerPath]: mentorApi.reducer,
    [certificateApi.reducerPath]: certificateApi.reducer,
    [pagesApi.reducerPath]: pagesApi.reducer,
    [plansApi.reducerPath]: plansApi.reducer,
    [moduleApi.reducerPath]: moduleApi.reducer,
    [queriesApi.reducerPath]: queriesApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [libraryApi.reducerPath]: libraryApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    [assignmentApi.reducerPath]: assignmentApi.reducer,
    [resourceApi.reducerPath]: resourceApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer,
    [primaryDashboardApi.reducerPath]: primaryDashboardApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [transactionsApi.reducerPath]: transactionsApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [leaderBoardApi.reducerPath]: leaderBoardApi.reducer,
    [appConfigApi.reducerPath]: appConfigApi.reducer,
    [timestampApi.reducerPath]: timestampApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(heroSectionApi.middleware)
      .concat(faqApi.middleware)
      .concat(carousalApi.middleware)
      .concat(latestTutorialsApi.middleware)
      .concat(mentorApi.middleware)
      .concat(certificateApi.middleware)
      .concat(pagesApi.middleware)
      .concat(plansApi.middleware)
      .concat(moduleApi.middleware)
      .concat(queriesApi.middleware)
      .concat(authApi.middleware)
      .concat(libraryApi.middleware)
      .concat(courseApi.middleware)
      .concat(assignmentApi.middleware)
      .concat(resourceApi.middleware)
      .concat(commentApi.middleware)
      .concat(primaryDashboardApi.middleware)
      .concat(usersApi.middleware)
      .concat(transactionsApi.middleware)
      .concat(dashboardApi.middleware)
      .concat(leaderBoardApi.middleware)
      .concat(appConfigApi.middleware)
      .concat(timestampApi.middleware),

  devTools: process.env.NODE_ENV !== "production",

  // devTools: true,
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
