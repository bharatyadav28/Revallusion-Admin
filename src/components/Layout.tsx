import { Outlet } from "react-router-dom";

import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./sidebar/AppSidebar";
import Header from "./Header";

function SidebarLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="ps-6 pr-6 w-full">
        <Header />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

export default SidebarLayout;
