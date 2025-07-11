import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, User, FileText, CheckCircle } from 'lucide-react';
import { Event } from '../types/Event';

interface EventFormProps {
  event?: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<Event, 'id'>) => void;
}

const categories = [
  { value: 'wellness', label: 'Wellness' },
  { value: 'technical', label: 'Technical' },
  { value: 'team-building', label: 'Team Building' },
  { value: 'sports', label: 'Sports' },
  { value: 'celebration', label: 'Celebration' },
  { value: 'training', label: 'Training' },
  { value: 'meeting', label: 'Meeting' }
] as const;

// Generate time options from 6:00 AM to 11:00 PM in 30-minute intervals
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 6; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const time12 = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
      times.push({ value: time12, label: time12 });
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();

const EventForm: React.FC<EventFormProps> = ({ event, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: 'meeting' as const,
    time: '',
    location: '',
    organizer: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset form when modal opens/closes or event changes
  useEffect(() => {
    console.log('EventForm useEffect triggered', { isOpen, event });
    if (isOpen) {
      if (event) {
        console.log('Editing existing event:', event);
        setFormData({
          title: event.title,
          description: event.description,
          date: event.date.toISOString().split('T')[0],
          category: event.category,
          time: event.time || '',
          location: event.location || '',
          organizer: event.organizer || ''
        });
      } else {
        console.log('Adding new event - resetting form');
        setFormData({
          title: '',
          description: '',
          date: '',
          category: 'meeting',
          time: '',
          location: '',
          organizer: ''
        });
      }
      setErrors({});
      setShowSuccess(false);
    }
  }, [event, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Event description is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Event date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const minDate = new Date('2025-04-01');
      const maxDate = new Date('2026-03-31');
      
      if (selectedDate < minDate || selectedDate > maxDate) {
        newErrors.date = 'Date must be within financial year 2025-26';
      }
    }
    
    console.log('Validation errors:', newErrors);
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    const validationErrors = validateForm();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      console.log('Validation failed, not submitting');
      return;
    }

    try {
      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: new Date(formData.date),
        category: formData.category,
        time: formData.time.trim() || undefined,
        location: formData.location.trim() || undefined,
        organizer: formData.organizer.trim() || undefined
      };

      console.log('Calling onSave with:', eventData);
      onSave(eventData);
      console.log('onSave called successfully');
      
      // Show success message
      setShowSuccess(true);
      
      // Close the modal after a brief delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  const handleChange = (field: string, value: string) => {
    console.log(`Field ${field} changed to:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleClose = () => {
    if (showSuccess) return; // Don't allow closing during success state
    
    console.log('Closing form');
    setFormData({
      title: '',
      description: '',
      date: '',
      category: 'meeting',
      time: '',
      location: '',
      organizer: ''
    });
    setErrors({});
    setShowSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {showSuccess ? (
            <div className="text-center py-8">
              <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Event {event ? 'Updated' : 'Added'} Successfully!
              </h2>
              <p className="text-gray-600">
                Your event has been saved and will persist between sessions.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {event ? 'Edit Event' : 'Add New Event'}
                </h2>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText size={16} className="inline mr-2" />
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter event title"
                    maxLength={100}
                    required
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter event description"
                    maxLength={500}
                    required
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                {/* Date and Category Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar size={16} className="inline mr-2" />
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      min="2025-04-01"
                      max="2026-03-31"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.date ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Time and Location Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock size={16} className="inline mr-2" />
                      Time
                    </label>
                    <select
                      value={formData.time}
                      onChange={(e) => handleChange('time', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select time (optional)</option>
                      {timeOptions.map((time) => (
                        <option key={time.value} value={time.value}>
                          {time.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin size={16} className="inline mr-2" />
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter event location"
                      maxLength={100}
                    />
                  </div>
                </div>

                {/* Organizer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User size={16} className="inline mr-2" />
                    Organizer
                  </label>
                  <input
                    type="text"
                    value={formData.organizer}
                    onChange={(e) => handleChange('organizer', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter organizer name"
                    maxLength={100}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {event ? 'Update Event' : 'Add Event'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventForm;