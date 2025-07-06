import React from 'react';
import { View, Text, Image, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { Fact } from '../types';
import { Lightbulb } from 'lucide-react-native';

export const WowFactCard = ({ fact }: { fact: Fact }) => (
  <View style={styles.section}>
    <View style={styles.headerRow}>
      <Lightbulb color="#FFD700" size={22} style={{ marginRight: 8 }} />
      <Text style={styles.sectionTitle}>Wow Fact of the Day</Text>
    </View>
    <View style={styles.card}>
      {fact.imageUrl && <Image source={{ uri: fact.imageUrl }} style={styles.image} />}
      <Text style={styles.text}>{fact.text}</Text>
      {fact.source && typeof fact.source === 'string' && (
        <TouchableOpacity onPress={() => fact.source && Linking.openURL(fact.source)}>
          <Text style={styles.source}>Source</Text>
        </TouchableOpacity>
      )}
    </View>
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
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#161823',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  source: {
    color: '#4fa3ff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
}); 