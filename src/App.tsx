import "./App.css";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/LandingPage.tsx";
import EventPage from "./Pages/EventPage.tsx";
import BlogPage from "./Pages/BlogPage.tsx";
import AboutUsPage from "./Pages/AboutUsPage.tsx";
import ContactUs from "./Pages/ContactUs.tsx";
import LoginPage from "./Pages/LoginPage.tsx";
import RegisterPage from "./Pages/RegisterPage.tsx";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage.tsx";
import { DateTimeSelectionPage } from "./Pages/DateTimeSelectionPage.tsx";
import { SeatSelectionPage } from "./Pages/SeatSelectionPage.tsx";
import { ReviewOrderPage } from "./Pages/ReviewOrderPage.tsx";
import { PaymentPage } from "./Pages/PaymentPage.tsx";
import { AdminChat } from "./Pages/Admin/AdminChat.tsx";
import { AdminDashboard } from "./Pages/Admin/AdminDashboard.tsx";
import AdminHomePage from "./Pages/Admin/AdminHomePage.tsx";
import { BookingAnalysis } from "./Pages/Admin/BookingAnalysis.tsx";
import { EventManagement } from "./Pages/Admin/EventManagement.tsx";
import { RevenueAnalysis } from "./Pages/Admin/RevenueAnalysis.tsx";
import UserHomePage from "./Pages/User/UserHomePage.tsx";
import UserEventPage from "./Pages/User/UserEventPage.tsx";
import UserBlogPage from "./Pages/User/UserBlogPage.tsx";
import UserAboutUsPage from "./Pages/User/UserAboutUsPage.tsx";
import UserContactUs from "./Pages/User/UserContactUs.tsx";
import { WriteBlogPage } from "./Pages/User/WriteBlogPage.tsx";
import AlertsPage from "./Pages/AlertsPage.tsx";
import ShowAvailability from "./Pages/ShowAvailability.tsx";
import { ChatPage } from "./Pages/ChatPage.tsx";
import { BlogApproval } from "./Pages/Admin/BlogApproval.tsx";
import { ShowManagement } from "./Pages/Admin/ShowManagement.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx"; // adjust path to match your project

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/events" element={<EventPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/about-us" element={<AboutUsPage />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sign-up" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Logged-in users only */}
      <Route
        path="/select-datetime"
        element={
          <ProtectedRoute>
            <DateTimeSelectionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seat-selection"
        element={
          <ProtectedRoute>
            <SeatSelectionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/review-order"
        element={
          <ProtectedRoute>
            <ReviewOrderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user-home-page"
        element={
          <ProtectedRoute>
            <UserHomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-events"
        element={
          <ProtectedRoute>
            <UserEventPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-blog"
        element={
          <ProtectedRoute>
            <UserBlogPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-write-blog"
        element={
          <ProtectedRoute>
            <WriteBlogPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-about-us"
        element={
          <ProtectedRoute>
            <UserAboutUsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-contact-us"
        element={
          <ProtectedRoute>
            <UserContactUs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user-alert"
        element={
          <ProtectedRoute>
            <AlertsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/show-availability"
        element={
          <ProtectedRoute>
            <ShowAvailability />
          </ProtectedRoute>
        }
      />

      {/* Admins only */}
      <Route
        path="/admin-chat"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminChat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/show-management"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <ShowManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-home-page"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminHomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-blog"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <BlogApproval />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking-analysis"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <BookingAnalysis />
          </ProtectedRoute>
        }
      />
      <Route
        path="/event-management"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <EventManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/revenue-analysis"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <RevenueAnalysis />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
export default App;
