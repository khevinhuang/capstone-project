import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-ait-neutral-50 flex items-center justify-center p-4">
      <Outlet />
    </div>
  );
}
