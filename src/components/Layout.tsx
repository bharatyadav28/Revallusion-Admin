import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./sidebar/AppSidebar";
import Header from "./Header";
import { useEffect } from "react";
import { useAppSelector } from "@/hooks/use-redux";

function SidebarLayout() {
  // const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((state) => state.general.user);

  // Redirect to signin page if user is not logged in
  useEffect(() => {
    if (!user?._id) {
      window.location.href = `/signin?redirect=${location.pathname}`;
      // navigate(`/signin?redirect=${location.pathname}`, { replace: true });
    }
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="ps-6 pr-6 w-full h-screen flex flex-col">
        <Header />

        <div className="relative flex-grow pb-4 ">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}

export default SidebarLayout;
