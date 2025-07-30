import { Task, ScheduleEvent, DiaryEntry, Note, AudioRecording } from '../types';

const STORAGE_KEYS = {
  TASKS: 'productivity_tasks',
  EVENTS: 'productivity_events',
  DIARY: 'productivity_diary',
  NOTES: 'productivity_notes',
  RECORDINGS: 'productivity_recordings',
  THEME: 'productivity_theme'
};

export const storage = {
  // Tasks
  getTasks: (): Task[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!data) return [];
    return JSON.parse(data).map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined
    }));
  },

  saveTasks: (tasks: Task[]) => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  // Schedule Events
  getEvents: (): ScheduleEvent[] => {
    const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!data) return [];
    return JSON.parse(data).map((event: any) => ({
      ...event,
      date: new Date(event.date),
      createdAt: new Date(event.createdAt)
    }));
  },

  saveEvents: (events: ScheduleEvent[]) => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  },

  // Diary Entries
  getDiaryEntries: (): DiaryEntry[] => {
    const data = localStorage.getItem(STORAGE_KEYS.DIARY);
    if (!data) return [];
    return JSON.parse(data).map((entry: any) => ({
      ...entry,
      date: new Date(entry.date),
      createdAt: new Date(entry.createdAt),
      updatedAt: new Date(entry.updatedAt)
    }));
  },

  saveDiaryEntries: (entries: DiaryEntry[]) => {
    localStorage.setItem(STORAGE_KEYS.DIARY, JSON.stringify(entries));
  },

  // Notes
  getNotes: (): Note[] => {
    const data = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (!data) return [];
    return JSON.parse(data).map((note: any) => ({
      ...note,
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt)
    }));
  },

  saveNotes: (notes: Note[]) => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  },

  // Audio Recordings
  getRecordings: (): AudioRecording[] => {
    const data = localStorage.getItem(STORAGE_KEYS.RECORDINGS);
    if (!data) return [];
    return JSON.parse(data).map((recording: any) => ({
      ...recording,
      createdAt: new Date(recording.createdAt)
    }));
  },

  saveRecordings: (recordings: AudioRecording[]) => {
    localStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(recordings));
  },

  // Theme
  getTheme: (): 'light' | 'dark' => {
    return localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark' || 'light';
  },

  saveTheme: (theme: 'light' | 'dark') => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }
};