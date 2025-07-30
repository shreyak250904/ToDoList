import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import TodoList from './components/TodoList';
import SchedulePlanner from './components/SchedulePlanner';
import DiaryNotes from './components/DiaryNotes';
import AudioRecorder from './components/AudioRecorder';
import { AppView } from './types';
import { storage } from './utils/storage';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = storage.getTheme();
    setIsDarkMode(savedTheme === 'dark');
    
    // Apply theme to document
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    storage.saveTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const getStats = () => {
    const tasks = storage.getTasks();
    const events = storage.getEvents();
    const diaryEntries = storage.getDiaryEntries();
    const notes = storage.getNotes();
    const recordings = storage.getRecordings();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcomingEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today;
    });

    return {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.completed).length,
      upcomingEvents: upcomingEvents.length,
      diaryEntries: diaryEntries.length,
      notes: notes.length,
      recordings: recordings.length
    };
  };

  const renderCurrentView = () => {
    const props = { isDarkMode };
    
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onViewChange={setCurrentView} isDarkMode={isDarkMode} stats={getStats()} />;
      case 'todo':
        return <TodoList {...props} />;
      case 'schedule':
        return <SchedulePlanner {...props} />;
      case 'diary':
        return <DiaryNotes {...props} />;
      case 'notes':
        return <DiaryNotes {...props} />;
      case 'audio':
        return <AudioRecorder {...props} />;
      default:
        return <Dashboard onViewChange={setCurrentView} isDarkMode={isDarkMode} stats={getStats()} />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
        isDarkMode={isDarkMode}
        onThemeToggle={toggleTheme}
      />
      
      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-in fade-in slide-in-from-bottom duration-500">
            {renderCurrentView()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;