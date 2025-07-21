import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  UserCheck, 
  Settings,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const navigation = [
    {
      name: t('dashboard'),
      href: '/dashboard', // ✅ FIX: Changed from '/' to '/dashboard'
      icon: LayoutDashboard,
    },
    {
      name: t('awwAwhData'),
      href: '/aww-awh-data',
      icon: Database,
    },
    {
      name: t('supportWorkerInfo'),
      href: '/support-workers',
      icon: UserCheck,
    },
    {
      name: t('settings'),
      href: '/settings',
      icon: Settings,
    },
  ];

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
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-20 px-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-bold text-lg">H</span>
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-white">{t('appTitle')}</h1>
            </div>
          </div>
          <button
            className="lg:hidden text-white hover:text-gray-200"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-4">
          {/* Navigation Header */}
          <div className="px-2 mb-4">
            <h3 className="text-white text-opacity-60 text-xs font-semibold uppercase tracking-wider">
              {t('navigation')}
            </h3>
          </div>
          
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `sidebar-item flex items-center text-white text-opacity-90 ${
                      isActive ? 'active' : ''
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              );
            })}
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
            
            <div className="flex items-center">
              {/* Notification Bell - Clean Style */}
              <div className="relative">
                <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                </button>
              </div>
            </div>
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
