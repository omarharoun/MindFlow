import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Award, Settings, LogOut, Trophy, Target } from 'lucide-react-native';
import { useStore } from '../../src/store/useStore';

export default function ProfileScreen() {
  const { user, addExperience } = useStore();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#334155']}
        style={styles.background}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.profileInfo}>
              <View style={styles.avatar}>
                <User size={32} color="#FFFFFF" strokeWidth={2} />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user?.username || 'Learner'}</Text>
                <Text style={styles.userLevel}>Level {user?.level || 1}</Text>
                <Text style={styles.userXP}>{user?.experience || 0} XP</Text>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Trophy size={24} color="#FFD700" strokeWidth={2} />
              <Text style={styles.statNumber}>{user?.achievements?.length || 0}</Text>
              <Text style={styles.statLabel}>Achievements</Text>
            </View>
            <View style={styles.statItem}>
              <Target size={24} color="#34C759" strokeWidth={2} />
              <Text style={styles.statNumber}>15</Text>
              <Text style={styles.statLabel}>Goals</Text>
            </View>
            <View style={styles.statItem}>
              <Award size={24} color="#007AFF" strokeWidth={2} />
              <Text style={styles.statNumber}>89%</Text>
              <Text style={styles.statLabel}>Progress</Text>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIcon}>
                <Award size={20} color="#FFD700" strokeWidth={2} />
              </View>
              <Text style={styles.menuTitle}>Achievements</Text>
              <Text style={styles.menuSubtitle}>View your badges</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIcon}>
                <Target size={20} color="#34C759" strokeWidth={2} />
              </View>
              <Text style={styles.menuTitle}>Learning Goals</Text>
              <Text style={styles.menuSubtitle}>Set and track objectives</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIcon}>
                <Settings size={20} color="#007AFF" strokeWidth={2} />
              </View>
              <Text style={styles.menuTitle}>Settings</Text>
              <Text style={styles.menuSubtitle}>App preferences</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIcon}>
                <LogOut size={20} color="#FF3B30" strokeWidth={2} />
              </View>
              <Text style={styles.menuTitle}>Sign Out</Text>
              <Text style={styles.menuSubtitle}>Log out of account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userLevel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFD700',
    marginBottom: 4,
  },
  userXP: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
}); 