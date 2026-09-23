import { ref, onMounted, onUnmounted } from 'vue';

/**
 * Solicita permissão de localização e mantém latitude/longitude
 * atualizadas conforme o usuário se movimenta (Desafio 1, item 1).
 */
export function useGeolocalizacao() {
  const latitude = ref<number | null>(null);
  const longitude = ref<number | null>(null);
  const precisao = ref<number | null>(null);
  const erro = ref<string | null>(null);
  const carregando = ref(true);
  const permissaoConcedida = ref(false);

  let watchId: number | null = null;

  function traduzirErro(err: GeolocationPositionError): string {
    switch (err.code) {
      case err.PERMISSION_DENIED:
        return 'Permissão de localização negada. Habilite-a nas configurações do dispositivo.';
      case err.POSITION_UNAVAILABLE:
        return 'Posição indisponível no momento.';
      case err.TIMEOUT:
        return 'Tempo esgotado ao tentar obter a localização.';
      default:
        return 'Não foi possível obter a localização.';
    }
  }

  /**
   * Dispara o prompt nativo de permissão (via getCurrentPosition) e só
   * inicia o acompanhamento contínuo (watchPosition) se o usuário permitir.
   */
  function solicitarPermissao(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        erro.value = 'Geolocalização não é suportada neste dispositivo.';
        carregando.value = false;
        resolve(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (posicao) => {
          // Permissão concedida: já aproveitamos essa primeira leitura
          latitude.value = posicao.coords.latitude;
          longitude.value = posicao.coords.longitude;
          precisao.value = posicao.coords.accuracy;
          erro.value = null;
          permissaoConcedida.value = true;
          resolve(true);
        },
        (err) => {
          erro.value = traduzirErro(err);
          carregando.value = false;
          permissaoConcedida.value = false;
          resolve(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 5000
        }
      );
    });
  }

  function iniciarAcompanhamento() {
    if (!('geolocation' in navigator)) return;

    // Nesse ponto a permissão já foi concedida, então watchPosition
    // não deve mais exibir nenhum prompt.
    watchId = navigator.geolocation.watchPosition(
      (posicao) => {
        latitude.value = posicao.coords.latitude;
        longitude.value = posicao.coords.longitude;
        precisao.value = posicao.coords.accuracy;
        erro.value = null;
        carregando.value = false;
      },
      (err) => {
        erro.value = traduzirErro(err);
        carregando.value = false;
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000
      }
    );
  }

  async function iniciar() {
    carregando.value = true;
    const concedida = await solicitarPermissao();

    if (concedida) {
      iniciarAcompanhamento();
    }
    // Se não concedida, "erro" e "carregando" já foram atualizados
    // dentro de solicitarPermissao().
  }

  function parar() {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
  }

  onMounted(iniciar);
  onUnmounted(parar);

  return {
    latitude,
    longitude,
    precisao,
    erro,
    carregando,
    permissaoConcedida,
    iniciar,
    parar
  };
}