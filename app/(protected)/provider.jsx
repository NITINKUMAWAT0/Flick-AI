import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./_components/AppSidebar";
import AppHeader from './_components/AppHeader'
import React from "react";

const DashboardProvider = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
        <AppHeader/>
      {children}
      </div>
    </SidebarProvider>
  );
};

export default DashboardProvider;
