import React, { useState } from 'react';
import { Search, Users, Eye, Edit, FileText, BarChart3, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface WorkerData {
  id: string;
  name: string;
  type: 'AWW' | 'AWH';
  center: string;
  phone: string;
  status: 'Active' | 'Inactive';
  village: string;
  beneficiaries: number;
  joinDate: string;
}

const AwwAwhData: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'AWW' | 'AWH'>('ALL');

  // Mock data - replace with actual data from Excel files
  const workersData: WorkerData[] = [
    {
      id: 'AWW001',
      name: 'सुनीता देवी',
      type: 'AWW',
      center: 'आंगनवाड़ी केंद्र 1',
      phone: '9876543210',
      status: 'Active',
      village: 'रामपुर',
      beneficiaries: 45,
      joinDate: '2023-01-15'
    },
    {
      id: 'AWH001',
      name: 'मीरा शर्मा',
      type: 'AWH',
      center: 'आंगनवाड़ी केंद्र 1',
      phone: '9876543211',
      status: 'Active',
      village: 'सीतापुर',
      beneficiaries: 38,
      joinDate: '2023-02-20'
    },
    {
      id: 'AWW002',
      name: 'रेखा पटेल',
      type: 'AWW',
      center: 'आंगनवाड़ी केंद्र 2',
      phone: '9876543212',
      status: 'Active',
      village: 'भिलाई',
      beneficiaries: 52,
      joinDate: '2023-03-10'
    },
    {
      id: 'AWH002',
      name: 'प्रिया वर्मा',
      type: 'AWH',
      center: 'आंगनवाड़ी केंद्र 2',
      phone: '9876543213',
      status: 'Inactive',
      village: 'दुर्ग',
      beneficiaries: 29,
      joinDate: '2023-04-05'
    },
    {
      id: 'AWW003',
      name: 'कमला देवी',
      type: 'AWW',
      center: 'आंगनवाड़ी केंद्र 3',
      phone: '9876543214',
      status: 'Active',
      village: 'बिलासपुर',
      beneficiaries: 63,
      joinDate: '2023-01-30'
    },
  ];

  const filteredData = workersData.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.village.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'ALL' || worker.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <span className="badge badge-success">Active</span>;
      case 'Inactive':
        return <span className="badge badge-error">Inactive</span>;
      default:
        return <span className="badge">Unknown</span>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'AWW':
        return <span className="badge badge-info">AWW</span>;
      case 'AWH':
        return <span className="badge badge-warning">AWH</span>;
      default:
        return <span className="badge">Unknown</span>;
    }
  };

  const totalBeneficiaries = filteredData.reduce((sum, worker) => sum + worker.beneficiaries, 0);
  const awwCount = filteredData.filter(worker => worker.type === 'AWW').length;
  const awhCount = filteredData.filter(worker => worker.type === 'AWH').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center animate-fadeInUp">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('awwAwhData')}</h1>
        <p className="text-gray-600 text-lg">Manage Anganwadi Workers (AWW) and Helpers (AWH) information</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card bg-gradient-card-blue animate-fadeInUp" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Total Workers</p>
              <p className="text-white text-2xl font-bold">{filteredData.length}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="stat-card bg-gradient-card-green animate-fadeInUp" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">AWW Workers</p>
              <p className="text-white text-2xl font-bold">{awwCount}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="stat-card bg-gradient-card-orange animate-fadeInUp" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">AWH Helpers</p>
              <p className="text-white text-2xl font-bold">{awhCount}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="stat-card bg-gradient-card-purple animate-fadeInUp" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Total Beneficiaries</p>
              <p className="text-white text-2xl font-bold">{totalBeneficiaries}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="modern-card p-6 animate-fadeInUp" style={{ animationDelay: '500ms' }}>
        <div className="max-w-4xl mx-auto">
          {/* Search Bar with Filter */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search workers by name, center, village, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors bg-white shadow-sm"
              />
            </div>
            
            {/* Filter Dropdown */}
            <div className="sm:w-60">
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'ALL' | 'AWW' | 'AWH')}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none bg-white shadow-sm text-base appearance-none cursor-pointer"
              >
                <option value="ALL">All Worker Types</option>
                <option value="AWW">AWW Workers Only</option>
                <option value="AWH">AWH Helpers Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Data Display - Workers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredData.map((worker, index) => (
            <div key={worker.id} className="modern-card p-6 hover:shadow-lg transition-shadow animate-fadeInUp" style={{ animationDelay: `${600 + (index * 50)}ms` }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">{worker.name}</h3>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{worker.village}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {getTypeBadge(worker.type)}
                  {getStatusBadge(worker.status)}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">ID:</span>
                  <span className="font-medium text-gray-900">{worker.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Center:</span>
                  <span className="font-medium text-gray-900 text-right">{worker.center}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Beneficiaries:</span>
                  <span className="font-medium text-gray-900">{worker.beneficiaries}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Contact:</span>
                  <span className="font-medium text-gray-900">{worker.phone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Join Date:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(worker.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4 mt-4 border-t border-gray-100">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      {filteredData.length === 0 && (
        <div className="modern-card p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workers found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default AwwAwhData;
