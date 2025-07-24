import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,       // Icon for Teachers Stats
  UserCheck,   // Icon for Student Stats
  Activity,    // Icon for School Stats card
  TrendingUp,  // Icon for Total Records
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { TEMP_BASE_URL } from '../config/apiConfig';

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
    total_teachers: 0,
    total_students: 0,
    total_schools: 0,
    total_records: 0,
  });
  // --- FIX: Added setError state ---
  const [error, setError] = useState<string | null>(null);
  // --- END FIX ---

  // --- IMPORTANT: TOGGLE THIS FOR DEBUGGING DATA ISSUES ---
  const USE_MOCK_DATA = false; // Set to true to use mock data for debugging
  const mockStatsData = {
    total_teachers: 150,
    total_students: 300,
    total_schools: 25,
    total_records: 475, // Sum of above
  };
  // --- END MOCK DATA CONFIG ---


  useEffect(() => {
    if (USE_MOCK_DATA) {
      setStatsData(mockStatsData);
      console.log("Dashboard - Using Mock Data:", mockStatsData);
      setError(null); // Clear any previous errors when using mock data
    } else {
      fetch(`${TEMP_BASE_URL}/web_dashboard`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data.status) {
            const teachers = data.total_teachers || 0;
            const students = data.total_students || 0;
            const schools = data.total_schools || 0;
            const total = teachers + students + schools;

            setStatsData({
              total_teachers: teachers,
              total_students: students,
              total_schools: schools,
              total_records: total,
            });
            setError(null); // Clear error on successful fetch
            console.log("Dashboard - API Data Fetched Successfully:", data);
          } else {
            console.error("Dashboard - API returned an error status:", data.message);
            setError("API Error: " + data.message);
            setStatsData({ total_teachers: 0, total_students: 0, total_schools: 0, total_records: 0 });
          }
        })
        .catch((error) => {
          console.error("Dashboard - Failed to fetch dashboard data:", error);
          setError("Failed to load dashboard data. Please check your network.");
          setStatsData({ total_teachers: 0, total_students: 0, total_schools: 0, total_records: 0 });
        });
    }
  }, [USE_MOCK_DATA, mockStatsData]);

  const stats = [
    {
      name: t('teachersStats'),
      value: statsData.total_teachers.toString(),
      icon: Users,
      gradient: 'gradient-card-blue',
      link: '/aww-awh-data',
    },
    {
      name: t('studentStats'),
      value: statsData.total_students.toString(),
      icon: UserCheck,
      gradient: 'gradient-card-green',
      link: '/support-workers',
    },
    {
      name: t('schoolStats'),
      value: statsData.total_schools.toString(),
      icon: Activity,
      gradient: 'gradient-card-purple',
      link: '/school-stats',
    },
    {
      name: 'कुल रिकॉर्ड', // Total Records
      value: statsData.total_records.toString(),
      icon: TrendingUp,
      gradient: 'gradient-card-orange',
      link: '/aww-awh-data',
    },
  ];

  // --- REVERTED: Original chartData structure for single Bar with Cells ---
  const chartData = [
    {
      name: t('teachersStats'),
      count: statsData.total_teachers,
      color: '#3b82f6' // Blue
    },
    {
      name: t('studentStats'),
      count: statsData.total_students,
      color: '#22c55e' // Green
    },
    {
      name: t('schoolStats'),
      count: statsData.total_schools,
      color: '#a855f7' // Purple
    },
  ];
  // --- END REVERTED CHART DATA ---

  console.log("Dashboard - Chart Data for Bars (rendered):", chartData);

  return (
    <div className="p-6 sm:p-8 lg:p-10 space-y-10 bg-transparent">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('dashboard')}
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

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
    </div>
  );
};

export default Dashboard;