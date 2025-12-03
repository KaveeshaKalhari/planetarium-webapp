import './App.css'
import {Route, Routes} from "react-router-dom";
import LandingPage from "./Pages/LandingPage.tsx";
import EventPage from "./Pages/EventPage.tsx";
import BlogPage from "./Pages/BlogPage.tsx";
import AboutUsPage from "./Pages/AboutUsPage.tsx";
import ContactUs from "./Pages/ContactUs.tsx";
import LoginPage from "./Pages/LoginPage.tsx";
import RegisterPage from "./Pages/RegisterPage.tsx";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage.tsx";
import BookingPage from "./Pages/BookingPage.tsx";
import ChooseSeatPage from "./Pages/ChooseSeatPage..tsx";
import ReviewOrderPage from "./Pages/ReviewOrderPage.tsx";
import PaymentPage from "./Pages/PaymentPage.tsx";

function App() {
  return (
      <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/events" element={<EventPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/choose-seats" element={<ChooseSeatPage />} />
          <Route path="/review-order" element={<ReviewOrderPage />} />
          <Route path="/payment" element={<PaymentPage />} />
      </Routes>
  )
}
export default App;