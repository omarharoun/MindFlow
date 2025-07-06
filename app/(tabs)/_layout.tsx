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
          tabBarActiveTintColor: '#3B82F6',
          tabBarInactiveTintColor: theme === 'dark' ? '#64748B' : '#9CA3AF',
          tabBarStyle: {
            backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
            borderTopColor: theme === 'dark' ? '#334155' : '#E5E7EB',
            borderTopWidth: 1,
            height: 65,
            paddingBottom: 10,
            paddingTop: 8,
            shadowColor: theme === 'dark' ? '#000' : '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: theme === 'dark' ? 0.3 : 0.1,
            shadowRadius: 4,
            elevation: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontFamily: 'Inter-Medium',
            marginTop: 2,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size, focused }) => (
              <Home 
                size={focused ? size + 2 : size} 
                color={color} 
                strokeWidth={focused ? 2.5 : 2} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="learn"
          options={{
            title: 'Learn',
            tabBarIcon: ({ color, size, focused }) => (
              <BookOpen 
                size={focused ? size + 2 : size} 
                color={color} 
                strokeWidth={focused ? 2.5 : 2} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="notes"
          options={{
            title: 'Notes',
            tabBarIcon: ({ color, size, focused }) => (
              <StickyNote 
                size={focused ? size + 2 : size} 
                color={color} 
                strokeWidth={focused ? 2.5 : 2} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="discover"
          options={{
            title: 'Discover',
            tabBarIcon: ({ color, size, focused }) => (
              <Compass 
                size={focused ? size + 2 : size} 
                color={color} 
                strokeWidth={focused ? 2.5 : 2} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size, focused }) => (
              <User 
                size={focused ? size + 2 : size} 
                color={color} 
                strokeWidth={focused ? 2.5 : 2} 
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
} 