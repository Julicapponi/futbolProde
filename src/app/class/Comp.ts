export class Comp {
  id: string;
  name?: string;
  flag?: string;
  value: string;
  data: Data;
  fixture: Fixture;
  league: League;
  teams: Teams;
  goals: Goals;
  score: Score;
}
interface Data {
  fixture: Fixture;
  league: League;
  teams: Teams;
  goals: Goals;
  score: Score;
}

export interface Score {
  halftime: Goals;
  fulltime: Goals;
  extratime: Extratime;
  penalty: Extratime;
}

export interface Extratime {
  home?: any;
  away?: any;
}

export interface Goals {
  home: number;
  away: number;
}

export interface Teams {
  home: Home;
  away: Home;
}

export interface Home {
  id: number;
  name: string;
  logo: string;
  winner: boolean;
}

export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag?: any;
  season: number;
  round: string;
}

export interface Fixture {
  id: number;
  referee: string;
  timezone: string;
  date: string;
  timestamp: number;
  periods: Periods;
  venue: Venue;
  status: Status;
}

export interface Status {
  long: string;
  short: string;
  elapsed: number;
}

export interface Venue {
  id: number;
  name: string;
  city: string;
}

export interface Periods {
  first: number;
  second: number;
}
