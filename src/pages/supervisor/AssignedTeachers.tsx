import React, { useEffect, useState } from 'react';
import { TEMP_BASE_URL } from '../../config/apiConfig';

const AssignedTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${TEMP_BASE_URL}/supervisor/teachers`)
      .then(res => res.json())
      .then(data => {
        if (data.status) {
          setTeachers(data.teachers || []);
          setError(null);
        } else {
          setError(data.message || 'Failed to load teachers data');
        }
      })
      .catch(err => {
        setError('Network error. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Assigned Teachers</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add your teacher cards or list here */}
        </div>
      )}
    </div>
  );
};

export default AssignedTeachers;
