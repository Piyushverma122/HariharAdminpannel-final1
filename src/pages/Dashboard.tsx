import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  School,
  Building2,
  MapPin,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ApiService, ApiError } from '../services/apiService';

// Import Recharts components
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend, // <--- RE-ADDED: Legend is back
  Cell // <--- RE-ADDED: For coloring individual bars
} from 'recharts';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();

  const [statsData, setStatsData] = useState({
    totalStudents: 0,
    totalSchools: 0,
    totalBlocks: 0,
    totalClusters: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const stats = await ApiService.getDashboardStats();
        setStatsData(stats);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load dashboard data. Please check your network.');
        }
        
        // Set default values on error
        setStatsData({
          totalStudents: 0,
          totalSchools: 0,
          totalBlocks: 0,
          totalClusters: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const stats = [
    {
      name: 'Total Students',
      value: statsData.totalStudents.toString(),
      icon: Users,
      gradient: 'gradient-card-blue',
      link: '/student-details',
    },
    {
      name: 'Total Schools',
      value: statsData.totalSchools.toString(),
      icon: School,
      gradient: 'gradient-card-purple',
      link: '/school-stats',
    },
    {
      name: 'Total Blocks',
      value: statsData.totalBlocks.toString(),
      icon: Building2,
      gradient: 'gradient-card-green',
      link: '/school-stats',
    },
    {
      name: 'Total Clusters',
      value: statsData.totalClusters.toString(),
      icon: MapPin,
      gradient: 'gradient-card-orange',
      link: '/school-stats',
    },
  ];

  const chartData = [
    {
      name: 'Students',
      count: statsData.totalStudents,
      color: '#3b82f6' // Blue
    },
    {
      name: 'Schools',
      count: statsData.totalSchools,
      color: '#a855f7' // Purple
    },
    {
      name: 'Blocks',
      count: statsData.totalBlocks,
      color: '#22c55e' // Green
    },
    {
      name: 'Clusters',
      count: statsData.totalClusters,
      color: '#f59e0b' // Orange
    },
  ];

  console.log("Dashboard - Chart Data for Bars (rendered):", chartData);

  return (
    <div className="p-6 sm:p-8 lg:p-10 space-y-10 bg-transparent">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('dashboard')}
        </h1>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              to={stat.link}
              className={`modern-card ${stat.gradient} p-6 animate-fadeInUp cursor-pointer hover:scale-105 transition-transform duration-200 block`}
              style={{ animationDelay: `${100 * index}ms` }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-white text-opacity-90 text-base font-semibold">
                    {stat.name}
                  </p>
                  <div className="opacity-50">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="stat-number text-white text-3xl font-extrabold">{stat.value}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Graph Section */}
      <div
        className="bg-white shadow-md rounded-lg p-6 animate-fadeInUp" // Reverted to shadow-md
        style={{ marginTop: '3rem', height: '350px' }}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('overview')}</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData} // <--- REVERTED: Uses chartData
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" tick={{ fill: '#4a5568' }} /> {/* <--- REVERTED: XAxis shows names */}
            <YAxis tick={{ fill: '#4a5568' }} />
            <Tooltip
              // <--- REVERTED: Simpler tooltip styling
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                color: '#2d3748',
              }}
              labelStyle={{ color: '#1a202c', fontWeight: 'bold' }}
              itemStyle={{ color: '#2d3748' }}
              formatter={(value: number) => [value, 'Count']} // <--- REVERTED: Formatter shows "Count"
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} /> {/* <--- RE-ADDED: Legend is back */}

            {/* <--- REVERTED: Single Bar with Cells for coloring --> */}
            <Bar dataKey="count" name={t('totalCount')} radius={[5, 5, 0, 0]}>
              {
                chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))
              }
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;