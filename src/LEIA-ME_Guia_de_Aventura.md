# Guia de Aventura — o que foi adicionado

Este pacote implementa o **Desafio 1 (Guia de Aventura)** do PDF "Acessando Recursos":

- `views/HomePage.vue` — tela principal, reúne todos os itens abaixo.
- `composables/useGeolocalizacao.ts` — obtém permissão e localização atual (lat/long), atualizando conforme o usuário se move.
- `components/MapaAventura.vue` — mapa (Leaflet/OpenStreetMap) com a posição do usuário e pelo menos 3 pontos de interesse.
- `composables/useBussola.ts` + `components/Bussola.vue` — bússola usando o sensor de orientação do dispositivo, com N/S/L/O.
- `components/DetalhePonto.vue` — ao tocar em um ponto, mostra nome, descrição, distância e imagem, além do botão **"Como chegar"** (abre o Google Maps com a rota).
- `data/pontosTuristicos.ts` — dados de exemplo dos pontos turísticos (edite com os locais reais do seu roteiro).
- `utils/geo.ts` — cálculo de distância entre coordenadas (fórmula de Haversine).
- Desafio extra **"Perto de mim"** — na tela principal, um toggle + controle de raio (km) filtra a lista/mapa para mostrar só os pontos dentro da distância escolhida.

## Dependência a instalar

O mapa usa a biblioteca **Leaflet** (gratuita, sem necessidade de API key):

```bash
npm install leaflet
npm install -D @types/leaflet
```

## Permissões do dispositivo

- **Localização**: o navegador/Capacitor pedirá a permissão automaticamente ao chamar `navigator.geolocation`. Em um build nativo (Android/iOS via Capacitor), lembre-se de declarar a permissão de localização no `AndroidManifest.xml` / `Info.plist`, ou usar o plugin `@capacitor/geolocation`.
- **Sensor de orientação (bússola)**: em iOS 13+, é necessário tocar no botão "Ativar bússola" para o navegador solicitar a permissão (`DeviceOrientationEvent.requestPermission()`), pois exige um gesto do usuário.

## O que ainda falta (Desafio 2 — Diário de Viagem)

Este pacote cobriu apenas o Desafio 1. O Desafio 2 (câmera, vídeo, áudio, galeria, "Memória do dia") não foi implementado — posso adicioná-lo também se você quiser.
