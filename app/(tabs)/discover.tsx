import React from 'react';
import { ScrollView, View, StyleSheet, SafeAreaView, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Compass, Sparkles } from 'lucide-react-native';
import { factService } from '../../src/services/factService';
import { WowFactCard } from '../../src/components/WowFactCard';
import { HistoryCarousel } from '../../src/components/HistoryCarousel';
import { FactChainTree } from '../../src/components/FactChainTree';
import { AIFactGenerator } from '../../src/components/AIFactGenerator';
import { FactVsFictionGame } from '../../src/components/FactVsFictionGame';

export default function DiscoverScreen() {
  const factOfTheDay = factService.getFactOfTheDay();
  const today = new Date().toISOString().slice(5, 10); // MM-DD
  const historyEvents = factService.getAllHistoricalEvents().filter(e => e.date.slice(5) === today);
  const factChain = [factOfTheDay, ...factService.getRelatedFacts(factOfTheDay.id)];

  const handleGenerateFact = (query: string) => {
    // For now, return a random fact since we don't have AI integration
    return factService.getFactOfTheDay();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#334155']}
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Compass size={24} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.headerTitle}>Discover</Text>
            <Sparkles size={24} color="#F59E0B" strokeWidth={2} />
          </View>
          <Text style={styles.headerSubtitle}>Explore fascinating facts and knowledge</Text>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <WowFactCard fact={factOfTheDay} />
          <HistoryCarousel events={historyEvents.length ? historyEvents : factService.getAllHistoricalEvents()} />
          <FactChainTree facts={factChain} />
          <AIFactGenerator onGenerate={handleGenerateFact} />
          <FactVsFictionGame getRandomFact={factService.getRandomGameFact} />
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  headerSubtitle: {
    color: '#CCCCCC',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
  },
}); 