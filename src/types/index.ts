// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  level: number;
  experience: number;
  achievements: Achievement[];
  following: string[];
  followers: string[];
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'auto';
  notifications: boolean;
  aiEnabled: boolean;
  autoSave: boolean;
  language: string;
  openAIApiKey?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'learning' | 'creation' | 'social' | 'productivity';
}

// Knowledge Types
export interface KnowledgeNode {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  color: string;
  position: { x: number; y: number; z: number };
  connections: string[];
  creator: string;
  createdAt: Date;
  updatedAt: Date;
  media: Media[];
  isPublic: boolean;
  views: number;
  likes: number;
}

export interface KnowledgeConnection {
  id: string;
  sourceNode: string;
  targetNode: string;
  relationship: string;
  strength: number;
}

// Content Types
export interface Content {
  id: string;
  type: 'video' | 'note' | 'quiz' | 'knowledge';
  title: string;
  description: string;
  media: Media[];
  creator: string;
  likes: number;
  comments: Comment[];
  shares: number;
  tags: string[];
  relatedNodes: string[];
  createdAt: Date;
  updatedAt: Date;
  duration?: number;
  views: number;
}

export interface Media {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  thumbnail?: string;
  duration?: number;
  size: number;
  mimeType: string;
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
  likes: number;
  replies: Comment[];
}

// Quiz Types
export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: number;
  creator: string;
  category: string;
  tags: string[];
  createdAt: Date;
  attempts: number;
  averageScore: number;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'open-ended';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  totalPoints: number;
  timeSpent: number;
  answers: QuizAnswer[];
  completedAt: Date;
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  timeSpent: number;
}

// Productivity Types
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  category: string;
  tags: string[];
  relatedNodes?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  media: Media[];
  relatedNodes?: string[];
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
}

export interface FocusSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  category: string;
  notes?: string;
  productivity: number;
}

// Social Types
export interface FeedItem {
  id: string;
  type: 'video' | 'note' | 'quiz' | 'achievement';
  content: Content;
  creator: User;
  interactions: {
    likes: number;
    comments: number;
    shares: number;
    isLiked: boolean;
    isSaved: boolean;
  };
  timestamp: Date;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  members: string[];
  admins: string[];
  topics: string[];
  createdAt: Date;
  isPrivate: boolean;
  maxMembers: number;
}

// Navigation Types
export type RootStackParamList = {
  Home: undefined;
  Learn: undefined;
  Create: undefined;
  Discover: undefined;
  Profile: undefined;
  KnowledgeNode: { nodeId: string };
  ContentDetail: { contentId: string };
  Quiz: { quizId: string };
  UserProfile: { userId: string };
  CreateContent: { type: 'video' | 'note' | 'quiz' };
  Settings: undefined;
};

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// AI Types
export interface AIRequest {
  prompt: string;
  context?: string;
  type: 'generate' | 'enhance' | 'summarize' | 'quiz';
  options?: {
    maxLength?: number;
    tone?: string;
    difficulty?: string;
  };
}

export interface AIResponse {
  content: string;
  suggestions?: string[];
  confidence: number;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
} 