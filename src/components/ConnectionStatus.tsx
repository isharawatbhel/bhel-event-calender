import React, { useState, useEffect } from 'react';
import { Database, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ConnectionStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Test the connection by trying to fetch from the events table
        const { data, error } = await supabase
          .from('events')
          .select('id')
          .limit(1);

        if (error) {
          console.error('Supabase connection error:', error);
          setError(error.message);
          setIsConnected(false);
        } else {
          console.log('Supabase connected successfully');
          setIsConnected(true);
          setError(null);
        }
      } catch (err) {
        console.error('Connection test failed:', err);
        setError('Failed to connect to database');
        setIsConnected(false);
      }
    };

    checkConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isConnected === null) {
    return (
      <div className="flex items-center space-x-2 text-yellow-200">
        <Database size={16} className="animate-pulse" />
        <span className="text-sm">Checking...</span>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center space-x-2 text-green-200">
        <Wifi size={16} />
        <span className="text-sm font-medium">Connected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-red-200" title={error || 'Database connection failed'}>
      <WifiOff size={16} />
      <span className="text-sm font-medium">Disconnected</span>
    </div>
  );
};

export default ConnectionStatus;