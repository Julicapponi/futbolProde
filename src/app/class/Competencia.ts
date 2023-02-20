export class Competencia {
  country: Country;
  league: League;
  seasons: Season;
  fixture: string;
  logo: string;
  id: string;
  idcompetition: number;
  name: string;
  code: string;
  flag: string;
  anio: string;
  activa: boolean;
  cambioNombre = false;
  yaEdito = false;
}

interface Season {
  year: number;
  start: string;
  end: string;
  current: boolean;
  coverage: Coverage;
}

interface Coverage {
  fixtures: Fixtures;
  standings: boolean;
  players: boolean;
  top_scorers: boolean;
  top_assists: boolean;
  top_cards: boolean;
  injuries: boolean;
  predictions: boolean;
  odds: boolean;
}

interface Fixtures {
  events: boolean;
  lineups: boolean;
  statistics_fixtures: boolean;
  statistics_players: boolean;
}

interface Country {
  name: string;
  code?: string;
  flag?: string;
}

interface League {
  id: number;
  name: string;
  type: string;
  logo: string;
  isActiva: boolean;
}
