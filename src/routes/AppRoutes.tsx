
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
import ProjectsListPage from "../pages/Projects/ProjectsListPage";
import CreateProjectPage from "../pages/Projects/CreateProjectPage";
import EditProjectPage from "../pages/Projects/EditProjectPage";
import PageNotFound from "../pages/NotFound/NotFoundPage";
import HomePage from "../pages/Home/HomePage";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Auth Routes (no layout) ── */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/activate/:uidb64/:token" element={<ActivatePage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        path="/reset-password/:uidb64/:token"
        element={<ResetPasswordPage />}
      />

      {/* Home */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <HomePage />
          </RequireAuth>
        }
      />
     
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/edit" element={<EditProfilePage />} />
      <Route path="/profile/change-password" element={<ChangePasswordPage />} />
      <Route path="/profile/my-donations" element={<MyDonationsPage />} />
      <Route path="/profile/delete-account" element={<DeleteAccountPage />} />
      

      <Route path="/projects" element={<ProjectsListPage />} />
      <Route
        path="/projects/create"
        element={
          <RequireAuth>
            <CreateProjectPage />
          </RequireAuth>
        }
      />
      <Route
        path="/projects/:id/edit"
        element={
          <RequireAuth>
            <EditProjectPage />
          </RequireAuth>
        }
      />

      {/* 404 */}
      <Route
        path="*"
        element={<PageNotFound />}
      />
    </Routes>
  );
}
