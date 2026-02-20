import { AuthLayout } from '@/components/layout/AuthLayout';
import { MainLayout } from '@/components/layout/MainLayout';
import type { ElementType } from 'react';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const HomePage = lazy(() => import('@/features/home'));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/features/auth/pages/ResetPasswordPage'));
const ProductPage = lazy(() => import('@/features/product'));
const ProductDetailPage = lazy(() => import('@/features/product/pages/ProductDetail'));
const AddProductPage = lazy(() =>
  import('@/features/product/pages/AddProduct').then((module) => ({ default: module.AddProductPage }))
);
const UpdateProductPage = lazy(() => import('@/features/product/pages/UpdateProduct'));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
        <p className="text-neutral-600">Loading...</p>
      </div>
    </div>
  );
}

export function AppRoutes() {
  type AppRoute =
    | { index: true; Component: ElementType }
    | { path: string; Component: ElementType };

  const routes: AppRoute[] = [
    { index: true, Component: HomePage },
    { path: 'product', Component: ProductPage },
    { path: 'product/add', Component: AddProductPage },
    { path: 'product/update/:id', Component: UpdateProductPage },
    { path: 'product/:id', Component: ProductDetailPage }
  ];

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Auth Routes (without sidebar) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Main Routes (with sidebar) */}
        <Route path="/" element={<MainLayout />}>
          {routes.map((r) => {
            const Component = r.Component;

            return 'index' in r ? (
              <Route key="index" index element={<Component />} />
            ) : (
              <Route key={r.path} path={r.path} element={<Component />} />
            );
          })}
        </Route>
      </Routes>
    </Suspense>
  );
}
