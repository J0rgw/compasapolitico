/*
 * Partidos y registro de fuentes.
 * ------------------------------------------------------------------
 * Este archivo NO contiene lógica. Edita libremente.
 *
 * parties[]: metadatos de cada partido.
 *   id      identificador usado en data/positions.js
 *   name    nombre completo
 *   short   abreviatura
 *   color   color de la gráfica (elegido por legibilidad, aproximado a la identidad del partido)
 *   scope   "estatal" | "territorial"
 *   note    aclaraciones metodológicas visibles en la app
 *
 * sources{}: registro de fuentes. En data/positions.js cada celda indica
 * una clave de fuente. Si la clave no tiene ":" se busca primero
 * "<partido>:<clave>" (p. ej. "prog23" -> "psoe:prog23") y si no existe,
 * la clave global.
 *   type: "programa" | "votacion" | "documento" | "declaracion" | "gobierno" | "prensa"
 *   url:  null cuando aún no se ha enlazado el documento exacto ("pendiente de enlazar")
 */
window.COMPAS = window.COMPAS || {};

COMPAS.parties = [
  { id: "psoe",  name: "Partido Socialista Obrero Español", short: "PSOE", color: "#E30613", scope: "estatal" },
  { id: "pp",    name: "Partido Popular", short: "PP", color: "#1D5FA8", scope: "estatal" },
  { id: "vox",   name: "Vox", short: "Vox", color: "#5BB12F", scope: "estatal" },
  { id: "sumar", name: "Sumar / Frente Amplio", short: "Sumar", color: "#E5007D", scope: "estatal",
    note: "Coalición en formación (IU, Movimiento Sumar, Más Madrid, Comuns y otros). Nombre y candidatura pendientes a 7/10/2026. Posiciones basadas en el programa de Sumar 2023 y su actuación en la legislatura." },
  { id: "podemos", name: "Podemos", short: "Podemos", color: "#6A2C70", scope: "estatal",
    note: "Concurre por separado (candidata: Irene Montero) salvo acuerdo con Sumar antes del 16/10/2026." },
  { id: "salf",  name: "Se Acabó La Fiesta", short: "SALF", color: "#8A5A2B", scope: "estatal",
    note: "Partido nuevo con pocas votaciones y programa reducido: muchas posiciones sin datos (null)." },
  { id: "erc",   name: "Esquerra Republicana de Catalunya", short: "ERC", color: "#F2A900", scope: "territorial" },
  { id: "junts", name: "Junts per Catalunya", short: "Junts", color: "#00A99D", scope: "territorial" },
  { id: "bildu", name: "EH Bildu", short: "Bildu", color: "#A8B400", scope: "territorial" },
  { id: "pnv",   name: "EAJ-PNV", short: "PNV", color: "#1B7A3E", scope: "territorial" },
  { id: "bng",   name: "Bloque Nacionalista Galego", short: "BNG", color: "#5DA9E9", scope: "territorial" },
  { id: "ac",    name: "Aliança Catalana", short: "AC", color: "#1F2A44", scope: "territorial",
    note: "Sin representación en el Congreso en la XV Legislatura; posiciones basadas en documentos y declaraciones del partido. Muchas posiciones sin datos." }
];

