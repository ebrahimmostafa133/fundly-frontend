import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

// ─── Component ──────────────────────────────────────────────────────────────

type Status = 'loading' | 'success' | 'already' | 'error';

export default function ActivatePage() {
  const { uidb64, token } = useParams<{ uidb64: string; token: string }>();
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const activateAccount = async () => {
      if (!uidb64 || !token) {
        setStatus('error');
        setMessage('Invalid activation link.');
        return;
      }

      try {
        const response = await axiosInstance.get(
          `auth/activate/${uidb64}/${token}/`
        );
        const msg: string = response.data.message || '';

        if (msg.toLowerCase().includes('already')) {
          setStatus('already');
        } else {
          setStatus('success');
        }
        setMessage(msg);
      } catch (err: unknown) {
        const error = err as {
          response?: { data?: { error?: string } };
        };
        setStatus('error');
        setMessage(
          error.response?.data?.error || 'Activation failed. The link may be invalid or expired.'
        );
      }
    };

    activateAccount();
  }, [uidb64, token]);

  // ─── Status configs ─────────────────────────────────────────────────────

  const statusConfig = {
    loading: {
      icon: <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />,
      bg: 'bg-primary-50',
      border: 'border-primary-200',
      title: 'Verifying your email...',
      subtitle: 'Please wait while we activate your account.',
    },
    success: {
      icon: <CheckCircle2 className="w-16 h-16 text-emerald-500" />,
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      title: 'Email Verified!',
      subtitle: message,
    },
    already: {
      icon: <CheckCircle2 className="w-16 h-16 text-blue-500" />,
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      title: 'Already Verified',
      subtitle: message,
    },
    error: {
      icon: <XCircle className="w-16 h-16 text-red-500" />,
      bg: 'bg-red-50',
      border: 'border-red-200',
      title: 'Activation Failed',
      subtitle: message,
    },
  };

  const config = statusConfig[status];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6">
          {/* Logo */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-2xl font-extrabold text-gray-900">
                Fund<span className="text-primary-500">ly</span>
              </span>
            </Link>
          </div>

          {/* Status Card */}
          <div
            className={`rounded-xl ${config.bg} border ${config.border} p-8 text-center space-y-4`}
            id="activation-status"
          >
            <div className="flex justify-center">{config.icon}</div>
            <h1 className="text-xl font-bold text-gray-900">{config.title}</h1>
            <p className="text-sm text-gray-600">{config.subtitle}</p>
          </div>

          {/* Action Button */}
          {status !== 'loading' && (
            <div className="text-center">
              <Link
                to="/login"
                className="
                  inline-flex items-center gap-2
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
        </div>
      </div>
    </div>
  );
}
