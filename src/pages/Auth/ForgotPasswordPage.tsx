import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import {
  Mail,
  ArrowLeft,
  Send,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

// ─── Zod Schema ─────────────────────────────────────────────────────────────

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// ─── Component ──────────────────────────────────────────────────────────────

export default function ForgotPasswordPage() {
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setApiError(null);
    setSuccessMsg(null);

    try {
      const response = await axiosInstance.post('auth/password/reset/', data);
      setSuccessMsg(response.data.message);
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: Record<string, unknown> };
      };
      const errData = error.response?.data;

      if (errData) {
        // Handle field-level errors (e.g., email: ["No account found..."])
        const messages: string[] = [];
        for (const [key, value] of Object.entries(errData)) {
          if (key === 'error' || key === 'detail') {
            messages.push(String(value));
          } else if (Array.isArray(value)) {
            messages.push(value.join(', '));
          } else if (typeof value === 'string') {
            messages.push(value);
          }
        }
        setApiError(messages.join(' ') || 'Failed to send reset email.');
      } else {
        setApiError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-2xl font-extrabold text-gray-900">
                Fund<span className="text-primary-500">ly</span>
              </span>
            </Link>

            {/* Icon */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-amber-500" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">Forgot your password?</h1>
            <p className="mt-1 text-sm text-gray-500 max-w-xs mx-auto">
              No worries! Enter your email and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Success State */}
          {successMsg && (
            <div
              className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm"
              role="status"
              id="forgot-success-alert"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">{successMsg}</p>
                <p className="text-xs text-emerald-600 mt-1">
                  Please check your inbox and spam folder.
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {apiError && (
            <div
              className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
              role="alert"
              id="forgot-error-alert"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              {apiError}
            </div>
          )}

          {/* Form */}
          {!successMsg && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              id="forgot-password-form"
              noValidate
            >
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={`
                      w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50/50
                      text-gray-900 placeholder-gray-400
                      transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white
                      ${errors.email ? 'border-red-300 focus:ring-red-200 focus:border-red-500' : 'border-gray-200'}
                    `}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  w-full flex items-center justify-center gap-2
                  py-3 px-6 rounded-xl font-semibold text-sm text-white
                  bg-gradient-to-r from-primary-600 to-primary-500
                  shadow-lg shadow-primary-500/25
                  hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5
                  active:translate-y-0
                  disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
                  transition-all duration-200
                "
                id="forgot-submit-btn"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          {/* Resend option after success */}
          {successMsg && (
            <button
              onClick={() => {
                setSuccessMsg(null);
                setApiError(null);
              }}
              className="
                w-full flex items-center justify-center gap-2
                py-3 px-6 rounded-xl font-semibold text-sm
                text-primary-600 bg-primary-50 border border-primary-200
                hover:bg-primary-100
                transition-all duration-200
              "
              id="try-again-btn"
            >
              <Send className="w-4 h-4" />
              Send another link
            </button>
          )}

          {/* Back to Login */}
          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              id="back-to-login-link"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
