<template>
  <div class="bussola">
    <div v-if="!suportado" class="bussola-aviso">
      Sensor de orientação não disponível neste dispositivo.
    </div>

    <ion-button v-else-if="permissaoNecessaria" size="small" @click="solicitarPermissao">
      Ativar bússola
    </ion-button>

    <div v-else class="bussola-rosa">
      <span class="ponto ponto-n">N</span>
      <span class="ponto ponto-l">L</span>
      <span class="ponto ponto-s">S</span>
      <span class="ponto ponto-o">O</span>

      <div class="agulha" :style="{ transform: `rotate(${-angulo}deg)` }">
        <div class="agulha-norte"></div>
        <div class="agulha-sul"></div>
      </div>

      <div class="centro">{{ cardeal }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonButton } from '@ionic/vue';
import { useBussola } from '../composables/useBussola';

const { angulo, cardeal, suportado, permissaoNecessaria, solicitarPermissao } = useBussola();
</script>

<style scoped>
.bussola {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
}

.bussola-aviso {
  font-size: 13px;
  color: var(--ion-color-medium);
  text-align: center;
}

.bussola-rosa {
  position: relative;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 3px solid var(--ion-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ponto {
  position: absolute;
  font-weight: 700;
  font-size: 14px;
  color: var(--ion-color-dark);
}

.ponto-n {
  top: 4px;
}
.ponto-s {
  bottom: 4px;
}
.ponto-l {
  right: 8px;
}
.ponto-o {
  left: 8px;
}

.agulha {
  position: absolute;
  width: 4px;
  height: 110px;
  transition: transform 0.15s ease-out;
}

.agulha-norte {
  position: absolute;
  top: 0;
  width: 0;
  height: 0;
  left: -6px;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 55px solid var(--ion-color-danger);
}

.agulha-sul {
  position: absolute;
  bottom: 0;
  width: 0;
  height: 0;
  left: -6px;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 55px solid var(--ion-color-medium);
}

.centro {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--ion-color-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  z-index: 2;
}
</style>
