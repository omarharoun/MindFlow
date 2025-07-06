import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  Alert,
  TextInput,
  FlatList,
  RefreshControl,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  FileText,
  CheckSquare,
  Calendar,
  Camera,
  Video,
  BookOpen,
  Zap,
  TrendingUp,
  Clock,
  Bell,
  Plus,
  Target,
  Award,
  X,
  Trash2,
  Edit3,
  Check,
  Home,
  Grid,
  Bookmark,
  User,
  Settings,
  Compass,
} from 'lucide-react-native';
import { useStore } from '../store/useStore';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface DashboardTileProps {
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  gradientColors: string[];
  onPress: () => void;
  size?: 'small' | 'large';
  style?: any;
}

const DashboardTile: React.FC<DashboardTileProps> = ({
  title,
  subtitle,
  icon: Icon,
  gradientColors,
  onPress,
  size = 'small',
  style,
}) => (
  <TouchableOpacity
    style={[
      styles.tile,
      size === 'large' && styles.largeTile,
      style,
    ]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <LinearGradient
      colors={gradientColors}
      style={styles.tileGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Icon size={size === 'large' ? 32 : 24} color="#FFFFFF" strokeWidth={2} />
      <Text style={styles.tileTitle}>{title}</Text>
      <Text style={styles.tileSubtitle}>{subtitle}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

// Add Event interface
interface Event {
  id: string;
  title: string;
  description?: string;
  date: Date;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const HomeDashboard: React.FC = () => {
  const { user, tasks, notes, knowledgeNodes, events, addTask, addNote, addEvent, updateTask, deleteTask, addExperience } = useStore();
  const [notifications] = useState(3);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showQuickTasksModal, setShowQuickTasksModal] = useState(false);
  const [showNoteDetailModal, setShowNoteDetailModal] = useState(false);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
  const [showEventDetailModal, setShowEventDetailModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskDueTime, setTaskDueTime] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [eventDueDate, setEventDueDate] = useState('');
  const [eventDueTime, setEventDueTime] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showTaskDatePicker, setShowTaskDatePicker] = useState(false);
  const [showTaskTimePicker, setShowTaskTimePicker] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [selectedTaskDateTime, setSelectedTaskDateTime] = useState(new Date());
  const router = useRouter();

  // Real-time data updates
  const [realTimeData, setRealTimeData] = useState({
    tasks: tasks,
    notes: notes,
    knowledgeNodes: knowledgeNodes,
    events: events
  });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Quick Actions Component
  const QuickActionsBar = () => (
    <View style={styles.quickActionsContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickActionsScroll}
      >
        <TouchableOpacity 
          style={styles.quickActionButton} 
          onPress={() => setShowTaskModal(true)}
        >
          <Plus size={16} color="#3B82F6" strokeWidth={2} />
          <Text style={styles.quickActionText}>Quick Task</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionButton} 
          onPress={() => setShowNoteModal(true)}
        >
          <FileText size={16} color="#10B981" strokeWidth={2} />
          <Text style={styles.quickActionText}>New Note</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionButton} 
          onPress={() => router.push('/(tabs)/learn')}
        >
          <BookOpen size={16} color="#F59E0B" strokeWidth={2} />
          <Text style={styles.quickActionText}>Learn</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionButton} 
          onPress={() => router.push('/(tabs)/discover')}
        >
          <Compass size={16} color="#8B5CF6" strokeWidth={2} />
          <Text style={styles.quickActionText}>Discover</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionButton} 
          onPress={() => setShowQuickTasksModal(true)}
        >
          <Zap size={16} color="#EF4444" strokeWidth={2} />
          <Text style={styles.quickActionText}>Quick Tasks</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  // Progress Tracking Widget
  const ProgressWidget = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const completedNotes = notes.length;
    const knowledgeCount = knowledgeNodes.length;
    const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Your Progress</Text>
          <Award size={20} color="#F59E0B" strokeWidth={2} />
        </View>
        
        <View style={styles.progressStats}>
          <View style={styles.progressStat}>
            <Text style={styles.progressStatNumber}>{completedTasks}</Text>
            <Text style={styles.progressStatLabel}>Tasks Done</Text>
          </View>
          
          <View style={styles.progressStat}>
            <Text style={styles.progressStatNumber}>{completedNotes}</Text>
            <Text style={styles.progressStatLabel}>Notes Created</Text>
          </View>
          
          <View style={styles.progressStat}>
            <Text style={styles.progressStatNumber}>{knowledgeCount}</Text>
            <Text style={styles.progressStatLabel}>Knowledge Nodes</Text>
          </View>
        </View>
        
        <View style={styles.progressBarContainer}>
          <Text style={styles.progressBarLabel}>Task Completion</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${taskProgress}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressBarText}>{Math.round(taskProgress)}%</Text>
        </View>
      </View>
    );
  };

  // Weather and Time Widget
  const WeatherTimeWidget = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    
    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      
      return () => clearInterval(timer);
    }, []);
    
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    };
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });
    };
    
    return (
      <View style={styles.weatherTimeContainer}>
        <View style={styles.timeSection}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Text style={styles.dateText}>{formatDate(currentTime)}</Text>
        </View>
        
        <View style={styles.weatherSection}>
          <Text style={styles.weatherText}>☀️ 72°F</Text>
          <Text style={styles.weatherLocation}>San Francisco</Text>
        </View>
      </View>
    );
  };

  // Update real-time data when store changes
  useEffect(() => {
    setRealTimeData({
      tasks,
      notes,
      knowledgeNodes,
      events
    });
    setLastUpdated(new Date());
  }, [tasks, notes, knowledgeNodes, events]);

  // Auto-refresh data every 30 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      setRealTimeData({
        tasks,
        notes,
        knowledgeNodes,
        events
      });
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 30000);

    return () => clearInterval(interval);
  }, [tasks, notes, knowledgeNodes, events]);

  // Manual refresh function
  const handleRefresh = () => {
    setIsRefreshing(true);
    setRealTimeData({
      tasks,
      notes,
      knowledgeNodes,
      events
    });
    setLastUpdated(new Date());
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Detail modal handlers
  const showNoteDetail = (note: any) => {
    setSelectedNote(note);
    setShowNoteDetailModal(true);
  };

  const showTaskDetail = (task: any) => {
    setSelectedTask(task);
    setShowTaskDetailModal(true);
  };

  const showEventDetail = (event: any) => {
    setSelectedEvent(event);
    setShowEventDetailModal(true);
  };

  // Date and Time picker handlers
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDateTime(selectedDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDateTime = new Date(selectedDateTime);
      newDateTime.setHours(selectedTime.getHours());
      newDateTime.setMinutes(selectedTime.getMinutes());
      setSelectedDateTime(newDateTime);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const showTimePickerModal = () => {
    setShowTimePicker(true);
  };

  // Task Date and Time picker handlers
  const onTaskDateChange = (event: any, selectedDate?: Date) => {
    setShowTaskDatePicker(false);
    if (selectedDate) {
      setSelectedTaskDateTime(selectedDate);
    }
  };

  const onTaskTimeChange = (event: any, selectedTime?: Date) => {
    setShowTaskTimePicker(false);
    if (selectedTime) {
      const newDateTime = new Date(selectedTaskDateTime);
      newDateTime.setHours(selectedTime.getHours());
      newDateTime.setMinutes(selectedTime.getMinutes());
      setSelectedTaskDateTime(newDateTime);
    }
  };

  const showTaskDatePickerModal = () => {
    setShowTaskDatePicker(true);
  };

  const showTaskTimePickerModal = () => {
    setShowTaskTimePicker(true);
  };

  // Predefined quick tasks
  const quickTasks = [
    {
      id: 'quick-1',
      title: 'Review emails',
      description: 'Check and respond to important emails',
      priority: 'medium' as const,
      category: 'Work',
      tags: ['email', 'communication']
    },
    {
      id: 'quick-2',
      title: 'Daily planning',
      description: 'Plan tasks and goals for today',
      priority: 'high' as const,
      category: 'Planning',
      tags: ['planning', 'daily']
    },
    {
      id: 'quick-3',
      title: 'Exercise',
      description: '30 minutes of physical activity',
      priority: 'medium' as const,
      category: 'Health',
      tags: ['health', 'fitness']
    },
    {
      id: 'quick-4',
      title: 'Read 30 minutes',
      description: 'Read a book or article for learning',
      priority: 'low' as const,
      category: 'Learning',
      tags: ['reading', 'learning']
    },
    {
      id: 'quick-5',
      title: 'Call family',
      description: 'Check in with family members',
      priority: 'medium' as const,
      category: 'Personal',
      tags: ['family', 'communication']
    },
    {
      id: 'quick-6',
      title: 'Organize workspace',
      description: 'Clean and organize your work area',
      priority: 'low' as const,
      category: 'Organization',
      tags: ['organization', 'cleanup']
    }
  ];

  const handleAddItem = (type: 'task' | 'note' | 'event' | 'knowledge' | 'read') => {
    setShowAddMenu(false);
    
    switch (type) {
      case 'task':
        setShowQuickTasksModal(true);
        break;
        
      case 'note':
        setShowNoteModal(true);
        break;
        
      case 'event':
        setShowEventModal(true);
        break;
        
      case 'knowledge':
        router.push('/(tabs)/learn');
        break;
        
      case 'read':
        router.push('/(tabs)/notes');
        break;
    }
  };

  const handleQuickTask = (quickTask: typeof quickTasks[0]) => {
    const newTask = {
      id: Date.now().toString(),
      title: quickTask.title,
      description: quickTask.description,
      completed: false,
      priority: quickTask.priority,
      category: quickTask.category,
      tags: quickTask.tags,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    addTask(newTask);
    addExperience(10);
    setShowQuickTasksModal(false);
    Alert.alert('Quick Task Added', `"${quickTask.title}" has been added to your tasks!`);
  };

  const handleSaveNote = () => {
    if (!noteTitle.trim()) {
      Alert.alert('Error', 'Please enter a title for your note.');
      return;
    }
    
    const newNote = {
      id: Date.now().toString(),
      title: noteTitle,
      content: noteContent,
      category: 'General',
      tags: [],
      media: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
    };
    
    addNote(newNote);
    addExperience(10);
    setNoteTitle('');
    setNoteContent('');
    setShowNoteModal(false);
    Alert.alert('Note Saved', 'Your note has been saved successfully!');
  };

  const handleSaveTask = () => {
    if (!taskTitle.trim()) {
      Alert.alert('Error', 'Please enter a title for your task.');
      return;
    }
    
    const newTask = {
      id: Date.now().toString(),
      title: taskTitle,
      description: taskDescription,
      completed: false,
      priority: taskPriority,
      category: 'General',
      tags: [],
      dueDate: taskDueDate ? selectedTaskDateTime : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    addTask(newTask);
    addExperience(10);
    setTaskTitle('');
    setTaskDescription('');
    setTaskPriority('medium');
    setTaskDueDate('');
    setTaskDueTime('');
    setSelectedTaskDateTime(new Date());
    setShowTaskModal(false);
    Alert.alert('Task Added', 'Your task has been added successfully!');
  };

  const handleSaveEvent = () => {
    if (!eventTitle.trim()) {
      Alert.alert('Error', 'Please enter a title for your event.');
      return;
    }

    if (!eventDueDate.trim() || !eventDueTime.trim()) {
      Alert.alert('Error', 'Please select both date and time for your event.');
      return;
    }

    const newEvent: Event = {
      id: Date.now().toString(),
      title: eventTitle,
      description: eventDescription,
      date: selectedDateTime,
      category: 'General',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    addEvent(newEvent);
    addExperience(15);
    setEventTitle('');
    setEventDescription('');
    setEventDueDate('');
    setEventDueTime('');
    setSelectedDateTime(new Date());
    setShowEventModal(false);
    Alert.alert('Event Created', 'Your event has been created successfully!');
  };

  const handleCompleteTask = (taskId: string) => {
    updateTask(taskId, { completed: true });
    addExperience(5);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const handleCompleteAllTasks = () => {
    const pendingTasks = tasks.filter(task => !task.completed);
    pendingTasks.forEach(task => {
      updateTask(task.id, { completed: true });
    });
    addExperience(pendingTasks.length * 5);
    Alert.alert('Tasks Completed', `Completed ${pendingTasks.length} tasks!`);
  };

  const handleTilePress = (title: string) => {
    switch (title) {
      case 'New Note':
        setShowNoteModal(true);
        break;
      case 'Tasks':
        setShowQuickTasksModal(true);
        break;
      case 'Knowledge':
        router.push('/(tabs)/learn');
        break;
      case 'Add':
        setShowAddMenu(true);
        break;
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#FF3B30';
      case 'medium': return '#FF9500';
      case 'low': return '#34C759';
      default: return '#FF9500';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const pendingTasks = realTimeData.tasks.filter(task => !task.completed);
  const recentNotes = realTimeData.notes.slice(0, 3);
  const recentNodes = realTimeData.knowledgeNodes.slice(0, 3);
  const recentEvents = realTimeData.events.slice(0, 3);

  const { width } = useWindowDimensions();

  // Responsive columns for quick actions and recent items
  const quickActionColumns = width > 900 ? 4 : width > 600 ? 3 : 2;
  const recentColumns = width > 900 ? 4 : width > 600 ? 3 : 2;
  const tileMargin = 8;
  const tileWidth = (width - (tileMargin * (quickActionColumns + 1))) / quickActionColumns;
  const recentItemWidth = (width - (tileMargin * (recentColumns + 1))) / recentColumns;

  const FloatingAddMenu = () => {
    const [open, setOpen] = useState(false);
    const { width } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    // Use the same size as the chatbot button, but clamp for web
    const fabSize = Math.min(Math.round(width * 0.11), 56); // clamp to 56px max
    const iconSize = Math.min(Math.round(width * 0.06), 28); // clamp to 28px max
    const buttonGap = Math.round(width * 0.03);
    const bottomOffset = insets.bottom + 80; // directly above chatbot button
    const rightOffset = insets.right + 24;

    // Action handlers for each menu item
    const handleMenuAction = (action: string) => {
      setOpen(false);
      switch (action) {
        case 'task': setShowTaskModal(true); break;
        case 'note': setShowNoteModal(true); break;
        case 'event': setShowEventModal(true); break;
        case 'knowledge': router.push('/(tabs)/learn'); break;
        case 'read': router.push('/(tabs)/notes'); break;
        default: break;
      }
    };

    // Menu buttons: icon, key, label, and action
    const buttons = [
      { icon: <Target size={iconSize} color="#222" />, key: 'task', label: 'Task' },
      { icon: <FileText size={iconSize} color="#34C759" />, key: 'note', label: 'Note' },
      { icon: <Calendar size={iconSize} color="#AF52DE" />, key: 'event', label: 'Event' },
      { icon: <BookOpen size={iconSize} color="#FF9500" />, key: 'knowledge', label: 'Knowledge' },
      { icon: <FileText size={iconSize} color="#FF3B30" />, key: 'read', label: 'Read' },
    ];

    return (
      <>
        <View
          style={[
            styles.menuContainer,
            {
              width: fabSize,
              height: fabSize * (buttons.length + 1) + buttonGap * buttons.length,
              bottom: bottomOffset,
              right: rightOffset,
              alignItems: 'center',
              justifyContent: 'flex-end',
            },
          ]}
          pointerEvents="box-none"
        >
          {/* Menu buttons, unfold upwards in a vertical list (overlapping/absolute) */}
          {buttons.map((btn, i) => (
            <TouchableOpacity
              key={btn.key}
              style={[
                styles.menuButton,
                {
                  width: fabSize,
                  height: fabSize,
                  borderRadius: fabSize / 2,
                  position: 'absolute',
                  left: 0,
                  bottom: open ? (fabSize + buttonGap) * (i + 1) : 0,
                  opacity: open ? 1 : 0,
                  backgroundColor: 'transparent',
                  overflow: 'hidden',
                  borderWidth: 2,
                  borderColor: '#fff',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 3,
                  elevation: 6,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
              activeOpacity={0.8}
              onPress={() => handleMenuAction(btn.key)}
            >
              {btn.icon}
            </TouchableOpacity>
          ))}
          {/* Add button always at bottom right, on top of chatbot button */}
          <TouchableOpacity
            style={[
              styles.fab,
              {
                width: fabSize,
                height: fabSize,
                borderRadius: fabSize / 2,
                backgroundColor: 'transparent',
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                left: 0,
                bottom: 0,
                zIndex: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 8,
                borderWidth: 2,
                borderColor: '#fff',
              },
            ]}
            onPress={() => setOpen(!open)}
            activeOpacity={0.8}
          >
            {open ? <X size={iconSize + 4} color="#fff" /> : <Plus size={iconSize + 4} color="#fff" />}
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#334155']}
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{user?.username || 'Learner'}</Text>
            <View style={styles.levelInfo}>
              <Text style={styles.levelText}>Level {user?.level || 1}</Text>
              <View style={styles.xpBar}>
                <View 
                  style={[
                    styles.xpProgress, 
                    { width: `${((user?.experience || 0) % 1000) / 10}%` }
                  ]} 
                />
              </View>
              <Text style={styles.xpText}>{user?.experience || 0} XP</Text>
            </View>
            {/* Real-time indicator */}
            <View style={styles.realTimeIndicator}>
              <View style={[styles.realTimeDot, { backgroundColor: isRefreshing ? '#FFD700' : '#34C759' }]} />
              <Text style={styles.realTimeText}>
                {isRefreshing ? 'Updating...' : `Live • Updated ${formatTime(lastUpdated)}`}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton} onPress={() => setShowNotifications(true)}>
            <Bell size={24} color="#FFFFFF" strokeWidth={2} />
            {notifications > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>{notifications}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Notifications Modal */}
        <Modal visible={showNotifications} animationType="slide" transparent onRequestClose={() => setShowNotifications(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.notificationsModal}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.modalTitle}>Notifications</Text>
                <TouchableOpacity onPress={() => setShowNotifications(false)}>
                  <X size={28} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={{ marginTop: 16 }}>
                <Text style={{ color: '#fff', marginBottom: 8 }}>• You have {pendingTasks.length} tasks pending</Text>
                <Text style={{ color: '#fff', marginBottom: 8 }}>• {notes.length} notes created</Text>
                <Text style={{ color: '#fff' }}>• {knowledgeNodes.length} knowledge nodes</Text>
              </View>
            </View>
          </View>
        </Modal>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
        >
          {/* Quick Actions Grid */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.recentRow}>
            {[
              { title: 'New Note', subtitle: 'Quick capture', icon: FileText, gradientColors: ['#007AFF', '#0056CC'], onPress: () => handleTilePress('New Note') },
              { title: 'Tasks', subtitle: `${pendingTasks.length} pending`, icon: CheckSquare, gradientColors: ['#34C759', '#28A745'], onPress: () => handleTilePress('Tasks') },
              { title: 'Knowledge', subtitle: `${realTimeData.knowledgeNodes.length} nodes`, icon: BookOpen, gradientColors: ['#AF52DE', '#9A4BCF'], onPress: () => handleTilePress('Knowledge') },
              { title: 'Events', subtitle: `${realTimeData.events.length} scheduled`, icon: Calendar, gradientColors: ['#FFD700', '#FFB300'], onPress: () => setShowEventModal(true) },
            ].map((tile, idx) => (
              <View key={tile.title} style={{ flex: 1, minWidth: 140, maxWidth: 280, margin: 8 }}>
                <DashboardTile
                  title={tile.title}
                  subtitle={tile.subtitle}
                  icon={tile.icon}
                  gradientColors={tile.gradientColors}
                  onPress={tile.onPress}
                  size="large"
                  style={{ width: '100%', height: 'auto' }}
                />
              </View>
            ))}
          </View>

          {/* Quick Actions Bar */}
          <QuickActionsBar />

          {/* Progress Tracking Widget */}
          <ProgressWidget />

          {/* Weather and Time Widget */}
          <WeatherTimeWidget />

          {/* Recent Activity - Notes Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Notes</Text>
            <View style={styles.sectionActions}>
              <TouchableOpacity style={styles.addNewButton} onPress={() => setShowNoteModal(true)}>
                <Plus size={16} color="#007AFF" />
                <Text style={styles.addNewText}>Add New</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.viewAllButton} onPress={() => router.push('/(tabs)/notes')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.recentRow}>
            {recentNotes.map((note, idx) => (
              <View key={note.id} style={{ flex: 1, minWidth: 140, maxWidth: 260, margin: 8 }}>
                <TouchableOpacity style={[styles.activityCard, { width: '100%', marginRight: 0 }]} onPress={() => showNoteDetail(note)}>
                  <View style={styles.cardHeader}>
                    <FileText size={16} color="#007AFF" />
                    <Text style={styles.cardType}>Note</Text>
                  </View>
                  <Text style={styles.cardTitle}>{note.title}</Text>
                  <Text style={styles.cardSubtitle}>{note.content.substring(0, 50)}...</Text>
                  <Text style={styles.cardTime}>{formatDate(note.updatedAt)}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Recent Activity - Tasks Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pending Tasks</Text>
            <View style={styles.sectionActions}>
              <TouchableOpacity style={styles.addNewButton} onPress={() => setShowQuickTasksModal(true)}>
                <Plus size={16} color="#34C759" />
                <Text style={[styles.addNewText, { color: '#34C759' }]}>Add New</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.viewAllButton} onPress={() => setShowQuickTasksModal(true)}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
          </View>
          {pendingTasks.length > 0 ? (
            <View style={styles.activitySection}>
              {pendingTasks.slice(0, 3).map(task => (
                <TouchableOpacity key={task.id} style={styles.taskCard} onPress={() => showTaskDetail(task)}>
                  <View style={styles.taskHeader}>
                    <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(task.priority) }]} />
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <TouchableOpacity onPress={(e) => {
                      e.stopPropagation();
                      handleCompleteTask(task.id);
                    }}>
                      <Check size={20} color="#34C759" />
                    </TouchableOpacity>
                  </View>
                  {task.description && (
                    <Text style={styles.taskDescription}>{task.description}</Text>
                  )}
                  <Text style={styles.cardTime}>{formatDate(task.createdAt)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <TouchableOpacity style={styles.emptyStateCard} onPress={() => setShowQuickTasksModal(true)}>
              <CheckSquare size={24} color="#34C759" />
              <Text style={styles.emptyStateText}>No pending tasks</Text>
              <Text style={styles.emptyStateSubtext}>Tap to add your first task</Text>
            </TouchableOpacity>
          )}

          {/* Recent Activity - Knowledge Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Knowledge</Text>
            <TouchableOpacity style={styles.addNewButton} onPress={() => router.push('/(tabs)/learn')}>
              <Plus size={16} color="#AF52DE" />
              <Text style={styles.addNewText}>Add New</Text>
            </TouchableOpacity>
          </View>
          {recentNodes.length > 0 ? (
            <View style={styles.recentRow}> 
              {recentNodes.map((node, idx) => (
                <View key={node.id} style={{ flex: 1, minWidth: 140, maxWidth: 260, margin: 8 }}>
                  <TouchableOpacity style={[styles.activityCard, { width: '100%', marginRight: 0 }]} onPress={() => {
                    // Navigate to knowledge node detail
                    router.push('/(tabs)/learn');
                  }}>
                    <View style={styles.cardHeader}>
                      <BookOpen size={16} color="#AF52DE" />
                      <Text style={styles.cardType}>Knowledge</Text>
                    </View>
                    <Text style={styles.cardTitle}>{node.title}</Text>
                    <Text style={styles.cardSubtitle}>{node.content.substring(0, 50)}...</Text>
                    <Text style={styles.cardTime}>{formatDate(node.updatedAt)}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <TouchableOpacity style={styles.emptyStateCard} onPress={() => router.push('/(tabs)/learn')}>
              <BookOpen size={24} color="#AF52DE" />
              <Text style={styles.emptyStateText}>No knowledge nodes yet</Text>
              <Text style={styles.emptyStateSubtext}>Tap to explore the knowledge map</Text>
            </TouchableOpacity>
          )}

          {/* Recent Activity - Events Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Events</Text>
            <View style={styles.sectionActions}>
              <TouchableOpacity style={styles.addNewButton} onPress={() => setShowEventModal(true)}>
                <Plus size={16} color="#FFD700" />
                <Text style={[styles.addNewText, { color: '#FFD700' }]}>Add New</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.viewAllButton} onPress={() => setShowEventModal(true)}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
          </View>
          {recentEvents.length > 0 ? (
            <ScrollView 
              style={styles.eventsScrollView}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.eventsScrollContent}
              decelerationRate="fast"
              snapToInterval={292}
              snapToAlignment="start"
            >
              {recentEvents.map(event => (
                <TouchableOpacity key={event.id} style={styles.activityCard} onPress={() => showEventDetail(event)}>
                  <View style={styles.cardHeader}>
                    <Calendar size={16} color="#FFD700" />
                    <Text style={styles.cardType}>Event</Text>
                  </View>
                  <Text style={styles.cardTitle}>{event.title}</Text>
                  {event.description && (
                    <Text style={styles.cardSubtitle}>{event.description.substring(0, 50)}...</Text>
                  )}
                  <Text style={styles.cardTime}>{formatDate(event.date)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <TouchableOpacity style={styles.emptyStateCard} onPress={() => setShowEventModal(true)}>
              <Calendar size={24} color="#FFD700" />
              <Text style={styles.emptyStateText}>No events scheduled</Text>
              <Text style={styles.emptyStateSubtext}>Tap to schedule your first event</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* Floating Add Button */}
        <FloatingAddMenu />

        {/* Add Menu Modal */}
        <Modal visible={showAddMenu} animationType="slide" transparent onRequestClose={() => setShowAddMenu(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.addModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New</Text>
                <TouchableOpacity onPress={() => setShowAddMenu(false)}>
                  <X size={28} color="#fff" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.addOptions}>
                <TouchableOpacity style={styles.addOption} onPress={() => handleAddItem('task')}>
                  <Target size={32} color="#007AFF" />
                  <Text style={styles.addOptionText}>Task</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addOption} onPress={() => handleAddItem('note')}>
                  <FileText size={32} color="#34C759" />
                  <Text style={styles.addOptionText}>Note</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addOption} onPress={() => handleAddItem('event')}>
                  <Calendar size={32} color="#AF52DE" />
                  <Text style={styles.addOptionText}>Event</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addOption} onPress={() => handleAddItem('knowledge')}>
                  <BookOpen size={32} color="#FF9500" />
                  <Text style={styles.addOptionText}>Knowledge</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addOption} onPress={() => handleAddItem('read')}>
                  <FileText size={32} color="#FF3B30" />
                  <Text style={styles.addOptionText}>Read</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Note Creation Modal */}
        <Modal visible={showNoteModal} animationType="slide" transparent onRequestClose={() => setShowNoteModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.noteModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create Note</Text>
                <TouchableOpacity onPress={() => setShowNoteModal(false)}>
                  <X size={28} color="#fff" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalContent}>
                <TextInput
                  style={styles.noteInput}
                  placeholder="Note title..."
                  value={noteTitle}
                  onChangeText={setNoteTitle}
                  placeholderTextColor="#888"
                />
                <TextInput
                  style={[styles.noteInput, styles.noteContentInput]}
                  placeholder="Note content..."
                  value={noteContent}
                  onChangeText={setNoteContent}
                  multiline
                  placeholderTextColor="#888"
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setShowNoteModal(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveNote}>
                  <Text style={styles.saveButtonText}>Save Note</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Task Creation Modal */}
        <Modal visible={showTaskModal} animationType="slide" transparent onRequestClose={() => setShowTaskModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.taskModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create Task</Text>
                <TouchableOpacity onPress={() => setShowTaskModal(false)}>
                  <X size={28} color="#fff" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalContent}>
                <TextInput
                  style={styles.taskInput}
                  placeholder="Task title..."
                  value={taskTitle}
                  onChangeText={setTaskTitle}
                  placeholderTextColor="#888"
                />
                <TextInput
                  style={[styles.taskInput, styles.taskDescriptionInput]}
                  placeholder="Description (optional)..."
                  value={taskDescription}
                  onChangeText={setTaskDescription}
                  multiline
                  placeholderTextColor="#888"
                />
                <View style={styles.prioritySelector}>
                  <Text style={styles.priorityLabel}>Priority:</Text>
                  <View style={styles.priorityButtons}>
                    <TouchableOpacity 
                      style={[
                        styles.priorityButton, 
                        taskPriority === 'low' && styles.priorityButtonActive
                      ]}
                      onPress={() => setTaskPriority('low')}
                    >
                      <Text style={styles.priorityButtonText}>Low</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[
                        styles.priorityButton, 
                        taskPriority === 'medium' && styles.priorityButtonActive
                      ]}
                      onPress={() => setTaskPriority('medium')}
                    >
                      <Text style={styles.priorityButtonText}>Medium</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[
                        styles.priorityButton, 
                        taskPriority === 'high' && styles.priorityButtonActive
                      ]}
                      onPress={() => setTaskPriority('high')}
                    >
                      <Text style={styles.priorityButtonText}>High</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Due Date Picker */}
                <View style={styles.pickerContainer}>
                  <Text style={styles.pickerLabel}>Due Date</Text>
                  <View style={styles.mobilePickerContainer}>
                    <ScrollView 
                      style={styles.datePickerScroll}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      snapToInterval={80}
                      decelerationRate="fast"
                    >
                      {Array.from({ length: 365 }, (_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() + i);
                        return (
                          <TouchableOpacity 
                            key={i}
                            style={[
                              styles.dateOption,
                              taskDueDate === date.toLocaleDateString() && styles.selectedDateOption
                            ]}
                            onPress={() => {
                              setSelectedTaskDateTime(date);
                              setTaskDueDate(date.toLocaleDateString());
                            }}
                          >
                            <Text style={[
                              styles.dateOptionText,
                              taskDueDate === date.toLocaleDateString() && styles.selectedDateOptionText
                            ]}>
                              {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                </View>

                {/* Due Time Picker */}
                <View style={styles.pickerContainer}>
                  <Text style={styles.pickerLabel}>Due Time</Text>
                  <View style={styles.mobilePickerContainer}>
                    <ScrollView 
                      style={styles.timePickerScroll}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      snapToInterval={60}
                      decelerationRate="fast"
                    >
                      {Array.from({ length: 24 }, (_, hour) => 
                        Array.from({ length: 4 }, (_, minute) => {
                          const time = new Date();
                          time.setHours(hour, minute * 15, 0, 0);
                          const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          return (
                            <TouchableOpacity 
                              key={`${hour}-${minute}`}
                              style={[
                                styles.timeOption,
                                taskDueTime === timeString && styles.selectedTimeOption
                              ]}
                              onPress={() => {
                                const newDateTime = new Date(selectedTaskDateTime);
                                newDateTime.setHours(hour, minute * 15, 0, 0);
                                setSelectedTaskDateTime(newDateTime);
                                setTaskDueTime(timeString);
                              }}
                            >
                              <Text style={[
                                styles.timeOptionText,
                                taskDueTime === timeString && styles.selectedTimeOptionText
                              ]}>
                                {timeString}
                              </Text>
                            </TouchableOpacity>
                          );
                        })
                      )}
                    </ScrollView>
                  </View>
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setShowTaskModal(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveTask}>
                  <Text style={styles.saveButtonText}>Create Task</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Event Creation Modal */}
        <Modal visible={showEventModal} animationType="slide" transparent onRequestClose={() => setShowEventModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.eventModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create Event</Text>
                <TouchableOpacity onPress={() => setShowEventModal(false)}>
                  <X size={28} color="#fff" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalContent}>
                <TextInput
                  style={styles.eventInput}
                  placeholder="Event title..."
                  value={eventTitle}
                  onChangeText={setEventTitle}
                  placeholderTextColor="#888"
                />
                <TextInput
                  style={[styles.eventInput, styles.eventDescriptionInput]}
                  placeholder="Description (optional)..."
                  value={eventDescription}
                  onChangeText={setEventDescription}
                  multiline
                  placeholderTextColor="#888"
                />
                
                {/* Date Picker */}
                <View style={styles.pickerContainer}>
                  <Text style={styles.pickerLabel}>Event Date</Text>
                  <View style={styles.mobilePickerContainer}>
                    <ScrollView 
                      style={styles.datePickerScroll}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      snapToInterval={80}
                      decelerationRate="fast"
                    >
                      {Array.from({ length: 365 }, (_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() + i);
                        return (
                          <TouchableOpacity 
                            key={i}
                            style={[
                              styles.dateOption,
                              eventDueDate === date.toLocaleDateString() && styles.selectedDateOption
                            ]}
                            onPress={() => {
                              setSelectedDateTime(date);
                              setEventDueDate(date.toLocaleDateString());
                            }}
                          >
                            <Text style={[
                              styles.dateOptionText,
                              eventDueDate === date.toLocaleDateString() && styles.selectedDateOptionText
                            ]}>
                              {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                </View>

                {/* Time Picker */}
                <View style={styles.pickerContainer}>
                  <Text style={styles.pickerLabel}>Event Time</Text>
                  <View style={styles.mobilePickerContainer}>
                    <ScrollView 
                      style={styles.timePickerScroll}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      snapToInterval={60}
                      decelerationRate="fast"
                    >
                      {Array.from({ length: 24 }, (_, hour) => 
                        Array.from({ length: 4 }, (_, minute) => {
                          const time = new Date();
                          time.setHours(hour, minute * 15, 0, 0);
                          const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          return (
                            <TouchableOpacity 
                              key={`${hour}-${minute}`}
                              style={[
                                styles.timeOption,
                                eventDueTime === timeString && styles.selectedTimeOption
                              ]}
                              onPress={() => {
                                const newDateTime = new Date(selectedDateTime);
                                newDateTime.setHours(hour, minute * 15, 0, 0);
                                setSelectedDateTime(newDateTime);
                                setEventDueTime(timeString);
                              }}
                            >
                              <Text style={[
                                styles.timeOptionText,
                                eventDueTime === timeString && styles.selectedTimeOptionText
                              ]}>
                                {timeString}
                              </Text>
                            </TouchableOpacity>
                          );
                        })
                      )}
                    </ScrollView>
                  </View>
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setShowEventModal(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveEvent}>
                  <Text style={styles.saveButtonText}>Create Event</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Mobile-optimized scroll pickers are now used instead of DateTimePicker */}

        {/* Quick Tasks Modal */}
        <Modal visible={showQuickTasksModal} animationType="slide" transparent onRequestClose={() => setShowQuickTasksModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.quickTasksModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Quick Task</Text>
                <TouchableOpacity onPress={() => setShowQuickTasksModal(false)}>
                  <X size={28} color="#fff" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.quickTasksContent}>
                {quickTasks.map(task => (
                  <TouchableOpacity key={task.id} style={styles.quickTask} onPress={() => handleQuickTask(task)}>
                    <View style={styles.quickTaskHeader}>
                      <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(task.priority) }]} />
                      <Text style={styles.quickTaskTitle}>{task.title}</Text>
                    </View>
                    <Text style={styles.quickTaskDescription}>{task.description}</Text>
                    <View style={styles.quickTaskFooter}>
                      <Text style={styles.quickTaskCategory}>{task.category}</Text>
                      <View style={styles.quickTaskTags}>
                        {task.tags.slice(0, 2).map((tag, index) => (
                          <Text key={index} style={styles.quickTaskTag}>#{tag}</Text>
                        ))}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
                
                <TouchableOpacity 
                  style={[styles.quickTask, styles.customTaskButton]} 
                  onPress={() => {
                    setShowQuickTasksModal(false);
                    setShowTaskModal(true);
                  }}
                >
                  <Text style={styles.customTaskText}>+ Custom Task</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Note Detail Modal */}
        <Modal
          visible={showNoteDetailModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowNoteDetailModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.detailModal}>
              <View style={styles.modalHeader}>
                <View style={styles.detailHeader}>
                  <FileText size={24} color="#007AFF" />
                  <Text style={styles.modalTitle}>Note Details</Text>
                </View>
                <TouchableOpacity onPress={() => setShowNoteDetailModal(false)}>
                  <X size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              
              {selectedNote && (
                <View style={styles.modalContent}>
                  <Text style={styles.detailTitle}>{selectedNote.title}</Text>
                  <Text style={styles.detailContent}>{selectedNote.content}</Text>
                  <View style={styles.detailMeta}>
                    <Text style={styles.detailCategory}>Category: {selectedNote.category}</Text>
                    <Text style={styles.detailDate}>Created: {formatDate(selectedNote.createdAt)}</Text>
                    <Text style={styles.detailDate}>Updated: {formatDate(selectedNote.updatedAt)}</Text>
                    {selectedNote.tags && selectedNote.tags.length > 0 && (
                      <View style={styles.detailTags}>
                        <Text style={styles.detailTagsLabel}>Tags:</Text>
                        <View style={styles.tagsRow}>
                          {selectedNote.tags.map((tag: string, index: number) => (
                            <View key={index} style={styles.tag}>
                              <Text style={styles.tagText}>{tag}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              )}
              
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowNoteDetailModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => {
                    setShowNoteDetailModal(false);
                    router.push('/(tabs)/notes');
                  }}
                >
                  <Text style={styles.saveButtonText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Task Detail Modal */}
        <Modal
          visible={showTaskDetailModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowTaskDetailModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.detailModal}>
              <View style={styles.modalHeader}>
                <View style={styles.detailHeader}>
                  <CheckSquare size={24} color="#34C759" />
                  <Text style={styles.modalTitle}>Task Details</Text>
                </View>
                <TouchableOpacity onPress={() => setShowTaskDetailModal(false)}>
                  <X size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              
              {selectedTask && (
                <View style={styles.modalContent}>
                  <View style={styles.taskDetailHeader}>
                    <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(selectedTask.priority) }]} />
                    <Text style={styles.detailTitle}>{selectedTask.title}</Text>
                  </View>
                  {selectedTask.description && (
                    <Text style={styles.detailContent}>{selectedTask.description}</Text>
                  )}
                  <View style={styles.detailMeta}>
                    <Text style={styles.detailPriority}>Priority: {selectedTask.priority}</Text>
                    <Text style={styles.detailCategory}>Category: {selectedTask.category}</Text>
                    <Text style={styles.detailDate}>Created: {formatDate(selectedTask.createdAt)}</Text>
                    <Text style={styles.detailStatus}>Status: {selectedTask.completed ? 'Completed' : 'Pending'}</Text>
                    {selectedTask.tags && selectedTask.tags.length > 0 && (
                      <View style={styles.detailTags}>
                        <Text style={styles.detailTagsLabel}>Tags:</Text>
                        <View style={styles.tagsRow}>
                          {selectedTask.tags.map((tag: string, index: number) => (
                            <View key={index} style={styles.tag}>
                              <Text style={styles.tagText}>{tag}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              )}
              
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowTaskDetailModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => {
                    setShowTaskDetailModal(false);
                    setShowQuickTasksModal(true);
                  }}
                >
                  <Text style={styles.saveButtonText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Event Detail Modal */}
        <Modal
          visible={showEventDetailModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowEventDetailModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.detailModal}>
              <View style={styles.modalHeader}>
                <View style={styles.detailHeader}>
                  <Calendar size={24} color="#FFD700" />
                  <Text style={styles.modalTitle}>Event Details</Text>
                </View>
                <TouchableOpacity onPress={() => setShowEventDetailModal(false)}>
                  <X size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              
              {selectedEvent && (
                <View style={styles.modalContent}>
                  <Text style={styles.detailTitle}>{selectedEvent.title}</Text>
                  {selectedEvent.description && (
                    <Text style={styles.detailContent}>{selectedEvent.description}</Text>
                  )}
                  <View style={styles.detailMeta}>
                    <Text style={styles.detailDate}>Date: {formatDate(selectedEvent.date)}</Text>
                    <Text style={styles.detailTime}>Time: {formatTime(selectedEvent.date)}</Text>
                    <Text style={styles.detailCategory}>Category: {selectedEvent.category}</Text>
                    {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                      <View style={styles.detailTags}>
                        <Text style={styles.detailTagsLabel}>Tags:</Text>
                        <View style={styles.tagsRow}>
                          {selectedEvent.tags.map((tag: string, index: number) => (
                            <View key={index} style={styles.tag}>
                              <Text style={styles.tagText}>{tag}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              )}
              
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowEventDetailModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => {
                    setShowEventDetailModal(false);
                    setShowEventModal(true);
                  }}
                >
                  <Text style={styles.saveButtonText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  xpBar: {
    width: 60,
    height: 4,
    backgroundColor: '#334155',
    borderRadius: 2,
    overflow: 'hidden',
  },
  xpProgress: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  xpText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
    marginTop: 24,
  },
  tilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginHorizontal: 0,
  },
  tile: {
    width: (width - 52) / 2,
    height: 100,
    borderRadius: 16,
    overflow: 'hidden',
  },
  largeTile: {
    width: width - 40,
    height: 120,
  },
  tileGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  tileTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginTop: 8,
    textAlign: 'center',
  },
  tileSubtitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
    textAlign: 'center',
    opacity: 0.9,
  },
  activitySection: {
    gap: 12,
  },
  activityCard: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    width: 280,
    marginRight: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardType: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  cardTime: {
    color: '#888888',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  taskCard: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  taskTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    flex: 1,
  },
  taskDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  fab: {
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: 'absolute',
    zIndex: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addModal: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  notificationsModal: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  noteModal: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '90%',
  },
  taskModal: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  eventModal: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  addOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 16,
  },
  addOption: {
    alignItems: 'center',
    padding: 16,
    minWidth: 80,
  },
  addOptionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginTop: 8,
    textAlign: 'center',
  },
  modalContent: {
    marginBottom: 16,
  },
  noteInput: {
    backgroundColor: '#334155',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  noteContentInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  taskInput: {
    backgroundColor: '#334155',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  taskDescriptionInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  prioritySelector: {
    marginBottom: 12,
  },
  priorityLabel: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  priorityButtonText: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  eventInput: {
    backgroundColor: '#334155',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  eventDescriptionInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#CCCCCC',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  quickTasksModal: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  quickTasksContent: {
    gap: 12,
  },
  quickTask: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    backgroundColor: 'rgba(51, 65, 85, 0.3)',
  },
  quickTaskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  quickTaskTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  quickTaskDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  quickTaskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickTaskCategory: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  quickTaskTags: {
    flexDirection: 'row',
    gap: 4,
  },
  quickTaskTag: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  customTaskButton: {
    backgroundColor: '#007AFF',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
  },
  customTaskText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  realTimeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  realTimeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  realTimeText: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 24,
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  addNewText: {
    color: '#007AFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  emptyStateCard: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateText: {
    color: '#CCCCCC',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    color: '#888888',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  sectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewAllButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  viewAllText: {
    color: '#007AFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  detailModal: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
  },
  detailContent: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
  },
  detailMeta: {
    marginBottom: 16,
  },
  detailCategory: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  detailDate: {
    color: '#888888',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  detailTags: {
    marginTop: 8,
  },
  detailTagsLabel: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  tag: {
    padding: 4,
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 4,
  },
  tagText: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  taskDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailPriority: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  detailStatus: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  detailTime: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  pickerContainer: {
    marginBottom: 12,
  },
  pickerLabel: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  pickerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
  eventsScrollView: {
    height: 140,
    marginBottom: 16,
  },
  eventsScrollContent: {
    paddingHorizontal: 20,
  },
  mobilePickerContainer: {
    backgroundColor: '#334155',
    borderRadius: 8,
    padding: 8,
    height: 60,
  },
  datePickerScroll: {
    height: 44,
  },
  dateOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  selectedDateOption: {
    backgroundColor: '#007AFF',
  },
  dateOptionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  selectedDateOptionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  timePickerScroll: {
    height: 44,
  },
  timeOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  selectedTimeOption: {
    backgroundColor: '#007AFF',
  },
  timeOptionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  selectedTimeOptionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  menuOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  menuContainer: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  menuButton: {
    position: 'absolute',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    zIndex: 1,
    opacity: 0,
  },
  activeButton: {
    backgroundColor: '#17425A',
    borderWidth: 2,
    borderColor: '#fff',
  },
  recentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginHorizontal: 0,
  },
  quickActionsContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    marginTop: 16,
  },
  quickActionsScroll: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginTop: 8,
  },
  progressContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatNumber: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  progressStatLabel: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  progressBarContainer: {
    marginTop: 12,
  },
  progressBarLabel: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  progressBarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'right',
    marginTop: 4,
  },
  weatherTimeContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  timeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  dateText: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  weatherSection: {
    alignItems: 'center',
  },
  weatherText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  weatherLocation: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});

export default HomeDashboard; 