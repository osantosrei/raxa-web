import { describe, expect, it } from "vitest";

import { drawTeams, formatDrawForSharing } from "./teamDraw";

const players10 = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const players13 = [...players10, "K", "L", "M"];

describe("drawTeams", () => {
  it("distribui todos os jogadores entre times e reservas", () => {
    const { teams, reserves } = drawTeams(players13, 5);
    const allDrawn = [...teams.flatMap((team) => team.players), ...reserves];

    expect(allDrawn).toHaveLength(13);
    expect(new Set(allDrawn).size).toBe(13);
  });

  it("gera o número correto de times completos", () => {
    const { teams } = drawTeams(players13, 5);

    expect(teams).toHaveLength(2);
    teams.forEach((team) => expect(team.players).toHaveLength(5));
  });

  it("coloca os jogadores restantes em reservas", () => {
    const { reserves } = drawTeams(players13, 5);

    expect(reserves).toHaveLength(3);
  });

  it("não gera reservas quando os times são exatos", () => {
    const { reserves } = drawTeams(players10, 5);

    expect(reserves).toHaveLength(0);
  });

  it("cada jogador aparece exatamente uma vez", () => {
    const { teams, reserves } = drawTeams(players13, 5);
    const allPlayers = [...teams.flatMap((team) => team.players), ...reserves];

    players13.forEach((player) => {
      expect(allPlayers.filter((drawn) => drawn === player)).toHaveLength(1);
    });
  });

  it("lança erro se teamSize < 2", () => {
    expect(() => drawTeams(players10, 1)).toThrow(
      "O time precisa ter pelo menos 2 jogadores.",
    );
  });

  it("lança erro se teamSize não é um inteiro finito", () => {
    expect(() => drawTeams(players10, Number.NaN)).toThrow(
      "teamSize must be a finite integer.",
    );
    expect(() => drawTeams(players10, Number.POSITIVE_INFINITY)).toThrow(
      "teamSize must be a finite integer.",
    );
    expect(() => drawTeams(players10, 2.5)).toThrow(
      "teamSize must be a finite integer.",
    );
  });

  it("lança erro se jogadores insuficientes", () => {
    expect(() => drawTeams(["A", "B"], 5)).toThrow(
      "Jogadores insuficientes para formar um time.",
    );
  });

});

describe("formatDrawForSharing", () => {
  it("inclui o título da partida em negrito", () => {
    const result = drawTeams(players10, 5);
    const text = formatDrawForSharing(result, "Pelada da Sexta");

    expect(text).toContain("*Pelada da Sexta - Times sorteados*");
  });

  it("inclui todos os jogadores no texto", () => {
    const result = drawTeams(players10, 5);
    const text = formatDrawForSharing(result, "Pelada");

    players10.forEach((player) => expect(text).toContain(`- ${player}`));
  });

  it("não inclui seção de reservas quando não há reservas", () => {
    const result = drawTeams(players10, 5);
    const text = formatDrawForSharing(result, "Pelada");

    expect(text).not.toContain("Reservas");
  });

  it("inclui seção de reservas quando há sobra", () => {
    const result = drawTeams(players13, 5);
    const text = formatDrawForSharing(result, "Pelada");

    expect(text).toContain("*Reservas*");
  });
});
