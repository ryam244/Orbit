import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { useGameStore } from '../stores/useGameStore';

export default function RootLayout() {
  const loadPersistedData = useGameStore((state) => state.loadPersistedData);

  // Load persisted data on app startup
  useEffect(() => {
    loadPersistedData();
  }, [loadPersistedData]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
