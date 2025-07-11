import React, { useState } from 'react';
import { CalendarDays, Building2, RotateCcw } from 'lucide-react';
import ConnectionStatus from './ConnectionStatus';

interface HeaderProps {
  onResetEvents: () => void;
}

const Header: React.FC<HeaderProps> = ({ onResetEvents }) => {
  const [showResetButton, setShowResetButton] = useState(false);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Building2 size={32} />
              <div>
                <h1 className="text-2xl font-bold">PS-PEM, BHEL</h1>
                <p className="text-blue-100 text-sm">Power Sector - Project Engineering Management</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <CalendarDays size={24} />
              <div className="text-right">
                <p className="font-semibold">Event Calendar</p>
                <p className="text-sm text-blue-100">FY 2025-26</p>
              </div>
            </div>
            
            {/* Connection Status */}
            <div className="bg-white bg-opacity-20 rounded-lg px-3 py-2">
              <ConnectionStatus />
            </div>
            
            {/* Admin Reset Button */}
            <div className="relative">
              <button
                onClick={() => setShowResetButton(!showResetButton)}
                className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
                title="Admin Options"
              >
                <RotateCcw size={20} />
              </button>
              
              {showResetButton && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg p-2 min-w-[200px] z-50">
                  <button
                    onClick={() => {
                      onResetEvents();
                      setShowResetButton(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Reset to Default Events
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;