import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { createTables, insertPlayer } from '../db/database';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Tabs: { screen?: 'Home' | 'GameBoard' | 'Leaderboard' };
  PlayerSetup: undefined;
  TriviaCard: undefined;
};

type PlayerSetupScreenNavProp = NativeStackNavigationProp<RootStackParamList, 'PlayerSetup'>;

// Define the colors for player avatars
const colors = ['#FF6B6B', '#6BCB77', '#4D96FF', '#FFD93D'];

const PlayerSetupScreen: React.FC = () => {
    const navigation = useNavigation<PlayerSetupScreenNavProp>();
    const [playerName, setPlayerName] = useState('');
    const [selectedColor, setSelectedColor] = useState(colors[0]);

  useEffect(() => {
    createTables();
  }, []);

  const handleSubmit = () => {
    if (playerName.trim() === '') {
      Alert.alert('Validation', 'Please enter your name!');
      return;
    }
    insertPlayer(playerName, selectedColor, () => {
      console.log('Player Saved!');
      navigation.navigate('Tabs', { screen: 'GameBoard' });;
    });
  };

// Render color options for player avatar selection
  const renderColorOption = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.colorOption, { backgroundColor: item }, item === selectedColor && styles.selectedColor]}
      onPress={() => setSelectedColor(item)}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Player Setup</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={playerName}
        onChangeText={setPlayerName}
      />
      <Text style={styles.subtitle}>Choose Your Hippo Color:</Text>
      <FlatList
        data={colors}
        renderItem={renderColorOption}
        keyExtractor={(item) => item}
        horizontal
        contentContainerStyle={styles.colorList}
      />
      <Button title="Start Race!" onPress={handleSubmit} />
    </View>
  );
};

export default PlayerSetupScreen;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 18,
    backgroundColor: '#fff',
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  colorList: {
    marginBottom: 20,
    justifyContent: 'space-around',
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  selectedColor: {
    borderColor: '#000',
    borderWidth: 3,
  },
});
