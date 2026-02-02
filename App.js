import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native'; // Add Platform to your imports

export default function App() {
  // 1. STATE: This is the brain of the app. It remembers the score and current target.
  const [score, setScore] = useState(0);
  const [activeTile, setActiveTile] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(0);


  // 2. FUNCTION: Spawns a new light on the grid
  const startChallenge = () => {
    const randomTile = Math.floor(Math.random() * 9);
    setActiveTile(randomTile);
  };
  

  // 3. FUNCTION: Handles when the user taps a tile
  const [timer, setTimer] = useState(1000); // 1 second to start

  const handleTap = (index) => {
    if (index === activeTile) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setScore(score + 1);
      
      // ADAPTIVE DIFFICULTY: Every 5 points, the game gets 10% faster
      if (score > 0 && score % 5 === 0) {
        setTimer(prev => prev * 0.9);
      }
      
      startChallenge();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      alert(`Session Over. Neural Score: ${score}`);
      setScore(0);
      setTimer(1000);
      setActiveTile(null);
    }
    if (index === activeTile) {
  // Only vibrate if we are NOT on the web
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
  setScore(score + 1);
  startChallenge();
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
const startChallenge = () => {
  const randomTile = Math.floor(Math.random() * 9);
  setActiveTile(randomTile);
  setStartTime(Date.now()); // Start the clock
};

const handleTap = (index) => {
  if (index === activeTile) {
    const timeTaken = Date.now() - startTime;
    setReactionTime(timeTaken);
    // ... rest of your logic

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
style={[
  styles.tile, 
  activeTile === i ? styles.activeTile : null,
  flashTile === i ? { backgroundColor: '#FFD700' } : null // Golden flash
]}