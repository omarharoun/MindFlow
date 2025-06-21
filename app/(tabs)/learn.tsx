import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, Brain, Network } from 'lucide-react-native';

export default function LearnScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#334155']}
        style={styles.background}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Knowledge Web</Text>
          <Text style={styles.subtitle}>Explore your learning network</Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.placeholder}>
            <Network size={64} color="#007AFF" strokeWidth={2} />
            <Text style={styles.placeholderText}>Interactive Knowledge Map</Text>
            <Text style={styles.placeholderSubtext}>
              Visualize connections between concepts and ideas
            </Text>
          </View>
        </View>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  placeholder: {
    alignItems: 'center',
    padding: 40,
  },
  placeholderText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 24,
  },
}); 