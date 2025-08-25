import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchPlayers, updatePlayerProgress } from '../db/database';

type RootStackParamList = {
  Home: undefined;
  PlayerSetup: undefined;
  GameBoard: { screen?: 'RaceTrack' | 'Leaderboard' };
  TriviaCard: { player: Player };
  GameOver: { winner: string };
};

type Player = {
  id: number;
  name: string;
  avatarColor: string;
  progress: number;
};

const TOTAL_SPACES = 5;

const GameBoardScreen: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const isFocused = useIsFocused();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (isFocused) {
      refreshPlayers();
    }
  }, [isFocused]);

  const refreshPlayers = () => {
    fetchPlayers((fetchedPlayers) => {
      setPlayers(fetchedPlayers);
      const winningPlayer = fetchedPlayers.find(p => p.progress >= 100);
      if (winningPlayer) setWinner(winningPlayer.name);
    });
  };

  const resetAllProgress = () => {
    players.forEach((player) => {
      updatePlayerProgress(player.id, 0, () => {});
    });
    setTimeout(refreshPlayers, 300);
  };

  const renderPlayer = ({ item }: { item: Player }) => {
    const currentSpace = Math.min(Math.floor((item.progress / 100) * TOTAL_SPACES), TOTAL_SPACES - 1);

    return (
      <View style={styles.playerRow}>
        <View style={[styles.avatar, { backgroundColor: item.avatarColor }]} />
        <Text style={styles.playerName}>{item.name}</Text>

        <View style={styles.boardTrack}>
          {Array.from({ length: TOTAL_SPACES }).map((_, index) => (
            <View key={index} style={styles.space}>
              {index === currentSpace && (
                <Image source={require('../assets/hippopotamus.png')} style={styles.hippoIcon} />
              )}
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.triviaButton}
          onPress={() => navigation.navigate('TriviaCard', { player: item })}
        >
          <Text style={styles.triviaButtonText}>Play Trivia</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hippo Dash Race!</Text>

      <FlatList
        data={players}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPlayer}
      />

      {/* Winner Overlay */}
      {winner && (
        <View style={styles.overlay}>
          <View style={styles.overlayContent}>
            <Text style={styles.winnerText}>🏆 {winner} Wins! 🏆</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setWinner(null)}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Bottom Navigation Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('PlayerSetup')}
        >
          <Text style={styles.navButtonText}>Add More Players</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={resetAllProgress}
        >
          <Text style={styles.resetButtonText}>Reset Race</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GameBoardScreen;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e0f7fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  playerName: {
    width: 50,
    fontSize: 16,
  },
  boardTrack: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  space: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hippoIcon: {
    width: 24,
    height: 24,
  },
  triviaButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginLeft: 10,
  },
  triviaButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  navButton: {
    backgroundColor: '#007ACC',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#FF5252',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginLeft: 10,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  overlayContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
  },
  winnerText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4CAF50',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});