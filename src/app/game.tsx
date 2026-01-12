import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function GameScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game</Text>
      <Text style={styles.body}>Gameplay loop will render here.</Text>
      <View style={styles.buttonRow}>
        <Link href="/" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Title</Text>
          </Pressable>
        </Link>
        <Link href="/result" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Finish</Text>
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
    backgroundColor: '#070a14',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#f6f8ff',
    marginBottom: 12,
  },
  body: {
    color: '#9aa7c2',
    marginBottom: 32,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    borderWidth: 1,
    borderColor: '#2b6cff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  buttonText: {
    color: '#8ff9ff',
    fontWeight: '600',
  },
});
