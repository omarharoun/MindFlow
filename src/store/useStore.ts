import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, KnowledgeNode, Content, Task, Note, Quiz } from '../types';

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Knowledge state
  knowledgeNodes: KnowledgeNode[];
  selectedNode: KnowledgeNode | null;
  
  // Content state
  feedItems: Content[];
  savedContent: Content[];
  
  // Productivity state
  tasks: Task[];
  notes: Note[];
  focusSessions: any[];
  
  // Quiz state
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  quizHistory: any[];
  
  // UI state
  currentTab: 'home' | 'learn' | 'create' | 'discover' | 'profile';
  theme: 'dark' | 'light' | 'auto';
  notifications: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  
  // Knowledge actions
  addKnowledgeNode: (node: KnowledgeNode) => void;
  updateKnowledgeNode: (id: string, updates: Partial<KnowledgeNode>) => void;
  deleteKnowledgeNode: (id: string) => void;
  setSelectedNode: (node: KnowledgeNode | null) => void;
  connectNodes: (sourceId: string, targetId: string, relationship?: string) => void;
  disconnectNodes: (sourceId: string, targetId: string) => void;
  likeKnowledgeNode: (nodeId: string) => void;
  viewKnowledgeNode: (nodeId: string) => void;
  
  // Content actions
  addFeedItem: (content: Content) => void;
  likeContent: (contentId: string) => void;
  saveContent: (contentId: string) => void;
  shareContent: (contentId: string) => void;
  
  // Productivity actions
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  
  // Quiz actions
  addQuiz: (quiz: Quiz) => void;
  setCurrentQuiz: (quiz: Quiz | null) => void;
  addQuizAttempt: (attempt: any) => void;
  
  // UI actions
  setCurrentTab: (tab: 'home' | 'learn' | 'create' | 'discover' | 'profile') => void;
  setTheme: (theme: 'dark' | 'light' | 'auto') => void;
  setNotifications: (enabled: boolean) => void;
  
  // Experience and leveling
  addExperience: (amount: number) => void;
  unlockAchievement: (achievement: any) => void;
  
  // Reset
  resetStore: () => void;
  
  // Add to AppState interface
  openAIApiKey?: string;
  setOpenAIApiKey: (key: string) => void;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  knowledgeNodes: [],
  selectedNode: null,
  feedItems: [],
  savedContent: [],
  tasks: [],
  notes: [],
  focusSessions: [],
  quizzes: [],
  currentQuiz: null,
  quizHistory: [],
  currentTab: 'home' as const,
  theme: 'dark' as const,
  notifications: true,
  openAIApiKey: '',
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // User actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLoading: (isLoading) => set({ isLoading }),
      
      // Knowledge actions
      addKnowledgeNode: (node) => 
        set((state) => ({ 
          knowledgeNodes: [...state.knowledgeNodes, node] 
        })),
      
      updateKnowledgeNode: (id, updates) =>
        set((state) => ({
          knowledgeNodes: state.knowledgeNodes.map(node =>
            node.id === id ? { ...node, ...updates } : node
          ),
        })),
      
      deleteKnowledgeNode: (id) =>
        set((state) => ({
          knowledgeNodes: state.knowledgeNodes.filter(node => node.id !== id),
        })),
      
      setSelectedNode: (node) => set({ selectedNode: node }),
      
      connectNodes: (sourceId, targetId, relationship) =>
        set((state) => ({
          knowledgeNodes: state.knowledgeNodes.map(node =>
            node.id === sourceId ? { ...node, connections: [...node.connections, targetId] } : node
          ),
        })),
      
      disconnectNodes: (sourceId, targetId) =>
        set((state) => ({
          knowledgeNodes: state.knowledgeNodes.map(node =>
            node.id === sourceId ? { ...node, connections: node.connections.filter(c => c !== targetId) } : node
          ),
        })),
      
      likeKnowledgeNode: (nodeId) =>
        set((state) => ({
          knowledgeNodes: state.knowledgeNodes.map(node =>
            node.id === nodeId ? { ...node, likes: node.likes + 1 } : node
          ),
        })),
      
      viewKnowledgeNode: (nodeId) =>
        set((state) => ({
          knowledgeNodes: state.knowledgeNodes.map(node =>
            node.id === nodeId ? { ...node, views: node.views + 1 } : node
          ),
        })),
      
      // Content actions
      addFeedItem: (content) =>
        set((state) => ({
          feedItems: [content, ...state.feedItems],
        })),
      
      likeContent: (contentId) =>
        set((state) => ({
          feedItems: state.feedItems.map(item =>
            item.id === contentId
              ? { ...item, likes: item.likes + 1 }
              : item
          ),
        })),
      
      saveContent: (contentId) => {
        const state = get();
        const content = state.feedItems.find(item => item.id === contentId);
        if (content && !state.savedContent.find(saved => saved.id === contentId)) {
          set((state) => ({
            savedContent: [...state.savedContent, content],
          }));
        }
      },
      
      shareContent: (contentId) =>
        set((state) => ({
          feedItems: state.feedItems.map(item =>
            item.id === contentId
              ? { ...item, shares: item.shares + 1 }
              : item
          ),
        })),
      
      // Productivity actions
      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, task],
        })),
      
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map(task =>
            task.id === id ? { ...task, ...updates } : task
          ),
        })),
      
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter(task => task.id !== id),
        })),
      
      completeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map(task =>
            task.id === id ? { ...task, completed: true } : task
          ),
        })),
      
      addNote: (note) =>
        set((state) => ({
          notes: [...state.notes, note],
        })),
      
      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map(note =>
            note.id === id ? { ...note, ...updates } : note
          ),
        })),
      
      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter(note => note.id !== id),
        })),
      
      // Quiz actions
      addQuiz: (quiz) =>
        set((state) => ({
          quizzes: [...state.quizzes, quiz],
        })),
      
      setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
      
      addQuizAttempt: (attempt) =>
        set((state) => ({
          quizHistory: [...state.quizHistory, attempt],
        })),
      
      // UI actions
      setCurrentTab: (tab) => set({ currentTab: tab }),
      setTheme: (theme) => set({ theme }),
      setNotifications: (notifications) => set({ notifications }),
      
      // Experience and leveling
      addExperience: (amount) =>
        set((state) => {
          if (!state.user) return state;
          
          const newExperience = state.user.experience + amount;
          const newLevel = Math.floor(newExperience / 1000) + 1;
          
          return {
            user: {
              ...state.user,
              experience: newExperience,
              level: newLevel,
            },
          };
        }),
      
      unlockAchievement: (achievement) =>
        set((state) => {
          if (!state.user) return state;
          
          const hasAchievement = state.user.achievements.some(
            (a) => a.id === achievement.id
          );
          
          if (hasAchievement) return state;
          
          return {
            user: {
              ...state.user,
              achievements: [...state.user.achievements, achievement],
            },
          };
        }),
      
      // Reset
      resetStore: () => set(initialState),
      
      // Add to AppState interface
      setOpenAIApiKey: (key) => set({ openAIApiKey: key }),
    }),
    {
      name: 'mindflow-storage',
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
); 