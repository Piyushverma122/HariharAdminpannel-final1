import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Activity,
  TrendingUp,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import DataViewer from '../components/DataViewer';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();

  // Modern stats cards with gradients
  const stats = [
    {
      name: t('awwWorkers'),
      value: '125',
      percentage: '+12%',
      trend: 'up',
      icon: Users,
      gradient: 'gradient-card-blue',
      bgIcon: 'bg-blue-600',
      link: '/aww-awh-data'
    },
    {
      name: t('awhWorkers'),
      value: '98',
      percentage: '+8%',
      trend: 'up',
      icon: UserCheck,
      gradient: 'gradient-card-green',
      bgIcon: 'bg-green-600',
      link: '/aww-awh-data'
    },
    {
      name: t('supportWorkers'),
      value: '67',
      percentage: '+15%',
      trend: 'up',
      icon: Activity,
      gradient: 'gradient-card-purple',
      bgIcon: 'bg-purple-600',
      link: '/support-workers'
    },
    {
      name: t('totalRecords'),
      value: '290',
      percentage: '-2%',
      trend: 'down',
      icon: TrendingUp,
      gradient: 'gradient-card-orange',
      bgIcon: 'bg-orange-500',
      link: '/aww-awh-data'
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: 'New AWW worker registered',
      description: 'सुनीता देवी has been added to AWW list',
      time: '2 min ago',
      type: 'user',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      id: 2,
      title: 'Support worker info updated',
      description: 'Updated contact information for मीरा शर्मा',
      time: '1 hour ago',
      type: 'update',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      id: 3,
      title: 'Data export completed',
      description: 'Monthly report exported successfully',
      time: '3 hours ago',
      type: 'export',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      id: 4,
      title: 'System backup completed',
      description: 'All data backed up successfully',
      time: '6 hours ago',
      type: 'system',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600'
    },
  ];

  return (
    // ✅ FIX: Ensure the outermost div of Dashboard is transparent.
    // This allows the background gradient from Layout to show through.
    <div className="space-y-8 bg-transparent">
      {/* Header with greeting */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('dashboard')}</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn-secondary flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Today</span>
          </button>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUp : ArrowDown;
          return (
            <Link
              key={stat.name}
              to={stat.link}
              className={`modern-card ${stat.gradient} p-6 animate-fadeInUp cursor-pointer hover:scale-105 transition-transform duration-200 block`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-white text-opacity-90 text-sm font-medium">{stat.name}</p>
                  <div className="opacity-50">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="stat-number text-white">{stat.value}</p>
                  <div className="flex items-center space-x-1">
                    <TrendIcon className={`w-4 h-4 ${stat.trend === 'up' ? 'text-green-300' : 'text-red-300'}`} />
                    <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-300' : 'text-red-300'}`}>
                      {stat.percentage}
                    </span>
                    <span className="text-white text-opacity-60 text-sm">vs last month</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Extra spacing before Recent Activities */}
      <div className="mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          {/* Assuming modern-card has a background, it will still show. */}
          {/* If you want this to be transparent, you'd need to adjust modern-card's CSS */}
          <div className="modern-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{t('recentActivity')}</h2>
              <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors animate-fadeInUp"
                  style={{ animationDelay: `${(index + 4) * 100}ms` }}
                >
                  <div className={`w-10 h-10 ${activity.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <div className={`w-2 h-2 ${activity.textColor.replace('text-', 'bg-')} rounded-full`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{activity.title}</p>
                    <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                    <p className="text-gray-400 text-xs mt-2">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Data Structure Overview */}
      {/* ✅ IMPORTANT: If DataViewer has its own background, it will still cover the gradient. */}
      {/* You would need to modify DataViewer.tsx to ensure its root element is transparent. */}
      <DataViewer />
      </div>
    </div>
  );
};

export default Dashboard;
