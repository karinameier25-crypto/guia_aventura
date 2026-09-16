import { ref, onMounted, onUnmounted } from 'vue';

type EventoOrientacaoIOS = DeviceOrientationEvent & {
  webkitCompassHeading?: number;
};

type ConstrutorDeviceOrientationIOS = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

function pontoCardeal(angulo: number): string {
  const direcoes = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'];
  const indice = Math.round(angulo / 45) % 8;
  return direcoes[indice];
}

/**
 * Usa o sensor de orientação do dispositivo para indicar a direção atual
 * e os pontos cardeais N/S/L/O (Desafio 1, item 3).
 */
export function useBussola() {
  const angulo = ref(0);
  const cardeal = ref('N');
  const suportado = ref(true);
  const permissaoNecessaria = ref(false);

  function tratarEvento(evento: DeviceOrientationEvent) {
    const eventoIOS = evento as EventoOrientacaoIOS;

    let heading: number | null = null;
    if (typeof eventoIOS.webkitCompassHeading === 'number') {
      // iOS: 0° já aponta para o Norte, sentido horário
      heading = eventoIOS.webkitCompassHeading;
    } else if (evento.alpha !== null) {
      // Android/genérico: alpha cresce sentido anti-horário a partir do Norte
      heading = 360 - evento.alpha;
    }

    if (heading === null) return;

    angulo.value = heading;
    cardeal.value = pontoCardeal(heading);
  }

  async function solicitarPermissao() {
    const ConstrutorIOS = DeviceOrientationEvent as ConstrutorDeviceOrientationIOS;

    if (typeof ConstrutorIOS.requestPermission !== 'function') return;

    try {
      const resposta = await ConstrutorIOS.requestPermission();
      if (resposta === 'granted') {
        permissaoNecessaria.value = false;
        window.addEventListener('deviceorientation', tratarEvento, true);
      }
    } catch {
      suportado.value = false;
    }
  }

  onMounted(() => {
    if (!('DeviceOrientationEvent' in window)) {
      suportado.value = false;
      return;
    }

    const ConstrutorIOS = DeviceOrientationEvent as ConstrutorDeviceOrientationIOS;

    if (typeof ConstrutorIOS.requestPermission === 'function') {
      // iOS 13+ exige um gesto do usuário (toque) antes de pedir permissão.
      permissaoNecessaria.value = true;
    } else {
      window.addEventListener('deviceorientation', tratarEvento, true);
    }
  });

  onUnmounted(() => {
    window.removeEventListener('deviceorientation', tratarEvento, true);
  });

  return { angulo, cardeal, suportado, permissaoNecessaria, solicitarPermissao };
}
