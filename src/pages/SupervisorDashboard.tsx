import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Activity,
  TrendingUp,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { TEMP_BASE_URL } from '../config/apiConfig';
import { useAuth } from '../contexts/AuthContext';

const SupervisorDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [statsData, setStatsData] = useState({
    assigned_teachers: 0,
    assigned_students: 0,
    assigned_schools: 0,
    total_records: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch supervisor-specific data
    fetch(`${TEMP_BASE_URL}/supervisor/dashboard`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.status) {
          const teachers = data.assigned_teachers || 0;
          const students = data.assigned_students || 0;
          const schools = data.assigned_schools || 0;
          
          setStatsData({
            assigned_teachers: teachers,
            assigned_students: students,
            assigned_schools: schools,
            total_records: teachers + students + schools,
          });
          setError(null);
        } else {
          console.error("API returned an error status:", data.message);
          setError(data.message || "Failed to load supervisor data");
        }
      })
      .catch((error) => {
        console.error("Failed to fetch supervisor data:", error);
        setError("Network error. Please try again later.");
      });
  }, []);

  const supervisorStats = [
    {
      name: "Assigned Teachers",
      value: statsData.assigned_teachers.toString(),
      icon: Users,
      gradient: 'gradient-card-blue',
      link: '/supervisor/teachers',
    },
    {
      name: "Assigned Students",
      value: statsData.assigned_students.toString(),
      icon: UserCheck,
      gradient: 'gradient-card-green',
      link: '/supervisor/students',
    },
    {
      name: "Assigned Schools",
      value: statsData.assigned_schools.toString(),
      icon: Activity,
      gradient: 'gradient-card-purple',
      link: '/supervisor/schools',
    },
    {
      name: "Total Records",
      value: statsData.total_records.toString(),
      icon: TrendingUp,
      gradient: 'gradient-card-orange',
      link: '/supervisor/overview',
    },
  ];

  return (
    <div className="p-6 sm:p-8 lg:p-10 space-y-10 bg-transparent">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Supervisor Dashboard
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* Supervisor Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {supervisorStats.map((stat, index) => {
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

      {/* Additional supervisor-specific content can be added here */}
    </div>
  );
};

export default SupervisorDashboard;
