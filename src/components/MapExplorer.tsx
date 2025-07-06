import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Modal, TouchableOpacity, Platform } from 'react-native';
// Conditional import for MapView and related components
let MapView: any = () => null;
let Marker: any = () => null;
let Callout: any = () => null;
let PROVIDER_GOOGLE: any = undefined;
if (Platform.OS !== 'web') {
  try {
    const maps = require('react-native-maps');
    MapView = maps.default;
    Marker = maps.Marker;
    Callout = maps.Callout;
    PROVIDER_GOOGLE = maps.PROVIDER_GOOGLE;
  } catch (e) {
    // fallback to null components
  }
}
import { MapFact } from '../types';
import { Globe } from 'lucide-react-native';

export const MapExplorer = ({ mapFacts }: { mapFacts: MapFact[] }) => {
  const [selectedFact, setSelectedFact] = useState<MapFact | null>(null);

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Globe color="#4fa3ff" size={22} style={{ marginRight: 8 }} />
        <Text style={styles.sectionTitle}>Global Curiosities</Text>
      </View>
      {Platform.OS === 'web' ? (
        <View style={[styles.map, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#222' }]}> 
          <Text style={{ color: '#fff', textAlign: 'center' }}>
            Map is not supported on web.
          </Text>
        </View>
      ) : (
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 20,
          longitude: 0,
          latitudeDelta: 120,
          longitudeDelta: 120,
        }}
        provider={PROVIDER_GOOGLE}
      >
        {mapFacts.map(fact => (
          <Marker
            key={fact.id}
            coordinate={{ latitude: fact.coordinates.lat, longitude: fact.coordinates.lng }}
            onPress={() => setSelectedFact(fact)}
          >
            <Callout tooltip>
              <View style={styles.calloutBox}>
                <Text style={styles.country}>{fact.country}</Text>
                <Text style={styles.fact}>{fact.fact}</Text>
                {fact.imageUrl && <Image source={{ uri: fact.imageUrl }} style={styles.image} />}
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      )}
      {/* Modal fallback for more info if needed */}
      <Modal visible={!!selectedFact} transparent animationType="slide" onRequestClose={() => setSelectedFact(null)}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setSelectedFact(null)}>
          <View style={styles.modalBox}>
            {selectedFact && (
              <>
                <Text style={styles.country}>{selectedFact.country}</Text>
                <Text style={styles.fact}>{selectedFact.fact}</Text>
                {selectedFact.imageUrl && <Image source={{ uri: selectedFact.imageUrl }} style={styles.image} />}
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
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
    color: '#4fa3ff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  map: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    marginBottom: 8,
  },
  calloutBox: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    maxWidth: 200,
  },
  country: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  fact: {
    color: '#ccc',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#222',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    maxWidth: 300,
  },
}); 