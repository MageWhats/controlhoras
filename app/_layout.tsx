import { AppProvider } from '@/components/context';
import { Stack } from 'expo-router';
import "./global.css";

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Forzamos a Expo Router a saltar directo a la carpeta (tabs) */}
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AppProvider>
  );
}
