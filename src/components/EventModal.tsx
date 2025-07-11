import React from 'react';
import { X, Calendar, Clock, MapPin, User, Edit, Trash2 } from 'lucide-react';
import { Event } from '../types/Event';
import { formatDate } from '../utils/dateUtils';

interface EventModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

const categoryColors = {
  wellness: 'bg-green-100 text-green-800',
  technical: 'bg-blue-100 text-blue-800',
  'team-building': 'bg-purple-100 text-purple-800',
  sports: 'bg-orange-100 text-orange-800',
  celebration: 'bg-pink-100 text-pink-800',
  training: 'bg-yellow-100 text-yellow-800',
  meeting: 'bg-gray-100 text-gray-800'
};

const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose, onEdit, onDelete }) => {
  if (!isOpen) return null;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      onDelete(event.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h2>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${categoryColors[event.category]}`}>
                {event.category.replace('-', ' ').toUpperCase()}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <Calendar size={18} className="mr-3" />
              <span>{formatDate(event.date)}</span>
            </div>

            {event.time && (
              <div className="flex items-center text-gray-600">
                <Clock size={18} className="mr-3" />
                <span>{event.time}</span>
              </div>
            )}

            {event.location && (
              <div className="flex items-center text-gray-600">
                <MapPin size={18} className="mr-3" />
                <span>{event.location}</span>
              </div>
            )}

            {event.organizer && (
              <div className="flex items-center text-gray-600">
                <User size={18} className="mr-3" />
                <span>{event.organizer}</span>
              </div>
            )}

            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              onClick={() => onEdit(event)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit size={16} className="mr-2" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 size={16} className="mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;