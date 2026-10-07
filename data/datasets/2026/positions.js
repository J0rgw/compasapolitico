/*
 * Batería 2026 · posiciones ACTUALIZADAS con los programas del 29N.
 * ------------------------------------------------------------------
 * Solo hace falta escribir las celdas que cambian o se confirman con 2026.
 * El resto se hereda de 2023 (y la app lo marca como dato de 2023).
 *
 *   partido: [valor, confianza, fuente, nota?]   valor -1|-0.5|0|0.5|1 · confianza "a"|"m"|"b"
 *   partido: null                                 borra la posición heredada (sin datos en 2026)
 *
 * Consejo: aunque un partido mantenga su posición, vuelve a escribir la celda con
 * la fuente "prog26" para que cuente como dato confirmado en 2026.
 *
 * Ejemplo (descomentar y adaptar):
 *
 *   "ECO-01": {
 *     psoe: [-1, "a", "prog26"],
 *     pp:   [1, "a", "prog26", "Propone rebaja general de IRPF"]
 *   },
 */
COMPAS_DEFINE("2026", "positions", {
});
