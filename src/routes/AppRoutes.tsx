import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import ActivatePage from '../pages/Auth/ActivatePage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/Auth/ResetPasswordPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import EditProfilePage from "../pages/Profile/EditProfilePage";
import ChangePasswordPage from '../pages/Profile/ChangePasswordPage';
import MyDonationsPage from '../pages/Profile/MyDonationsPage';
import DeleteAccountPage from '../pages/Profile/DeleteAccountPage';


// ─── Redirect to /login if no token found ───────────────────────────────────

function HomeRedirect() {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Placeholder home — other team members will replace this
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-900">
        Fund<span className="text-primary-500">ly</span>
      </h1>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Auth Routes (Person 2) ── */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/activate/:uidb64/:token" element={<ActivatePage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:uidb64/:token" element={<ResetPasswordPage />} />


      {/* ── Home — redirects to login if not authenticated ── */}
      <Route path="/" element={<HomeRedirect />} />


      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/edit" element={<EditProfilePage />} />
      <Route path="/profile/change-password" element={<ChangePasswordPage />} />
      <Route path="/profile/my-donations" element={<MyDonationsPage />} />
      <Route path="/profile/delete-account" element={<DeleteAccountPage />} />

      {/* ── 404 ── */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-300">404</h1>
              <p className="mt-2 text-gray-500">Page not found</p>
            </div>
          </div>
        }
      />
    </Routes>
  );
}
