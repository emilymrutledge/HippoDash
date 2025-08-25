import { ref, push } from 'firebase/database';
import { db } from './firebaseConfig';

export const pushPlayerToLeaderboard = (name: string) => {
  const now = new Date();
  const winDate = now.toLocaleString();

  push(ref(db, 'leaderboard'), {
    name,
    winDate,
  });
};
