/*
 * ================================================================
 *  CONFIGURACIÓN · batería de preguntas activa
 * ================================================================
 *  Cambia SOLO el valor de `dataset` para elegir qué batería usa la app:
 *
 *    "2023"  -> posiciones basadas en los programas del 23J-2023 y la legislatura 2023-2026
 *    "2026"  -> programas del 29N-2026 (hereda de 2023 lo que aún no se haya actualizado)
 *
 *  Al hacer push a GitHub, la acción .github/workflows/deploy.yml valida
 *  los datos y publica automáticamente la web en GitHub Pages.
 *  Atajo: node tools/set-dataset.js 2026 --push
 *
 *  Para probar otra batería sin cambiar este archivo: index.html?datos=2026
 */
window.COMPAS_CONFIG = {
  dataset: "2023"
};
