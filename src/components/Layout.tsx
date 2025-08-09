import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  Menu,
  X,
  Bell,
  School,
  LogOut,
  Users
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useLanguage();
  const { role } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();

  // Define navigation items
  const navigation: NavItem[] = [
    {
      name: t('dashboard'),
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: t('schoolStats'),
      href: '/school-stats',
      icon: School,
    },
    {
      name: 'Student Details',
      href: '/student-details',
      icon: Users,
    },
    {
      name: t('settings'),
      href: '/settings',
      icon: Settings,
    }
  ];

  // NEW: handleLogout function
  const handleLogout = () => {
    // Clear any stored user data or session tokens from localStorage
    localStorage.clear(); // Clears all localStorage items
    // Reload the application to reset state (e.g., return to login)
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 sidebar transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        bg-green-800
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-center h-20 px-6">
          <div className="flex items-center justify-center w-full">
            <div className="text-center">
              <h1 className="text-lg font-semibold text-white">
                Harihar Admin Panel
              </h1>
            </div>
          </div>
          <button
            className="lg:hidden text-white hover:text-gray-200 absolute right-6"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-4 flex flex-col justify-between h-[calc(100vh-10rem)]"> {/* Added flex-col and height */}
          <div>
            {/* Navigation Header */}
            <div className="px-2 mb-4">
              <h3 className="text-white text-opacity-60 text-xs font-semibold uppercase tracking-wider">
                {t('navigation')}
              </h3>
            </div>

            <div className="space-y-2">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `sidebar-item flex items-center px-4 py-2 rounded-lg transition-colors duration-200
                      ${isActive
                        ? 'bg-white bg-opacity-20 text-green-900'
                        : 'text-white text-opacity-90 hover:bg-white hover:bg-opacity-10'
                      }`
                    }
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <IconComponent className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* NEW: Logout Button at the bottom of the sidebar */}
          <div className="mt-auto">
            <div className="pt-4 border-t border-green-700 mx-4">
              <button
                onClick={handleLogout}
                className="sidebar-item flex items-center px-4 py-2 rounded-lg transition-colors duration-200 w-full
                  text-red-300 hover:bg-red-700 hover:text-white"
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span className="font-medium">{t('logout')}</span>
              </button>
            </div>
            
            {/* Powered by SSIPMT Raipur */}
            <div className="pt-3 pb-4 px-4">
              <div className="text-center">
                <p className="text-white text-opacity-50 text-xs font-medium">
                  Powered by SSIPMT Raipur
                </p>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm border-b border-gray-100">
          <div className="flex items-center justify-between h-20 px-6">
            <div className="flex items-center">
              <button
                className="lg:hidden mr-4 text-gray-500 hover:text-gray-700"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Empty div to maintain spacing */}
            <div></div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;