import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>Orbit Core</Text>
        <Text style={styles.subtitle}>Neon ring puzzle prototype</Text>
      </View>
      <View style={styles.menu}>
        <Link href="/game" style={styles.button}>
          <Text style={styles.buttonText}>Start</Text>
        </Link>
        <Link href="/settings" style={[styles.button, styles.secondaryButton]}>
          <Text style={styles.buttonText}>Settings</Text>
        </Link>
        <Link href="/shop" style={[styles.button, styles.secondaryButton]}>
          <Text style={styles.buttonText}>Shop</Text>
        </Link>
      </View>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070913',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    color: '#d8fbff',
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 12,
  },
  subtitle: {
    color: '#7ad9ff',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  menu: {
    gap: 16,
  },
  button: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#39c9ff',
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: '#132237',
    alignItems: 'center',
  },
  secondaryButton: {
    borderColor: '#37506b',
    backgroundColor: '#0f1928',
  },
  buttonText: {
    color: '#d8fbff',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
});
