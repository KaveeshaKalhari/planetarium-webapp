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
import {DateTimeSelectionPage} from "./Pages/DateTimeSelectionPage.tsx";
import {SeatSelectionPage} from "./Pages/SeatSelectionPage.tsx";
import {ReviewOrderPage} from "./Pages/ReviewOrderPage.tsx";
import {PaymentPage} from "./Pages/PaymentPage.tsx";
import {AdminChat} from "./Pages/Admin/AdminChat.tsx";
import {AdminDashboard} from "./Pages/Admin/AdminDashboard.tsx";
import AdminHomePage from "./Pages/Admin/AdminHomePage.tsx";
import {BookingAnalysis} from "./Pages/Admin/BookingAnalysis.tsx";
import {EventManagement} from "./Pages/Admin/EventManagement.tsx";
import {RevenueAnalysis} from "./Pages/Admin/RevenueAnalysis.tsx";
import UserHomePage from "./Pages/User/UserHomePage.tsx";
import UserEventPage from "./Pages/User/UserEventPage.tsx";
import UserBlogPage from "./Pages/User/UserBlogPage.tsx";
import UserAboutUsPage from "./Pages/User/UserAboutUsPage.tsx";
import UserContactUs from "./Pages/User/UserContactUs.tsx";
import {WriteBlogPage} from "./Pages/User/WriteBlogPage.tsx";
import AlertsPage from "./Pages/AlertsPage.tsx";
import ReservationsPage from "./Pages/ReservationsPage.tsx";
import ShowAvailability from "./Pages/ShowAvailability.tsx";
import {ChatPage} from "./Pages/ChatPage.tsx";
import {BlogApproval} from "./Pages/Admin/BlogApproval.tsx";

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
          <Route path="/select-datetime" element={<DateTimeSelectionPage />} />
          <Route path="/seat-selection" element={<SeatSelectionPage />} />
          <Route path="/review-order" element={<ReviewOrderPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/chat" element={<ChatPage />} />

          <Route path="/user-home-page" element={<UserHomePage />} />
          <Route path="/user-events" element={<UserEventPage />} />
          <Route path="/user-blog" element={<UserBlogPage />} />
          <Route path="/user-write-blog" element={<WriteBlogPage />} />
          <Route path="/user-about-us" element={<UserAboutUsPage />} />
          <Route path="/user-contact-us" element={<UserContactUs />} />

          <Route path="/user-alert" element={<AlertsPage />} />
          <Route path="/user-reseravation" element={<ReservationsPage />} />
          <Route path="/show-availability" element={<ShowAvailability />} />

          <Route path="/admin-chat" element={<AdminChat />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-home-page" element={<AdminHomePage />} />
          <Route path="/admin-blog" element={<BlogApproval />} />
          <Route path="/booking-analysis" element={<BookingAnalysis />} />
          <Route path="/event-management" element={<EventManagement />} />
          <Route path="/revenue-analysis" element={<RevenueAnalysis />} />
      </Routes>
  )
}
export default App;