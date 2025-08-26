import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Demo from "./pages/Demo";
import Footer from "./components/Footer";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/demo" replace />} />
        {/* <Route path="/PostLogin" element={<PostLogin />} /> */}
        <Route path="/demo" element={<Demo page />} />
        <Route path="/Header" element={<Header />} />
      </Routes>
      <Footer />

      {/* ToastContainer outside Routes so it works everywhere */}
      <ToastContainer
        style={{ zIndex: 9999 }}
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
