import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { validateLoginForm } from '../utils/validation';
import type { LoginFormData, ValidationErrors } from '../types';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string>('');

  const handleChange = (field: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === 'rememberMe' ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
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

    // Validate form
    const validationErrors = validateLoginForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    void (async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // TODO: Replace with actual API call
        // const response = await loginApi(formData);

        // Simulate successful login
        console.log('Login successful:', formData);

        // Navigate to dashboard or home
        void navigate('/');
      } catch {
        setServerError('Invalid email or password. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  return (
    <div className="w-full max-w-md">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-ait-primary-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-ait-primary-200 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative bg-white rounded-2xl shadow-ait-xl p-8 border border-ait-neutral-100">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4">
            <img src="/assets/logo.webp" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-ait-h2-bold text-ait-neutral-900 mb-2">Welcome Back</h1>
          <p className="text-ait-body-md-regular text-ait-neutral-600">
            Sign in to your account to continue
          </p>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="mb-6 p-4 bg-ait-danger-50 border border-ait-danger-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-ait-danger-600 flex-shrink-0 mt-0.5" />
            <p className="text-ait-body-md-regular text-ait-danger-700">{serverError}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
                onChange={handleChange('email')}
                placeholder="you@example.com"
                error={!!errors.email}
                disabled={isSubmitting}
                className="pl-10"
              />
            </div>
            {errors.email && (
              <p className="text-ait-caption-md-regular text-ait-danger-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-ait-body-md-semibold text-ait-neutral-900"
            >
              Password
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
                placeholder="Enter your password"
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

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange('rememberMe')}
                disabled={isSubmitting}
                className="w-4 h-4 rounded border-ait-neutral-300 text-ait-primary-500 focus:ring-2 focus:ring-ait-primary-500 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-ait-body-sm-regular text-ait-neutral-700 group-hover:text-ait-neutral-900 transition-colors">
                Remember me
              </span>
            </label>
            <Link
              to="/forgot-password"
              className="text-ait-body-sm-semibold text-ait-primary-500 hover:text-ait-primary-600 transition-colors hover:underline"
            >
              Forgot password?
            </Link>
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
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-ait-neutral-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-ait-neutral-500 text-ait-body-sm-regular">
              New to our platform?
            </span>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <Link
            to="/signup"
            className="inline-flex items-center justify-center w-full h-11 px-6 py-2.5 text-ait-body-md-semibold text-ait-primary-600 bg-ait-primary-50 hover:bg-ait-primary-100 border border-ait-primary-200 rounded-lg transition-all hover:shadow-md"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
