import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { updatePlayerProgress } from '../db/database';
import { decode } from 'html-entities';
import { pushPlayerToLeaderboard } from '../db/firebaseLeaderboard';

type RootStackParamList = {
  TriviaCard: { player: { id: number; name: string; progress: number } };
};

type Question = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};


const TriviaCardScreen: React.FC = () => {
  const [questionData, setQuestionData] = useState<Question | null>(null);
  const [allAnswers, setAllAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'TriviaCard'>>();
  const { player } = route.params;

  // Fetch trivia question from API
  useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=1&type=multiple')
      .then((res) => res.json())
      .then((data) => {
        const q = data.results[0];
        const decodedQ = {
          question: decode(q.question),
          correct_answer: decode(q.correct_answer),
          incorrect_answers: q.incorrect_answers.map((ans: string) => decode(ans)),
        };
        const answers = shuffleArray([decodedQ.correct_answer, ...decodedQ.incorrect_answers]);
        setQuestionData(decodedQ);
        setAllAnswers(answers);
        setLoading(false);
      });
  }, []);

// Shuffle answers to randomize order
  const shuffleArray = (array: string[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleAnswer = (selectedAnswer: string) => {
    const isCorrect = selectedAnswer === questionData?.correct_answer;
    const newProgress = isCorrect ? player.progress + 25 : player.progress;
    const cappedProgress = Math.min(newProgress, 100);

    if (isCorrect) {
      updatePlayerProgress(player.id, cappedProgress, () => {
        if (cappedProgress >= 100) {
          pushPlayerToLeaderboard(player.name);
          Alert.alert('🏆 Race Completed!', `${player.name} finished the race!`, [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]);
        } else {
          Alert.alert('Correct!', 'You move forward!', [
            {
              text: 'Continue',
              onPress: () => navigation.goBack(),
            },
          ]);
        }
      });
    } else {
      Alert.alert('Oops!', 'No progress this turn.', [
        {
          text: 'Continue',
          onPress: () => navigation.goBack(),
        },
      ]);
    }
  };

  if (loading || !questionData) {
    return <ActivityIndicator size="large" color="#007acc" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trivia Time!</Text>
      <Text style={styles.question}>{questionData.question}</Text>
      {allAnswers.map((answer, idx) => (
        <TouchableOpacity key={idx} style={styles.answerButton} onPress={() => handleAnswer(answer)}>
          <Text style={styles.answerText}>{answer}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TriviaCardScreen;

//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  question: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  answerButton: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
  },
  answerText: {
    fontSize: 18,
    textAlign: 'center',
  },
  loader: {
    marginTop: 50,
  },
});
