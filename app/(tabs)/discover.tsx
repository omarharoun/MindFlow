import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
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
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <WowFactCard fact={factOfTheDay} />
      <HistoryCarousel events={historyEvents.length ? historyEvents : factService.getAllHistoricalEvents()} />
      <FactChainTree facts={factChain} />
      <AIFactGenerator onGenerate={handleGenerateFact} />
      <FactVsFictionGame getRandomFact={factService.getRandomGameFact} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
}); 