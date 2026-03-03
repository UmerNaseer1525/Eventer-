import React from "react";
import Sidebar from "./Sidebar";
import "./mainLayout.css";

function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-content">{children}</div>
    </div>
  );
}

export default MainLayout;
