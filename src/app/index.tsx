import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function TitleScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orbit Core</Text>
      <Text style={styles.subtitle}>Neon Ring Puzzle</Text>
      <View style={styles.buttonStack}>
        <Link href="/game" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Start</Text>
          </Pressable>
        </Link>
        <Link href="/result" asChild>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>Results</Text>
          </Pressable>
        </Link>
      </View>
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
    fontSize: 40,
    fontWeight: '700',
    color: '#8ff9ff',
    letterSpacing: 2,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#9aa7c2',
    marginBottom: 40,
  },
  buttonStack: {
    width: '100%',
    gap: 16,
  },
  button: {
    backgroundColor: '#2b6cff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#f6f8ff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#3a4663',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryText: {
    color: '#9aa7c2',
    fontSize: 16,
  },
});
