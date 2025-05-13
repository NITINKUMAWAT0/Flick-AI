// (protected)/layout.jsx
import React from "react";
import DashboardProvider from "./provider";

const ProtectedLayout = ({ children }) => {
  return (
    <DashboardProvider>
      {children}
    </DashboardProvider>
  );
};

export default ProtectedLayout;
