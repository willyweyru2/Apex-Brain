import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, SafeAreaView, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [score, setScore] = useState(0);
  const [activeTile, setActiveTile] = useState(null);
  const [highScore, setHighScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [lastReaction, setLastReaction] = useState(0);

  // Load High Score on startup
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const savedScore = await AsyncStorage.getItem('APEX_HIGH_SCORE');
    if (savedScore) setHighScore(parseInt(savedScore));
  };

  const startChallenge = () => {
    const randomTile = Math.floor(Math.random() * 9);
    setActiveTile(randomTile);
    setStartTime(Date.now());
  };

  const handleTap = async (index) => {
    if (index === activeTile) {
      // Calculate speed
      const reaction = Date.now() - startTime;
      setLastReaction(reaction);

      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      
      const nextScore = score + 1;
      setScore(nextScore);

      // Save new high score if beaten
      if (nextScore > highScore) {
        setHighScore(nextScore);
        await AsyncStorage.setItem('APEX_HIGH_SCORE', nextScore.toString());
      }
      
      startChallenge();
    } else {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      setScore(0);
      setActiveTile(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>SPEED: {lastReaction}ms</Text>
        <Text style={styles.label}>BEST: {highScore}</Text>
      </View>

      <Text style={styles.score}>{score}</Text>

      <View style={styles.grid}>
        {[...Array(9)].map((_, i) => (
          <TouchableOpacity 
            key={i}
            onPress={() => handleTap(i)}
            style={[styles.tile, activeTile === i ? styles.activeTile : null]} 
          />
        ))}
      </View>

      {!activeTile && (
        <TouchableOpacity style={styles.button} onPress={startChallenge}>
          <Text style={styles.buttonText}>OPTIMIZE BRAIN</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505', alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginBottom: 20 },
  label: { color: '#666', fontSize: 12, letterSpacing: 1 },
  score: { color: '#00D4FF', fontSize: 80, fontWeight: '100', marginBottom: 20 },
  grid: { width: 320, height: 320, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  tile: { width: 95, height: 95, margin: 5, backgroundColor: '#111', borderRadius: 15, borderWidth: 1, borderColor: '#222' },
  activeTile: { backgroundColor: '#00D4FF', shadowColor: '#00D4FF', shadowRadius: 20, shadowOpacity: 0.8 },
  button: { marginTop: 50, paddingHorizontal: 40, paddingVertical: 15, borderRadius: 30, backgroundColor: '#00D4FF' },
  buttonText: { color: '#000', fontWeight: '900', letterSpacing: 1 }
});