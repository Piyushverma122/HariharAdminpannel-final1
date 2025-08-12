import React, { useState } from 'react';
import { ApiService, ApiError, Student as StudentType } from '../services/apiService';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Search,
  User,
  GraduationCap,
  School,
  Calendar,
  Eye,
  X,
  Image as ImageIcon,
  Award,
  TreePine,
  IdCard,
  XCircle,
  Users,
  Filter,
  ChevronDown
} from 'lucide-react';

interface Student {
  name: string;
  employee_id: string;
  school_name: string;
  class: string;
  name_of_tree: string;
  plant_image: string;
  certificate: string;
  date_time: string;
  udise_code: string;
  status: string;
}

const StudentDetails: React.FC = () => {
  const { t } = useLanguage();
  const [udiseCode, setUdiseCode] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [imageModal, setImageModal] = useState<{ isOpen: boolean; imageUrl: string; title: string }>({
    isOpen: false,
    imageUrl: '',
    title: ''
  });

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    udiseCode: '',
    class: ''
  });

  // Filter logic
  const filteredStudents = students.filter(student => {
    const matchesUdiseCode = filters.udiseCode === '' || 
      student.udise_code.toLowerCase().includes(filters.udiseCode.toLowerCase());
    const matchesClass = filters.class === '' || student.class === filters.class;
    
    return matchesUdiseCode && matchesClass;
  });

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      udiseCode: '',
      class: ''
    });
  };



  const handleSearch = async () => {
    if (!udiseCode.trim()) {
      setError(t('pleaseEnterUdiseCode'));
      return;
    }

    if (!ApiService.validateUdiseCode(udiseCode.trim())) {
      setError(t('pleaseEnterValidUdiseCode'));
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const fetchedStudents = await ApiService.getStudentsByUdiseCode(udiseCode.trim());
      setStudents(fetchedStudents as Student[]);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch student data:', err);
      setStudents([]);
      
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(t('failedToFetchStudentData'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const openImageModal = (imageUrl: string, title: string) => {
    setImageModal({
      isOpen: true,
      imageUrl: ApiService.getImageUrl(imageUrl),
      title
    });
  };

  const closeImageModal = () => {
    setImageModal({
      isOpen: false,
      imageUrl: '',
      title: ''
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return t('notAvailable') || 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Main Heading */}
      <h2 className="text-3xl font-bold text-left text-green-700">
        {t('studentDetailsTitle')}
      </h2>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              value={udiseCode}
              onChange={(e) => setUdiseCode(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('enterUdiseCodePlaceholder')}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search className="w-5 h-5" />
            {loading ? t('searching') : t('searchStudents')}
          </button>
        </div>
      </div>

      {/* Filters Section */}
      {searched && students.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <h3 className="text-lg font-semibold text-gray-800">{t('filterResults')}</h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Filter className="w-4 h-4" />
              {t('filters')}
              <ChevronDown className={`w-3 h-3 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filter Controls */}
          {showFilters && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-semibold text-gray-800">{t('filterOptions')}</h4>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-red-600 hover:text-red-800 underline"
                >
                  {t('clearAllFilters')}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* UDISE Code Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('udiseCodeFilter')}</label>
                  <input
                    type="text"
                    value={filters.udiseCode}
                    onChange={(e) => handleFilterChange('udiseCode', e.target.value)}
                    placeholder={t('filterByUdiseCodePlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Class Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('classFilter')}</label>
                  <select
                    value={filters.class}
                    onChange={(e) => handleFilterChange('class', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{t('allClasses')}</option>
                    <option value="1">{t('class1')}</option>
                    <option value="2">{t('class2')}</option>
                    <option value="3">{t('class3')}</option>
                    <option value="4">{t('class4')}</option>
                    <option value="5">{t('class5')}</option>
                    <option value="6">{t('class6')}</option>
                    <option value="7">{t('class7')}</option>
                    <option value="8">{t('class8')}</option>
                    <option value="9">{t('class9')}</option>
                    <option value="10">{t('class10')}</option>
                    <option value="11">{t('class11')}</option>
                    <option value="12">{t('class12')}</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {(filters.udiseCode || filters.class) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">{t('activeFilters')}</p>
                  <div className="flex flex-wrap gap-2">
                    {filters.udiseCode && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {t('udise')}: {filters.udiseCode}
                        <button onClick={() => handleFilterChange('udiseCode', '')} className="ml-2 text-blue-600 hover:text-blue-800">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {filters.class && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {t('class')}: {filters.class}
                        <button onClick={() => handleFilterChange('class', '')} className="ml-2 text-blue-600 hover:text-blue-800">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Results Section */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">{t('searchingForStudents')}</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <XCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      ) : searched && students.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">{t('noStudentsFoundForUdise')} {udiseCode}</p>
        </div>
      ) : searched && students.length > 0 && filteredStudents.length === 0 ? (
        <div className="text-center py-12">
          <Filter className="w-16 h-16 mx-auto text-orange-400 mb-4" />
          <p className="text-orange-500 text-lg">{t('noStudentsMatchFilters')}</p>
          <button
            onClick={clearAllFilters}
            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            {t('clearFilters')}
          </button>
        </div>
      ) : searched && filteredStudents.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800">
              {t('foundStudents')} {filteredStudents.length} {filteredStudents.length !== 1 ? t('students') : t('student')} 
              {filteredStudents.length !== students.length && ` (${t('filteredFrom')} ${students.length} ${t('total')})`} {t('forUdise')} {udiseCode}
            </h3>
          </div>
          
          {/* Students Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-green-700">{student.name}</h4>
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center">
                    <School className="w-4 h-4 mr-2 text-green-600" />
                    <span><strong>{t('schoolNameLabel')}:</strong> {student.school_name}</span>
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="w-4 h-4 mr-2 text-green-600" />
                    <span><strong>{t('classNameLabel')}:</strong> {student.class}</span>
                  </div>
                  <div className="flex items-center">
                    <TreePine className="w-4 h-4 mr-2 text-green-600" />
                    <span><strong>{t('treeNameLabel')}:</strong> {student.name_of_tree}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-green-600" />
                    <span><strong>{t('statusLabel')}:</strong> {student.status || 'No Status'}</span>
                  </div>
                </div>

                {/* Image Buttons */}
                <div className="mt-4 flex gap-2">
                  {student.plant_image && (
                    <button
                      onClick={() => openImageModal(student.plant_image, `${student.name} - ${t('plantImageLabel')}`)}
                      className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs"
                    >
                      <ImageIcon className="w-4 h-4" />
                      {t('plantImageLabel')}
                    </button>
                  )}
                  {student.certificate && (
                    <button
                      onClick={() => openImageModal(student.certificate, `${student.name} - Monitering Photo`)}
                      className="flex items-center gap-1 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-xs"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Monitering Photo
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setSelectedStudent(student)}
                  className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  {t('viewFullDetailsButton')}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Student Details Modal */}
      {selectedStudent && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center px-4"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-96 h-96 relative overflow-hidden"
          >
            {/* Header with close button */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 truncate pr-8">
                {t('studentDetailsModal')}
              </h3>
              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable content area */}
            <div className="overflow-y-auto h-80 pr-2 custom-scrollbar">
              <div className="space-y-3">
                <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                  <div className="flex items-center text-green-800">
                    <User className="w-4 h-4 mr-2 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-green-600 block">{t('studentNameLabel')}</span>
                      <span className="text-sm font-semibold break-words">{selectedStudent.name}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                  <div className="flex items-center text-blue-800">
                    <School className="w-4 h-4 mr-2 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-blue-600 block">{t('schoolNameLabel')}</span>
                      <span className="text-sm font-semibold break-words">{selectedStudent.school_name}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg border-l-4 border-purple-400">
                  <div className="flex items-center text-purple-800">
                    <GraduationCap className="w-4 h-4 mr-2 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-purple-600 block">{t('classNameLabel')}</span>
                      <span className="text-sm font-semibold break-words">{selectedStudent.class}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-3 rounded-lg border-l-4 border-orange-400">
                  <div className="flex items-center text-orange-800">
                    <TreePine className="w-4 h-4 mr-2 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-orange-600 block">{t('treeNameLabel')}</span>
                      <span className="text-sm font-semibold break-words">{selectedStudent.name_of_tree}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-teal-50 p-3 rounded-lg border-l-4 border-teal-400">
                  <div className="flex items-center text-teal-800">
                    <Search className="w-4 h-4 mr-2 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-teal-600 block">{t('udiseCodeLabel')}</span>
                      <span className="text-sm font-semibold break-words">{selectedStudent.udise_code}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-pink-50 p-3 rounded-lg border-l-4 border-pink-400">
                  <div className="flex items-center text-pink-800">
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-pink-600 block">{t('registrationDateLabel')}</span>
                      <span className="text-sm font-semibold break-words">{formatDate(selectedStudent.date_time)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-50 p-3 rounded-lg border-l-4 border-indigo-400">
                  <div className="flex items-center text-indigo-800">
                    <User className="w-4 h-4 mr-2 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-indigo-600 block">{t('statusLabel')}</span>
                      <span className="text-sm font-semibold break-words">{selectedStudent.status || 'No Status'}</span>
                    </div>
                  </div>
                </div>

                {/* Document Buttons */}
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-400">
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-medium text-gray-600 block mb-2">{t('uploadedDocuments')}</span>
                    <div className="flex flex-col gap-2">
                      {selectedStudent.plant_image && (
                        <button
                          onClick={() => openImageModal(selectedStudent.plant_image, `${selectedStudent.name} - ${t('plantImageLabel')}`)}
                          className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs"
                        >
                          <ImageIcon className="w-3 h-3" />
                          {t('viewPlantImage')}
                        </button>
                      )}
                      {selectedStudent.certificate && (
                        <button
                          onClick={() => openImageModal(selectedStudent.certificate, `${selectedStudent.name} - Monitering Photo`)}
                          className="flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-xs"
                        >
                          <ImageIcon className="w-3 h-3" />
                          View Monitering Photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {imageModal.isOpen && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            animation: 'fadeIn 0.3s ease-out forwards'
          }}
          onClick={closeImageModal}
        >
          <div 
            className="relative bg-white rounded-3xl shadow-2xl max-w-md max-h-[85vh] w-96"
            style={{
              animation: 'scaleIn 0.3s ease-out forwards'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 rounded-t-3xl bg-gray-50">
              <h3 className="text-md font-semibold text-gray-800 truncate">{imageModal.title}</h3>
              <button
                onClick={closeImageModal}
                className="text-gray-500 hover:text-red-500 text-xl font-bold transition-colors duration-200 p-1 rounded-full hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Image Container */}
            <div className="p-4 flex items-center justify-center bg-gray-100 rounded-b-3xl">
              <div className="relative max-w-full max-h-[65vh] flex items-center justify-center">
                <img
                  src={imageModal.imageUrl}
                  alt={imageModal.title}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
                  style={{
                    maxHeight: '65vh',
                    maxWidth: '100%'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetails;
