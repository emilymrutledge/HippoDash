import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBJtmJ4wftm-2jZqglPkafdQiJ95Je-Kqc",
  authDomain: "hippodash-4f6e8.firebaseapp.com",
  databaseURL: "https://hippodash-4f6e8-default-rtdb.firebaseio.com",
  projectId: "hippodash-4f6e8",
  storageBucket: "hippodash-4f6e8.firebasestorage.app",
  messagingSenderId: "450943094993",
  appId: "1:450943094993:web:4ac140d24459007665f5f0"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
