import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";

import { useSendMeQuery } from "./store/apis/auth.apis";
import { PageLoadingSpinner } from "./components/common/LoadingSpinner";
import { useAppDispatch } from "./hooks/use-redux";
import { setUser } from "./store/features/generalSlice";

import "./App.css";
import { ThemeProvider } from "./lib/theme-provider";
import Home from "./pages/Home";
import SidebarLayout from "./components/Layout";
import NotFound from "./pages/Notfound";
import HeroSection from "./pages/content-pages/HeroSection";
import Faq from "./pages/content-pages/FAQ/Faq";
import ViewFaqs from "./pages/content-pages/FAQ/ViewFaqs";

import Carousals from "./pages/content-pages/Carousal/Carousals";
import Mentor from "./pages/content-pages/Mentor/Mentor";
import Certificate from "./pages/content-pages/Certificate/Certificate";
import StaticPages from "./pages/content-pages/Static/StaticPages";
import EditStaticPage from "./pages/content-pages/Static/EditStaticPage";
import Profile from "./pages/Profile";
import Plan from "./pages/content-pages/Plan/Plan";
import ModulesList from "./pages/Modules/ModulesList";
import ModuleItem from "./pages/Modules/ModuleItem";
import QueriesList from "./pages/Query/QueriesList";
import QueryDetails from "./pages/Query/QueryDetails";
import Signin from "./pages/auth/Signin";
import VideoList from "./pages/library-management/VideoList";
import AddEditVideo from "./pages/library-management/AddEditVideo";
import CourseList from "./pages/course-management/CourseList";
import EditCourse from "./pages/course-management/EditCourse";
import LatestTutorialsList from "./pages/content-pages/latest-tutorials/LatestTutorialsList";
import Curriculum from "./pages/content-pages/Curriculum";
import SubmittedAssignments from "./pages/SubmittedAssignments";
import Comment from "./pages/Comment";
import PrimaryDashboard from "./pages/PrimaryDashboard";
import UsersList from "./pages/users/UsersList";
import UsersDetails from "./pages/users/UsersDetails";
import Transactions from "./pages/Transactions";
import LeaderBoard from "./pages/leader-board/LeaderBoard";
import DeletedUsers from "./pages/users/DeletedUsers";

function App() {
  const { data, isFetching } = useSendMeQuery();

  const dispatch = useAppDispatch();

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      offset: 50, // Offset (in pixels) from the original trigger point
      easing: "ease-in-out", // Easing function
      // once: true, // Whether animation should happen only once
    });
  }, []);

  useEffect(() => {
    if (data) {
      dispatch(setUser(data?.data?.user));
    }
  }, [data]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster />
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/" element={<SidebarLayout />}>
          <Route index element={<Home />} />
          <Route path="hero-section" element={<HeroSection />} />

          <Route path="carousals">
            <Route index element={<Carousals />} />
          </Route>

          <Route path="latest-tutorials" element={<LatestTutorialsList />} />

          <Route path="plans" element={<Plan />} />

          <Route path="mentor" element={<Mentor />} />

          <Route path="certificate" element={<Certificate />} />

          <Route path="faq">
            <Route index element={<ViewFaqs />} />
            <Route path=":id" element={<Faq />} />
            <Route path="add" element={<Faq />} />
          </Route>

          <Route path="static-pages">
            <Route index element={<StaticPages />} />
            <Route path=":id" element={<EditStaticPage />} />
          </Route>

          <Route path="curriculum" element={<Curriculum />} />

          <Route path="/modules">
            <Route index element={<ModulesList />} />
            <Route path="add" element={<ModuleItem />} />
            <Route path=":id" element={<ModuleItem />} />
          </Route>

          <Route path="/queries">
            <Route index element={<QueriesList />} />
            <Route path=":id" element={<QueryDetails />} />
          </Route>

          <Route path="/users">
            <Route index element={<UsersList />} />
            <Route path=":id" element={<UsersDetails />} />
          </Route>

          <Route path="deleted-users" element={<DeletedUsers />} />

          <Route path="leader-board" element={<LeaderBoard />} />

          <Route path="transactions" element={<Transactions />} />

          <Route path="/primary-dashboard" element={<PrimaryDashboard />} />

          <Route path="/library-management">
            <Route index element={<VideoList />} />
            <Route path=":id" element={<AddEditVideo />} />
            <Route path="add" element={<AddEditVideo />} />
          </Route>

          <Route path="/course-management">
            <Route index element={<CourseList />} />
            <Route path=":id" element={<EditCourse />} />
          </Route>

          <Route path="/profile" element={<Profile />} />
          <Route path="/comment" element={<Comment />} />

          <Route
            path="/submitted-assignments"
            element={<SubmittedAssignments />}
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      {isFetching && <PageLoadingSpinner isFullPage={true} />}
    </ThemeProvider>
  );
}

export default App;
