import { useColorScheme } from '@/components/useColorScheme';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563eb', // Azul brillante de tus capturas
        tabBarInactiveTintColor: '#475569',
        tabBarStyle: {
          backgroundColor: '#131c2e', // Fondo oscuro del menú inferior
          borderTopColor: '#1e2b44/40',
          paddingBottom: 5,
          height: 60,
        },
        headerShown: false, // Ocultar la barra superior fea por defecto
      }}
    >
      {/* Pestaña 1: Registro (index.tsx) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Registro',
        }}
      />
      
      {/* Pestaña 2: Estadísticas / Resumen */}
      {/* Nota: Asegúrate de que el nombre aquí coincida exactamente con el nombre de tu otro archivo dentro de (tabs) sin la extensión */}
      <Tabs.Screen
        name="resumen" // Cambiar por "two" o "resumen" si tu archivo se llama así
        options={{
          title: 'Consolidado',
        }}
      />
    </Tabs>
  );
}
