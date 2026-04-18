
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
import ProjectDetailsPage from "../pages/ProjectDetails/ProjectDetailsPage";
import PageNotFound from "../pages/NotFound/NotFoundPage";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("access");
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
            <div className="min-h-[60vh] flex items-center justify-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Fund<span className="text-primary-500">ly</span> — Coming soon
              </h1>
            </div>
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
      <Route path="/projects/:id" element={<ProjectDetailsPage />} />

      {/* 404 */}
      <Route path="*" element={<PageNotFound />} />
      <Route
        path="*"
        element={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-7xl font-extrabold text-gray-200">404</h1>
              <p className="mt-3 text-gray-500 text-lg">Page not found</p>
              <a
                href="/"
                className="mt-5 inline-block text-sm text-primary-500 font-semibold hover:underline"
              >
                Back to Home
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
}
