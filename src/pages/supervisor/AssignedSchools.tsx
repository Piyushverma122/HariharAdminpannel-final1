import React, { useEffect, useState } from 'react';
import { TEMP_BASE_URL } from '../../config/apiConfig';
import { School } from 'lucide-react';

interface SchoolData {
  id: string;
  schoolName: string;
  address: string;
  udise: string;
}

const AssignedSchools: React.FC = () => {
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch(`${TEMP_BASE_URL}/supervisor/schools`);
        const data = await response.json();
        
        if (data.status) {
          setSchools(data.schools || []);
          setError(null);
        } else {
          setError(data.message || 'Failed to load schools data');
        }
      } catch (err) {
        setError('Network error. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSchools = schools.filter(school => 
    school.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.udise.includes(searchQuery) ||
    school.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Assigned Schools</h1>
      
      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, address, UDISE, or School ID"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools.map(school => (
            <div key={school.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="mb-4">
                <div className="text-green-600 font-bold mb-2">{school.id}</div>
                <div className="flex items-start space-x-3">
                  <School className="w-5 h-5 mt-1 text-green-600 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">School Name:</div>
                    <div className="text-gray-600">{school.schoolName}</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 mt-1 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <div className="font-semibold">Address:</div>
                    <div className="text-gray-600">{school.address}</div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 mt-1 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                  <div>
                    <div className="font-semibold">UDISE:</div>
                    <div className="text-gray-600">{school.udise}</div>
                  </div>
                </div>
              </div>

              <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>View Full Details</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignedSchools;
