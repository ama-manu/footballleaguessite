// League and Match type definitions for football league data

// Individual team data
export interface Team {
  teamId: number;
  teamName: string;
  shortName?: string;
  teamIconUrl?: string;
}

// Match goal information
export interface Goal {
  goalId: number;
  scoreTeam1: number;
  scoreTeam2: number;
  matchMinute: number;
  goalGetterId: number;
  goalGetterName: string;
  isPenalty: boolean;
  isOwnGoal: boolean;
  isOvertime: boolean;
  comment?: string;
}

// Individual match data (based on OpenLigaDB API structure)
export interface Match {
  matchId: number;
  matchDateTime: string;
  timeZoneId: string;
  matchday: {
    number: number;
    matchdayId: number;
  };
  team1: Team;
  team2: Team;
  lastUpdateDateTime: string;
  matchIsFinished: boolean;
  matchResults: Array<{
    resultId: number;
    resultName: string;
    pointsTeam1: number;
    pointsTeam2: number;
    resultOrderId: number;
    resultTypeId: number;
    resultDescription: string;
  }>;
  winner: "team1" | "team2" | "draw" | null; // Added winner field
  goals: Goal[];
  location?: {
    locationId: number;
    locationCity: string;
    locationStadium: string;
  };
  numberOfViewers?: number;
}

// Matchday structure - groups matches by matchday/round
export interface Matchday {
  matchdayNumber: number;
  matches: Match[];
  isFinished: boolean;
  table: LeagueTable;
  //   startDate?: string;
  //   endDate?: string;
}

// League configuration and metadata
export interface LeagueConfig {
  name: string;
  topLeague: boolean;
  internalURL: string;
  externalURL: string;
  logoURL: string;
  wordmarkURL: string;
  size: number; // number of teams
  // European competition spots
  ucl: number; // Champions League spots
  uel: number; // Europa League spots
  uecl: number; // Europa Conference League spots
  // Promotion/Relegation
  up: number; // direct promotion spots
  relup: number; // relegation playoff promotion spots
  reldown: number; // relegation playoff relegation spots
  down: number; // direct relegation spots
  startYear: number;
}

// Country/Federation grouping
export interface Country {
  name: string;
  internalURL: string;
  leagues: LeagueConfig[];
}

// Complete league data with matches
export interface LeagueData {
  config: LeagueConfig;
  season: string;
  matchdays: Matchday[];
  allMatches: Match[]; // Flat array of all matches for easy filtering
  // lastUpdated: string;
  isComplete: boolean;
}

// Table/standings related types
export interface TableEntry {
  position: number;
  positionChange?: "up" | "down" | null; // Change in position from previous matchday
  team: {
    teamId: number;
    teamName: string;
    teamIconUrl?: string;
    matchesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
    form: string[]; // match results e.g. ["W", "L", "D", "W", "L"]
  };
}

export type LeagueTable = TableEntry[];

// API response types
export interface ApiResponse<T> {
  data: T;
  error: boolean;
  isLoading: boolean;
  lastUpdated?: string;
}

// Utility type for league selection
export interface LeagueSelection {
  countryCode: string;
  leagueCode: string;
  season: string;
}

// Export the main leagues array type
export type LeaguesConfig = Country[];
