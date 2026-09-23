export interface PontoTuristico {
  id: number;
  nome: string;
  descricao: string;
  latitude: number;
  longitude: number;
  imagem: string;
}

// Pontos de exemplo — substitua pelas coordenadas reais do seu roteiro.
// É necessário haver pelo menos 3 pontos, conforme o desafio.
export const pontosTuristicos: PontoTuristico[] = [
  {
    id: 1,
    nome: 'Mirante da Serra',
    descricao:
      'Trilha curta com vista panorâmica da cidade, ideal para observar o pôr do sol.',
    latitude: -26.2922,
    longitude: -48.8268,
    imagem: 'https://picsum.photos/seed/mirante/400/300'
  },
  {
    id: 2,
    nome: 'Museu da Cidade',
    descricao:
      'Acervo histórico com exposições sobre a colonização e a cultura local.',
    latitude: -26.3067,
    longitude: -48.8497,
    imagem: 'https://picsum.photos/seed/museu/400/300'
  },
  {
    id: 3,
    nome: 'Parque das Águas',
    descricao:
      'Espaço aberto com trilhas, cachoeira e área para piquenique em família.',
    latitude: -26.2954,
    longitude: -48.8532,
    imagem: 'https://picsum.photos/seed/parque/400/300'
  },
  {
    id: 4,
    nome: 'Praça Central',
    descricao:
      'Ponto de encontro no coração da cidade, cercado por cafés e lojas.',
    latitude: -26.3038,
    longitude: -48.8467,
    imagem: 'https://picsum.photos/seed/praca/400/300'
  }
];
