import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { clearPlayers, fetchPlayers } from '../db/database';

// Define the root stack with nested Tabs screen
type RootStackParamList = {
  Tabs: { screen?: 'Home' | 'GameBoard' | 'Leaderboard' };
  PlayerSetup: undefined;
  TriviaCard: { player: any };
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [playersExist, setPlayersExist] = useState(false);

  useEffect(() => {
    fetchPlayers((players) => {
      setPlayersExist(players.length > 0);
    });
  }, []);

  const handleClearPlayers = () => {
    Alert.alert(
      'Confirm Reset',
      'Are you sure you want to clear all player data?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearPlayers(() => {
              setPlayersExist(false);
              Alert.alert('Player data cleared!');
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/hippo_logo.png')} style={styles.logo} />
      <Text style={styles.title}>Hippo Dash</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PlayerSetup')}
      >
        <Text style={styles.buttonText}>Start New Game</Text>
      </TouchableOpacity>

      {playersExist && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Tabs', { screen: 'GameBoard' })}
        >
          <Text style={styles.buttonText}>Resume Game</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Tabs', { screen: 'Leaderboard' })}
      >
        <Text style={styles.buttonText}>View Leaderboard</Text>
      </TouchableOpacity>

      {playersExist && (
        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={handleClearPlayers}
        >
          <Text style={styles.buttonText}>Clear Player Data</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f7fa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#007acc',
  },
  button: {
    backgroundColor: '#4D96FF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginVertical: 10,
    width: '80%',
  },
  clearButton: {
    backgroundColor: '#FF5252',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});
