import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  details?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, details }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="flex items-center mb-4">
          <AlertCircle className="text-red-500 mr-3" size={24} />
          <h2 className="text-xl font-semibold text-gray-900">Error</h2>
        </div>
        <p className="text-gray-700 mb-4">{message}</p>
        {details && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 font-medium mb-2">Details:</p>
            <p className="text-sm text-gray-600">{details}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;