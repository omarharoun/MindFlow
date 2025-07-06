import React from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { HistoricalEvent } from '../types';
import { Calendar } from 'lucide-react-native';

export const HistoryCarousel = ({ events }: { events: HistoricalEvent[] }) => (
  <View style={styles.section}>
    <View style={styles.headerRow}>
      <Calendar color="#ff7f50" size={22} style={{ marginRight: 8 }} />
      <Text style={styles.sectionTitle}>Today in History</Text>
    </View>
    <FlatList
      data={events}
      horizontal
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} />}
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Text style={styles.eventDesc}>{item.description}</Text>
        </View>
      )}
      showsHorizontalScrollIndicator={false}
    />
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
    color: '#ff7f50',
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 220,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  eventTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  eventDesc: {
    color: '#ccc',
    fontSize: 13,
    textAlign: 'center',
  },
}); 