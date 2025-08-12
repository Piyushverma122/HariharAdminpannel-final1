import React, { useEffect, useState, useMemo } from 'react';
import { ApiService, ApiError, School as SchoolType } from '../services/apiService';
import { useLanguage } from '../contexts/LanguageContext';
import {
  School as SchoolIcon,
  MapPin,
  IdCard,
  Hash,
  Eye,
  X,
  GraduationCap,
  Filter,
  ChevronDown,
  Users,
  Building2,
  Camera,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface School {
  sno: number;
  district_code: string;
  district_name: string;
  block_name: string;
  block_code: string;
  cluster_code: string;
  cluster_name: string;
  udise_code: string;
  school_name: string;
  password: string;
}

const SchoolStats: React.FC = () => {
  const { t } = useLanguage();
  const [schools, setSchools] = useState<School[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [reuploadStats, setReuploadStats] = useState({
    neverReuploaded: 0,
    pendingReupload: 0,
    reuploadDue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    districtCode: '',
    districtName: '',
    blockCode: '',
    blockName: '',
    clusterCode: '',
    clusterName: '',
    udiseCode: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch schools, students, and reupload statistics
        const [fetchedSchools, fetchedStudents] = await Promise.all([
          ApiService.getAllSchools(),
          ApiService.getAllStudents()
        ]);
        
        setSchools(fetchedSchools);
        setStudents(fetchedStudents);
        
        // Try to fetch reupload stats, with fallback if endpoint doesn't exist
        try {
          const fetchedReuploadStats = await ApiService.getReuploadStats();
          setReuploadStats(fetchedReuploadStats);
        } catch (reuploadError) {
          console.warn("Re-upload stats endpoint not available, using default values");
          setReuploadStats({
            neverReuploaded: 0,
            pendingReupload: 0,
            reuploadDue: 0,
          });
        }
        
        setError(null);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError(t('failedToFetchSchools'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  const filteredSchools = schools.filter((school) => {
    // Basic search functionality
    const matchesSearch = 
      school.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.district_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.udise_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.block_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.cluster_name.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter functionality
    const matchesFilters = 
      (filters.districtCode === '' || school.district_code.toLowerCase().includes(filters.districtCode.toLowerCase())) &&
      (filters.districtName === '' || school.district_name.toLowerCase().includes(filters.districtName.toLowerCase())) &&
      (filters.blockCode === '' || school.block_code.toLowerCase().includes(filters.blockCode.toLowerCase())) &&
      (filters.blockName === '' || school.block_name.toLowerCase().includes(filters.blockName.toLowerCase())) &&
      (filters.clusterCode === '' || school.cluster_code.toLowerCase().includes(filters.clusterCode.toLowerCase())) &&
      (filters.clusterName === '' || school.cluster_name.toLowerCase().includes(filters.clusterName.toLowerCase())) &&
      (filters.udiseCode === '' || school.udise_code.toLowerCase().includes(filters.udiseCode.toLowerCase()));

    return matchesSearch && matchesFilters;
  });

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      districtCode: '',
      districtName: '',
      blockCode: '',
      blockName: '',
      clusterCode: '',
      clusterName: '',
      udiseCode: ''
    });
    setSearchTerm('');
  };

  // Calculate filtered counts
  const filteredCounts = useMemo(() => {
    // Get unique blocks from filtered schools
    const uniqueBlocks = new Set(
      filteredSchools
        .map(school => school.block_code)
        .filter(blockCode => blockCode && blockCode.trim() !== '')
    );

    // Get unique clusters from filtered schools
    const uniqueClusters = new Set(
      filteredSchools
        .map(school => school.cluster_code)
        .filter(clusterCode => clusterCode && clusterCode.trim() !== '')
    );

    // Get unique UDISE codes from filtered schools
    const udiseCodes = filteredSchools.map(school => school.udise_code);
    
    // Count students that belong to the filtered schools
    const filteredStudentsCount = students.filter(student => 
      udiseCodes.includes(student.udise_code)
    ).length;

    return {
      totalBlocks: uniqueBlocks.size,
      totalClusters: uniqueClusters.size,
      totalSchools: filteredSchools.length,
      totalStudents: filteredStudentsCount,
      udiseCodes: udiseCodes
    };
  }, [filteredSchools, students]);

  // Calculate filtered re-upload statistics
  const filteredReuploadStats = useMemo(() => {
    // Get UDISE codes from filtered schools
    const filteredUdiseCodes = filteredSchools.map(school => school.udise_code);
    
    // Filter students to only include those from filtered schools
    const filteredStudents = students.filter(student => 
      filteredUdiseCodes.includes(student.udise_code)
    );

    // Calculate re-upload statistics for filtered students
    const neverReuploaded = filteredStudents.filter(student => 
      (student.reupload_count || 0) === 0
    ).length;

    const pendingReupload = filteredStudents.filter(student => 
      !student.certificate || student.certificate.trim() === ''
    ).length;

    const reuploadDue = filteredStudents.filter(student => {
      const hasNoCertificate = !student.certificate || student.certificate.trim() === '';
      const reuploadCount = student.reupload_count || 0;
      const lastReuploadDate = student.last_reupload_date;
      
      // Check if last reupload was more than 4 days ago or never happened
      let isOverdue = false;
      if (!lastReuploadDate) {
        isOverdue = true; // Never reuploaded
      } else {
        const lastDate = new Date(lastReuploadDate);
        const fourDaysAgo = new Date();
        fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
        isOverdue = lastDate <= fourDaysAgo;
      }
      
      return hasNoCertificate && isOverdue && reuploadCount < 6;
    }).length;

    return {
      neverReuploaded,
      pendingReupload,
      reuploadDue
    };
  }, [filteredSchools, students]);

  return (
    <div className="p-6 space-y-6">
      {/* Main Heading */}
      <h2
        className="text-3xl font-bold text-left text-green-700" // Changed to text-green-700 for a standard green
        // Removed: style={{ color: '#86EFAC' }}
      >
        {t('schoolStatsTitle')}
      </h2>

      {/* Search Bar and Filter Toggle */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search schools by name, district, UDISE code, block, or cluster..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
            />
          </div>
          
          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Filter className="w-5 h-5" />
            Filters
            <ChevronDown className={`w-4 h-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Advanced Filters</h3>
              <button
                onClick={clearAllFilters}
                className="text-sm text-red-600 hover:text-red-800 underline"
              >
                Clear All Filters
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* District Code Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District Code</label>
                <input
                  type="text"
                  value={filters.districtCode}
                  onChange={(e) => handleFilterChange('districtCode', e.target.value)}
                  placeholder="Search by district code..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* District Name Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District Name</label>
                <input
                  type="text"
                  value={filters.districtName}
                  onChange={(e) => handleFilterChange('districtName', e.target.value)}
                  placeholder="Search by district name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Block Code Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Block Code</label>
                <input
                  type="text"
                  value={filters.blockCode}
                  onChange={(e) => handleFilterChange('blockCode', e.target.value)}
                  placeholder="Search by block code..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Block Name Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Block Name</label>
                <input
                  type="text"
                  value={filters.blockName}
                  onChange={(e) => handleFilterChange('blockName', e.target.value)}
                  placeholder="Search by block name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Cluster Code Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cluster Code</label>
                <input
                  type="text"
                  value={filters.clusterCode}
                  onChange={(e) => handleFilterChange('clusterCode', e.target.value)}
                  placeholder="Search by cluster code..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Cluster Name Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cluster Name</label>
                <input
                  type="text"
                  value={filters.clusterName}
                  onChange={(e) => handleFilterChange('clusterName', e.target.value)}
                  placeholder="Search by cluster name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* UDISE Code Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">UDISE Code</label>
                <input
                  type="text"
                  value={filters.udiseCode}
                  onChange={(e) => handleFilterChange('udiseCode', e.target.value)}
                  placeholder="Search by UDISE code..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Active Filters Display */}
            {(filters.districtCode || filters.districtName || filters.blockCode || filters.blockName || filters.clusterCode || filters.clusterName || filters.udiseCode) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Active Filters:</p>
                <div className="flex flex-wrap gap-2">
                  {filters.districtCode && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      District Code: {filters.districtCode}
                      <button onClick={() => handleFilterChange('districtCode', '')} className="ml-2 text-green-600 hover:text-green-800">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.districtName && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      District Name: {filters.districtName}
                      <button onClick={() => handleFilterChange('districtName', '')} className="ml-2 text-green-600 hover:text-green-800">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.blockCode && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Block Code: {filters.blockCode}
                      <button onClick={() => handleFilterChange('blockCode', '')} className="ml-2 text-green-600 hover:text-green-800">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.blockName && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Block Name: {filters.blockName}
                      <button onClick={() => handleFilterChange('blockName', '')} className="ml-2 text-green-600 hover:text-green-800">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.clusterCode && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Cluster Code: {filters.clusterCode}
                      <button onClick={() => handleFilterChange('clusterCode', '')} className="ml-2 text-green-600 hover:text-green-800">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.clusterName && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Cluster Name: {filters.clusterName}
                      <button onClick={() => handleFilterChange('clusterName', '')} className="ml-2 text-green-600 hover:text-green-800">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.udiseCode && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      UDISE Code: {filters.udiseCode}
                      <button onClick={() => handleFilterChange('udiseCode', '')} className="ml-2 text-green-600 hover:text-green-800">
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

      {/* Count Statistics Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Total Blocks */}
        <div className="bg-white border-l-4 border-green-500 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Total Blocks</p>
              <p className="text-gray-800 text-3xl font-bold">{filteredCounts.totalBlocks}</p>
            </div>
            <Building2 className="w-12 h-12 text-green-500" />
          </div>
        </div>

        {/* Total Clusters */}
        <div className="bg-white border-l-4 border-blue-500 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Clusters</p>
              <p className="text-gray-800 text-3xl font-bold">{filteredCounts.totalClusters}</p>
            </div>
            <MapPin className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        {/* Total Students */}
        <div className="bg-white border-l-4 border-purple-500 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Total Students</p>
              <p className="text-gray-800 text-3xl font-bold">{filteredCounts.totalStudents}</p>
            </div>
            <Users className="w-12 h-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Re-upload Statistics Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Never Re-uploaded */}
        <div className="bg-white border-l-4 border-gray-500 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Never Re-uploaded</p>
              <p className="text-gray-800 text-3xl font-bold">{filteredReuploadStats.neverReuploaded}</p>
              
            </div>
            <Camera className="w-12 h-12 text-gray-500" />
          </div>
        </div>

        {/* Pending Re-upload */}
        <div className="bg-white border-l-4 border-orange-500 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Pending Re-upload</p>
              <p className="text-gray-800 text-3xl font-bold">{filteredReuploadStats.pendingReupload}</p>
              <p className="text-orange-500 text-xs mt-1">upload after 30 days</p>
            </div>
            <Clock className="w-12 h-12 text-orange-500" />
          </div>
        </div>

        {/* Re-upload Due */}
        <div className="bg-white border-l-4 border-red-500 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Re-upload Due</p>
              <p className="text-gray-800 text-3xl font-bold">{filteredReuploadStats.reuploadDue}</p>
              <p className="text-red-500 text-xs mt-1">upload available but not re-uploaded</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
        </div>
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
              <h3 className="text-lg font-semibold text-green-700 mb-4">{school.udise_code}</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <div>
                  <SchoolIcon className="inline mr-2 text-green-600" size={16} />
                  <strong>{t('schoolName')}:</strong> {school.school_name}
                </div>
                <div>
                  <MapPin className="inline mr-2 text-green-600" size={16} />
                  <strong>District:</strong> {school.district_name}
                </div>
                <div>
                  <IdCard className="inline mr-2 text-green-600" size={16} />
                  <strong>Block:</strong> {school.block_name}
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
          className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center px-4"
          onClick={() => setSelectedSchool(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-96 h-96 relative overflow-hidden"
          >
            {/* Header with close button */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 truncate pr-8">
                School Details
              </h3>
              <button
                onClick={() => setSelectedSchool(null)}
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
                    <SchoolIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-green-600 block">School Name</span>
                      <span className="text-sm font-semibold break-words">{selectedSchool.school_name}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                  <div className="flex items-center text-blue-800">
                    <IdCard className="w-4 h-4 mr-2 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-blue-600 block">UDISE Code</span>
                      <span className="text-sm font-semibold break-words">{selectedSchool.udise_code}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg border-l-4 border-purple-400">
                  <div className="flex items-center text-purple-800">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-purple-600 block">District</span>
                      <span className="text-sm font-semibold break-words">{selectedSchool.district_name}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-3 rounded-lg border-l-4 border-orange-400">
                  <div className="flex items-center text-orange-800">
                    <Hash className="w-4 h-4 mr-2 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-orange-600 block">District Code</span>
                      <span className="text-sm font-semibold break-words">{selectedSchool.district_code}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-teal-50 p-3 rounded-lg border-l-4 border-teal-400">
                  <div className="flex items-center text-teal-800">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-teal-600 block">Block</span>
                      <span className="text-sm font-semibold break-words">{selectedSchool.block_name}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-pink-50 p-3 rounded-lg border-l-4 border-pink-400">
                  <div className="flex items-center text-pink-800">
                    <Hash className="w-4 h-4 mr-2 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-pink-600 block">Block Code</span>
                      <span className="text-sm font-semibold break-words">{selectedSchool.block_code}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-50 p-3 rounded-lg border-l-4 border-indigo-400">
                  <div className="flex items-center text-indigo-800">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-indigo-600 block">Cluster</span>
                      <span className="text-sm font-semibold break-words">{selectedSchool.cluster_name}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                  <div className="flex items-center text-yellow-800">
                    <Hash className="w-4 h-4 mr-2 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-yellow-600 block">Cluster Code</span>
                      <span className="text-sm font-semibold break-words">{selectedSchool.cluster_code}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-400">
                  <div className="flex items-center text-gray-800">
                    <Hash className="w-4 h-4 mr-2 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-gray-600 block">Serial Number</span>
                      <span className="text-sm font-semibold break-words">{selectedSchool.sno}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolStats;