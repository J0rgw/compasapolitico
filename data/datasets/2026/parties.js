/*
 * Batería 2026 · partidos y fuentes NUEVOS o MODIFICADOS.
 * ------------------------------------------------------------------
 * parties: añade un partido nuevo o modifica uno existente por id
 *          (solo hace falta indicar los campos que cambian).
 * sources: añade las fuentes de 2026. Convención: "<partido>:prog26".
 *
 * Ejemplo (descomentar y adaptar):
 *
 *   parties: [
 *     { id: "sumar", name: "Frente Amplio", short: "F. Amplio",
 *       note: "Coalición de IU, Movimiento Sumar, Más Madrid y Comuns." }
 *   ],
 *   sources: {
 *     "psoe:prog26": { type: "programa", title: "PSOE · Programa electoral generales 29N 2026", url: "https://..." }
 *   }
 */
COMPAS_DEFINE("2026", "parties", {
  parties: [],
  sources: {}
});
