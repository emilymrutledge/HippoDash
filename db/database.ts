import SQLite from 'react-native-sqlite-storage';

// Enable debugging
SQLite.enablePromise(false);
SQLite.DEBUG(true);

const db = SQLite.openDatabase(
  { name: 'hippodash.db', location: 'default' },
  () => console.log('Database opened successfully!'),
  (error) => console.log('Database failed to open:', error)
);

// Create Tables (with progress column)
export const createTables = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        avatarColor TEXT,
        progress INTEGER DEFAULT 0
      );`,
      [],
      () => console.log('Table created successfully!'),
      (tx, error) => {
        console.log('Table Creation Error:', error.message);
        return true;
      }
    );
  });
};

// Insert New Player
export const insertPlayer = (name: string, avatarColor: string, callback: () => void) => {
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO players (name, avatarColor, progress) VALUES (?, ?, 0);',
      [name, avatarColor],
      () => callback(),
      (tx, error) => {
        console.log('Insert Error:', error.message);
        return true;
      }
    );
  });
};

// Fetch All Players
export const fetchPlayers = (callback: (players: { id: number; name: string; avatarColor: string; progress: number }[]) => void) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM players;',
      [],
      (tx, results) => {
        const rows = results.rows;
        const players = [];
        for (let i = 0; i < rows.length; i++) {
          players.push(rows.item(i));
        }
        callback(players);
      },
      (tx, error) => {
        console.log('Fetch Error:', error.message);
        return true;
      }
    );
  });
};

export const clearPlayers = (callback: () => void) => {
  db.transaction((tx) => {
    tx.executeSql(
      'DELETE FROM players;',
      [],
      () => {
        console.log('All players cleared!');
        callback();
      },
      (tx, error) => {
        console.log('Clear Error:', error.message);
        return true;
      }
    );
  });
};

// Update Player Progress
export const updatePlayerProgress = (id: number, newProgress: number, callback: () => void) => {
  db.transaction((tx) => {
    tx.executeSql(
      'UPDATE players SET progress = ? WHERE id = ?;',
      [newProgress, id],
      () => callback(),
      (tx, error) => {
        console.log('Progress Update Error:', error.message);
        return true;
      }
    );
  });
};
