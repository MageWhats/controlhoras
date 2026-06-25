import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import BottomSheetRegistro from '../../components/BottomSheetRegistro';
import { TipoHora, useApp } from '../../components/context';
import { cn } from '../../utils/cn';

export default function RegistroScreen() {
  const { jornadas, horasSemanalesActuales, 'jornadaObjetivoSemanal': metaSemanal, agregarJornada } = useApp();
  const [modalVisible, setModalVisible] = useState(false);

  const mesActualNombre = "Junio 2026";
  const diasDelMes = Array.from({ 'length': 30 }, (_, i) => i + 1);
  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const horasFaltantesSemana = Math.max(0, metaSemanal - horasSemanalesActuales);
  const totalHorasMes = jornadas.reduce((sum, j) => sum + j.horasTrabajadas, 0);
  const diasTrabajados = new Set(jornadas.map(j => j.fecha)).size;
  const promedioDia = diasTrabajados > 0 ? (totalHorasMes / diasTrabajados).toFixed(1) : '—';

  const handleGuardarJornada = async (
    entrada: string, 
    salida: string, 
    horasTotales: number, 
    tipo: TipoHora, 
    notas: string
  ) => {
    const fechaHoy = new Date().toISOString().split('T')[0];
    await agregarJornada(fechaHoy, entrada, salida, horasTotales, tipo, notas);
  };

  return (
    <View className="flex-1 bg-[#0b121f] pt-12">
      <View className={cn(
        "mx-4 p-3 rounded-xl mb-4 border flex-row items-center justify-between",
        horasFaltantesSemana > 0 ? "bg-[#2c1d11] border-[#eab308]/30" : "bg-[#0d281e] border-[#22c55e]/30"
      )}>
        <Text className={cn(
          "text-xs font-semibold flex-1",
          horasFaltantesSemana > 0 ? "text-amber-400" : "text-emerald-400"
        )}>
          {horasFaltantesSemana > 0 
            ? `Meta Semanal: Faltan ${horasFaltantesSemana}h para cumplir las ${metaSemanal}h de ley.`
            : "¡Meta Semanal cumplida con éxito! 🎉"}
        </Text>
        <View className={cn("px-2 py-0.5 rounded-full", horasFaltantesSemana > 0 ? "bg-amber-500/20" : "bg-emerald-500/20")}>
          <Text className={cn("text-[10px] font-bold", horasFaltantesSemana > 0 ? "text-amber-400" : "text-emerald-400")}>
            {horasSemanalesActuales}h hoy
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center px-6 mb-4">
        <TouchableOpacity><Text className="text-blue-500 text-lg">‹</Text></TouchableOpacity>
        <Text className="text-blue-400 font-semibold text-xs uppercase tracking-wider">{mesActualNombre}</Text>
        <TouchableOpacity><Text className="text-blue-500 text-lg">›</Text></TouchableOpacity>
      </View>

      <View className="flex-row justify-around border-b border-[#1a2638] pb-4 mx-4">
        <View className="items-center">
          <Text className="text-blue-400 font-bold text-xl">{totalHorasMes}h</Text>
          <Text className="text-slate-400 text-[10px] mt-1">Total mes</Text>
        </View>
        <View className="items-center border-x border-[#1a2638] px-8">
          <Text className="text-slate-200 font-bold text-xl">{diasTrabajados}</Text>
          <Text className="text-slate-400 text-[10px] mt-1">Días trabajados</Text>
        </View>
        <View className="items-center">
          <Text className="text-slate-200 font-bold text-xl">{promedioDia}</Text>
          <Text className="text-slate-400 text-[10px] mt-1">Promedio/día</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="gap-y-2 pb-24">
          {diasDelMes.map((dia) => {
            const fechaString = `2026-06-${dia < 10 ? '0' + dia : dia}`;
            const diaSemanaIndex = dia % 7; 
            const nombreDiaSemana = diasSemana[diaSemanaIndex];
            const esFinDeSemana = nombreDiaSemana === 'Dom' || nombreDiaSemana === 'Sáb';

            const jornadasDelDia = jornadas.filter(j => j.fecha === fechaString);

            return (
              <View 
                key={dia} 
                className={cn(
                  "bg-[#131c2e] p-4 rounded-xl flex-row justify-between items-center border border-[#1e2b44]/40",
                  esFinDeSemana && "bg-[#16223a]"
                )}
              >
                <View className="flex-row items-center">
                  {/* AQUÍ CORREGIMOS EL DIV POR VIEW */}
                  <View className="items-center pr-4 border-r border-[#22314d]">
                    <Text className="text-slate-200 font-bold text-sm">{dia < 10 ? `0${dia}` : dia}</Text>
                    <Text className="text-slate-400 text-[10px] uppercase mt-0.5">{nombreDiaSemana}</Text>
                  </View>

                  <View className="pl-4">
                    {jornadasDelDia.length > 0 ? (
                      <View className="flex-row gap-x-1.5 flex-wrap">
                        {jornadasDelDia.map(j => (
                          <View 
                            key={j.id} 
                            className={cn(
                              "px-2 py-0.5 rounded-md",
                              j.tipoHora === 'dominical' && "bg-red-500/10 border border-red-500/20",
                              j.tipoHora === 'festiva' && "bg-purple-500/10 border border-purple-500/20",
                              j.tipoHora === 'ordinaria' && "bg-blue-500/10 border border-blue-500/20",
                              j.tipoHora === 'nocturna' && "bg-amber-500/10 border border-amber-500/20"
                            )}
                          >
                            <Text className={cn(
                              "text-[10px] font-medium capitalize",
                              j.tipoHora === 'dominical' && "text-red-400",
                              j.tipoHora === 'festiva' && "text-purple-400",
                              j.tipoHora === 'ordinaria' && "text-blue-400",
                              j.tipoHora === 'nocturna' && "text-amber-400"
                            )}>
                              {j.horaEntrada}-{j.horaSalida} ({j.horasTrabajadas}h)
                            </Text>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <Text className="text-slate-600 text-xs font-medium">—</Text>
                    )}
                  </View>
                </View>

                <TouchableOpacity onPress={() => setModalVisible(true)} className="p-1">
                  <Text className="text-blue-500 text-sm font-semibold">+</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <TouchableOpacity 
        onPress={() => setModalVisible(true)}
        className="absolute bottom-6 right-6 bg-[#2563eb] flex-row py-3.5 px-6 rounded-full shadow-lg shadow-blue-500/20 items-center justify-center"
      >
        <Text className="text-white font-bold text-sm tracking-wide">+ Hoy</Text>
      </TouchableOpacity>

      <BottomSheetRegistro 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onGuardar={handleGuardarJornada}
      />
    </View>
  );
}
