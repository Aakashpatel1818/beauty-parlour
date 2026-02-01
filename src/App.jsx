import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";

import store from "./redux/store";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import Services from "./pages/Services.jsx";
import Booking from "./pages/Booking.jsx";
import Gallery from "./pages/Gallery.jsx";
import Reviews from "./pages/Reviews.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function App() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <Router>
          <Header />
          <main style={{ minHeight: "80vh" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </HelmetProvider>
    </Provider>
  );
}

export default App;
