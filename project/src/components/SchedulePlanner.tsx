import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Edit2, Trash2, Search } from 'lucide-react';
import { ScheduleEvent } from '../types';
import { storage } from '../utils/storage';

interface SchedulePlannerProps {
  isDarkMode: boolean;
}

const SchedulePlanner: React.FC<SchedulePlannerProps> = ({ isDarkMode }) => {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  useEffect(() => {
    setEvents(storage.getEvents());
  }, []);

  useEffect(() => {
    storage.saveEvents(events);
  }, [events]);

  const addEvent = () => {
    if (newEvent.title.trim() && newEvent.startTime && newEvent.endTime) {
      const event: ScheduleEvent = {
        id: Date.now().toString(),
        title: newEvent.title.trim(),
        description: newEvent.description.trim(),
        date: new Date(newEvent.date),
        startTime: newEvent.startTime,
        endTime: newEvent.endTime,
        priority: newEvent.priority,
        createdAt: new Date()
      };
      setEvents([...events, event]);
      setNewEvent({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        priority: 'medium'
      });
      setShowForm(false);
    }
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const eventDate = event.date.toISOString().split('T')[0];
    const matchesDate = !selectedDate || eventDate === selectedDate;
    return matchesSearch && matchesDate;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return events.filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className={`text-3xl font-bold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Schedule Planner
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Event</span>
        </button>
      </div>

      {/* Add Event Form */}
      {showForm && (
        <div className={`rounded-2xl p-6 ${
          isDarkMode 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
        } shadow-lg animate-in slide-in-from-top duration-300`}>
          <h3 className={`text-xl font-semibold mb-4 ${
            isDinkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Add New Event
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              placeholder="Event title"
              className={`px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
            
            <select
              value={newEvent.priority}
              onChange={(e) => setNewEvent({ ...newEvent, priority: e.target.value as 'low' | 'medium' | 'high' })}
              className={`px-4 py-3 rounded-xl border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              className={`px-4 py-3 rounded-xl border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
            
            <div className="flex space-x-2">
              <input
                type="time"
                value={newEvent.startTime}
                onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                className={`flex-1 px-4 py-3 rounded-xl border ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <input
                type="time"
                value={newEvent.endTime}
                onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                className={`flex-1 px-4 py-3 rounded-xl border ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>
          
          <textarea
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            placeholder="Event description (optional)"
            rows={3}
            className={`w-full mt-4 px-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
          
          <div className="flex space-x-3 mt-4">
            <button
              onClick={addEvent}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
            >
              Add Event
            </button>
            <button
              onClick={() => setShowForm(false)}
              className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search events..."
            className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
        
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className={`px-4 py-3 rounded-xl border ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Events */}
        <div className="lg:col-span-2">
          <h2 className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {selectedDate ? `Events for ${new Date(selectedDate).toLocaleDateString()}` : 'All Events'}
          </h2>
          
          <div className="space-y-3">
            {filteredEvents.length === 0 ? (
              <div className={`text-center py-12 rounded-2xl ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              } shadow-lg`}>
                <Calendar className={`mx-auto mb-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} size={48} />
                <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No events found
                </p>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className={`group rounded-2xl p-4 transition-all duration-300 border-l-4 ${getPriorityColor(event.priority)} ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } shadow-lg hover:shadow-xl transform hover:scale-[1.02]`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {event.title}
                      </h3>
                      
                      {event.description && (
                        <p className={`mt-2 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {event.description}
                        </p>
                      )}
                      
                      <div className={`flex items-center space-x-4 mt-3 text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{event.date.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock size={14} />
                          <span>{event.startTime} - {event.endTime}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Events Sidebar */}
        <div>
          <h2 className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Upcoming Events
          </h2>
          
          <div className={`rounded-2xl p-4 ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          } shadow-lg`}>
            <div className="space-y-3">
              {getUpcomingEvents().slice(0, 5).map((event) => (
                <div key={event.id} className={`p-3 rounded-lg border-l-4 ${getPriorityColor(event.priority)}`}>
                  <h4 className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {event.title}
                  </h4>
                  <div className={`text-sm mt-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {event.date.toLocaleDateString()} at {event.startTime}
                  </div>
                </div>
              ))}
              
              {getUpcomingEvents().length === 0 && (
                <p className={`text-center py-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  No upcoming events
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePlanner;