import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from '../db/firebaseConfig';
import { ref, onValue } from 'firebase/database';

type Player = {
  id: string;
  name: string;
  winDate: string;
};

const LeaderboardScreen: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const playersRef = ref(db, 'leaderboard');

    const unsubscribe = onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const playerArray: Player[] = Object.entries(data).map(([id, player]: [string, any]) => ({
          id,
          name: player.name,
          winDate: player.winDate,
        }));

        // Sort by date (newest first)
        playerArray.sort((a, b) => new Date(b.winDate).getTime() - new Date(a.winDate).getTime());

        setPlayers(playerArray);
      } else {
        setPlayers([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }: { item: Player; index: number }) => (
  <View style={styles.itemContainer}>
    <Text style={styles.rank}>👑</Text>
    <View style={styles.details}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.date}>{item.winDate}</Text>
    </View>
  </View>
);


  if (loading) {
    return <ActivityIndicator size="large" color="#007acc" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={players}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No players yet!</Text>}
      />
    </View>
  );
};

export default LeaderboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  rank: {
    fontSize: 18,
    width: 30,
    textAlign: 'center',
  },
  name: {
    fontSize: 18,
    flex: 1,
    marginLeft: 10,
  },
  details: {
  flex: 1,
  marginLeft: 10,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  loader: {
    marginTop: 50,
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});
