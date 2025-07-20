import React from 'react';
import { FileText, Users, UserCheck, Activity, ArrowRight } from 'lucide-react';

const DataViewer: React.FC = () => {
  const dataStructure = {
    'AWW & AWH Data': {
      icon: Users,
      color: 'gradient-card-blue',
      iconBg: 'bg-blue-600',
      fields: [
        'Worker ID',
        'Name (नाम)',
        'Type (AWW/AWH)',
        'Anganwadi Center (आंगनवाड़ी केंद्र)',
        'Phone Number (फोन नंबर)',
        'Address (पता)',
        'Status (स्थिति)',
        'Joining Date (ज्वाइनिंग डेट)'
      ],
      count: '223 records'
    },
    'Support Worker Info': {
      icon: UserCheck,
      color: 'gradient-card-green',
      iconBg: 'bg-green-600',
      fields: [
        'Worker ID',
        'Name (नाम)',
        'Designation (पदनाम)',
        'Area/Block (क्षेत्र/ब्लॉक)',
        'Phone Number (फोन नंबर)',
        'Email ID',
        'Joining Date (ज्वाइनिंग डेट)',
        'Status (स्थिति)'
      ],
      count: '67 records'
    }
  };

  return (
    <div className="modern-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-xl mr-3">
            <FileText className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Data Structure Overview</h2>
            <p className="text-gray-500 text-sm">Based on your Excel files structure</p>
          </div>
        </div>
        <button className="btn-secondary text-sm">
          View Details
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(dataStructure).map(([title, config], index) => {
          const Icon = config.icon;
          return (
            <div 
              key={title} 
              className="modern-card hover:shadow-lg transition-all duration-300 animate-fadeInUp"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`p-3 ${config.iconBg} rounded-xl mr-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
                      <p className="text-sm text-gray-500">{config.count}</p>
                    </div>
                  </div>
                </div>

                {/* Fields */}
                <div className="space-y-2 mb-4">
                  {config.fields.slice(0, 6).map((field, fieldIndex) => (
                    <div key={fieldIndex} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{field}</span>
                    </div>
                  ))}
                  {config.fields.length > 6 && (
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-gray-300 rounded-full mr-3 flex-shrink-0"></div>
                      <span>+{config.fields.length - 6} more fields</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                  <span className="font-medium">View Data</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Next Steps */}
      <div className="mt-8 p-6 bg-gradient-card-green rounded-xl">
        <div className="flex items-start">
          <Activity className="w-6 h-6 text-white mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-white text-lg mb-2">Ready for Data Integration</h4>
            <ul className="text-white text-opacity-90 text-sm space-y-1">
              <li>• Excel files structure analyzed and ready</li>
              <li>• UI components prepared for real data</li>
              <li>• CRUD operations can be implemented</li>
              <li>• Data validation system ready to deploy</li>
            </ul>
            <button className="mt-4 bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Integration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataViewer;
