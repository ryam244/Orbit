import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function ShopScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop</Text>
      <Text style={styles.subtitle}>Skins and neon upgrades coming soon.</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070912',
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
