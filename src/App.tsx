import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./App.css";
import { ThemeProvider } from "./lib/theme-provider";
import Home from "./pages/Home";
import SidebarLayout from "./components/Layout";
import NotFound from "./pages/Notfound";
import HeroSection from "./pages/content-pages/HeroSection";
import Faq from "./pages/content-pages/FAQ/Faq";
import ViewFaqs from "./pages/content-pages/FAQ/ViewFaqs";
import ViewCarousal from "./pages/content-pages/Carousal/ViewCarousals";
import Carousal from "./pages/content-pages/Carousal/Carousal";
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
import { useSendMeQuery } from "./store/apis/auth.apis";
import { PageLoadingSpinner } from "./components/common/LoadingSpinner";
import { useEffect } from "react";
import { useAppDispatch } from "./hooks/use-redux";
import { setUser } from "./store/features/generalSlice";

function App() {
  const { data, isFetching } = useSendMeQuery();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) {
      dispatch(setUser(data?.data?.user));
    }
  }, [data]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster
      // position="bottom-right"
      // toastOptions={{
      //   style: {
      //     background: "#363636",
      //     color: "#fff",
      //   },
      // }}
      />
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/" element={<SidebarLayout />}>
          <Route index element={<Home />} />
          <Route path="hero-section" element={<HeroSection />} />

          <Route path="carousals">
            <Route index element={<ViewCarousal />} />
            <Route path=":id" element={<Carousal />} />
            <Route path="add" element={<Carousal />} />
          </Route>

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

          <Route path="/modules">
            <Route index element={<ModulesList />} />
            <Route path="add" element={<ModuleItem />} />
            <Route path=":id" element={<ModuleItem />} />
          </Route>

          <Route path="/queries">
            <Route index element={<QueriesList />} />
            <Route path=":id" element={<QueryDetails />} />
          </Route>

          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      {isFetching && <PageLoadingSpinner />}
    </ThemeProvider>
  );
}

export default App;
