import React, { useEffect, useState } from 'react';
import { TEMP_BASE_URL } from '../config/apiConfig';
import { useLanguage } from '../contexts/LanguageContext';
import {
  GraduationCap,
  TreeDeciduous,
  Image,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  // Icons for card fields
  School,      // For school_name
  Phone,       // For mobile
  User,        // For student name (or class)
  BookOpen,    // For class
  IdCard,      // For udise_code
  CalendarDays // For date_time
} from 'lucide-react';

interface Student {
  certificate: string;
  class: string;
  date_time: string;
  mobile: string;
  name: string;
  name_of_tree: string;
  plant_image: string;
  school_name: string;
  udise_code: string;
  verified: string;
}

const SupportWorkers: React.FC = () => {
  const { t } = useLanguage();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentProofs, setSelectedStudentProofs] = useState<Student | null>(null);
  const [imageLoading, setImageLoading] = useState(false); // This state isn't currently used but kept for completeness

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${TEMP_BASE_URL}/fetch_student`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        if (data.status && Array.isArray(data.data)) {
          setStudents(data.data);
        } else {
          throw new Error("Invalid API response");
        }
      } catch (err) {
        console.error(err);
        setError(t('failedToFetchStudents'));
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [t]);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.udise_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.name_of_tree.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-green-600 text-left">
        {t('studentStatsTitle')}
      </h2>

      <div className="flex justify-center mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('searchStudentsPlaceholder')}
          className="w-full max-w-lg px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-600">{t('loading')}</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center text-gray-500">
          <GraduationCap className="w-10 h-10 mx-auto mb-3" />
          {t('noStudentsFound')}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStudents.map((student, index) => (
            <div key={index} className="bg-white shadow rounded-xl p-6 flex flex-col">
              <h3 className="text-lg font-semibold text-green-700 mb-4">{student.name}</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <div>
                  <BookOpen size={16} className="inline mr-2 text-green-600" />
                  <strong>{t('class')}:</strong> {student.class}
                </div>
                <div>
                  <School size={16} className="inline mr-2 text-green-600" />
                  <strong>{t('school')}:</strong> {student.school_name}
                </div>
                <div>
                  <Phone size={16} className="inline mr-2 text-green-600" />
                  <strong>{t('mobile')}:</strong> {student.mobile}
                </div>
                <div>
                  <IdCard size={16} className="inline mr-2 text-green-600" />
                  <strong>{t('udise')}:</strong> {student.udise_code}
                </div>
                <div>
                  <TreeDeciduous size={16} className="inline mr-2 text-green-600" />
                  <strong>{t('tree')}:</strong> {student.name_of_tree}
                </div>
                <div>
                  <CalendarDays size={16} className="inline mr-2 text-green-600" />
                  <strong>{t('date')}:</strong> {new Date(student.date_time).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <strong>{t('verified')}:</strong>
                  {student.verified === 'true' ? (
                    <span className="text-green-600 flex items-center gap-1"><CheckCircle size={16} /> {t('yes')}</span>
                  ) : (
                    <span className="text-red-500 flex items-center gap-1"><XCircle size={16} /> {t('no')}</span>
                  )}
                </div>
              </div>

              {(student.plant_image || student.certificate) ? (
                <button
                  onClick={() => setSelectedStudentProofs(student)}
                  className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm flex items-center justify-center gap-2"
                >
                  <Eye size={16} /> {t('viewPlantationProofs')}
                </button>
              ) : (
                <p className="mt-3 text-xs text-gray-500 text-center">{t('noProofsAvailable')}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Proof Modal */}
      {selectedStudentProofs && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center px-4"
          onClick={() => setSelectedStudentProofs(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
          >
            <button
              onClick={() => setSelectedStudentProofs(null)}
              className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-xl font-bold"
            >
              &times;
            </button>

            <h3 className="text-xl font-semibold mb-6 text-gray-800 text-center">
              {t('proofsFor')} <span className="text-green-600">{selectedStudentProofs.name}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {selectedStudentProofs.plant_image && (
                <div className="text-center">
                  <p className="font-medium mb-2">{t('plantImage')}</p>
                  <a
                    href={`${TEMP_BASE_URL}/${selectedStudentProofs.plant_image}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`${TEMP_BASE_URL}/${selectedStudentProofs.plant_image}`}
                      alt={t('plantImage')}
                      className="rounded-lg border shadow object-contain w-full h-60"
                    />
                  </a>
                </div>
              )}

              {selectedStudentProofs.certificate && (
                <div className="text-center">
                  <p className="font-medium mb-2">{t('certificate')}</p>
                  <a
                    href={`${TEMP_BASE_URL}/${selectedStudentProofs.certificate}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`${TEMP_BASE_URL}/${selectedStudentProofs.certificate}`}
                      alt={t('certificate')}
                      className="rounded-lg border shadow object-contain w-full h-60"
                    />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportWorkers;