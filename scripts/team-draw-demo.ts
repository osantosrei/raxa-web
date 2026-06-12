import { drawTeams, formatDrawForSharing } from "../src/lib/teamDraw";

const defaultPlayers = [
  "Ana",
  "Bruno",
  "Caio",
  "Duda",
  "Edu",
  "Fabi",
  "Gui",
  "Helena",
  "Igor",
  "Julia",
  "Kadu",
  "Lari",
  "Marta",
];

function getArg(name: string) {
  const index = process.argv.indexOf(`--${name}`);

  return index >= 0 ? process.argv[index + 1] : undefined;
}

function createSeededRandom(seed: string) {
  let hash = 2166136261;

  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return () => {
    hash += 0x6d2b79f5;
    let value = hash;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

const seed = getArg("seed") ?? "raxa";
const title = getArg("title") ?? "Pelada da Sexta";
const teamSize = Number.parseInt(getArg("team-size") ?? "5", 10);
const playersArg = getArg("players");
const players = playersArg
  ? playersArg
      .split(",")
      .map((player) => player.trim())
      .filter(Boolean)
  : defaultPlayers;

const result = drawTeams(players, teamSize, createSeededRandom(seed));
const text = formatDrawForSharing(result, title);

console.log(`Seed: ${seed}`);
console.log(`Jogadores por time: ${teamSize}`);
console.log("");
console.log(text);
