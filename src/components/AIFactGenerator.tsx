import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Fact } from '../types';
import { Bot } from 'lucide-react-native';

export const AIFactGenerator = ({ onGenerate }: { onGenerate: (query: string) => Fact }) => {
  const [query, setQuery] = useState('');
  const [fact, setFact] = useState<Fact | null>(null);

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Bot color="#00b894" size={22} style={{ marginRight: 8 }} />
        <Text style={styles.sectionTitle}>Ask AI for a Fact</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Type a topic (e.g. space, animals)"
        placeholderTextColor="#888"
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Generate Fact" onPress={() => setFact(onGenerate(query))} />
      {fact && (
        <View style={styles.factBox}>
          <Text style={styles.factText}>{fact.text}</Text>
        </View>
      )}
    </View>
  );
};

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
    color: '#00b894',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  factBox: {
    backgroundColor: '#161823',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
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