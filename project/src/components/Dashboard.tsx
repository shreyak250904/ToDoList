import React from 'react';
import { CheckSquare, Calendar, BookOpen, StickyNote, Mic, TrendingUp } from 'lucide-react';
import { AppView } from '../types';

interface DashboardProps {
  onViewChange: (view: AppView) => void;
  isDarkMode: boolean;
  stats: {
    totalTasks: number;
    completedTasks: number;
    upcomingEvents: number;
    diaryEntries: number;
    notes: number;
    recordings: number;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange, isDarkMode, stats }) => {
  const cards = [
    {
      id: 'todo' as AppView,
      title: 'To-Do List',
      icon: CheckSquare,
      gradient: 'from-blue-500 to-cyan-500',
      count: stats.totalTasks,
      subtitle: `${stats.completedTasks} completed`,
      description: 'Manage your daily tasks efficiently'
    },
    {
      id: 'schedule' as AppView,
      title: 'Schedule Planner',
      icon: Calendar,
      gradient: 'from-green-500 to-emerald-500',
      count: stats.upcomingEvents,
      subtitle: 'upcoming events',
      description: 'Plan and organize your schedule'
    },
    {
      id: 'diary' as AppView,
      title: 'Diary',
      icon: BookOpen,
      gradient: 'from-orange-500 to-red-500',
      count: stats.diaryEntries,
      subtitle: 'total entries',
      description: 'Record your thoughts and experiences'
    },
    {
      id: 'notes' as AppView,
      title: 'Notes',
      icon: StickyNote,
      gradient: 'from-yellow-500 to-orange-500',
      count: stats.notes,
      subtitle: 'saved notes',
      description: 'Quick notes and important information'
    },
    {
      id: 'audio' as AppView,
      title: 'Audio Recorder',
      icon: Mic,
      gradient: 'from-indigo-500 to-purple-500',
      count: stats.recordings,
      subtitle: 'recordings',
      description: 'Voice memos and audio notes'
    }
  ];

  const completionRate = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className={`rounded-2xl p-8 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
          : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
      } shadow-xl`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Welcome back!
            </h1>
            <p className={`text-lg mt-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Stay organized and productive with your personal suite
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 text-green-500">
              <TrendingUp size={24} />
              <span className="text-2xl font-bold">{completionRate}%</span>
            </div>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Completion Rate
            </p>
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onViewChange(card.id)}
              className={`group cursor-pointer rounded-2xl p-6 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${
                isDarkMode
                  ? 'bg-gray-800 border border-gray-700 hover:border-gray-600'
                  : 'bg-white border border-gray-200 hover:border-gray-300'
              } shadow-lg hover:shadow-2xl`}
              style={{
                perspective: '1000px'
              }}
            >
              <div className="group-hover:animate-pulse">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${card.gradient} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:rotate-12`}>
                  <Icon className="text-white" size={24} />
                </div>
                
                <h3 className={`text-xl font-semibold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {card.title}
                </h3>
                
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className={`text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                    {card.count}
                  </span>
                  <span className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {card.subtitle}
                  </span>
                </div>
                
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`rounded-xl p-4 text-center ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        } shadow-lg`}>
          <div className="text-2xl font-bold text-blue-500">{stats.totalTasks}</div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Tasks</div>
        </div>
        
        <div className={`rounded-xl p-4 text-center ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        } shadow-lg`}>
          <div className="text-2xl font-bold text-green-500">{stats.completedTasks}</div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Completed</div>
        </div>
        
        <div className={`rounded-xl p-4 text-center ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        } shadow-lg`}>
          <div className="text-2xl font-bold text-orange-500">{stats.upcomingEvents}</div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Events</div>
        </div>
        
        <div className={`rounded-xl p-4 text-center ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        } shadow-lg`}>
          <div className="text-2xl font-bold text-purple-500">{stats.notes}</div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Notes</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;