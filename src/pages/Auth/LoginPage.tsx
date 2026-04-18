import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, LogIn, Loader2 } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

// ─── Schema ─────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ─── Component ──────────────────────────────────────────

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
  setApiError(null);
  try {
    const response = await axiosInstance.post('auth/login/', {
      email: data.email,
      password: data.password,
    });

    const { tokens, user } = response.data;

    if (!tokens?.access) {
      throw new Error("No access token received");
    }

    localStorage.setItem('access', tokens.access);
    localStorage.setItem('refresh', tokens.refresh);

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }

    navigate('/');
  } catch (err: any) {
    console.error("LOGIN ERROR:", err?.response?.data || err);
    setApiError(
      err?.response?.data?.error ||
      err?.response?.data?.detail ||
      err?.message ||
      "Login failed. Please try again."
    );
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">

      {/* background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6">

          {/* HEADER */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-2xl font-extrabold text-gray-900">
                Fund<span className="text-primary-500">ly</span>
              </span>
            </Link>

            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Sign in to continue
            </p>
          </div>

          {/* ERROR */}
          {apiError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {apiError}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* EMAIL */}
            <div>
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-3 rounded-xl border bg-gray-50"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />

              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-3 rounded-xl border bg-gray-50"
                {...register('password')}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-xs">
                {errors.password.message}
              </p>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white font-semibold"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold">
              Create one
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
