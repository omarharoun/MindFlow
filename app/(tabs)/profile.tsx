import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Modal, TextInput, Alert, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Award, Settings, LogOut, Trophy, Target, X, Moon, Sun, Bell } from 'lucide-react-native';
import { useStore } from '../../src/store/useStore';

export default function ProfileScreen() {
  const { user, addExperience, theme, toggleTheme } = useStore();
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => {
          // Sign out logic here
          Alert.alert('Signed Out', 'You have been signed out successfully.');
        }},
      ]
    );
  };

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

            <TouchableOpacity style={styles.menuItem} onPress={() => setShowSettings(true)}>
              <View style={styles.menuIcon}>
                <Settings size={20} color="#007AFF" strokeWidth={2} />
              </View>
              <Text style={styles.menuTitle}>Settings</Text>
              <Text style={styles.menuSubtitle}>App preferences</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
              <View style={styles.menuIcon}>
                <LogOut size={20} color="#FF3B30" strokeWidth={2} />
              </View>
              <Text style={styles.menuTitle}>Sign Out</Text>
              <Text style={styles.menuSubtitle}>Log out of account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Settings Modal */}
        <Modal visible={showSettings} animationType="slide" transparent onRequestClose={() => setShowSettings(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.settingsModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Settings</Text>
                <TouchableOpacity onPress={() => setShowSettings(false)}>
                  <X size={28} color="#fff" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalContent}>
                {/* Theme Toggle */}
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <View style={styles.settingIcon}>
                      {theme === 'dark' ? <Moon size={20} color="#8B5CF6" strokeWidth={2} /> : <Sun size={20} color="#F59E0B" strokeWidth={2} />}
                    </View>
                    <View style={styles.settingText}>
                      <Text style={styles.settingTitle}>Dark Mode</Text>
                      <Text style={styles.settingSubtitle}>Toggle dark/light theme</Text>
                    </View>
                  </View>
                  <Switch
                    value={theme === 'dark'}
                    onValueChange={toggleTheme}
                    trackColor={{ false: '#767577', true: '#8B5CF6' }}
                    thumbColor={theme === 'dark' ? '#FFFFFF' : '#F4F3F4'}
                  />
                </View>

                {/* Notifications Toggle */}
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <View style={styles.settingIcon}>
                      <Bell size={20} color="#34C759" strokeWidth={2} />
                    </View>
                    <View style={styles.settingText}>
                      <Text style={styles.settingTitle}>Notifications</Text>
                      <Text style={styles.settingSubtitle}>Enable push notifications</Text>
                    </View>
                  </View>
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    trackColor={{ false: '#767577', true: '#34C759' }}
                    thumbColor={notificationsEnabled ? '#FFFFFF' : '#F4F3F4'}
                  />
                </View>

                {/* API Key Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>OpenAI API Key</Text>
                  <TextInput
                    style={styles.input}
                    value={apiKey}
                    onChangeText={setApiKey}
                    placeholder="sk-..."
                    placeholderTextColor="#666"
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>
              </ScrollView>

              <TouchableOpacity style={styles.saveButton} onPress={() => {
                // Save logic here
                setShowSettings(false);
                Alert.alert('Saved', 'Settings saved successfully.');
              }}>
                <Text style={styles.saveButtonText}>Save Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsModal: {
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
  modalContent: {
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#334155',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
}); 