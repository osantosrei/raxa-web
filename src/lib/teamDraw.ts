export interface DrawnTeam {
  name: string;
  players: string[];
}

export interface DrawResult {
  teams: DrawnTeam[];
  reserves: string[];
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function drawTeams(playerNames: string[], teamSize: number): DrawResult {
  if (!Number.isFinite(teamSize) || !Number.isInteger(teamSize)) {
    throw new Error("teamSize must be a finite integer.");
  }

  if (teamSize < 2) {
    throw new Error("O time precisa ter pelo menos 2 jogadores.");
  }

  if (playerNames.length < teamSize) {
    throw new Error("Jogadores insuficientes para formar um time.");
  }

  const shuffled = shuffle(playerNames);
  const teamCount = Math.floor(shuffled.length / teamSize);
  const totalInTeams = teamCount * teamSize;
  const teams: DrawnTeam[] = Array.from({ length: teamCount }, (_, index) => ({
    name: `Time ${index + 1}`,
    players: [],
  }));

  for (let i = 0; i < totalInTeams; i += 1) {
    teams[i % teamCount].players.push(shuffled[i]);
  }

  return {
    teams,
    reserves: shuffled.slice(totalInTeams),
  };
}

export function formatDrawForSharing(
  result: DrawResult,
  matchTitle: string,
): string {
  const lines: string[] = [`*${matchTitle} - Times sorteados*`, ""];

  for (const team of result.teams) {
    lines.push(`*${team.name}*`);
    team.players.forEach((player) => lines.push(`- ${player}`));
    lines.push("");
  }

  if (result.reserves.length > 0) {
    lines.push("*Reservas*");
    result.reserves.forEach((player) => lines.push(`- ${player}`));
  }

  return lines.join("\n").trim();
}
