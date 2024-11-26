import React from "react";
import Footer from "../Components/Footer";
import { Outlet } from "react-router-dom";
import Header from "@/Components/Header";

const AppLayout = () => {
  return (
    <>
      <main className="min-h-screen container">
        {/* Header  */}
        {/* <nav>Nav</nav> */}
        {/* Body  */}

        <Header />

        {/* This is where the page content will be rendered according to the route configuration in the App.jsx file.  */}
        <Outlet />
        {/* <h1>body</h1> */}
      </main>
       {/* Footer */}
      {/* <footer>Footer</footer> */}
      <Footer />
    </>
  );
};

export default AppLayout;
