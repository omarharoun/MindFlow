import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { GameFact } from '../types';
import { HelpCircle } from 'lucide-react-native';

export const FactVsFictionGame = ({ getRandomFact }: { getRandomFact: () => GameFact }) => {
  const [fact, setFact] = useState<GameFact>(getRandomFact());
  const [result, setResult] = useState<string | null>(null);

  const handleGuess = (guess: boolean) => {
    if (guess === fact.isTrue) {
      setResult('Correct!');
    } else {
      setResult('Incorrect!');
    }
  };

  const nextFact = () => {
    setFact(getRandomFact());
    setResult(null);
  };

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <HelpCircle color="#fdcb6e" size={22} style={{ marginRight: 8 }} />
        <Text style={styles.sectionTitle}>Fact vs. Fiction</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.factText}>{fact.text}</Text>
        {!result ? (
          <View style={styles.buttonRow}>
            <Button title="True" onPress={() => handleGuess(true)} />
            <Button title="False" onPress={() => handleGuess(false)} />
          </View>
        ) : (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>{result}</Text>
            <Text style={styles.explanation}>{fact.explanation}</Text>
            <Button title="Next" onPress={nextFact} />
          </View>
        )}
      </View>
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
    color: '#fdcb6e',
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  factText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  resultBox: {
    alignItems: 'center',
    marginTop: 8,
  },
  resultText: {
    color: '#4fa3ff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  explanation: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
}); 