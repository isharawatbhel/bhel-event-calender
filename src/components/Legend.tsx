import React from 'react';

const Legend: React.FC = () => {
  const categories = [
    { name: 'Wellness', color: 'bg-green-500', description: 'Health & wellness sessions' },
    { name: 'Technical', color: 'bg-blue-500', description: 'Technical workshops & seminars' },
    { name: 'Team Building', color: 'bg-purple-500', description: 'Team building activities' },
    { name: 'Sports', color: 'bg-orange-500', description: 'Sports events & competitions' },
    { name: 'Celebration', color: 'bg-pink-500', description: 'Festivals & celebrations' },
    { name: 'Training', color: 'bg-yellow-500', description: 'Training & development' },
    { name: 'Meeting', color: 'bg-gray-500', description: 'Official meetings & reviews' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Categories</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {categories.map((category) => (
          <div key={category.name} className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded ${category.color}`}></div>
            <div>
              <p className="text-sm font-medium text-gray-900">{category.name}</p>
              <p className="text-xs text-gray-500">{category.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;