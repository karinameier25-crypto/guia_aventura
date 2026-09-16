<template>
  <ion-modal :is-open="aberto" @didDismiss="fechar">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ ponto?.nome }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="fechar">Fechar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" v-if="ponto">
      <img :src="ponto.imagem" :alt="ponto.nome" class="imagem-ponto" />
      <h2>{{ ponto.nome }}</h2>
      <p>{{ ponto.descricao }}</p>

      <p class="distancia" v-if="distanciaTexto">
        <ion-icon :icon="navigateOutline"></ion-icon>
        {{ distanciaTexto }}
      </p>

      <ion-button expand="block" @click="comoChegar">
        <ion-icon slot="start" :icon="mapOutline"></ion-icon>
        Como chegar
      </ion-button>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonIcon
} from '@ionic/vue';
import { mapOutline, navigateOutline } from 'ionicons/icons';
import { computed } from 'vue';
import type { PontoTuristico } from '../data/pontosTuristicos';
import { calcularDistancia, formatarDistancia } from '../utils/geo';

const props = defineProps<{
  aberto: boolean;
  ponto: PontoTuristico | null;
  latitudeUsuario: number | null;
  longitudeUsuario: number | null;
}>();

const emit = defineEmits<{ (e: 'fechar'): void }>();

const distanciaTexto = computed(() => {
  if (!props.ponto || props.latitudeUsuario === null || props.longitudeUsuario === null) {
    return null;
  }
  const distancia = calcularDistancia(
    { latitude: props.latitudeUsuario, longitude: props.longitudeUsuario },
    { latitude: props.ponto.latitude, longitude: props.ponto.longitude }
  );
  return formatarDistancia(distancia);
});

function fechar() {
  emit('fechar');
}

// Abre o app de mapas do dispositivo (ou Google Maps no navegador)
// com a rota até o ponto selecionado.
function comoChegar() {
  if (!props.ponto) return;
  const url = `https://www.google.com/maps/dir/?api=1&destination=${props.ponto.latitude},${props.ponto.longitude}`;
  window.open(url, '_blank');
}
</script>

<style scoped>
.imagem-ponto {
  width: 100%;
  border-radius: 12px;
  margin-bottom: 12px;
}

.distancia {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--ion-color-medium);
}
</style>
