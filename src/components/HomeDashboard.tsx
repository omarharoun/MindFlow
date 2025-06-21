import React, { useState } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  FileText,
  CheckSquare,
  Calendar,
  Camera,
  BookOpen,
  Zap,
  TrendingUp,
  Clock,
  Bell,
  Plus,
  Target,
  Award,
  X,
} from 'lucide-react-native';
import { useStore } from '../store/useStore';

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

const HomeDashboard: React.FC = () => {
  const { user, tasks, notes, knowledgeNodes, addTask, addNote, addExperience } = useStore();
  const [notifications] = useState(3);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const handleAddItem = (type: 'task' | 'note' | 'event' | 'knowledge') => {
    setShowAddMenu(false);
    
    switch (type) {
      case 'task':
        const newTask = {
          id: Date.now().toString(),
          title: 'New Task',
          description: '',
          completed: false,
          priority: 'medium' as const,
          category: 'General',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        addTask(newTask);
        addExperience(10);
        Alert.alert('Task Added', 'New task created successfully!');
        break;
        
      case 'note':
        const newNote = {
          id: Date.now().toString(),
          title: 'New Note',
          content: '',
          category: 'General',
          tags: [],
          media: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          isPinned: false,
        };
        addNote(newNote);
        addExperience(10);
        Alert.alert('Note Added', 'New note created successfully!');
        break;
        
      case 'event':
        addExperience(10);
        Alert.alert('Event Added', 'New event created successfully!');
        break;
        
      case 'knowledge':
        addExperience(10);
        Alert.alert('Knowledge Node Added', 'New knowledge node created successfully!');
        break;
    }
  };

  const handleTilePress = (title: string) => {
    // TODO: Navigate to specific sections
    console.log('Pressed:', title);
    addExperience(5);
  };

  const pendingTasks = tasks.filter(task => !task.completed).length;
  const recentNotes = notes.slice(0, 3);
  const recentNodes = knowledgeNodes.slice(0, 3);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
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
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color="#FFFFFF" strokeWidth={2} />
            {notifications > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>{notifications}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

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
              subtitle={`${pendingTasks} pending`}
              icon={CheckSquare}
              gradientColors={['#34C759', '#28A745']}
              onPress={() => handleTilePress('Tasks')}
            />
            <DashboardTile
              title="Calendar"
              subtitle="Today's schedule"
              icon={Calendar}
              gradientColors={['#FF9500', '#FF8C00']}
              onPress={() => handleTilePress('Calendar')}
            />
            <DashboardTile
              title="Scan"
              subtitle="Document capture"
              icon={Camera}
              gradientColors={['#AF52DE', '#9A4BCF']}
              onPress={() => handleTilePress('Scan')}
            />
          </View>

          {/* Learning Section */}
          <Text style={styles.sectionTitle}>Continue Learning</Text>
          <View style={styles.tilesGrid}>
            <DashboardTile
              title="Knowledge Web"
              subtitle={`${knowledgeNodes.length} nodes`}
              icon={BookOpen}
              gradientColors={['#FF3B30', '#E53E3E']}
              onPress={() => handleTilePress('Knowledge Web')}
              size="large"
            />
          </View>

          {/* Productivity Insights */}
          <Text style={styles.sectionTitle}>Today's Insights</Text>
          <View style={styles.tilesGrid}>
            <DashboardTile
              title="Focus Time"
              subtitle="4.5 hours"
              icon={Zap}
              gradientColors={['#5856D6', '#4B49D1']}
              onPress={() => handleTilePress('Focus Time')}
            />
            <DashboardTile
              title="Progress"
              subtitle="+15% this week"
              icon={TrendingUp}
              gradientColors={['#32D74B', '#28CD41']}
              onPress={() => handleTilePress('Progress')}
            />
          </View>

          {/* Recent Notes */}
          {recentNotes.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Recent Notes</Text>
              <View style={styles.recentItems}>
                {recentNotes.map((note, index) => (
                  <TouchableOpacity key={note.id} style={styles.recentItem}>
                    <View style={styles.recentIcon}>
                      <FileText size={20} color="#007AFF" strokeWidth={2} />
                    </View>
                    <View style={styles.recentContent}>
                      <Text style={styles.recentTitle}>{note.title}</Text>
                      <Text style={styles.recentType}>Note</Text>
                    </View>
                    <View style={styles.recentTime}>
                      <Clock size={14} color="#666666" strokeWidth={2} />
                      <Text style={styles.recentTimeText}>
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Recent Knowledge Nodes */}
          {recentNodes.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Recent Knowledge</Text>
              <View style={styles.recentItems}>
                {recentNodes.map((node, index) => (
                  <TouchableOpacity key={node.id} style={styles.recentItem}>
                    <View style={[styles.recentIcon, { backgroundColor: node.color }]}>
                      <BookOpen size={20} color="#FFFFFF" strokeWidth={2} />
                    </View>
                    <View style={styles.recentContent}>
                      <Text style={styles.recentTitle}>{node.title}</Text>
                      <Text style={styles.recentType}>{node.category}</Text>
                    </View>
                    <View style={styles.recentTime}>
                      <Clock size={14} color="#666666" strokeWidth={2} />
                      <Text style={styles.recentTimeText}>
                        {new Date(node.updatedAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Add Menu FAB */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowAddMenu(true)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#007AFF', '#0056CC']}
            style={styles.fabGradient}
          >
            <Plus size={24} color="#FFFFFF" strokeWidth={3} />
          </LinearGradient>
        </TouchableOpacity>

        {/* Add Menu Modal */}
        <Modal
          visible={showAddMenu}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowAddMenu(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowAddMenu(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New</Text>
                <TouchableOpacity onPress={() => setShowAddMenu(false)}>
                  <X size={24} color="#FFFFFF" strokeWidth={2} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.menuOptions}>
                <TouchableOpacity
                  style={styles.menuOption}
                  onPress={() => handleAddItem('task')}
                >
                  <LinearGradient
                    colors={['#34C759', '#28A745']}
                    style={styles.menuOptionGradient}
                  >
                    <CheckSquare size={24} color="#FFFFFF" strokeWidth={2} />
                  </LinearGradient>
                  <View style={styles.menuOptionText}>
                    <Text style={styles.menuOptionTitle}>Task</Text>
                    <Text style={styles.menuOptionSubtitle}>Add a new task</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuOption}
                  onPress={() => handleAddItem('note')}
                >
                  <LinearGradient
                    colors={['#007AFF', '#0056CC']}
                    style={styles.menuOptionGradient}
                  >
                    <FileText size={24} color="#FFFFFF" strokeWidth={2} />
                  </LinearGradient>
                  <View style={styles.menuOptionText}>
                    <Text style={styles.menuOptionTitle}>Note</Text>
                    <Text style={styles.menuOptionSubtitle}>Write a quick note</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuOption}
                  onPress={() => handleAddItem('event')}
                >
                  <LinearGradient
                    colors={['#FF9500', '#FF8C00']}
                    style={styles.menuOptionGradient}
                  >
                    <Calendar size={24} color="#FFFFFF" strokeWidth={2} />
                  </LinearGradient>
                  <View style={styles.menuOptionText}>
                    <Text style={styles.menuOptionTitle}>Event</Text>
                    <Text style={styles.menuOptionSubtitle}>Schedule an event</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuOption}
                  onPress={() => handleAddItem('knowledge')}
                >
                  <LinearGradient
                    colors={['#FF3B30', '#E53E3E']}
                    style={styles.menuOptionGradient}
                  >
                    <BookOpen size={24} color="#FFFFFF" strokeWidth={2} />
                  </LinearGradient>
                  <View style={styles.menuOptionText}>
                    <Text style={styles.menuOptionTitle}>Knowledge Node</Text>
                    <Text style={styles.menuOptionSubtitle}>Create knowledge</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
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
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFD700',
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
    backgroundColor: '#FFD700',
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
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 16,
  },
  tilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
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
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 8,
    textAlign: 'center',
  },
  tileSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 2,
    textAlign: 'center',
  },
  recentItems: {
    gap: 12,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentContent: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  recentType: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  recentTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recentTimeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  bottomSpacing: {
    height: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: {
    flex: 1,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  menuOptions: {
    gap: 16,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#334155',
    borderRadius: 16,
  },
  menuOptionGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuOptionText: {
    flex: 1,
  },
  menuOptionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  menuOptionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
});

export default HomeDashboard; 