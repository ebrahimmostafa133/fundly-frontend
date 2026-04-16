import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  UserPlus,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

// ─── Zod Schema ─────────────────────────────────────────────────────────────

const registerSchema = z
  .object({
    first_name: z
      .string()
      .min(2, 'First name must be at least 2 characters')
      .max(30, 'First name is too long'),
    last_name: z
      .string()
      .min(2, 'Last name must be at least 2 characters')
      .max(30, 'Last name is too long'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirm_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

// ─── Password Strength Indicator ────────────────────────────────────────────

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ characters', met: password.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Number', met: /[0-9]/.test(password) },
  ];

  const metCount = checks.filter((c) => c.met).length;
  const strengthPercent = (metCount / checks.length) * 100;

  const strengthColors = [
    'bg-red-400',
    'bg-orange-400',
    'bg-yellow-400',
    'bg-emerald-400',
  ];
  const strengthColor = strengthColors[Math.min(metCount, strengthColors.length) - 1] || 'bg-gray-200';

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Bar */}
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${strengthColor}`}
          style={{ width: `${strengthPercent}%` }}
        />
      </div>
      {/* Checklist */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {checks.map((check) => (
          <div
            key={check.label}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              check.met ? 'text-emerald-600' : 'text-gray-400'
            }`}
          >
            <CheckCircle2
              className={`w-3 h-3 ${check.met ? 'text-emerald-500' : 'text-gray-300'}`}
            />
            {check.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const watchPassword = watch('password', '');

  const onSubmit = async (data: RegisterFormData) => {
    setApiError(null);
    setSuccessMsg(null);

    try {
      const response = await axiosInstance.post('auth/register/', data);
      setSuccessMsg(response.data.message);

      // Redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: Record<string, unknown> };
      };
      const data = error.response?.data;

      if (data) {
        // Collect field-level errors from DRF
        const messages: string[] = [];
        for (const [key, value] of Object.entries(data)) {
          if (key === 'error' || key === 'detail') {
            messages.push(String(value));
          } else if (Array.isArray(value)) {
            messages.push(`${key}: ${value.join(', ')}`);
          } else if (typeof value === 'string') {
            messages.push(`${key}: ${value}`);
          }
        }
        setApiError(messages.join('\n') || 'Registration failed.');
      } else {
        setApiError('Registration failed. Please try again.');
      }
    }
  };

  // ─── Input helper ─────────────────────────────────────────────────────────

  const inputClasses = (hasError: boolean) => `
    w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50/50
    text-gray-900 placeholder-gray-400
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white
    ${hasError ? 'border-red-300 focus:ring-red-200 focus:border-red-500' : 'border-gray-200'}
  `;

  const passwordInputClasses = (hasError: boolean) => `
    w-full pl-10 pr-12 py-3 rounded-xl border bg-gray-50/50
    text-gray-900 placeholder-gray-400
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white
    ${hasError ? 'border-red-300 focus:ring-red-200 focus:border-red-500' : 'border-gray-200'}
  `;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
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
            <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
            <p className="mt-1 text-sm text-gray-500">
              Join Fundly and start backing amazing projects
            </p>
          </div>

          {/* Success Message */}
          {successMsg && (
            <div
              className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm"
              role="status"
              id="register-success-alert"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">{successMsg}</p>
                <p className="text-xs text-emerald-600 mt-1">
                  Redirecting to login page...
                </p>
              </div>
            </div>
          )}

          {/* API Error */}
          {apiError && (
            <div
              className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
              role="alert"
              id="register-error-alert"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <pre className="whitespace-pre-wrap font-sans">{apiError}</pre>
            </div>
          )}

          {/* Form */}
          {!successMsg && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              id="register-form"
              noValidate
            >
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-3">
                {/* First Name */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="first_name"
                      type="text"
                      autoComplete="given-name"
                      placeholder="John"
                      className={inputClasses(!!errors.first_name)}
                      {...register('first_name')}
                    />
                  </div>
                  {errors.first_name && (
                    <p className="text-xs text-red-500">{errors.first_name.message}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="last_name"
                      type="text"
                      autoComplete="family-name"
                      placeholder="Doe"
                      className={inputClasses(!!errors.last_name)}
                      {...register('last_name')}
                    />
                  </div>
                  {errors.last_name && (
                    <p className="text-xs text-red-500">{errors.last_name.message}</p>
                  )}
                </div>
              </div>

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
                    className={inputClasses(!!errors.email)}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Phone (optional) */}
              <div className="space-y-1.5">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone{' '}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+20 1XX XXX XXXX"
                    className={inputClasses(false)}
                    {...register('phone')}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className={passwordInputClasses(!!errors.password)}
                    {...register('password')}
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
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
                <PasswordStrength password={watchPassword} />
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="confirm_password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="confirm_password"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className={passwordInputClasses(!!errors.confirm_password)}
                    {...register('confirm_password')}
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
                {errors.confirm_password && (
                  <p className="text-xs text-red-500">
                    {errors.confirm_password.message}
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
                id="register-submit-btn"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          {/* Footer */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              id="login-link"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
