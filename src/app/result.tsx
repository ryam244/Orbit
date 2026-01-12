import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ResultScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Result</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Score</Text>
        <Text style={styles.score}>12,340</Text>
        <Text style={styles.label}>Combo</Text>
        <Text style={styles.value}>x4</Text>
      </View>
      <Link href="/" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Back to Title</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#05070d',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#f6f8ff',
    marginBottom: 24,
  },
  card: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#1c2233',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    backgroundColor: '#0b1020',
  },
  label: {
    color: '#9aa7c2',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  score: {
    fontSize: 36,
    fontWeight: '700',
    color: '#8ff9ff',
    marginBottom: 16,
  },
  value: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f6f8ff',
  },
  button: {
    backgroundColor: '#2b6cff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    color: '#f6f8ff',
    fontSize: 16,
    fontWeight: '600',
  },
});
