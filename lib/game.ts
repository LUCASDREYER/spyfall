import { LOCATIONS, Location } from "./locations";

export interface PlayerToken {
  playerName: string;
  isSpy: boolean;
  location: string;
  role: string | null; // null if spy
  allLocations: string[];
  timerMinutes: number;
  startedAt: number; // epoch ms
  totalPlayers: number;
  spyCount: number;
}

export interface GameSetup {
  players: string[];
  timerMinutes: number;
  spyCount: number;
  locationNames: string[]; // pool to pick from
}

export interface GeneratedGame {
  location: Location;
  tokens: PlayerToken[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateGame(setup: GameSetup): GeneratedGame {
  const pool = LOCATIONS.filter((l) => setup.locationNames.includes(l.name));
  if (pool.length === 0) throw new Error("No locations selected");

  const location = pool[Math.floor(Math.random() * pool.length)];
  const shuffledRoles = shuffle(location.roles);
  const spyIndices = new Set(
    shuffle([...Array(setup.players.length).keys()]).slice(0, setup.spyCount)
  );

  const startedAt = Date.now();

  const tokens: PlayerToken[] = setup.players.map((name, i) => ({
    playerName: name,
    isSpy: spyIndices.has(i),
    location: location.name,
    role: spyIndices.has(i) ? null : (shuffledRoles[i % shuffledRoles.length] ?? "Guest"),
    allLocations: setup.locationNames.sort(),
    timerMinutes: setup.timerMinutes,
    startedAt,
    totalPlayers: setup.players.length,
    spyCount: setup.spyCount,
  }));

  return { location, tokens };
}

// --- Token encoding (no crypto needed for a fun party game) ---
// We base64url-encode each player's token. It's not secret-secure,
// but role info isn't easily stumbled on since each player gets their own URL.

export function encodeToken(token: PlayerToken): string {
  const json = JSON.stringify(token);
  return btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export function decodeToken(encoded: string): PlayerToken | null {
  try {
    const padded = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const pad = padded.length % 4;
    const b64 = pad ? padded + "=".repeat(4 - pad) : padded;
    return JSON.parse(atob(b64)) as PlayerToken;
  } catch {
    return null;
  }
}
