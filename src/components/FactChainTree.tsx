import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Fact } from '../types';
import { GitBranch } from 'lucide-react-native';

export const FactChainTree = ({ facts }: { facts: Fact[] }) => (
  <View style={styles.section}>
    <View style={styles.headerRow}>
      <GitBranch color="#8e44ad" size={22} style={{ marginRight: 8 }} />
      <Text style={styles.sectionTitle}>Fact Chain Reaction</Text>
    </View>
    {facts.map((fact, idx) => (
      <View key={fact.id} style={styles.factRow}>
        <Text style={styles.factText}>{idx + 1}. {fact.text}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#8e44ad',
    fontSize: 18,
    fontWeight: 'bold',
  },
  factRow: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  factText: {
    color: '#fff',
    fontSize: 15,
  },
}); 