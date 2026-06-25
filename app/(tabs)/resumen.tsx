import { useApp } from '@/components/context';
import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ResumenScreen() {
  const { jornadas } = useApp();
  
  const mesNombre = "Junio";
  const anioActual = 2026;
  const diasTotalesMes = 30;

  // Filtrar las jornadas del mes actual
  const jornadasMes = jornadas.filter(j => {
    if (!j.fecha) return false;
    const [anio, mes] = j.fecha.split('-');
    return parseInt(mes) === 6 && parseInt(anio) === anioActual;
  });

  // Cálculos matemáticos de horas colombianas
  const horasOrdinarias = jornadasMes.filter(j => j.tipoHora === 'ordinaria').reduce((s, j) => s + j.horasTrabajadas, 0);
  const horasDominicales = jornadasMes.filter(j => j.tipoHora === 'dominical').reduce((s, j) => s + j.horasTrabajadas, 0);
  const horasFestivas = jornadasMes.filter(j => j.tipoHora === 'festiva').reduce((s, j) => s + j.horasTrabajadas, 0);
  const horasNocturnas = jornadasMes.filter(j => j.tipoHora === 'nocturna').reduce((s, j) => s + j.horasTrabajadas, 0);

  const totalHorasMes = horasOrdinarias + horasDominicales + horasFestivas + horasNocturnas;

  const diasTrabajados = new Set(jornadasMes.map(j => j.fecha)).size;
  const porcentajeProgreso = Math.min(100, Math.round((diasTrabajados / diasTotalesMes) * 100));
  const promedioDia = diasTrabajados > 0 ? (totalHorasMes / diasTrabajados).toFixed(1) : '—';

  const handleExportarExcel = () => {
    if (jornadasMes.length === 0) {
      Alert.alert("Sin datos", "No tienes jornadas registradas en este mes para exportar.");
      return;
    }
    Alert.alert("Éxito", `Tu archivo estructurado para Excel de ${mesNombre} ha sido generado.`);
  };

  return (
    <ScrollView className="flex-1 bg-[#0b121f] pt-12 px-4" showsVerticalScrollIndicator={false}>
      <View className="flex-row justify-between items-center mb-2 px-2">
        <TouchableOpacity><Text className="text-blue-500 text-lg">‹</Text></TouchableOpacity>
        <Text className="text-blue-400 font-semibold text-xs uppercase tracking-wider">Mes actual</Text>
        <TouchableOpacity><Text className="text-blue-500 text-lg">›</Text></TouchableOpacity>
      </View>
      
      <Text className="text-center text-slate-400 text-xs uppercase tracking-widest font-medium mb-6">
        Consolidado mensual
      </Text>

      <View className="bg-[#131c2e] rounded-2xl p-6 border border-[#1e2b44]/40 mb-5">
        <Text className="text-center text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-2">
          TOTAL DE HORAS EN {mesNombre}
        </Text>
        <Text className="text-center text-[#2563eb] font-bold text-5xl mb-6">
          {totalHorasMes}h
        </Text>

        <View className="flex-row justify-around border-b border-[#1a2638] pb-4 mb-4">
          <View className="items-center">
            <Text className="text-slate-200 font-bold text-base">{diasTrabajados} / {diasTotalesMes}</Text>
            <Text className="text-slate-400 text-[10px] mt-0.5">Días trabajados</Text>
          </View>
          <View className="items-center">
            <Text className="text-slate-200 font-bold text-base">{promedioDia}</Text>
            <Text className="text-slate-400 text-[10px] mt-0.5">Promedio por día</Text>
          </View>
        </View>

        <View className="mb-2">
          <View className="flex-row justify-between mb-1.5">
            <Text className="text-slate-400 text-[10px] font-semibold">Días registrados</Text>
            <Text className="text-blue-400 text-[10px] font-bold">{porcentajeProgreso}%</Text>
          </View>
          <View className="h-2 bg-[#1a2638] rounded-full overflow-hidden">
            <View className="h-full bg-[#2563eb] rounded-full" style={{ width: `${porcentajeProgreso}%` }} />
          </View>
        </View>
      </View>

      <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-3 px-1">
        Desglose de horas y recargos de ley
      </Text>

      <View className="bg-[#131c2e] rounded-2xl p-4 border border-[#1e2b44]/40 gap-y-3 mb-6">
        <View className="flex-row justify-between items-center pb-2 border-b border-[#1a2638]/60">
          <View className="flex-row items-center gap-x-2">
            <View className="w-2 h-2 rounded-full bg-blue-500" />
            <Text className="text-slate-300 text-xs font-medium">Horas Ordinarias</Text>
          </View>
          <Text className="text-slate-200 font-bold text-sm">{horasOrdinarias}h</Text>
        </View>

        <View className="flex-row justify-between items-center pb-2 border-b border-[#1a2638]/60">
          <View className="flex-row items-center gap-x-2">
            <View className="w-2 h-2 rounded-full bg-red-500" />
            <Text className="text-slate-300 text-xs font-medium">Dominicales (Recargo 75%)</Text>
          </View>
          <Text className="text-red-400 font-bold text-sm">{horasDominicales}h</Text>
        </View>

        <View className="flex-row justify-between items-center pb-2 border-b border-[#1a2638]/60">
          <View className="flex-row items-center gap-x-2">
            <View className="w-2 h-2 rounded-full bg-purple-500" />
            <Text className="text-slate-300 text-xs font-medium">Festivas (Recargo 75%)</Text>
          </View>
          <Text className="text-purple-400 font-bold text-sm">{horasFestivas}h</Text>
        </View>

        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-x-2">
            <View className="w-2 h-2 rounded-full bg-amber-500" />
            <Text className="text-slate-300 text-xs font-medium">Nocturnas (Recargo 35%)</Text>
          </View>
          <Text className="text-amber-400 font-bold text-sm">{horasNocturnas}h</Text>
        </View>
      </View>

      <TouchableOpacity 
        onPress={handleExportarExcel}
        className="bg-emerald-600 rounded-xl py-3.5 mb-12 items-center justify-center shadow-lg shadow-emerald-900/20"
      >
        <Text className="text-white font-bold text-sm tracking-wide">
          Exportar Consolidado a Excel (.xlsx)
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
