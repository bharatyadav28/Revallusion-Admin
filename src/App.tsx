import { Routes, Route } from "react-router-dom";

import "./App.css";
import { ThemeProvider } from "./lib/theme-provider";
import Home from "./pages/Home";
import SidebarLayout from "./components/Layout";
import NotFound from "./pages/Notfound";
import HeroSection from "./pages/content-pages/HeroSection";
import Faq from "./pages/content-pages/FAQ/Faq";
import ViewFaqs from "./pages/content-pages/FAQ/ViewFaqs";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<SidebarLayout />}>
          <Route index element={<Home />} />
          <Route path="hero-section" element={<HeroSection />} />
          <Route path="faq">
            <Route index element={<ViewFaqs />} />
            <Route path=":id" element={<Faq />} />
            <Route path="add" element={<Faq />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
