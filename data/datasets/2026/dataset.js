/*
 * Batería 2026 · ficha de la batería.
 * ------------------------------------------------------------------
 * Hereda TODO de la batería 2023 y aplica encima los cambios de 2026.
 * Así puedes actualizar partido a partido según se publiquen los programas
 * del 29N: lo que no hayas tocado sigue marcado como dato de 2023 y la app
 * avisa al usuario del porcentaje de datos aún antiguos.
 *
 * Para activarla: data/config.js -> dataset: "2026"
 *
 * Campos:
 *   extends           batería de la que se parte ("2023")
 *   inheritPositions  true: hereda las posiciones de 2023 hasta que se sustituyan
 *                     false: empieza sin posiciones (solo cuenta lo codificado en 2026)
 *   removeQuestions   ids de preguntas de 2023 que dejan de usarse
 *   editQuestions     cambios de redacción, peso o contexto: { "ECO-07": { text: "...", w: 1 } }
 *   removeParties     ids de partidos que ya no concurren
 */
COMPAS_DEFINE("2026", "dataset", {
  extends: "2023",
  inheritPositions: true,
  removeQuestions: [],
  editQuestions: {},
  removeParties: [],
  meta: {
    version: "0.2.0-2026",
    updated: "2026-10-07",
    election: "Elecciones generales del 29 de noviembre de 2026",
    programs: "programas electorales de 2026 (29N)",
    oldPrograms: false,
    status: "Batería 2026 en preparación: las posiciones no actualizadas siguen procediendo de 2023."
  }
});
