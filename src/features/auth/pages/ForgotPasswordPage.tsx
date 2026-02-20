import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { validateForgotPasswordForm } from '../utils/validation';
import type { ForgotPasswordFormData, ValidationErrors } from '../types';

export default function ForgotPasswordPage() {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ email: e.target.value });

    // Clear errors when user starts typing
    if (errors.email) {
      setErrors({});
    }
    setServerError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    // Validate form
    const validationErrors = validateForgotPasswordForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    void (async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // TODO: Replace with actual API call
        // await forgotPasswordApi(formData.email);

        // Show success message
        setIsSuccess(true);
      } catch {
        setServerError('Failed to send reset link. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-ait-success-200 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-ait-success-200 rounded-full opacity-20 blur-3xl" />
        </div>

        <div className="relative bg-white rounded-2xl shadow-ait-xl p-8 border border-ait-neutral-100">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-ait-success-500 to-ait-success-700 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-8">
            <h1 className="text-ait-h2-bold text-ait-neutral-900 mb-3">Check Your Email</h1>
            <p className="text-ait-body-md-regular text-ait-neutral-600 mb-2">
              We've sent a password reset link to:
            </p>
            <p className="text-ait-body-md-semibold text-ait-primary-600 mb-4">{formData.email}</p>
            <p className="text-ait-body-sm-regular text-ait-neutral-500 bg-ait-neutral-50 p-4 rounded-lg">
              Please check your inbox and click on the link to reset your password. If you don't see
              the email, check your spam folder.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={() => setIsSuccess(false)}
              className="w-full h-11 bg-ait-primary-500 hover:bg-ait-primary-600 text-white"
            >
              Resend Email
            </Button>
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

  return (
    <div className="w-full max-w-md">
      {/* Decorative Background Elements */}
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

        {/* Back to Login */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-ait-body-sm-semibold text-ait-primary-500 hover:text-ait-primary-600 transition-colors mb-6 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-ait-h2-bold text-ait-neutral-900 mb-2">Forgot Password?</h1>
          <p className="text-ait-body-md-regular text-ait-neutral-600">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="mb-6 p-4 bg-ait-danger-50 border border-ait-danger-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-ait-danger-600 flex-shrink-0 mt-0.5" />
            <p className="text-ait-body-md-regular text-ait-danger-700">{serverError}</p>
          </div>
        )}

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-ait-body-md-semibold text-ait-neutral-900">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ait-neutral-400">
                <Mail className="w-5 h-5" />
              </div>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                error={!!errors.email}
                disabled={isSubmitting}
                autoFocus
                className="pl-10"
              />
            </div>
            {errors.email && (
              <p className="text-ait-caption-md-regular text-ait-danger-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
            <p className="text-ait-body-sm-regular text-ait-neutral-500 bg-ait-neutral-50 p-3 rounded-lg">
              We'll send a password reset link to this email address.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-ait-body-md-semibold shadow-lg hover:shadow-xl transition-all bg-ait-primary-500 hover:bg-ait-primary-600 text-white"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
