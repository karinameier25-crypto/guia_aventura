<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Guia de Aventura</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <!-- 1. Localização atual -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Sua localização</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div v-if="carregando" class="linha">
            <ion-spinner name="dots"></ion-spinner>
            <span>Obtendo localização...</span>
          </div>
          <ion-text color="danger" v-else-if="erro">{{ erro }}</ion-text>
          <div v-else class="linha coordenadas">
            <span><strong>Lat:</strong> {{ latitude?.toFixed(5) }}</span>
            <span><strong>Long:</strong> {{ longitude?.toFixed(5) }}</span>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- 2. Mapa com posição do usuário e pontos de interesse -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Mapa</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <MapaAventura
            :latitude="latitude"
            :longitude="longitude"
            :pontos="pontosExibidos"
            @selecionar-ponto="abrirDetalhe"
          />
        </ion-card-content>
      </ion-card>

      <!-- 3. Bússola -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Bússola</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <Bussola />
        </ion-card-content>
      </ion-card>

      <!-- Desafio extra: "Perto de mim" -->
      <div class="perto">
      <ion-card >
        <ion-card-header>
          <ion-card-title>Perto de mim</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item lines="none">
            <ion-toggle v-model="filtroAtivo">Mostrar somente pontos próximos</ion-toggle>
          </ion-item>
          <ion-item v-if="filtroAtivo" lines="none">
            <ion-label>Raio: {{ raioKm }} km</ion-label>
            <ion-range
              :min="0.5"
              :max="10"
              :step="0.5"
              v-model="raioKm"
              aria-label="Raio de busca em quilômetros"
            ></ion-range>
          </ion-item>
        </ion-card-content>
      </ion-card>
</div>
      <!-- 4. Lista / seleção de pontos turísticos -->
      <ion-list>
        <ion-list-header>Pontos turísticos ({{ pontosExibidos.length }})</ion-list-header>
        <ion-item v-for="ponto in pontosExibidos" :key="ponto.id" button @click="abrirDetalhe(ponto)">
          <ion-thumbnail slot="start">
            <img :src="ponto.imagem" :alt="ponto.nome" />
          </ion-thumbnail>
          <ion-label>
            <h2>{{ ponto.nome }}</h2>
            <p>{{ distanciaDe(ponto) }}</p>
          </ion-label>
        </ion-item>
        <ion-item v-if="!pontosExibidos.length" lines="none">
          <ion-label color="medium">Nenhum ponto turístico dentro do raio selecionado.</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>

    <!-- 5. Detalhe do ponto selecionado, com opção "Como chegar" -->
    <DetalhePonto
      :aberto="modalAberto"
      :ponto="pontoSelecionado"
      :latitude-usuario="latitude"
      :longitude-usuario="longitude"
      @fechar="modalAberto = false"
    />
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  IonText,
  IonList,
  IonListHeader,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonToggle,
  IonRange
} from '@ionic/vue';

import MapaAventura from '../components/MapaAventura.vue';
import Bussola from '../components/Bussola.vue';
import DetalhePonto from '../components/DetalhePonto.vue';

import { useGeolocalizacao } from '../composables/useGeolocalizacao';
import { pontosTuristicos, type PontoTuristico } from '../data/pontosTuristicos';
import { calcularDistancia, formatarDistancia } from '../utils/geo';

// Item 1: obter e acompanhar a localização atual do usuário.
const { latitude, longitude, erro, carregando } = useGeolocalizacao();

// Desafio extra: filtro "Perto de mim" por raio de distância.
const filtroAtivo = ref(false);
const raioKm = ref(2);

// Item 4: seleção de um ponto turístico e exibição de detalhes.
const modalAberto = ref(false);
const pontoSelecionado = ref<PontoTuristico | null>(null);

function distanciaMetros(ponto: PontoTuristico): number | null {
  if (latitude.value === null || longitude.value === null) return null;
  return calcularDistancia(
    { latitude: latitude.value, longitude: longitude.value },
    { latitude: ponto.latitude, longitude: ponto.longitude }
  );
}

function distanciaDe(ponto: PontoTuristico): string {
  const metros = distanciaMetros(ponto);
  return metros === null ? 'Calculando distância...' : formatarDistancia(metros);
}

const pontosExibidos = computed(() => {
  if (!filtroAtivo.value || latitude.value === null || longitude.value === null) {
    return pontosTuristicos;
  }
  const raioMetros = raioKm.value * 1000;
  return pontosTuristicos.filter((ponto) => {
    const distancia = distanciaMetros(ponto);
    return distancia !== null && distancia <= raioMetros;
  });
});

function abrirDetalhe(ponto: PontoTuristico) {
  pontoSelecionado.value = ponto;
  modalAberto.value = true;
}
</script>

<style scoped>

.linha {
  display: flex;
  align-items: center;
  gap: 8px;
}

.coordenadas {
  justify-content: space-between;
}
</style>
