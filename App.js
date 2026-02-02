import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, SafeAreaView, Platform, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  // --- STATE MANAGEMENT ---
  const [score, setScore] = useState(0);
  const [activeTile, setActiveTile] = useState(null);
  const [trapTile, setTrapTile] = useState(null);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState("NOVICE");
  const [startTime, setStartTime] = useState(null);
  const [lastReaction, setLastReaction] = useState(0);

  // --- INITIALIZATION ---
  useEffect(() => {
    loadHighScore();
  }, []);

  const loadHighScore = async () => {
    try {
      const saved = await AsyncStorage.getItem('APEX_HIGH_SCORE');
      if (saved) setHighScore(parseInt(saved));
    } catch (e) {
      console.log("Failed to load high score");
    }
  };

  // --- GAME LOGIC ---
  const calculateLevel = (currentScore, speed) => {
    if (currentScore > 30 && speed < 280) return "APEX";
    if (currentScore > 15) return "ELITE";
    if (currentScore > 5) return "FOCUSED";
    return "NOVICE";
  };

  const startChallenge = () => {
    // Spawn Active Tile
    const newActive = Math.floor(Math.random() * 9);
    setActiveTile(newActive);
    
    // 20% Chance to spawn a Trap Tile
    if (Math.random() > 0.8) {
      let potentialTrap = Math.floor(Math.random() * 9);
      if (potentialTrap !== newActive) {
        setTrapTile(potentialTrap);
      } else {
        setTrapTile(null);
      }
    } else {
      setTrapTile(null);
    }
    
    setStartTime(Date.now());
  };

  const handleTap = async (index) => {
    // 1. Handle Trap Tap (Game Over)
    if (index === trapTile) {
      triggerFeedback('error');
      endSession("NEURAL OVERLOAD: You hit an Inhibitor!");
      return;
    }

    // 2. Handle Correct Tap
    if (index === activeTile) {
      const reaction = Date.now() - startTime;
      const nextScore = score + 1;
      
      triggerFeedback('success');
      setLastReaction(reaction);
      setScore(nextScore);
      
      // Update Rank
      const currentRank = calculateLevel(nextScore, reaction);
      setLevel(currentRank);

      // Save High Score
      if (nextScore > highScore) {
        setHighScore(nextScore);
        await AsyncStorage.setItem('APEX_HIGH_SCORE', nextScore.toString());
      }

      startChallenge();
    } 
    // 3. Handle Empty Tile Tap (Game Over)
    else if (activeTile !== null) {
      triggerFeedback('error');
      endSession("MISS: Precision Lost.");
    }
  };

  const triggerFeedback = (type) => {
    if (Platform.OS === 'web') return; 
    if (type === 'success') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (type === 'error') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  };

  const endSession = (message) => {
    alert(message + `\nScore: ${score}`);
    setScore(0);
    setLevel("NOVICE");
    setActiveTile(null);
    setTrapTile(null);
  };

  // --- RENDERING ---
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>RANK</Text>
          <Text style={styles.headerValue}>{level}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.label}>BEST</Text>
          <Text style={styles.headerValue}>{highScore}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <Text style={styles.statText}>SPEED: {lastReaction}ms</Text>
      </View>

      <Text style={styles.scoreDisplay}>{score}</Text>

      <View style={styles.grid}>
        {[...Array(9)].map((_, i) => (
          <TouchableOpacity 
            key={i}
            activeOpacity={0.7}
            onPress={() => handleTap(i)}
            style={[
              styles.tile, 
              activeTile === i ? { backgroundColor: level === 'APEX' ? '#FF00FF' : '#00D4FF', borderColor: '#fff' } : null,
              trapTile === i ? { backgroundColor: '#FF4444' } : null
            ]} 
          />
        ))}
      </View>

      {!activeTile && (
        <TouchableOpacity style={styles.mainButton} onPress={startChallenge}>
          <Text style={styles.buttonText}>OPTIMIZE BRAIN</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505', alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', width: '85%', position: 'absolute', top: 60 },
  label: { color: '#444', fontSize: 10, letterSpacing: 2, fontWeight: 'bold' },
  headerValue: { color: '#fff', fontSize: 18, fontWeight: '900' },
  statsRow: { marginBottom: 10 },
  statText: { color: '#00D4FF', fontSize: 12, letterSpacing: 1 },
  scoreDisplay: { color: '#fff', fontSize: 100, fontWeight: '100', marginBottom: 30 },
  grid: { width: 330, height: 330, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  tile: { width: 100, height: 100, margin: 5, backgroundColor: '#111', borderRadius: 20, borderWidth: 1, borderColor: '#222' },
  mainButton: { marginTop: 60, paddingHorizontal: 50, paddingVertical: 18, borderRadius: 40, backgroundColor: '#00D4FF', shadowColor: '#00D4FF', shadowRadius: 15, shadowOpacity: 0.5 },
  buttonText: { color: '#000', fontWeight: '900', letterSpacing: 2 }
});