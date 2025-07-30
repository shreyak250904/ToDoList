export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  mood: 'happy' | 'neutral' | 'sad' | 'excited' | 'stressed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AudioRecording {
  id: string;
  name: string;
  url: string;
  duration: number;
  createdAt: Date;
}

export type AppView = 'dashboard' | 'todo' | 'schedule' | 'diary' | 'notes' | 'audio';