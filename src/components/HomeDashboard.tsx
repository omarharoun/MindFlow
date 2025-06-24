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
} from 'lucide-react-native';
import { useStore } from '../store/useStore';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface DashboardTileProps {
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  gradientColors: string[];
  onPress: () => void;
  size?: 'small' | 'large';
}

const DashboardTile: React.FC<DashboardTileProps> = ({
  title,
  subtitle,
  icon: Icon,
  gradientColors,
  onPress,
  size = 'small',
}) => (
  <TouchableOpacity
    style={[
      styles.tile,
      size === 'large' && styles.largeTile,
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
  const { user, tasks, notes, knowledgeNodes, addTask, addNote, updateTask, deleteTask, addExperience } = useStore();
  const [notifications] = useState(3);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [eventDueDate, setEventDueDate] = useState('');
  const [eventDueTime, setEventDueTime] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();

  const handleAddItem = (type: 'task' | 'note' | 'event' | 'knowledge' | 'read') => {
    setShowAddMenu(false);
    
    switch (type) {
      case 'task':
        setShowTaskModal(true);
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
        router.push('/(tabs)/read');
        break;
    }
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    addTask(newTask);
    addExperience(10);
    setTaskTitle('');
    setTaskDescription('');
    setTaskPriority('medium');
    setShowTaskModal(false);
    Alert.alert('Task Added', 'Your task has been added successfully!');
  };

  const handleSaveEvent = () => {
    if (!eventTitle.trim()) {
      Alert.alert('Error', 'Please enter a title for your event.');
      return;
    }

    if (!eventDueDate.trim() || !eventDueTime.trim()) {
      Alert.alert('Error', 'Please enter both due date and time.');
      return;
    }
    
    const newEvent: Event = {
      id: Date.now().toString(),
      title: eventTitle,
      description: eventDescription,
      date: new Date(`${eventDueDate} ${eventDueTime}`),
      category: 'General',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setEvents([newEvent, ...events]);
    addExperience(15);
    setEventTitle('');
    setEventDescription('');
    setEventDueDate('');
    setEventDueTime('');
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
        // Navigate to tasks view or show task modal
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

  const pendingTasks = tasks.filter(task => !task.completed);
  const recentNotes = notes.slice(0, 3);
  const recentNodes = knowledgeNodes.slice(0, 3);
  const recentEvents = events.slice(0, 3);

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
        >
          {/* Quick Actions Grid */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.tilesGrid}>
            <DashboardTile
              title="New Note"
              subtitle="Quick capture"
              icon={FileText}
              gradientColors={['#007AFF', '#0056CC']}
              onPress={() => handleTilePress('New Note')}
            />
            <DashboardTile
              title="Tasks"
              subtitle={`${pendingTasks.length} pending`}
              icon={CheckSquare}
              gradientColors={['#34C759', '#28A745']}
              onPress={() => handleTilePress('Tasks')}
            />
            <DashboardTile
              title="Knowledge"
              subtitle="Explore map"
              icon={BookOpen}
              gradientColors={['#AF52DE', '#9A4BCF']}
              onPress={() => handleTilePress('Knowledge')}
            />
            <DashboardTile
              title="Add"
              subtitle="Knowledge"
              icon={Plus}
              gradientColors={['#FFD700', '#FFB300']}
              onPress={() => handleTilePress('Add')}
            />
          </View>

          {/* Recent Activity - Notes Section */}
          {recentNotes.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Recent Notes</Text>
              <View style={styles.activitySection}>
                {recentNotes.map(note => (
                  <View key={note.id} style={styles.activityCard}>
                    <View style={styles.cardHeader}>
                      <FileText size={16} color="#007AFF" />
                      <Text style={styles.cardType}>Note</Text>
                    </View>
                    <Text style={styles.cardTitle}>{note.title}</Text>
                    <Text style={styles.cardSubtitle}>{note.content.substring(0, 50)}...</Text>
                    <Text style={styles.cardTime}>{formatDate(note.updatedAt)}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Recent Activity - Tasks Section */}
          {pendingTasks.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Pending Tasks</Text>
              <View style={styles.activitySection}>
                {pendingTasks.slice(0, 3).map(task => (
                  <View key={task.id} style={styles.taskCard}>
                    <View style={styles.taskHeader}>
                      <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(task.priority) }]} />
                      <Text style={styles.taskTitle}>{task.title}</Text>
                      <TouchableOpacity onPress={() => handleCompleteTask(task.id)}>
                        <Check size={20} color="#34C759" />
                      </TouchableOpacity>
                    </View>
                    {task.description && (
                      <Text style={styles.taskDescription}>{task.description}</Text>
                    )}
                    <Text style={styles.cardTime}>{formatDate(task.createdAt)}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Recent Activity - Knowledge Section */}
          {recentNodes.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Recent Knowledge</Text>
              <View style={styles.activitySection}>
                {recentNodes.map(node => (
                  <View key={node.id} style={styles.activityCard}>
                    <View style={styles.cardHeader}>
                      <BookOpen size={16} color="#AF52DE" />
                      <Text style={styles.cardType}>Knowledge</Text>
                    </View>
                    <Text style={styles.cardTitle}>{node.title}</Text>
                    <Text style={styles.cardSubtitle}>{node.content.substring(0, 50)}...</Text>
                    <Text style={styles.cardTime}>{formatDate(node.updatedAt)}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Recent Activity - Events Section */}
          {recentEvents.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Recent Events</Text>
              <View style={styles.activitySection}>
                {recentEvents.map(event => (
                  <View key={event.id} style={styles.activityCard}>
                    <View style={styles.cardHeader}>
                      <Calendar size={16} color="#FFD700" />
                      <Text style={styles.cardType}>Event</Text>
                    </View>
                    <Text style={styles.cardTitle}>{event.title}</Text>
                    {event.description && (
                      <Text style={styles.cardSubtitle}>{event.description.substring(0, 50)}...</Text>
                    )}
                    <Text style={styles.cardTime}>{formatDate(event.date)}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </ScrollView>

        {/* Floating Add Button */}
        <TouchableOpacity style={styles.fab} onPress={() => setShowAddMenu(true)}>
          <Plus size={32} color="#fff" />
        </TouchableOpacity>

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
                <TextInput
                  style={styles.eventInput}
                  placeholder="Due Date (MM/DD/YYYY)..."
                  value={eventDueDate}
                  onChangeText={setEventDueDate}
                  placeholderTextColor="#888"
                />
                <TextInput
                  style={styles.eventInput}
                  placeholder="Due Time (HH:MM AM/PM)..."
                  value={eventDueTime}
                  onChangeText={setEventDueTime}
                  placeholderTextColor="#888"
                />
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
    gap: 12,
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
    position: 'absolute',
    bottom: 32,
    right: 24,
    backgroundColor: '#007AFF',
    borderRadius: 32,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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
});

export default HomeDashboard; 