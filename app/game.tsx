import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function GameScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game</Text>
      <Text style={styles.subtitle}>Ring grid + falling blocks will land here.</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05070f',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#d8fbff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#7ad9ff',
    fontSize: 14,
    textAlign: 'center',
  },
});
