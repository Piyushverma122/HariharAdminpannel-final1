import React, { useEffect, useState } from 'react';
import { TEMP_BASE_URL } from '../config/apiConfig';
import { useLanguage } from '../contexts/LanguageContext';
import {
  School,
  MapPin,
  IdCard,
  KeyRound,
  Hash,
  Eye,
  X,
  Search,
  GraduationCap
} from 'lucide-react';

interface School {
  address: string;
  employee_id: string | null;
  password: string;
  school_id: string;
  school_name: string;
  sno: number;
  udise_code: string;
}

const SchoolStats: React.FC = () => {
  const { t } = useLanguage();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch(`${TEMP_BASE_URL}/fetch_school`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (data.status && Array.isArray(data.data)) {
          const fetchedSchools: School[] = data.data.map((school: any) => ({
            address: school.address || '',
            employee_id: school.employee_id || null,
            password: school.password || '',
            school_id: school.school_id || '',
            school_name: school.school_name || '',
            sno: school.sno || 0,
            udise_code: school.udise_code || '',
          }));
          setSchools(fetchedSchools);
          setError(null);
        } else {
          throw new Error('Invalid API response structure or status false.');
        }
      } catch (err) {
        console.error("Failed to fetch school data:", err);
        setError(t('failedToFetchSchools'));
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, [t]);

  const filteredSchools = schools.filter((school) =>
    school.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.udise_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.school_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Main Heading */}
      <h2
        className="text-3xl font-bold text-left text-green-700" // Changed to text-green-700 for a standard green
        // Removed: style={{ color: '#86EFAC' }}
      >
        {t('schoolStatsTitle')}
      </h2>

      {/* Search Bar */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('searchSchoolsPlaceholder')}
          className="w-full max-w-lg px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
        />
      </div>

      {/* Loading, Error, No Records Found States */}
      {loading ? (
        <p className="text-center text-gray-600">{t('loading')}</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredSchools.length === 0 ? (
        <div className="text-center text-gray-500">
          <GraduationCap className="w-10 h-10 mx-auto mb-3" />
          {t('noSchoolsFound')}
        </div>
      ) : (
        /* Schools Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSchools.map((school, index) => (
            <div
              key={index}
              className="bg-white shadow rounded-xl p-6 flex flex-col justify-between"
            >
              <h3 className="text-lg font-semibold text-green-700 mb-4">{school.school_id}</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <div>
                  <School className="inline mr-2 text-green-600" size={16} />
                  <strong>{t('schoolName')}:</strong> {school.school_name}
                </div>
                <div>
                  <MapPin className="inline mr-2 text-green-600" size={16} />
                  <strong>{t('address')}:</strong> {school.address}
                </div>
                <div>
                  <IdCard className="inline mr-2 text-green-600" size={16} />
                  <strong>{t('udise')}:</strong> {school.udise_code}
                </div>
              </div>
              <button
                onClick={() => setSelectedSchool(school)}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm flex items-center justify-center gap-2"
              >
                <Eye size={16} /> {t('viewFullDetails')}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Popup Modal for School Details */}
      {selectedSchool && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center px-4"
          onClick={() => setSelectedSchool(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
          >
            <button
              onClick={() => setSelectedSchool(null)}
              className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-xl font-bold"
            >
              &times;
            </button>

            <h3 className="text-xl font-semibold mb-6 text-gray-800 text-center">
              {t('detailsFor')} <span className="text-green-600">{selectedSchool.school_name}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-sm">
              <div>
                <School className="inline mr-2 text-green-600" /> <strong>{t('schoolName')}:</strong> {selectedSchool.school_name}
              </div>
              <div>
                <School className="inline mr-2 text-green-600" /> <strong>{t('schoolId')}:</strong> {selectedSchool.school_id}
              </div>
              <div>
                <MapPin className="inline mr-2 text-green-600" /> <strong>{t('address')}:</strong> {selectedSchool.address}
              </div>
              <div>
                <IdCard className="inline mr-2 text-green-600" /> <strong>{t('udise')}:</strong> {selectedSchool.udise_code}
              </div>
              <div>
                <Hash className="inline mr-2 text-green-600" /> <strong>{t('sno')}:</strong> {selectedSchool.sno}
              </div>
              {selectedSchool.employee_id && (
                <div>
                  <IdCard className="inline mr-2 text-green-600" /> <strong>{t('employeeId')}:</strong> {selectedSchool.employee_id}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolStats;