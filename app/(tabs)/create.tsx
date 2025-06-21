import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, FileText, BookOpen, Video } from 'lucide-react-native';

export default function CreateScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#334155']}
        style={styles.background}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Content</Text>
          <Text style={styles.subtitle}>Share your knowledge with the world</Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.optionsGrid}>
            <TouchableOpacity style={styles.option}>
              <LinearGradient
                colors={['#FF3B30', '#E53E3E']}
                style={styles.optionGradient}
              >
                <Video size={32} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.optionTitle}>Record Video</Text>
                <Text style={styles.optionSubtitle}>Educational content</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.option}>
              <LinearGradient
                colors={['#007AFF', '#0056CC']}
                style={styles.optionGradient}
              >
                <FileText size={32} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.optionTitle}>Write Note</Text>
                <Text style={styles.optionSubtitle}>Quick thoughts</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.option}>
              <LinearGradient
                colors={['#34C759', '#28A745']}
                style={styles.optionGradient}
              >
                <BookOpen size={32} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.optionTitle}>Create Quiz</Text>
                <Text style={styles.optionSubtitle}>Test knowledge</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.option}>
              <LinearGradient
                colors={['#AF52DE', '#9A4BCF']}
                style={styles.optionGradient}
              >
                <Camera size={32} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.optionTitle}>Scan Document</Text>
                <Text style={styles.optionSubtitle}>Capture text</Text>
              </LinearGradient>
            </TouchableOpacity>
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
    paddingHorizontal: 20,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  option: {
    width: '48%',
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
  },
  optionGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  optionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
  },
}); 