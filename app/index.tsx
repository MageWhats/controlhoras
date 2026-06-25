import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function RootIndex() {
  const router = useRouter();

  useEffect(() => {
    // Pequeño retraso o microtarea para asegurar que el Layout esté listo
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 10);

    return () => clearTimeout(timer);
  }, [router]);

  // Mostramos una pantalla limpia de carga mientras se ejecuta el salto
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}
