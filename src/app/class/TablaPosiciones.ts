export class TablaPosiciones {
  rank: number;
  team: Team;
  points: number;
  goalsDiff: number;
  group: string;
  form: string;
  status: string;
  description?: string;
  all: All;
  home: All;
  away: All;
  update: string;
}

interface All {
  played: number;
  win: number;
  draw: number;
  lose: number;
  goals: Goals;
}

interface Goals {
  for: number;
  against: number;
}

interface Team {
  id: number;
  name: string;
  logo: string;
}