import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { useUiStore } from '@/store/useUIStore';
import { Button } from '@/components/ui/Button';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children?: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { sidebarOpen, toggleSidebar } = useUiStore();

  return (
    <div className="flex h-screen bg-neutral-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {!sidebarOpen && (
              <Button variant="text" size="sm" onClick={toggleSidebar}>
                ☰
              </Button>
            )}
            <h1 className="text-xl font-semibold">Khatulistiwa AirCore</h1>
            <div />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}
