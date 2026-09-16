export interface Coordenadas {
  latitude: number;
  longitude: number;
}

/**
 * Calcula a distância aproximada (em metros) entre duas coordenadas
 * geográficas usando a fórmula de Haversine.
 */
export function calcularDistancia(origem: Coordenadas, destino: Coordenadas): number {
  const R = 6371000; // raio médio da Terra, em metros
  const toRad = (graus: number) => (graus * Math.PI) / 180;

  const dLat = toRad(destino.latitude - origem.latitude);
  const dLng = toRad(destino.longitude - origem.longitude);

  const lat1 = toRad(origem.latitude);
  const lat2 = toRad(destino.latitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/** Formata uma distância em metros para um texto amigável (m ou km). */
export function formatarDistancia(metros: number): string {
  if (metros < 1000) {
    return `${Math.round(metros)} m`;
  }
  return `${(metros / 1000).toFixed(1)} km`;
}
