import React from 'react';
import { Database, Users, Cloud, Shield, Zap } from 'lucide-react';

const DatabaseInfo: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Database size={24} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-blue-900">Live Database Connected</h3>
          <p className="text-blue-700 text-sm">Real-time multi-user event management</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center space-x-2 bg-white bg-opacity-50 rounded-lg p-3">
          <Cloud size={18} className="text-blue-500" />
          <span className="text-blue-800 font-medium">Cloud Storage</span>
        </div>
        <div className="flex items-center space-x-2 bg-white bg-opacity-50 rounded-lg p-3">
          <Users size={18} className="text-blue-500" />
          <span className="text-blue-800 font-medium">Multi-User</span>
        </div>
        <div className="flex items-center space-x-2 bg-white bg-opacity-50 rounded-lg p-3">
          <Zap size={18} className="text-blue-500" />
          <span className="text-blue-800 font-medium">Real-time</span>
        </div>
        <div className="flex items-center space-x-2 bg-white bg-opacity-50 rounded-lg p-3">
          <Shield size={18} className="text-blue-500" />
          <span className="text-blue-800 font-medium">Secure</span>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-white bg-opacity-60 rounded-lg">
        <p className="text-blue-800 text-sm leading-relaxed">
          <strong>✨ Now live!</strong> Events are stored in a professional database and sync instantly across all users and devices. 
          Changes made by any user will appear immediately for everyone else.
        </p>
      </div>
    </div>
  );
};

export default DatabaseInfo;