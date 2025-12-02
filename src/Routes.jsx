import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import LandingPage from './pages/landing-page';
import Authentication from './pages/authentication';
import FieldSchedule from './pages/field-schedule';
import AdminBookingManagement from './pages/admin-booking-management';
import AdminFieldManagement from './pages/admin-field-management';
import UserProfile from './pages/user-profile';
import BookingForm from './pages/booking-form';
import PaymentManagement from './pages/payment-management';
import UserRegistration from './pages/user-registration';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/authentication" element={<Authentication />} />
        <Route path="/field-schedule" element={<FieldSchedule />} />
        <Route path="/admin-booking-management" element={<AdminBookingManagement />} />
        <Route path="/admin-field-management" element={<AdminFieldManagement />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/booking-form" element={<BookingForm />} />
        <Route path="/payment-management" element={<PaymentManagement />} />
        <Route path="/user-registration" element={<UserRegistration />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
