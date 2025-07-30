import React, { useEffect, useState } from 'react';
import { TEMP_BASE_URL } from '../../config/apiConfig';
import { User, School, CalendarDays, UserCircle } from 'lucide-react';

interface StudentData {
  id: string;
  name: string;
  school: string;
  grade: string;
  age: number;
  guardianName: string;
}

const AssignedStudents: React.FC = () => {
    const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${TEMP_BASE_URL}/supervisor/students`);
        const data = await response.json();
        
        if (data.status) {
          setStudents(data.students || []);
          setError(null);
        } else {
          setError(data.message || 'Failed to load students data');
        }
      } catch (err) {
        setError('Network error. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Assigned Students</h1>
      
      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, school, grade, or Student ID"
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
          {filteredStudents.map(student => (
            <div key={student.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="mb-4">
                <div className="text-green-600 font-bold mb-2">{student.id}</div>
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 mt-1 text-green-600 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Name:</div>
                    <div className="text-gray-600">{student.name}</div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-start space-x-3">
                  <School className="w-5 h-5 mt-1 text-green-600 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">School:</div>
                    <div className="text-gray-600">{student.school}</div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-start space-x-3">
                  <CalendarDays className="w-5 h-5 mt-1 text-green-600 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Grade:</div>
                    <div className="text-gray-600">{student.grade}</div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-start space-x-3">
                  <UserCircle className="w-5 h-5 mt-1 text-green-600 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Guardian Name:</div>
                    <div className="text-gray-600">{student.guardianName}</div>
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

export default AssignedStudents;