COMPAS.sources = {
  /* ---------- Programas electorales (generales 23J-2023) ---------- */
  "psoe:prog23":  { type: "programa", title: "PSOE · Programa electoral generales 23J 2023", url: "https://www.psoe.es/", pending: true },
  "pp:prog23":    { type: "programa", title: "PP · Programa electoral generales 23J 2023", url: "https://www.pp.es/", pending: true },
  "vox:prog23":   { type: "programa", title: "Vox · Programa electoral generales 23J 2023 («Agenda España»)", url: "https://www.voxespana.es/", pending: true },
  "sumar:prog23": { type: "programa", title: "Sumar · Programa electoral generales 23J 2023", url: "https://movimientosumar.es/", pending: true },
  "podemos:prog23": { type: "programa", title: "Podemos · Programa (integrado en Sumar en 2023) y documentos políticos posteriores", url: "https://podemos.info/", pending: true },
  "salf:prog":    { type: "programa", title: "SALF · Propuestas de presentación nacional (oct. 2025) y programa autonómico Castilla y León (2026)", url: "https://theobjective.com/wp-content/uploads/2026/03/Programa-electoral-CyL-de-Alvise-Pe%CC%81rez.pdf" },
  "erc:prog23":   { type: "programa", title: "ERC · Programa electoral generales 23J 2023", url: "https://www.esquerra.cat/", pending: true },
  "junts:prog23": { type: "programa", title: "Junts · Programa electoral generales 23J 2023", url: "https://junts.cat/", pending: true },
  "bildu:prog23": { type: "programa", title: "EH Bildu · Programa electoral generales 23J 2023", url: "https://ehbildu.eus/", pending: true },
  "pnv:prog23":   { type: "programa", title: "EAJ-PNV · Programa electoral generales 23J 2023", url: "https://www.eaj-pnv.eus/", pending: true },
  "bng:prog23":   { type: "programa", title: "BNG · Programa electoral generales 23J 2023", url: "https://www.bng.gal/", pending: true },
  "ac:doc":       { type: "documento", title: "Aliança Catalana · Documentos y programa (Parlament 2024)", url: "https://aliancacatalana.cat/", pending: true },

  /* ---------- Declaraciones y acción de gobierno (por partido) ---------- */
  "psoe:gob":   { type: "gobierno", title: "Acción del Gobierno de coalición (2023-2026)", url: "https://www.lamoncloa.gob.es/" },
  "sumar:gob":  { type: "gobierno", title: "Acción de los ministerios de Sumar (2023-2026)", url: "https://www.lamoncloa.gob.es/" },
  "psoe:decl":  { type: "declaracion", title: "Declaraciones públicas de dirigentes del PSOE", url: null, pending: true },
  "pp:decl":    { type: "declaracion", title: "Declaraciones públicas de dirigentes del PP", url: null, pending: true },
  "vox:decl":   { type: "declaracion", title: "Declaraciones públicas de dirigentes de Vox", url: null, pending: true },
  "sumar:decl": { type: "declaracion", title: "Declaraciones públicas de dirigentes de Sumar", url: null, pending: true },
  "podemos:decl": { type: "declaracion", title: "Declaraciones públicas de dirigentes de Podemos", url: null, pending: true },
  "salf:decl":  { type: "declaracion", title: "Declaraciones públicas de Luis «Alvise» Pérez y SALF", url: "https://en.wikipedia.org/wiki/Se_Acab%C3%B3_La_Fiesta" },
  "erc:decl":   { type: "declaracion", title: "Declaraciones públicas de dirigentes de ERC", url: null, pending: true },
  "junts:decl": { type: "declaracion", title: "Declaraciones públicas de dirigentes de Junts", url: null, pending: true },
  "bildu:decl": { type: "declaracion", title: "Declaraciones públicas de dirigentes de EH Bildu", url: null, pending: true },
  "pnv:decl":   { type: "declaracion", title: "Declaraciones públicas de dirigentes del PNV", url: null, pending: true },
  "bng:decl":   { type: "declaracion", title: "Declaraciones públicas de dirigentes del BNG", url: null, pending: true },
  "ac:decl":    { type: "declaracion", title: "Declaraciones públicas de Sílvia Orriols y Aliança Catalana", url: null, pending: true },

  /* ---------- Votaciones y hechos (globales) ---------- */
  "v_amnistia":   { type: "votacion", title: "Congreso · Aprobación definitiva de la Ley Orgánica 1/2024 de amnistía (30/05/2024)", url: "https://www.congreso.es/es/opendata/votaciones" },
  "v_embargo":    { type: "votacion", title: "Congreso · Convalidación del Real Decreto-ley de embargo de armas a Israel (08/10/2025): 178 sí, 169 no (PP y Vox en contra)", url: "https://www.elsaltodiario.com/congreso-de-los-diputados/congreso-convalida-decreto-embargo-armas-votos-podemos-junts" },
  "v_jornada":    { type: "votacion", title: "Congreso · Enmiendas a la totalidad al proyecto de reducción de jornada a 37,5 h (sept. 2025; PP, Vox y Junts a favor de devolverlo)", url: "https://www.congreso.es/es/opendata/votaciones" },
  "v_vivienda26": { type: "votacion", title: "Congreso · Derogación de los decretos de vivienda (protección frente a desahucios y renovación de alquileres) por PP, Vox y Junts (oct. 2026)", url: "https://www.moncloa.com/2026/10/05/sanchez-convoca-elecciones-3442686/" },
  "v_ley_vivienda": { type: "votacion", title: "Congreso · Ley 12/2023 por el derecho a la vivienda (abril 2023)", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2023-12203" },
  "v_eutanasia":  { type: "votacion", title: "Congreso · Ley Orgánica 3/2021 de regulación de la eutanasia (PP, Vox y UPN en contra)", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2021-4628" },
  "v_aborto23":   { type: "votacion", title: "Congreso · Ley Orgánica 1/2023 de salud sexual y reproductiva (reforma de la ley del aborto)", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2023-5364" },
  "v_trans":      { type: "votacion", title: "Congreso · Ley 4/2023 para la igualdad real y efectiva de las personas trans y LGTBI", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2023-5366" },
  "v_memoria":    { type: "votacion", title: "Congreso · Ley 20/2022 de Memoria Democrática", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2022-17099" },
  "v_inmig_cat":  { type: "votacion", title: "Congreso · Toma en consideración de la delegación de competencias de inmigración a Cataluña (rechazada, sept. 2025: PP, Vox, Podemos, UPN y 2 diputados de Sumar en contra)", url: "https://rtvc.es/pp-vox-podemos-division-de-sumar-frenan-delegacion-inmigraciona-cataluna-23-septiembre-2025/" },
  "v_nucleares":  { type: "votacion", title: "Congreso · PNL del PP contra el calendario de cierre nuclear (12/02/2025): PP, Vox, UPN sí; PSOE, Sumar, Bildu, PNV, Podemos, BNG, CC no; ERC y Junts abstención", url: "https://theobjective.com/espana/politica/2025-02-12/congreso-prolongar-erc-junts/" },
  "v_burka":      { type: "votacion", title: "Congreso · Proposiciones de Vox (feb. 2026) y Junts (14/04/2026) para prohibir burka y niqab", url: "https://www.vozpopuli.com/espana/politica/junts-se-queda-solo-y-ningun-partido-respalda-su-ley-contra-el-burka-y-el-niqab.html" },
  "v_regulariz":  { type: "votacion", title: "Congreso · Toma en consideración de la ILP de regularización (abril 2024, solo Vox en contra) y Real Decreto de regularización extraordinaria (2026)", url: "https://es.rollingstone.com/que-sabemos-sobre-la-nueva-regularizacion-masiva-de-inmigrantes-que-residen-en-espana/" },
  "v_prioridad":  { type: "votacion", title: "Acuerdos PP-Vox de «prioridad nacional» (Extremadura, Aragón, 2026) y moción de Vox en el Congreso (abril 2026, PP en contra)", url: "https://www.elindependiente.com/espana/2026/04/22/el-pp-rechaza-la-mocion-sobre-prioridad-nacional-de-vox-en-el-congreso-no-refleja-lo-pactado-en-extremadura/" },
  "v_menores":    { type: "votacion", title: "Real Decreto-ley y reforma del art. 35 de la Ley de Extranjería sobre reparto de menores migrantes (2025)", url: "https://www.congreso.es/es/opendata/votaciones" },
  "h_iran_bases": { type: "gobierno", title: "Gobierno de España · Negativa al uso de Rota y Morón en la guerra contra Irán (marzo 2026)", url: "https://es.ara.cat/politica/espana-rechaza-prestar-ayuda-eua-guerra-iran-no-usara-bases-rota-moron_1_5665730.html" },
  "h_otan25":     { type: "gobierno", title: "Cumbre de la OTAN de La Haya (junio 2025): España obtiene excepción al objetivo del 5 %", url: "https://www.lamoncloa.gob.es/" },
  "h_palestina":  { type: "gobierno", title: "Reconocimiento del Estado de Palestina por el Consejo de Ministros (28/05/2024)", url: "https://www.lamoncloa.gob.es/" },
  "h_sahara22":   { type: "gobierno", title: "Carta del presidente del Gobierno al rey de Marruecos apoyando el plan de autonomía (marzo 2022) y debates posteriores en el Congreso", url: "https://www.lamoncloa.gob.es/" },
  "h_vox_fin":    { type: "prensa", title: "Fiscalía Anticorrupción abre diligencias sobre la financiación de Vox (marzo 2025) tras denuncia del PSOE; préstamos de MBH Bank", url: "https://www.publico.es/politica/anticorrupcion-abre-investigacion-vox-financiacion-irregular.html" },
  "h_dana":       { type: "prensa", title: "Causa judicial de la DANA (Catarroja) y comisión de investigación del Congreso (2025-2026)", url: "https://www.moncloa.com/2026/09/17/causa-dana-2027-aforamiento-mazon-pp-3433052/" },
  "h_acus_popular": { type: "prensa", title: "Proposición de ley del PSOE para limitar la acusación popular (2025)", url: "https://www.congreso.es/" },
  "h_cgpj24":     { type: "prensa", title: "Acuerdo PSOE-PP de renovación del CGPJ (junio 2024) y propuestas sobre el sistema de elección", url: "https://www.congreso.es/" }
};
