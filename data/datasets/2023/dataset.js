/*
 * Batería 2023 · ficha de la batería.
 * Base del modelo: programas electorales del 23J-2023, votaciones de la
 * XV Legislatura (2023-2026) y declaraciones públicas.
 */
COMPAS_DEFINE("2023", "dataset", {
  extends: null,
  meta: {
    version: "0.2.0",
    updated: "2026-10-07",
    election: "Elecciones generales del 29 de noviembre de 2026",
    programs: "programas electorales de 2023 (23J)",
    // true = las posiciones de esta batería NO proceden de los programas de la elección en curso.
    // La app muestra un aviso al inicio y en los resultados mientras haya datos de baterías antiguas.
    oldPrograms: true,
    status: "Posiciones basadas en los programas de 2023, votaciones de la legislatura 2023-2026 y declaraciones. Pendiente de actualizar con los programas del 29N."
  }
});
