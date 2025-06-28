import React from 'react';
import { Tabs } from 'expo-router';
import { Home, BookOpen, Compass, User, StickyNote } from 'lucide-react-native';
import { useStore } from '../../src/store/useStore';

export default function TabLayout() {
  const { theme } = useStore();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#666666',
          tabBarStyle: {
            backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
            borderTopColor: theme === 'dark' ? '#334155' : '#E5E7EB',
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Inter-Medium',
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: '',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} strokeWidth={2} />,
          }}
        />
        <Tabs.Screen
          name="learn"
          options={{
            title: '',
            tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} strokeWidth={2} />,
          }}
        />
        <Tabs.Screen
          name="notes"
          options={{
            title: '',
            tabBarIcon: ({ color, size }) => <StickyNote size={size} color={color} strokeWidth={2} />,
          }}
        />
        <Tabs.Screen
          name="discover"
          options={{
            title: '',
            tabBarIcon: ({ color, size }) => <Compass size={size} color={color} strokeWidth={2} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: '',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} strokeWidth={2} />,
          }}
        />
      </Tabs>
    </>
  );
} 