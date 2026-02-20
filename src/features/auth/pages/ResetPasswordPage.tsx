import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { validateResetPasswordForm } from '../utils/validation';
import type { ResetPasswordFormData, ValidationErrors } from '../types';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string>('');
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      return;
    }

    // Simulate token validation
    const validateToken = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        // TODO: Replace with actual API call to validate token
        // const response = await validateResetToken(token);
        setIsValidToken(true);
      } catch {
        setIsValidToken(false);
      }
    };

    void validateToken();
  }, [token]);

  const handleChange =
    (field: keyof ResetPasswordFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));

      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
      setServerError('');
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    const validationErrors = validateResetPasswordForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    void (async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        // TODO: Replace with actual API call
        // await resetPasswordApi({ token, password: formData.password });
        setIsSuccess(true);
      } catch {
        setServerError('Failed to reset password. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  // Loading state while validating token
  if (isValidToken === null) {
    return (
      <div className="w-full max-w-md">
        <div className="relative bg-white rounded-2xl shadow-ait-xl p-8 border border-ait-neutral-100">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 border-4 border-ait-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-ait-body-md-regular text-ait-neutral-600">Validating link...</p>
          </div>
        </div>
      </div>
    );
  }

  // Invalid or expired token
  if (!isValidToken) {
    return (
      <div className="w-full max-w-md">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-ait-danger-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-ait-danger-200 rounded-full opacity-20 blur-3xl" />
        </div>

        <div className="relative bg-white rounded-2xl shadow-ait-xl p-8 border border-ait-neutral-100">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-ait-danger-500 to-ait-danger-700 rounded-full flex items-center justify-center shadow-lg">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-ait-h2-bold text-ait-neutral-900 mb-3">Invalid or Expired Link</h1>
            <p className="text-ait-body-md-regular text-ait-neutral-600">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
          </div>

          <div className="space-y-3">
            <Link to="/forgot-password" className="block">
              <Button className="w-full h-11 bg-ait-primary-500 hover:bg-ait-primary-600 text-white">
                Request New Link
              </Button>
            </Link>
            <Link to="/login" className="block">
              <Button
                variant="secondary"
                className="w-full h-11 border-ait-neutral-200 hover:bg-ait-neutral-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="w-full max-w-md">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-ait-success-200 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-ait-success-200 rounded-full opacity-20 blur-3xl" />
        </div>

        <div className="relative bg-white rounded-2xl shadow-ait-xl p-8 border border-ait-neutral-100">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-ait-success-500 to-ait-success-700 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-ait-h2-bold text-ait-neutral-900 mb-3">Password Reset Complete</h1>
            <p className="text-ait-body-md-regular text-ait-neutral-600">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
          </div>

          <Button
            onClick={() => {
              void navigate('/login');
            }}
            className="w-full h-11 bg-ait-primary-500 hover:bg-ait-primary-600 text-white"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="w-full max-w-md">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-ait-primary-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-ait-primary-200 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative bg-white rounded-2xl shadow-ait-xl p-8 border border-ait-neutral-100">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16">
            <img src="/assets/logo.webp" alt="Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-ait-h2-bold text-ait-neutral-900 mb-2">Reset Your Password</h1>
          <p className="text-ait-body-md-regular text-ait-neutral-600">
            Enter your new password below.
          </p>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="mb-6 p-4 bg-ait-danger-50 border border-ait-danger-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-ait-danger-600 flex-shrink-0 mt-0.5" />
            <p className="text-ait-body-md-regular text-ait-danger-700">{serverError}</p>
          </div>
        )}

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-ait-body-md-semibold text-ait-neutral-900"
            >
              New Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ait-neutral-400">
                <Lock className="w-5 h-5" />
              </div>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange('password')}
                placeholder="Enter new password"
                error={!!errors.password}
                disabled={isSubmitting}
                className="pl-10"
              />
            </div>
            {errors.password && (
              <p className="text-ait-caption-md-regular text-ait-danger-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block text-ait-body-md-semibold text-ait-neutral-900"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ait-neutral-400">
                <Lock className="w-5 h-5" />
              </div>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                placeholder="Confirm new password"
                error={!!errors.confirmPassword}
                disabled={isSubmitting}
                className="pl-10"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-ait-caption-md-regular text-ait-danger-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Password Requirements */}
          <p className="text-ait-body-sm-regular text-ait-neutral-500 bg-ait-neutral-50 p-3 rounded-lg">
            Password must be at least 8 characters long.
          </p>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-ait-body-md-semibold shadow-lg hover:shadow-xl transition-all bg-ait-primary-500 hover:bg-ait-primary-600 text-white"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Resetting...
              </span>
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-ait-body-sm-semibold text-ait-primary-500 hover:text-ait-primary-600 transition-colors hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
