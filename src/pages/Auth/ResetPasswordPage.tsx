import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Lock,
  KeyRound,
  Loader2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

// ─── Zod Schema ─────────────────────────────────────────────────────────────

const resetPasswordSchema = z
  .object({
    new_password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirm_new_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: 'Passwords do not match',
    path: ['confirm_new_password'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// ─── Password Strength Indicator ────────────────────────────────────────────

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ characters', met: password.length >= 8 },
    { label: 'Uppercase', met: /[A-Z]/.test(password) },
    { label: 'Lowercase', met: /[a-z]/.test(password) },
    { label: 'Number', met: /[0-9]/.test(password) },
  ];

  const metCount = checks.filter((c) => c.met).length;
  const percent = (metCount / checks.length) * 100;
  const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-400'];
  const color = colors[Math.min(metCount, colors.length) - 1] || 'bg-gray-200';

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {checks.map((c) => (
          <div
            key={c.label}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              c.met ? 'text-emerald-600' : 'text-gray-400'
            }`}
          >
            <CheckCircle2
              className={`w-3 h-3 ${c.met ? 'text-emerald-500' : 'text-gray-300'}`}
            />
            {c.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function ResetPasswordPage() {
  const { uidb64, token } = useParams<{ uidb64: string; token: string }>();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const watchPassword = watch('new_password', '');

  const onSubmit = async (data: ResetPasswordFormData) => {
    setApiError(null);

    if (!uidb64 || !token) {
      setApiError('Invalid reset link.');
      return;
    }

    try {
      await axiosInstance.post(
        `auth/password/reset/confirm/${uidb64}/${token}/`,
        data,
      );
      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: Record<string, unknown> };
      };
      const errData = error.response?.data;

      if (errData) {
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
        setApiError(messages.join(' ') || 'Password reset failed.');
      } else {
        setApiError('Something went wrong. Please try again.');
      }
    }
  };

  const passwordInputClasses = (hasError: boolean) => `
    w-full pl-10 pr-12 py-3 rounded-xl border bg-gray-50/50
    text-gray-900 placeholder-gray-400
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white
    ${hasError ? 'border-red-300 focus:ring-red-200 focus:border-red-500' : 'border-gray-200'}
  `;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
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
            <div className="mx-auto w-16 h-16 rounded-2xl bg-violet-50 border border-violet-200 flex items-center justify-center mb-4">
              <KeyRound className="w-8 h-8 text-violet-500" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">Set a new password</h1>
            <p className="mt-1 text-sm text-gray-500">
              Choose a strong password for your account
            </p>
          </div>

          {/* Success State */}
          {success && (
            <div className="space-y-5">
              <div
                className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm"
                role="status"
                id="reset-success-alert"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Password reset successfully!</p>
                  <p className="text-xs text-emerald-600 mt-1">
                    Redirecting to login page...
                  </p>
                </div>
              </div>

              <Link
                to="/login"
                className="
                  w-full flex items-center justify-center gap-2
                  py-3 px-6 rounded-xl font-semibold text-sm text-white
                  bg-gradient-to-r from-primary-600 to-primary-500
                  shadow-lg shadow-primary-500/25
                  hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5
                  transition-all duration-200
                "
                id="go-to-login-btn"
              >
                Go to Login
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Error */}
          {apiError && (
            <div
              className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
              role="alert"
              id="reset-error-alert"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              {apiError}
            </div>
          )}

          {/* Form */}
          {!success && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              id="reset-password-form"
              noValidate
            >
              {/* New Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="new_password"
                  className="block text-sm font-medium text-gray-700"
                >
                  New password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="new_password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className={passwordInputClasses(!!errors.new_password)}
                    {...register('new_password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.new_password && (
                  <p className="text-xs text-red-500">
                    {errors.new_password.message}
                  </p>
                )}
                <PasswordStrength password={watchPassword} />
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="confirm_new_password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm new password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="confirm_new_password"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className={passwordInputClasses(!!errors.confirm_new_password)}
                    {...register('confirm_new_password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirm_new_password && (
                  <p className="text-xs text-red-500">
                    {errors.confirm_new_password.message}
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
                id="reset-submit-btn"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <KeyRound className="w-4 h-4" />
                )}
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          {/* Back to Login */}
          {!success && (
            <p className="text-center text-sm text-gray-500">
              Remember your password?{' '}
              <Link
                to="/login"
                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
