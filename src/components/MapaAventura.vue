<template>
  <div ref="mapaEl" class="mapa"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { PontoTuristico } from '../data/pontosTuristicos';

const props = defineProps<{
  latitude: number | null;
  longitude: number | null;
  pontos: PontoTuristico[];
}>();

const emit = defineEmits<{
  (e: 'selecionar-ponto', ponto: PontoTuristico): void;
}>();

const mapaEl = ref<HTMLDivElement | null>(null);
let mapa: L.Map | null = null;
let marcadorUsuario: L.Marker | null = null;
const marcadoresPontos: L.Marker[] = [];

const iconeUsuario = L.divIcon({
  className: 'marcador-usuario',
  html: '<div class="ponto-azul"></div>',
  iconSize: [16, 16]
});

function centroInicial(): [number, number] {
  if (props.latitude !== null && props.longitude !== null) {
    return [props.latitude, props.longitude];
  }
  // Enquanto a localização não chega, centraliza no primeiro ponto turístico.
  return props.pontos.length
    ? [props.pontos[0].latitude, props.pontos[0].longitude]
    : [-26.3045, -48.8487];
}

function desenharPontos() {
  if (!mapa) return;

  marcadoresPontos.forEach((m) => m.remove());
  marcadoresPontos.length = 0;

  props.pontos.forEach((ponto) => {
    const marcador = L.marker([ponto.latitude, ponto.longitude]).addTo(mapa as L.Map);
    marcador.bindPopup(`<strong>${ponto.nome}</strong>`);
    marcador.on('click', () => emit('selecionar-ponto', ponto));
    marcadoresPontos.push(marcador);
  });
}

onMounted(() => {
  if (!mapaEl.value) return;

  mapa = L.map(mapaEl.value).setView(centroInicial(), 15);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; colaboradores do OpenStreetMap',
    maxZoom: 19
  }).addTo(mapa);

  desenharPontos();
});

watch(() => props.pontos, desenharPontos);

watch(
  () => [props.latitude, props.longitude],
  ([lat, lng]) => {
    if (!mapa || lat === null || lng === null) return;

    if (!marcadorUsuario) {
      marcadorUsuario = L.marker([lat, lng], { icon: iconeUsuario }).addTo(mapa);
      mapa.setView([lat, lng], 15);
    } else {
      marcadorUsuario.setLatLng([lat, lng]);
    }
  }
);

onBeforeUnmount(() => {
  mapa?.remove();
  mapa = null;
});
</script>

<style scoped>
.mapa {
  width: 100%;
  height: 260px;
  border-radius: 12px;
  overflow: hidden;
}

:deep(.ponto-azul) {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #1976d2;
  border: 2px solid white;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
}
</style>
