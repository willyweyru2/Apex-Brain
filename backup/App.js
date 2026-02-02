import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import * as Haptics from 'expo-haptics';

export default function App() {
  // 1. STATE: This is the brain of the app. It remembers the score and current target.
  const [score, setScore] = useState(0);
  const [activeTile, setActiveTile] = useState(null);

  // 2. FUNCTION: Spawns a new light on the grid
  const startChallenge = () => {
    const randomTile = Math.floor(Math.random() * 9);
    setActiveTile(randomTile);
  };

  // 3. FUNCTION: Handles when the user taps a tile
  const handleTap = (index) => {
    if (index === activeTile) {
      // Success! Play a light vibration
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setScore(score + 1);
      startChallenge(); // Move to the next one
    } else {
      // Mistake! Play a heavy vibration
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setScore(0); // Reset for cognitive discipline
      setActiveTile(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>APEX BRAIN</Text>
      <Text style={styles.score}>NEURAL SCORE: {score}</Text>

      <View style={styles.grid}>
        {[...Array(9)].map((_, i) => (
          <TouchableOpacity 
            key={i}
            onPress={() => handleTap(i)}
            style={[
              styles.tile, 
              activeTile === i ? styles.activeTile : null
            ]} 
          />
        ))}
      </View>

      {!activeTile && (
        <TouchableOpacity style={styles.button} onPress={startChallenge}>
          <Text style={styles.buttonText}>BEGIN SESSION</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#fff', fontSize: 12, letterSpacing: 5, marginBottom: 10 },
  score: { color: '#00D4FF', fontSize: 32, fontWeight: '900', marginBottom: 40 },
  grid: { width: 300, height: 300, flexDirection: 'row', flexWrap: 'wrap' },
  tile: { width: 90, height: 90, margin: 5, backgroundColor: '#111', borderRadius: 5, borderOuterWidth: 1, borderColor: '#222' },
  activeTile: { backgroundColor: '#00D4FF' },
  button: { marginTop: 50, padding: 20, borderColor: '#00D4FF', borderWidth: 1, borderRadius: 5 },
  buttonText: { color: '#00D4FF', fontWeight: 'bold' }
});