import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, BookOpen, StickyNote, Heart, Meh, Frown, Smile, Zap, Pin, PinOff } from 'lucide-react';
import { DiaryEntry, Note } from '../types';
import { storage } from '../utils/storage';

interface DiaryNotesProps {
  isDarkMode: boolean;
}

const DiaryNotes: React.FC<DiaryNotesProps> = ({ isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'diary' | 'notes'>('diary');
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDiaryForm, setShowDiaryForm] = useState(false);
  const [showNotesForm, setShowNotesForm] = useState(false);
  
  const [newDiary, setNewDiary] = useState({
    title: '',
    content: '',
    mood: 'neutral' as 'happy' | 'neutral' | 'sad' | 'excited' | 'stressed'
  });
  
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: '',
    pinned: false
  });

  useEffect(() => {
    setDiaryEntries(storage.getDiaryEntries());
    setNotes(storage.getNotes());
  }, []);

  useEffect(() => {
    storage.saveDiaryEntries(diaryEntries);
  }, [diaryEntries]);

  useEffect(() => {
    storage.saveNotes(notes);
  }, [notes]);

  const addDiaryEntry = () => {
    if (newDiary.title.trim() && newDiary.content.trim()) {
      const entry: DiaryEntry = {
        id: Date.now().toString(),
        title: newDiary.title.trim(),
        content: newDiary.content.trim(),
        date: new Date(),
        mood: newDiary.mood,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setDiaryEntries([entry, ...diaryEntries]);
      setNewDiary({ title: '', content: '', mood: 'neutral' });
      setShowDiaryForm(false);
    }
  };

  const addNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        title: newNote.title.trim(),
        content: newNote.content.trim(),
        tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        pinned: newNote.pinned,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setNotes([note, ...notes]);
      setNewNote({ title: '', content: '', tags: '', pinned: false });
      setShowNotesForm(false);
    }
  };

  const deleteDiaryEntry = (id: string) => {
    setDiaryEntries(diaryEntries.filter(entry => entry.id !== id));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const togglePinNote = (id: string) => {
    setNotes(notes.map(note =>
      note.id === id
        ? { ...note, pinned: !note.pinned, updatedAt: new Date() }
        : note
    ));
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy': return <Smile className="text-green-500" size={20} />;
      case 'excited': return <Zap className="text-yellow-500" size={20} />;
      case 'neutral': return <Meh className="text-gray-500" size={20} />;
      case 'sad': return <Frown className="text-blue-500" size={20} />;
      case 'stressed': return <Heart className="text-red-500" size={20} />;
      default: return <Meh className="text-gray-500" size={20} />;
    }
  };

  const filteredDiaryEntries = diaryEntries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('diary')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === 'diary'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                : isDarkMode
                ? 'text-gray-300 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookOpen size={20} />
            <span>Diary</span>
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === 'notes'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                : isDarkMode
                ? 'text-gray-300 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <StickyNote size={20} />
            <span>Notes</span>
          </button>
        </div>

        <button
          onClick={() => activeTab === 'diary' ? setShowDiaryForm(true) : setShowNotesForm(true)}
          className={`px-6 py-3 text-white rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 ${
            activeTab === 'diary'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
              : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
          }`}
        >
          <Plus size={20} />
          <span>Add {activeTab === 'diary' ? 'Entry' : 'Note'}</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`} size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search ${activeTab === 'diary' ? 'diary entries' : 'notes'}...`}
          className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
        />
      </div>

      {/* Diary Form */}
      {showDiaryForm && (
        <div className={`rounded-2xl p-6 ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        } shadow-lg animate-in slide-in-from-top duration-300`}>
          <h3 className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            New Diary Entry
          </h3>
          
          <div className="space-y-4">
            <input
              type="text"
              value={newDiary.title}
              onChange={(e) => setNewDiary({ ...newDiary, title: e.target.value })}
              placeholder="Entry title"
              className={`w-full px-4 py-3 rounded-xl border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
            
            <select
              value={newDiary.mood}
              onChange={(e) => setNewDiary({ ...newDiary, mood: e.target.value as any })}
              className={`w-full px-4 py-3 rounded-xl border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="happy">😊 Happy</option>
              <option value="excited">⚡ Excited</option>
              <option value="neutral">😐 Neutral</option>
              <option value="sad">😢 Sad</option>
              <option value="stressed">💔 Stressed</option>
            </select>
            
            <textarea
              value={newDiary.content}
              onChange={(e) => setNewDiary({ ...newDiary, content: e.target.value })}
              placeholder="Write your thoughts..."
              rows={6}
              className={`w-full px-4 py-3 rounded-xl border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
            
            <div className="flex space-x-3">
              <button
                onClick={addDiaryEntry}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300"
              >
                Save Entry
              </button>
              <button
                onClick={() => setShowDiaryForm(false)}
                className={`px-6 py-3 rounded-xl ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Form */}
      {showNotesForm && (
        <div className={`rounded-2xl p-6 ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        } shadow-lg animate-in slide-in-from-top duration-300`}>
          <h3 className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            New Note
          </h3>
          
          <div className="space-y-4">
            <input
              type="text"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              placeholder="Note title"
              className={`w-full px-4 py-3 rounded-xl border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
            
            <input
              type="text"
              value={newNote.tags}
              onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
              placeholder="Tags (comma separated)"
              className={`w-full px-4 py-3 rounded-xl border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="pinned"
                checked={newNote.pinned}
                onChange={(e) => setNewNote({ ...newNote, pinned: e.target.checked })}
                className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
              />
              <label htmlFor="pinned" className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Pin this note
              </label>
            </div>
            
            <textarea
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              placeholder="Note content"
              rows={6}
              className={`w-full px-4 py-3 rounded-xl border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
            
            <div className="flex space-x-3">
              <button
                onClick={addNote}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300"
              >
                Save Note
              </button>
              <button
                onClick={() => setShowNotesForm(false)}
                className={`px-6 py-3 rounded-xl ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === 'diary' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDiaryEntries.length === 0 ? (
            <div className={`col-span-full text-center py-12 rounded-2xl ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            } shadow-lg`}>
              <BookOpen className={`mx-auto mb-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} size={48} />
              <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No diary entries yet
              </p>
            </div>
          ) : (
            filteredDiaryEntries.map((entry) => (
              <div
                key={entry.id}
                className={`group rounded-2xl p-6 transition-all duration-300 ${
                  isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                } shadow-lg hover:shadow-xl transform hover:scale-[1.02]`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getMoodIcon(entry.mood)}
                    <span className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {entry.date.toLocaleDateString()}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => deleteDiaryEntry(entry.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-all duration-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <h3 className={`text-lg font-semibold mb-3 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {entry.title}
                </h3>
                
                <p className={`text-sm leading-relaxed ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {entry.content.length > 150 
                    ? `${entry.content.substring(0, 150)}...` 
                    : entry.content
                  }
                </p>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedNotes.length === 0 ? (
            <div className={`col-span-full text-center py-12 rounded-2xl ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            } shadow-lg`}>
              <StickyNote className={`mx-auto mb-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} size={48} />
              <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No notes yet
              </p>
            </div>
          ) : (
            sortedNotes.map((note) => (
              <div
                key={note.id}
                className={`group rounded-2xl p-6 transition-all duration-300 ${
                  note.pinned
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700'
                    : isDarkMode
                    ? 'bg-gray-800 border border-gray-700'
                    : 'bg-white border border-gray-200'
                } shadow-lg hover:shadow-xl transform hover:scale-[1.02]`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {note.updatedAt.toLocaleDateString()}
                    </span>
                    {note.pinned && (
                      <Pin className="text-yellow-500" size={14} />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => togglePinNote(note.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        note.pinned
                          ? 'text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900'
                          : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {note.pinned ? <PinOff size={16} /> : <Pin size={16} />}
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <h3 className={`text-lg font-semibold mb-3 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {note.title}
                </h3>
                
                <p className={`text-sm leading-relaxed mb-4 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {note.content.length > 150 
                    ? `${note.content.substring(0, 150)}...` 
                    : note.content
                  }
                </p>
                
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 text-xs rounded-full ${
                          isDarkMode
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DiaryNotes;