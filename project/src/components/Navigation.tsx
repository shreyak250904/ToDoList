import React from 'react';
import { 
  CheckSquare, 
  Calendar, 
  BookOpen, 
  StickyNote, 
  Mic, 
  LayoutDashboard,
  Moon,
  Sun
} from 'lucide-react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  currentView, 
  onViewChange, 
  isDarkMode, 
  onThemeToggle 
}) => {
  const navItems = [
    { id: 'dashboard' as AppView, icon: LayoutDashboard, label: 'Dashboard', color: 'from-purple-500 to-pink-500' },
    { id: 'todo' as AppView, icon: CheckSquare, label: 'To-Do List', color: 'from-blue-500 to-cyan-500' },
    { id: 'schedule' as AppView, icon: Calendar, label: 'Schedule', color: 'from-green-500 to-emerald-500' },
    { id: 'diary' as AppView, icon: BookOpen, label: 'Diary', color: 'from-orange-500 to-red-500' },
    { id: 'notes' as AppView, icon: StickyNote, label: 'Notes', color: 'from-yellow-500 to-orange-500' },
    { id: 'audio' as AppView, icon: Mic, label: 'Audio', color: 'from-indigo-500 to-purple-500' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${
      isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'
    } backdrop-blur-lg border-b ${
      isDarkMode ? 'border-gray-700' : 'border-gray-200'
    } transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <h1 className={`text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent`}>
                ProductivitySuite
              </h1>
            </div>
            
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onViewChange(item.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                        currentView === item.id
                          ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                          : isDarkMode
                          ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            onClick={onThemeToggle}
            className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
              isDarkMode
                ? 'text-yellow-400 hover:bg-gray-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className={`px-2 pt-2 pb-3 space-y-1 ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  currentView === item.id
                    ? `bg-gradient-to-r ${item.color} text-white`
                    : isDarkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon size={16} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;