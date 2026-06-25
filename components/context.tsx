import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

// 1. Estructura de los datos para Colombia
export type TipoHora = 'ordinaria' | 'dominical' | 'festiva' | 'nocturna';

export interface RegistroJornada {
  id: string;
  fecha: string;          // Formato YYYY-MM-DD
  horaEntrada: string;    // Ej: "08:00"
  horaSalida: string;     // Ej: "17:00"
  horasTrabajadas: number; // El sistema calcula esto automáticamente
  tipoHora: TipoHora;     
  notas?: string;
}

interface AppContextType {
  jornadas: RegistroJornada[];
  horasSemanalesActuales: number;
  jornadaObjetivoSemanal: number;
  agregarJornada: (fecha: string, horaEntrada: string, horaSalida: string, horas: number, tipo: TipoHora, notas?: string) => Promise<void>;
  borrarJornada: (id: string) => Promise<void>;
}


// Clave única para guardar los datos en el almacenamiento del celular
const STORAGE_KEY = '@control_horas_colombia';
const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [jornadas, setJornadas] = useState<RegistroJornada[]>([]);
  const [horasSemanalesActuales, setHorasSemanalesActuales] = useState<number>(0);
  
  // Jornada laboral ordinaria en Colombia (Ley 2101)
  const JORNADA_OBJETIVO_SEMANAL = 42; 

  // 2. Cargar las horas guardadas al abrir la aplicación
  const cargarDatos = useCallback(async () => {
    try {
      const datos = await AsyncStorage.getItem(STORAGE_KEY);
      if (datos) {
        const listaJornadas: RegistroJornada[] = JSON.parse(datos);
        setJornadas(listaJornadas);
        calcularHorasSemanaActual(listaJornadas);
      }
    } catch (e) {
      console.error("Error al cargar horas:", e);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // 3. Calcular cuántas horas llevas acumuladas en la semana actual
  const calcularHorasSemanaActual = (lista: RegistroJornada[]) => {
    const hoy = new Date();
    // Encontrar el lunes de la semana actual
    const inicioSemana = new Date(hoy.setDate(hoy.getDate() - hoy.getDay() + (hoy.getDay() === 0 ? -6 : 1)));
    inicioSemana.setHours(0, 0, 0, 0);

    const total = lista
      .filter(j => new Date(j.fecha) >= inicioSemana)
      .reduce((sum, j) => sum + j.horasTrabajadas, 0);

    setHorasSemanalesActuales(total);
  };

 // 4. Guardar un nuevo registro de horas en el dispositivo
  const agregarJornada = async (
    fecha: string, 
    horaEntrada: string, 
    horaSalida: string, 
    horas: number, 
    tipo: TipoHora, 
    notas?: string
  ) => {
    const nuevaJornada: RegistroJornada = {
      id: Date.now().toString(),
      fecha,
      horaEntrada,
      horaSalida,
      horasTrabajadas: horas,
      tipoHora: tipo,
      notas
    };
    
    const listaActualizada = [nuevaJornada, ...jornadas];
    setJornadas(listaActualizada);
    calcularHorasSemanaActual(listaActualizada);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(listaActualizada));
  };

  // 5. Eliminar un registro por si te equivocas
  const borrarJornada = async (id: string) => {
    const listaActualizada = jornadas.filter(j => j.id !== id);
    setJornadas(listaActualizada);
    calcularHorasSemanaActual(listaActualizada);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(listaActualizada));
  };

  return (
    <AppContext.Provider value={{ 
      jornadas, 
      horasSemanalesActuales, 
      jornadaObjetivoSemanal: JORNADA_OBJETIVO_SEMANAL, 
      agregarJornada, 
      borrarJornada 
    }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook amigable para usar los datos en cualquier pantalla
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp debe usarse dentro de un AppProvider');
  return context;
};
