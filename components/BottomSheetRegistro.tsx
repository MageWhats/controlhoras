import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { cn } from '../utils/cn';
import { TipoHora } from './context';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onGuardar: (horaEntrada: string, horaSalida: string, horasTotales: number, tipo: TipoHora, notas: string) => void;
}

export default function BottomSheetRegistro({ visible, onClose, onGuardar }: BottomSheetProps) {
  // Estados para hora y minutos de Entrada
  const [entradaH, setEntradaH] = useState('08');
  const [entradaM, setEntradaM] = useState('00');
  
  // Estados para hora y minutos de Salida
  const [salidaH, setSalidaH] = useState('17');
  const [salidaM, setSalidaM] = useState('00');

  const [tipo, setTipo] = useState<TipoHora>('ordinaria');
  const [notas, setNotas] = useState('');

  const fechaHoyFormateada = "Jueves, 4/06/2026"; 

  const handleConfirmarGuardar = () => {
    const entH = parseInt(entradaH) || 0;
    const entM = parseInt(entradaM) || 0;
    const salH = parseInt(salidaH) || 0;
    const salM = parseInt(salidaM) || 0;

    // Convertir todo a minutos totales desde la medianoche para calcular la diferencia
    const minutosEntrada = (entH * 60) + entM;
    let minutosSalida = (salH * 60) + salM;

    // Si la hora de salida es menor, asumimos que trabajó hasta el día siguiente (turno nocturno)
    if (minutosSalida < minutosEntrada) {
      minutosSalida += 24 * 60; 
    }

    const diferenciaMinutos = minutosSalida - minutosEntrada;
    const horasTotales = parseFloat((diferenciaMinutos / 60).toFixed(2));

    if (horasTotales <= 0) {
      alert("La hora de salida no puede ser igual a la de entrada.");
      return;
    }

    const horaEntradaString = `${entradaH.padStart(2, '0')}:${entradaM.padStart(2, '0')}`;
    const horaSalidaString = `${salidaH.padStart(2, '0')}:${salidaM.padStart(2, '0')}`;

    onGuardar(horaEntradaString, horaSalidaString, horasTotales, tipo, notas);
    
    // Limpiar notas y cerrar
    setNotas('');
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 justify-end bg-black/60">
        <TouchableOpacity className="flex-1" activeOpacity={1} onPress={onClose} />

        <View className="bg-[#151f32] rounded-t-3xl p-6 border-t border-[#1e2b44]/60 pb-10">
          <View className="w-10 h-1 bg-slate-600 rounded-full self-center mb-5" />

          <Text className="text-xl font-bold text-white mb-1">Registrar Jornada</Text>
          <Text className="text-slate-400 text-xs mb-6">{fechaHoyFormateada}</Text>

          {/* SECCIÓN HORA DE ENTRADA */}
          <Text className="text-blue-400 text-[10px] font-bold uppercase tracking-wider mb-2">Hora de Entrada (Formato 24h)</Text>
          <View className="flex-row items-center gap-x-2 mb-4">
            <TextInput
              className="bg-[#0b121f] text-white text-lg font-bold text-center w-16 p-2 rounded-xl border border-[#1e2b44]"
              keyboardType="numeric"
              maxLength={2}
              value={entradaH}
              onChangeText={setEntradaH}
            />
            <Text className="text-white font-bold">:</Text>
            <TextInput
              className="bg-[#0b121f] text-white text-lg font-bold text-center w-16 p-2 rounded-xl border border-[#1e2b44]"
              keyboardType="numeric"
              maxLength={2}
              value={entradaM}
              onChangeText={setEntradaM}
            />
          </View>

          {/* SECCIÓN HORA DE SALIDA */}
          <Text className="text-blue-400 text-[10px] font-bold uppercase tracking-wider mb-2">Hora de Salida (Formato 24h)</Text>
          <View className="flex-row items-center gap-x-2 mb-6">
            <TextInput
              className="bg-[#0b121f] text-white text-lg font-bold text-center w-16 p-2 rounded-xl border border-[#1e2b44]"
              keyboardType="numeric"
              maxLength={2}
              value={salidaH}
              onChangeText={setSalidaH}
            />
            <Text className="text-white font-bold">:</Text>
            <TextInput
              className="bg-[#0b121f] text-white text-lg font-bold text-center w-16 p-2 rounded-xl border border-[#1e2b44]"
              keyboardType="numeric"
              maxLength={2}
              value={salidaM}
              onChangeText={setSalidaM}
            />
          </View>

          {/* SELECTOR DE RECARGO COLOMBIANO */}
          <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Tipo de Recargo</Text>
          <View className="flex-row gap-2 mb-5 flex-wrap">
            {(['ordinaria', 'dominical', 'festiva', 'nocturna'] as TipoHora[]).map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setTipo(t)}
                className={cn(
                  "px-3 py-1.5 rounded-full border text-center capitalize",
                  tipo === t ? "bg-[#2563eb] border-[#2563eb]" : "bg-[#0b121f] border-[#1e2b44]"
                )}
              >
                <Text className={cn(tipo === t ? "text-white" : "text-slate-400", "text-xs font-semibold")}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* NOTAS */}
          <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">Notas / Observaciones</Text>
          <TextInput
            className="bg-[#0b121f] text-slate-200 p-3 rounded-xl border border-[#1e2b44] text-xs mb-6"
            placeholder="Ej: Turno de la mañana..."
            placeholderTextColor="#475569"
            value={notas}
            onChangeText={setNotas}
          />

          {/* BOTONES */}
          <View className="gap-y-2">
            <TouchableOpacity onPress={handleConfirmarGuardar} className="bg-[#2563eb] py-3.5 rounded-xl items-center justify-center">
              <Text className="text-white font-bold text-sm">Calcular y Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} className="bg-transparent py-2 items-center justify-center">
              <Text className="text-slate-400 font-semibold text-sm">Cancelar</Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
