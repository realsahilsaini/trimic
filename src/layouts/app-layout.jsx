import React from "react";
import Footer from "../Components/Footer";
import { Outlet } from "react-router-dom";
import Header from "@/Components/Header";

const AppLayout = () => {
  return (
    <>
      <main className="min-h-screen px-4 container mx-auto">

        <Header />

        {/* This is where the page content will be rendered according to the route configuration in the App.jsx file.  */}
        <Outlet />

      </main>

      <Footer />
    </>
  );
};

export default AppLayout;
