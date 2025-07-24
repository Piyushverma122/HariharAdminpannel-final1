import React, { useEffect, useState } from 'react';
import { TEMP_BASE_URL } from '../config/apiConfig';
import { useLanguage } from '../contexts/LanguageContext';
import {
  GraduationCap,
  Phone,
  User,
  School,
  BookOpenCheck,
  BadgeCheck,
  Eye,
  XCircle,
  CheckCircle,
  CalendarDays,
  IdCard,
  X,
  Users,
} from 'lucide-react';

interface Teacher {
  name: string;
  mobile: string;
  username: string;
  password: string;
  school_name: string;
  udise_code: string;
  date_time: string;
  student_count: number;
  employee_id: string;
}

const AwwAwhData: React.FC = () => {
  const { t } = useLanguage();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(`${TEMP_BASE_URL}/fetch_teacher`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        if (data.status && Array.isArray(data.data)) {
          const fetchedTeachers: Teacher[] = data.data.map((teacher: any) => ({
            name: teacher.name,
            mobile: teacher.mobile,
            username: teacher.username,
            password: teacher.password,
            school_name: teacher.school_name,
            udise_code: teacher.udise_code,
            date_time: teacher.date_time,
            student_count: teacher.student_count || 0,
            employee_id: teacher.employee_id || '',
          }));
          setTeachers(fetchedTeachers);
        } else {
          throw new Error('Invalid API response');
        }
      } catch (err) {
        console.error(err);
        setError(t('failedToFetchTeachers'));
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [t]);

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.mobile.includes(searchTerm) ||
    teacher.username.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-green-600 text-left">
        {t('teachersStats')}
      </h2>

      <div className="flex justify-center mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('searchTeachersPlaceholder')}
          className="w-full max-w-lg px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-600">{t('loading')}</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredTeachers.length === 0 ? (
        <div className="text-center text-gray-500">
          <GraduationCap className="w-10 h-10 mx-auto mb-3" />
          {t('noTeachersFound')}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTeachers.map((teacher, index) => (
            <div
              key={index}
              className="bg-white shadow rounded-xl p-6 flex flex-col justify-between"
            >
              <h3 className="text-lg font-semibold text-green-700 mb-4">{teacher.name}</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <div>
                    <School className="inline mr-2 text-green-600" />
                    <strong>{t('school')}:</strong> {teacher.school_name}
                </div>
                <div>
                    <Phone className="inline mr-2 text-green-600" />
                    <strong>{t('mobile')}:</strong> {teacher.mobile}
                </div>
                <div>
                    <User className="inline mr-2 text-green-600" />
                    <strong>{t('username')}:</strong> {teacher.username}
                </div>
                <div>
                    <BadgeCheck className="inline mr-2 text-green-600" />
                    <strong>{t('employeeId')}:</strong> {teacher.employee_id}
                </div>
                <div>
                    <IdCard className="inline mr-2 text-green-600" />
                    <strong>{t('udise')}:</strong> {teacher.udise_code}
                </div>
                <div>
                  <Users className="inline mr-2 text-green-600" />
                  <strong>{t('studentCount')}:</strong> {teacher.student_count}
                </div>
                <div>
                    <CalendarDays className="inline mr-2 text-green-600" />
                    <strong>{t('date')}:</strong> {new Date(teacher.date_time).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={() => setSelectedTeacher(teacher)}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm flex items-center justify-center gap-2"
              >
                <Eye size={16} /> {t('viewFullDetails')}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Popup Modal */}
      {selectedTeacher && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center px-4"
          onClick={() => setSelectedTeacher(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
          >
            <button
              onClick={() => setSelectedTeacher(null)}
              className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-xl font-bold"
            >
              &times;
            </button>

            <h3 className="text-xl font-semibold mb-6 text-gray-800 text-center">
              {t('detailsFor')} <span className="text-green-600">{selectedTeacher.name}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-sm">
              <div>
                <User className="inline mr-2 text-green-600" /> <strong>{t('name')}:</strong> {selectedTeacher.name}
              </div>
              <div>
                <Phone className="inline mr-2 text-green-600" /> <strong>{t('mobile')}:</strong> {selectedTeacher.mobile}
              </div>
              <div>
                <BadgeCheck className="inline mr-2 text-green-600" /> <strong>{t('employeeId')}:</strong> {selectedTeacher.employee_id}
              </div>
              <div>
                <BadgeCheck className="inline mr-2 text-green-600" /> <strong>{t('username')}:</strong> {selectedTeacher.username}
              </div>
              <div>
                <BookOpenCheck className="inline mr-2 text-green-600" /> <strong>{t('password')}:</strong> {selectedTeacher.password}
              </div>
              <div>
                <School className="inline mr-2 text-green-600" /> <strong>{t('school')}:</strong> {selectedTeacher.school_name}
              </div>
              <div>
                <IdCard className="inline mr-2 text-green-600" /> <strong>{t('udise')}:</strong> {selectedTeacher.udise_code}
              </div>
              <div>
                <Users className="inline mr-2 text-green-600" /> <strong>{t('studentCount')}:</strong> {selectedTeacher.student_count}
              </div>
              <div>
                <CalendarDays className="inline mr-2 text-green-600" /> <strong>{t('registrationDate')}:</strong> {new Date(selectedTeacher.date_time).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AwwAwhData;