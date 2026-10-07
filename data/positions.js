/*
 * Matriz de posiciones pregunta × partido.
 * ------------------------------------------------------------------
 * Este archivo NO contiene lógica. Edita libremente.
 *
 * Formato de cada celda:  partido: [valor, confianza, fuente, nota?]
 *   valor      -1 | -0.5 | 0 | 0.5 | 1  (grado de ACUERDO del partido con la afirmación)
 *   confianza  "a" alta | "m" media | "b" baja   (ver METODOLOGIA.md §3)
 *   fuente     clave en COMPAS.sources (data/parties.js). "prog23" se resuelve
 *              como "<partido>:prog23"; "decl" como "<partido>:decl"; etc.
 *   nota       aclaración opcional (contradicciones programa/voto, matices)
 *
 * Partido ausente en una pregunta = sin evidencia suficiente (null):
 * la pregunta se excluye del cálculo de afinidad para ese partido.
 *
 * ESTADO: codificación inicial (v0.1). Revisar celdas "b" y fuentes "pendientes de enlazar".
 */
window.COMPAS = window.COMPAS || {};

COMPAS.positions = {
  /* ============================ ECO ============================ */
  "ECO-01": {
    psoe: [-1, "a", "prog23"], pp: [0.5, "m", "prog23", "Propone rebajas de IRPF centradas en rentas medias y bajas y deflactación"],
    vox: [1, "a", "prog23"], sumar: [-1, "a", "prog23"], podemos: [-1, "a", "decl"],
    salf: [1, "m", "salf:prog", "Propone reducir/eliminar impuestos y rebajas de IRPF por hijo"],
    erc: [-0.5, "m", "prog23"], junts: [0.5, "b", "prog23"], bildu: [-1, "a", "prog23"],
    pnv: [0, "b", "prog23", "Fiscalidad foral propia; posición moderada"], bng: [-1, "m", "prog23"], ac: [0.5, "b", "ac:doc"]
  },
  "ECO-02": {
    psoe: [1, "a", "psoe:gob", "Creó el impuesto temporal de solidaridad de las grandes fortunas (2022)"],
    pp: [-1, "a", "prog23", "Sus gobiernos autonómicos bonifican Patrimonio"], vox: [-1, "a", "prog23"],
    sumar: [1, "a", "prog23"], podemos: [1, "a", "decl"], salf: [-1, "b", "salf:prog"],
    erc: [1, "m", "prog23"], junts: [-0.5, "b", "prog23", "Rechaza la armonización estatal de tributos cedidos"],
    bildu: [1, "a", "prog23"], bng: [1, "m", "prog23"]
  },
  "ECO-03": {
    psoe: [1, "a", "psoe:gob"], pp: [-1, "a", "prog23"], vox: [-0.5, "b", "decl"],
    sumar: [1, "a", "prog23"], podemos: [1, "a", "decl"], erc: [1, "a", "decl"],
    junts: [-0.5, "m", "decl", "Se opuso a prorrogar el gravamen energético (2025)"],
    bildu: [1, "a", "decl"], pnv: [-1, "a", "decl", "Se opuso al gravamen energético"], bng: [1, "m", "decl"]
  },
  "ECO-04": {
    psoe: [1, "a", "v_ley_vivienda"], pp: [-1, "a", "v_ley_vivienda"], vox: [-1, "a", "v_ley_vivienda"],
    sumar: [1, "a", "prog23"], podemos: [1, "a", "decl"], erc: [1, "a", "v_ley_vivienda"],
    junts: [-0.5, "m", "v_ley_vivienda", "Votó en contra de la ley estatal por invasión competencial"],
    bildu: [1, "a", "v_ley_vivienda"], pnv: [-0.5, "m", "v_ley_vivienda", "Votó en contra por invasión competencial"],
    bng: [1, "m", "v_ley_vivienda"]
  },
  "ECO-05": {
    psoe: [-0.5, "m", "prog23", "Combina oferta de suelo con regulación y vivienda pública"],
    pp: [1, "a", "prog23"], vox: [1, "a", "prog23"], sumar: [-1, "a", "prog23"], podemos: [-1, "a", "decl"],
    salf: [1, "b", "salf:decl"], erc: [-0.5, "m", "prog23"], junts: [0.5, "m", "prog23"],
    bildu: [-1, "m", "prog23"], pnv: [0.5, "b", "prog23"], bng: [-1, "m", "prog23"], ac: [0.5, "b", "ac:doc"]
  },
  "ECO-06": {
    psoe: [1, "a", "psoe:gob", "Creación de una entidad pública estatal de vivienda"],
    pp: [-0.5, "m", "prog23", "Prefiere colaboración público-privada"], vox: [-0.5, "b", "prog23"],
    sumar: [1, "a", "prog23"], podemos: [1, "a", "decl"], erc: [1, "m", "prog23"],
    junts: [0, "b", "prog23"], bildu: [1, "a", "prog23"], pnv: [0.5, "b", "prog23"], bng: [1, "m", "prog23"]
  },
  "ECO-07": {
    psoe: [1, "a", "v_vivienda26"], pp: [-1, "a", "v_vivienda26"], vox: [-1, "a", "v_vivienda26"],
    sumar: [1, "a", "v_vivienda26"], podemos: [1, "a", "decl"], erc: [1, "m", "decl"],
    junts: [-1, "a", "v_vivienda26"], bildu: [1, "a", "decl"], bng: [1, "m", "decl"]
  },
  "ECO-08": {
    psoe: [1, "a", "psoe:gob"], pp: [0, "m", "decl", "Algunos gobiernos autonómicos del PP han limitado pisos turísticos; rechaza regulación estatal"],
    vox: [-0.5, "b", "decl"], sumar: [1, "a", "prog23"], podemos: [1, "a", "decl"], erc: [1, "a", "decl"],
    junts: [0, "b", "decl"], bildu: [1, "m", "decl"], pnv: [0.5, "b", "decl"], bng: [1, "b", "decl"]
  },
  "ECO-09": {
    psoe: [1, "a", "psoe:gob"], pp: [1, "m", "decl"], vox: [1, "m", "prog23"], sumar: [1, "a", "prog23"],
    podemos: [1, "a", "decl"], erc: [1, "m", "decl"], junts: [1, "m", "decl"], bildu: [1, "a", "decl"],
    pnv: [1, "m", "decl"], bng: [1, "a", "decl"]
  },
  "ECO-10": {
    psoe: [1, "a", "psoe:gob"], pp: [-0.5, "m", "decl", "Pide que el SMI se fije con acuerdo de patronal y sindicatos"],
    vox: [-0.5, "b", "decl"], sumar: [1, "a", "sumar:gob"], podemos: [1, "a", "decl"], erc: [1, "m", "decl"],
    bildu: [1, "a", "decl"], bng: [1, "a", "decl"]
  },
  "ECO-11": {
    psoe: [1, "a", "v_jornada"], pp: [-1, "a", "v_jornada"], vox: [-1, "a", "v_jornada"], sumar: [1, "a", "v_jornada"],
    podemos: [1, "a", "v_jornada"], erc: [1, "a", "v_jornada"], junts: [-1, "a", "v_jornada"],
    bildu: [1, "a", "v_jornada"], pnv: [0.5, "m", "v_jornada", "Apoyó la tramitación con reservas sobre su aplicación a pymes"],
    bng: [1, "a", "v_jornada"]
  },
  "ECO-12": {
    psoe: [0.5, "m", "psoe:gob", "Sistema de cotización por ingresos reales con cuota reducida"], pp: [1, "m", "prog23"],
    vox: [1, "a", "prog23"], sumar: [0.5, "b", "prog23"], podemos: [0.5, "b", "decl"], salf: [1, "b", "salf:decl"],
    erc: [0.5, "b", "decl"], junts: [1, "m", "prog23"], pnv: [0.5, "b", "decl"], ac: [1, "b", "ac:doc"]
  },
  "ECO-13": {
    psoe: [-1, "m", "prog23"], pp: [0.5, "m", "prog23", "Propone reducir ministerios, asesores y entes"],
    vox: [1, "a", "prog23"], sumar: [-1, "m", "prog23"], podemos: [-1, "m", "decl"], salf: [1, "a", "salf:prog"],
    erc: [-0.5, "b", "prog23"], junts: [0, "b", "prog23"], bildu: [-1, "m", "prog23"], pnv: [-0.5, "b", "prog23"],
    bng: [-1, "m", "prog23"], ac: [0.5, "b", "ac:doc"]
  },
  "ECO-14": {
    psoe: [-1, "m", "decl"], pp: [0, "b", "decl"], vox: [1, "a", "prog23"], sumar: [-1, "m", "decl"],
    podemos: [-0.5, "b", "decl"], salf: [1, "a", "salf:prog"], erc: [-0.5, "b", "decl"], bildu: [-1, "b", "decl"],
    bng: [-0.5, "b", "decl"], ac: [0.5, "b", "ac:decl"]
  },
  "ECO-15": {
    psoe: [0.5, "m", "psoe:gob", "Ley de gestión pública e integridad del SNS (2025)"], pp: [-1, "a", "prog23"],
    vox: [-0.5, "m", "prog23"], sumar: [1, "a", "prog23"], podemos: [1, "a", "decl"], erc: [0.5, "m", "prog23"],
    junts: [-1, "m", "prog23", "Defiende el modelo sanitario mixto catalán"], bildu: [1, "m", "prog23"],
    pnv: [-0.5, "b", "prog23"], bng: [1, "m", "prog23"]
  },
  "ECO-16": {
    psoe: [0, "m", "prog23", "La LOMLOE prioriza la pública pero mantiene los conciertos"], pp: [-1, "a", "prog23"],
    vox: [-1, "a", "prog23", "Propone cheque escolar"], sumar: [0.5, "m", "prog23"], podemos: [1, "m", "decl"],
    erc: [0, "b", "prog23"], junts: [-1, "m", "prog23"], bildu: [1, "m", "prog23"], pnv: [-1, "m", "prog23"],
    bng: [1, "m", "prog23"]
  },
  "ECO-17": {
    psoe: [-0.5, "m", "v_nucleares", "Votó contra la PNL; mantiene el calendario pero condiciona a solicitudes de las eléctricas y al CSN"],
    pp: [1, "a", "v_nucleares"], vox: [1, "a", "v_nucleares"], sumar: [-1, "a", "v_nucleares"],
    podemos: [-1, "a", "v_nucleares"], salf: [1, "b", "salf:decl"], erc: [-0.5, "m", "v_nucleares", "Abstención"],
    junts: [0, "m", "v_nucleares", "Abstención; ha defendido la continuidad de las centrales catalanas"],
    bildu: [-1, "a", "v_nucleares"], pnv: [-0.5, "m", "v_nucleares"], bng: [-1, "a", "v_nucleares"], ac: [1, "b", "ac:decl"]
  },
  "ECO-18": {
    psoe: [1, "a", "psoe:gob"], pp: [-0.5, "m", "prog23"], vox: [-1, "a", "prog23"], sumar: [1, "a", "prog23"],
    podemos: [1, "a", "decl"], salf: [-1, "b", "salf:decl"], erc: [1, "m", "prog23"], junts: [0, "b", "prog23"],
    bildu: [1, "m", "prog23"], pnv: [0, "b", "prog23"], bng: [0.5, "b", "prog23"], ac: [-0.5, "b", "ac:doc"]
  },
  "ECO-19": {
    psoe: [-0.5, "m", "psoe:gob", "Redujo caudales del Tajo-Segura (2023); el PSOE de Murcia y Valencia discrepa"],
    pp: [1, "a", "prog23"], vox: [1, "a", "prog23"], sumar: [-1, "m", "prog23"], podemos: [-1, "m", "decl"],
    erc: [-1, "m", "decl", "Contrario a trasvases del Ebro"], junts: [-1, "m", "decl", "Contrario a trasvases del Ebro"]
  },

  /* ============================ SOC ============================ */
  "SOC-01": {
    psoe: [1, "a", "v_aborto23"], pp: [0, "m", "decl", "Votó contra la reforma de 2023 pero acepta la ley de plazos avalada por el TC"],
    vox: [-1, "a", "v_aborto23"], sumar: [1, "a", "v_aborto23"], podemos: [1, "a", "v_aborto23"],
    erc: [1, "a", "v_aborto23"], junts: [1, "m", "v_aborto23"], bildu: [1, "a", "v_aborto23"],
    pnv: [1, "m", "v_aborto23"], bng: [1, "a", "v_aborto23"]
  },
  "SOC-02": {
    psoe: [1, "a", "psoe:gob", "El Gobierno propuso la reforma constitucional en 2025"], pp: [-1, "a", "decl"],
    vox: [-1, "a", "decl"], sumar: [1, "a", "decl"], podemos: [1, "a", "decl"], erc: [1, "m", "decl"],
    junts: [0, "b", "decl"], bildu: [1, "m", "decl"], pnv: [0, "b", "decl"], bng: [1, "m", "decl"]
  },
  "SOC-03": {
    psoe: [1, "a", "v_eutanasia"], pp: [-0.5, "m", "v_eutanasia", "Votó en contra; no ha priorizado su derogación"],
    vox: [-1, "a", "v_eutanasia"], sumar: [1, "a", "v_eutanasia"], podemos: [1, "a", "v_eutanasia"],
    erc: [1, "a", "v_eutanasia"], junts: [1, "a", "v_eutanasia"], bildu: [1, "a", "v_eutanasia"],
    pnv: [1, "a", "v_eutanasia"], bng: [1, "a", "v_eutanasia"]
  },
  "SOC-04": {
    psoe: [-0.5, "m", "v_trans", "Aprobó la ley; existe una corriente interna crítica"], pp: [1, "a", "prog23"],
    vox: [1, "a", "prog23"], sumar: [-1, "a", "v_trans"], podemos: [-1, "a", "v_trans"], erc: [-1, "m", "v_trans"],
    bildu: [-1, "m", "v_trans"], bng: [-1, "b", "v_trans"]
  },
  "SOC-05": {
    psoe: [1, "a", "prog23"], pp: [0, "m", "prog23"], vox: [-1, "a", "prog23"], sumar: [1, "a", "prog23"],
    podemos: [1, "a", "decl"], erc: [1, "a", "prog23"], junts: [0.5, "m", "prog23"], bildu: [1, "a", "prog23"],
    pnv: [1, "m", "prog23"], bng: [1, "a", "prog23"], ac: [-0.5, "b", "ac:decl"]
  },
  "SOC-06": {
    psoe: [1, "a", "prog23"], pp: [1, "m", "decl", "Firmó la renovación del Pacto de Estado contra la Violencia de Género (2025)"],
    vox: [-1, "a", "prog23"], sumar: [1, "a", "prog23"], podemos: [1, "a", "decl"], erc: [1, "a", "decl"],
    junts: [1, "m", "decl"], bildu: [1, "a", "decl"], pnv: [1, "m", "decl"], bng: [1, "a", "decl"]
  },
  "SOC-07": {
    psoe: [1, "a", "psoe:gob", "Ley Orgánica de representación paritaria (2024)"], pp: [-0.5, "b", "decl"],
    vox: [-1, "a", "decl"], sumar: [1, "a", "prog23"], podemos: [1, "a", "decl"], erc: [1, "m", "decl"],
    junts: [0.5, "b", "decl"], bildu: [1, "m", "decl"], pnv: [1, "b", "decl"], bng: [1, "m", "decl"]
  },
  "SOC-08": {
    psoe: [0, "b", "prog23"], pp: [-1, "m", "decl"], vox: [-1, "a", "decl"], sumar: [1, "m", "prog23"],
    podemos: [1, "a", "decl"], erc: [1, "m", "prog23"], bildu: [1, "m", "prog23"], bng: [1, "m", "prog23"]
  },
  "SOC-09": {
    psoe: [-1, "a", "decl"], pp: [-1, "a", "decl"], vox: [-1, "a", "decl"],
    sumar: [0.5, "m", "prog23", "IU y Comuns son republicanos; Sumar no lo prioriza en su programa"],
    podemos: [1, "a", "decl"], salf: [1, "m", "salf:decl", "Alvise se ha declarado partidario de una república"],
    erc: [1, "a", "prog23"], junts: [1, "m", "decl"], bildu: [1, "a", "prog23"], pnv: [0.5, "b", "decl"],
    bng: [1, "a", "prog23"], ac: [1, "b", "ac:doc", "Defiende una república catalana independiente"]
  },
  "SOC-10": {
    psoe: [1, "a", "v_memoria"], pp: [-1, "a", "prog23", "Propone derogarla"], vox: [-1, "a", "prog23"],
    sumar: [1, "a", "v_memoria"], podemos: [1, "a", "v_memoria"],
    erc: [0.5, "m", "v_memoria", "Votó en contra por considerarla insuficiente"], bildu: [1, "a", "v_memoria"],
    pnv: [1, "a", "v_memoria"], bng: [0.5, "b", "v_memoria"]
  },
  "SOC-11": {
    psoe: [0, "b", "decl", "Posición dividida"], pp: [-1, "a", "decl"], vox: [-1, "a", "decl"],
    sumar: [1, "a", "sumar:gob", "El Ministerio de Cultura suprimió el Premio Nacional de Tauromaquia"],
    podemos: [1, "a", "decl"], salf: [1, "m", "salf:decl", "Se opone a las subvenciones a la tauromaquia"],
    erc: [1, "m", "decl"], junts: [0.5, "b", "decl"], bildu: [1, "m", "decl"], bng: [1, "m", "decl"]
  },
  "SOC-12": {
    psoe: [-1, "m", "v_burka"], pp: [0.5, "m", "v_burka", "Apoya la prohibición pero votó en contra de las propuestas de Vox y Junts"],
    vox: [1, "a", "v_burka"], sumar: [-1, "a", "v_burka"], podemos: [-1, "m", "v_burka"],
    erc: [0, "m", "v_burka", "Abstención en la propuesta de Junts"], junts: [1, "a", "v_burka"],
    bildu: [-1, "m", "v_burka"], pnv: [-1, "m", "v_burka"], ac: [1, "a", "ac:doc"]
  },
  "SOC-13": {
    psoe: [-0.5, "m", "decl", "Solo apoya el uso medicinal"], pp: [-1, "m", "decl"], vox: [-1, "a", "decl"],
    sumar: [1, "m", "prog23"], podemos: [1, "a", "decl"], erc: [1, "m", "prog23"], junts: [0.5, "b", "decl"],
    bildu: [1, "m", "prog23"], bng: [0.5, "b", "decl"]
  },
  "SOC-14": {
    psoe: [1, "a", "prog23"], pp: [0, "b", "prog23"], vox: [-1, "a", "prog23", "Defiende el consentimiento parental previo («pin parental»)"],
    sumar: [1, "a", "prog23"], podemos: [1, "a", "decl"], erc: [1, "m", "prog23"], junts: [0.5, "b", "prog23"],
    bildu: [1, "m", "prog23"], pnv: [0.5, "b", "prog23"], bng: [1, "m", "prog23"]
  },
  "SOC-15": {
    psoe: [0.5, "b", "decl"], pp: [-1, "m", "decl"], vox: [-1, "a", "decl"], sumar: [1, "a", "decl", "Registró una proposición de ley en ese sentido"],
    podemos: [1, "a", "decl"], salf: [0.5, "b", "salf:decl"], erc: [1, "a", "decl"], junts: [1, "m", "decl"],
    bildu: [1, "a", "decl"], pnv: [0.5, "b", "decl"], bng: [1, "m", "decl"]
  },

  /* ============================ TER ============================ */
  "TER-01": {
    psoe: [-1, "a", "prog23"], pp: [-1, "a", "prog23"], vox: [-1, "a", "prog23"],
    sumar: [0.5, "m", "prog23", "Comuns defienden el referéndum; Sumar habla de solución dialogada"],
    podemos: [1, "a", "decl"], salf: [-1, "b", "salf:decl"], erc: [1, "a", "prog23"], junts: [1, "a", "prog23"],
    bildu: [1, "a", "prog23"], pnv: [1, "m", "prog23", "Defiende el «derecho a decidir»"], bng: [1, "a", "prog23"], ac: [1, "a", "ac:doc"]
  },
  "TER-02": {
    psoe: [-1, "a", "decl"], pp: [-0.5, "m", "decl", "Propone sancionar la convocatoria de referéndums ilegales, no ilegalizar por ideología"],
    vox: [1, "a", "prog23"], sumar: [-1, "a", "decl"], podemos: [-1, "a", "decl"], erc: [-1, "a", "decl"],
    junts: [-1, "a", "decl"], bildu: [-1, "a", "decl"], pnv: [-1, "a", "decl"], bng: [-1, "a", "decl"], ac: [-1, "a", "decl"]
  },
  "TER-03": {
    psoe: [-1, "a", "prog23"], pp: [-0.5, "m", "prog23", "Defiende reforzar la alta inspección educativa, no recentralizar"],
    vox: [1, "a", "prog23"], sumar: [-1, "m", "prog23"], podemos: [-1, "m", "decl"], salf: [0.5, "b", "salf:prog"],
    erc: [-1, "a", "prog23"], junts: [-1, "a", "prog23"], bildu: [-1, "a", "prog23"], pnv: [-1, "a", "prog23"],
    bng: [-1, "a", "prog23"], ac: [-1, "a", "ac:doc"]
  },
  "TER-04": {
    psoe: [0.5, "m", "psoe:gob", "Acuerdo PSC-ERC de «financiación singular» (2024)"], pp: [-1, "a", "decl"],
    vox: [-1, "a", "decl"], sumar: [0.5, "m", "decl"], salf: [-1, "b", "salf:decl"], erc: [1, "a", "prog23"],
    junts: [1, "a", "prog23"], bildu: [1, "m", "decl"], pnv: [1, "m", "decl"], bng: [1, "m", "decl"], ac: [1, "a", "ac:doc"]
  },
  "TER-05": {
    psoe: [-1, "a", "decl"], pp: [-1, "a", "decl"], vox: [1, "a", "prog23"], sumar: [-0.5, "b", "decl"],
    podemos: [-0.5, "b", "decl"], erc: [-1, "m", "decl"], junts: [-1, "m", "decl"], bildu: [-1, "a", "prog23"],
    pnv: [-1, "a", "prog23"], bng: [-1, "m", "decl"], ac: [-1, "b", "ac:decl"]
  },
  "TER-06": {
    psoe: [1, "a", "v_inmig_cat"], pp: [-1, "a", "v_inmig_cat"], vox: [-1, "a", "v_inmig_cat"],
    sumar: [0.5, "m", "v_inmig_cat", "Votó a favor salvo dos diputados"], podemos: [-1, "a", "v_inmig_cat"],
    salf: [-1, "b", "salf:decl"], erc: [1, "a", "v_inmig_cat"], junts: [1, "a", "v_inmig_cat"],
    bildu: [1, "a", "v_inmig_cat"], pnv: [1, "a", "v_inmig_cat"], bng: [1, "a", "v_inmig_cat"], ac: [1, "m", "ac:decl"]
  },
  "TER-07": {
    psoe: [1, "a", "psoe:gob"], pp: [-1, "a", "decl"], vox: [-1, "a", "decl"], sumar: [1, "a", "decl"],
    podemos: [1, "a", "decl"], erc: [1, "a", "decl"], junts: [1, "a", "decl"], bildu: [1, "a", "decl"],
    pnv: [1, "a", "decl"], bng: [1, "a", "decl"], ac: [1, "a", "ac:doc"]
  },
  "TER-08": {
    psoe: [-0.5, "m", "decl", "El PSC defiende la inmersión con flexibilidad"], pp: [1, "a", "prog23"], vox: [1, "a", "prog23"],
    sumar: [-1, "m", "decl"], podemos: [-0.5, "b", "decl"], salf: [1, "b", "salf:decl"], erc: [-1, "a", "decl"],
    junts: [-1, "a", "decl"], bildu: [-1, "m", "decl"], pnv: [-1, "m", "decl"], bng: [-1, "m", "decl"], ac: [-1, "a", "ac:doc"]
  },
  "TER-09": {
    psoe: [0, "b", "psoe:gob", "Defendió el marco vigente de dirección autonómica durante la DANA"],
    pp: [0.5, "m", "decl", "Reprochó al Gobierno no declarar la emergencia nacional"],
    vox: [1, "a", "decl"], erc: [-1, "m", "decl"], junts: [-1, "m", "decl"], bildu: [-1, "m", "decl"],
    pnv: [-1, "m", "decl"], bng: [-1, "b", "decl"], ac: [-1, "b", "ac:decl"]
  },
  "TER-10": {
    psoe: [-0.5, "m", "prog23", "Defiende un modelo federal, no plurinacional"], pp: [-1, "a", "prog23"], vox: [-1, "a", "prog23"],
    sumar: [1, "a", "prog23"], podemos: [1, "a", "decl"], salf: [-1, "b", "salf:decl"], erc: [1, "a", "prog23"],
    junts: [1, "m", "prog23"], bildu: [1, "a", "prog23"], pnv: [1, "a", "prog23"], bng: [1, "a", "prog23"]
  },
  "TER-11": {
    psoe: [-0.5, "b", "decl"], pp: [0.5, "m", "prog23"], vox: [1, "a", "prog23"], sumar: [-1, "m", "decl"],
    erc: [-1, "m", "decl"], junts: [-1, "m", "decl"], bildu: [-1, "m", "decl"], pnv: [-1, "m", "decl"], bng: [-1, "m", "decl"]
  },
  "TER-12": {
    psoe: [0.5, "m", "psoe:gob", "Traspaso de Rodalies a Cataluña acordado con ERC"], pp: [-0.5, "m", "decl"], vox: [-1, "a", "decl"],
    sumar: [0.5, "b", "decl"], erc: [1, "a", "decl"], junts: [1, "a", "decl"], bildu: [1, "m", "decl"],
    pnv: [1, "a", "decl"], bng: [1, "a", "decl"], ac: [1, "b", "ac:doc"]
  },
  "TER-13": {
    psoe: [1, "m", "psoe:gob", "Transfirió la competencia de tráfico a Navarra (2025)"], pp: [-1, "a", "decl"],
    vox: [-1, "a", "decl"], sumar: [0.5, "b", "decl"], podemos: [0.5, "b", "decl"], salf: [-1, "b", "salf:decl"],
    erc: [1, "b", "decl"], junts: [1, "b", "decl"], bildu: [1, "a", "decl"], pnv: [1, "a", "decl"], bng: [1, "b", "decl"]
  },

  /* ============================ MIG ============================ */
  "MIG-01": {
    psoe: [1, "a", "v_regulariz"], pp: [-1, "a", "decl", "Votó a favor de tramitar la ILP en 2024 pero se opone al decreto de 2026"],
    vox: [-1, "a", "v_regulariz"], sumar: [1, "a", "v_regulariz"], podemos: [1, "a", "v_regulariz"],
    salf: [-1, "a", "salf:prog"], erc: [1, "m", "v_regulariz"], junts: [0, "b", "decl"], bildu: [1, "a", "v_regulariz"],
    pnv: [0.5, "m", "v_regulariz"], bng: [1, "m", "v_regulariz"], ac: [-1, "a", "ac:doc"]
  },
  "MIG-02": {
    psoe: [-0.5, "m", "decl"], pp: [1, "a", "v_prioridad"], vox: [1, "a", "v_prioridad"], sumar: [-1, "a", "decl"],
    podemos: [-1, "a", "decl"], salf: [1, "b", "salf:decl"], erc: [-0.5, "b", "decl"], junts: [0.5, "b", "decl"],
    bildu: [-1, "m", "decl"], pnv: [0.5, "b", "decl", "Algunas ayudas vascas exigen años de empadronamiento"],
    bng: [-0.5, "b", "decl"], ac: [1, "a", "ac:doc"]
  },
  "MIG-03": {
    psoe: [-1, "a", "decl"], pp: [-1, "m", "v_prioridad", "Rechaza el criterio de nacionalidad u origen; prefiere el de arraigo"],
    vox: [1, "a", "v_prioridad"], sumar: [-1, "a", "decl"], podemos: [-1, "a", "decl"], salf: [1, "b", "salf:decl"],
    erc: [-1, "m", "decl"], junts: [-0.5, "b", "decl"], bildu: [-1, "a", "decl"], pnv: [-1, "m", "decl"],
    bng: [-1, "m", "decl"], ac: [1, "m", "ac:doc", "Defiende la prioridad de los catalanes"]
  },
  "MIG-04": {
    psoe: [0, "m", "decl"], pp: [1, "a", "prog23"], vox: [1, "a", "prog23"], sumar: [-1, "a", "decl"],
    podemos: [-1, "a", "decl"], salf: [1, "a", "salf:prog", "Propone un plan de deportación masiva"], erc: [-0.5, "b", "decl"],
    junts: [1, "m", "decl", "Pide expulsar a multirreincidentes"], bildu: [-1, "a", "decl"], pnv: [0, "b", "decl"],
    bng: [-1, "m", "decl"], ac: [1, "a", "ac:doc"]
  },
  "MIG-05": {
    psoe: [1, "a", "v_menores"], pp: [-1, "a", "v_menores"], vox: [-1, "a", "v_menores"], sumar: [1, "a", "v_menores"],
    podemos: [1, "m", "v_menores"], salf: [-1, "b", "salf:decl"], erc: [0.5, "m", "v_menores"],
    junts: [-1, "m", "v_menores"], bildu: [1, "m", "v_menores"], pnv: [1, "m", "v_menores"],
    bng: [0.5, "b", "v_menores"], ac: [-1, "m", "ac:decl"]
  },
  "MIG-06": {
    psoe: [0.5, "m", "psoe:gob", "Las ha mantenido en el Gobierno"], pp: [1, "a", "decl"], vox: [1, "a", "decl"],
    sumar: [-1, "a", "decl"], podemos: [-1, "a", "decl"], salf: [1, "b", "salf:decl"], erc: [-1, "m", "decl"],
    junts: [0, "b", "decl"], bildu: [-1, "a", "decl"], pnv: [-0.5, "b", "decl"], bng: [-1, "m", "decl"], ac: [1, "b", "ac:decl"]
  },
  "MIG-07": {
    psoe: [0.5, "m", "prog23", "Defiende reformarla, no derogarla íntegramente"], pp: [-1, "a", "decl"], vox: [-1, "a", "decl"],
    sumar: [1, "a", "prog23"], podemos: [1, "a", "decl"], erc: [1, "a", "decl"], junts: [0.5, "b", "decl"],
    bildu: [1, "a", "decl"], pnv: [0.5, "m", "decl"], bng: [1, "a", "decl"]
  },
  "MIG-08": {
    psoe: [0.5, "m", "decl", "Apoyó tramitar la reforma de multirreincidencia de Junts"], pp: [1, "a", "decl"], vox: [1, "a", "prog23"],
    sumar: [-0.5, "m", "decl"], podemos: [-1, "m", "decl"], salf: [1, "m", "salf:prog"], erc: [-0.5, "b", "decl"],
    junts: [1, "a", "decl"], bildu: [-1, "m", "decl"], pnv: [1, "m", "decl"], bng: [-0.5, "b", "decl"], ac: [1, "a", "ac:doc"]
  },
  "MIG-09": {
    psoe: [1, "a", "decl"], pp: [0.5, "m", "decl", "Defiende una inmigración «legal y ordenada»"], vox: [-1, "a", "prog23"],
    sumar: [1, "a", "decl"], podemos: [1, "a", "decl"], salf: [-1, "m", "salf:decl"], erc: [1, "m", "decl"],
    junts: [0, "b", "decl"], bildu: [1, "m", "decl"], pnv: [1, "m", "decl"], bng: [1, "m", "decl"], ac: [-1, "a", "ac:doc"]
  },
  "MIG-10": {
    psoe: [-1, "m", "decl"], pp: [0.5, "b", "decl"], vox: [1, "a", "prog23"], sumar: [-1, "m", "decl"],
    podemos: [-1, "m", "decl"], erc: [-1, "b", "decl"], bildu: [-1, "m", "decl"]
  },
  "MIG-11": {
    psoe: [-1, "a", "decl"], pp: [-1, "m", "v_prioridad", "Se ha desmarcado del concepto"], vox: [1, "m", "decl"],
    sumar: [-1, "a", "decl"], podemos: [-1, "a", "decl"], salf: [0, "b", "salf:prog", "Propone deportar a irregulares, no habla de residentes legales"],
    erc: [-1, "m", "decl"], junts: [-1, "b", "decl"], bildu: [-1, "a", "decl"], pnv: [-1, "m", "decl"], bng: [-1, "m", "decl"]
  },
  "MIG-12": {
    psoe: [1, "a", "psoe:gob"], pp: [-0.5, "m", "decl"], vox: [-1, "a", "v_prioridad"], sumar: [1, "a", "decl"],
    podemos: [1, "a", "decl"], salf: [-1, "b", "salf:decl"], erc: [1, "m", "decl"], junts: [0.5, "b", "decl"],
    bildu: [1, "a", "decl"], pnv: [1, "m", "decl"], bng: [1, "m", "decl"], ac: [-1, "m", "ac:decl"]
  },
  "MIG-13": {
    psoe: [-0.5, "m", "decl"], pp: [1, "a", "prog23"], vox: [1, "a", "prog23"], sumar: [-1, "a", "decl"],
    podemos: [-1, "a", "decl"], salf: [1, "m", "salf:prog"], erc: [-1, "a", "decl"], junts: [-0.5, "b", "decl"],
    bildu: [-1, "a", "decl"], pnv: [-1, "m", "decl"], bng: [-1, "m", "decl"], ac: [1, "b", "ac:decl"]
  },
  "MIG-14": {
    psoe: [0.5, "m", "decl"], pp: [1, "a", "prog23"], vox: [1, "a", "prog23"], sumar: [-0.5, "m", "decl"],
    podemos: [-1, "m", "decl"], salf: [1, "b", "salf:decl"], erc: [-0.5, "b", "decl"], junts: [1, "a", "decl"],
    bildu: [-1, "m", "decl"], pnv: [0.5, "b", "decl"], bng: [-0.5, "b", "decl"], ac: [1, "m", "ac:doc"]
  },
  "MIG-15": {
    psoe: [-1, "m", "psoe:gob", "Prioriza la cooperación con Marruecos"], pp: [0.5, "m", "decl"], vox: [1, "a", "prog23"]
  },

  /* ============================ EXT ============================ */
  "EXT-01": {
    psoe: [-0.5, "a", "h_otan25", "Aumentó el gasto al 2 % pero rechazó el 5 %"], pp: [0.5, "m", "decl"],
    vox: [0.5, "b", "decl"], sumar: [-1, "a", "decl"], podemos: [-1, "a", "decl"], erc: [-1, "m", "decl"],
    junts: [0, "b", "decl"], bildu: [-1, "a", "decl"], pnv: [0.5, "b", "decl"], bng: [-1, "a", "decl"]
  },
  "EXT-02": {
    psoe: [-1, "a", "prog23"], pp: [-1, "a", "prog23"], vox: [-1, "a", "prog23"],
    sumar: [-0.5, "m", "decl", "IU es partidaria de salir; Sumar no lo plantea"], podemos: [1, "m", "decl"],
    junts: [-1, "m", "decl"], bildu: [0.5, "m", "decl"], pnv: [-1, "m", "decl"], bng: [1, "m", "prog23"]
  },
  "EXT-03": {
    psoe: [1, "a", "psoe:gob"], pp: [1, "a", "decl"], vox: [0.5, "m", "decl", "Ha apoyado a Ucrania con críticas a la gestión europea"],
    sumar: [0, "m", "decl", "Posición interna dividida"], podemos: [-1, "a", "decl"],
    salf: [-1, "m", "salf:decl", "Se opone a la ayuda financiera a Ucrania"], erc: [0.5, "b", "decl"], junts: [1, "m", "decl"],
    bildu: [-0.5, "b", "decl"], pnv: [1, "m", "decl"], bng: [-1, "m", "decl"]
  },
  "EXT-04": {
    psoe: [1, "a", "v_embargo"], pp: [-1, "a", "v_embargo"], vox: [-1, "a", "v_embargo"], sumar: [1, "a", "v_embargo"],
    podemos: [1, "a", "v_embargo", "Votó a favor criticando que era insuficiente"], salf: [-0.5, "b", "salf:decl"],
    erc: [1, "a", "v_embargo"], junts: [0.5, "m", "v_embargo"], bildu: [1, "a", "v_embargo"],
    pnv: [1, "m", "v_embargo"], bng: [1, "a", "v_embargo"], ac: [-1, "b", "ac:decl"]
  },
  "EXT-05": {
    psoe: [-1, "m", "psoe:gob", "Ha llamado a consultas a su embajadora, sin romper relaciones"], pp: [-1, "a", "decl"],
    vox: [-1, "a", "decl"], sumar: [1, "m", "decl"], podemos: [1, "a", "decl"], salf: [-1, "b", "salf:decl"],
    erc: [1, "m", "decl"], junts: [-0.5, "b", "decl"], bildu: [1, "a", "decl"], pnv: [-0.5, "b", "decl"],
    bng: [1, "m", "decl"], ac: [-1, "b", "ac:decl"]
  },
  "EXT-06": {
    psoe: [1, "a", "h_palestina"], pp: [-0.5, "m", "decl", "Defiende la solución de dos Estados pero criticó el momento y la forma"],
    vox: [-1, "a", "decl"], sumar: [1, "a", "h_palestina"], podemos: [1, "a", "decl"], erc: [1, "a", "decl"],
    junts: [1, "m", "decl"], bildu: [1, "a", "decl"], pnv: [1, "a", "decl"], bng: [1, "a", "decl"], ac: [-1, "b", "ac:decl"]
  },
  "EXT-07": {
    psoe: [1, "a", "h_sahara22"], pp: [-0.5, "b", "decl", "Criticó el cambio unilateral de posición"], vox: [-0.5, "b", "decl"],
    sumar: [-1, "a", "decl"], podemos: [-1, "a", "decl"], erc: [-1, "a", "decl"], junts: [-0.5, "b", "decl"],
    bildu: [-1, "a", "decl"], pnv: [-0.5, "b", "decl"], bng: [-1, "a", "decl"]
  },
  "EXT-08": {
    psoe: [1, "a", "prog23"], pp: [1, "m", "prog23"], vox: [-1, "a", "prog23"],
    sumar: [0, "m", "prog23", "Europeísta pero contraria a la militarización"], podemos: [-0.5, "b", "decl"],
    salf: [-1, "a", "salf:decl"], erc: [0.5, "m", "prog23"], junts: [0.5, "b", "prog23"], bildu: [0, "b", "prog23"],
    pnv: [1, "a", "prog23"], bng: [-0.5, "b", "prog23"]
  },
  "EXT-09": {
    psoe: [-1, "a", "prog23"], pp: [-1, "a", "prog23"], vox: [-1, "m", "decl", "Euroescéptico pero no propone la salida"],
    sumar: [-1, "a", "prog23"], podemos: [-1, "m", "decl"], salf: [1, "a", "salf:prog"], erc: [-1, "m", "decl"],
    junts: [-1, "m", "decl"], bildu: [-1, "m", "decl"], pnv: [-1, "a", "decl"], bng: [-0.5, "b", "decl"], ac: [-0.5, "b", "ac:decl"]
  },
  "EXT-10": {
    psoe: [1, "a", "h_iran_bases"], pp: [-0.5, "b", "decl"], vox: [-1, "m", "decl"], sumar: [1, "a", "decl"],
    podemos: [1, "a", "decl"], salf: [1, "m", "salf:decl", "Calificó de ilegales las acciones de EE. UU. e Israel contra Irán"],
    erc: [1, "m", "decl"], bildu: [1, "a", "decl"], pnv: [0.5, "b", "decl"], bng: [1, "a", "decl"]
  },
  "EXT-11": {
    psoe: [1, "a", "psoe:gob", "Ley de Cooperación (2023)"], pp: [0, "b", "decl"], vox: [-1, "a", "prog23"],
    sumar: [1, "a", "prog23"], podemos: [1, "a", "decl"], salf: [-1, "a", "salf:prog", "Propone destinar esos fondos a deportaciones"],
    erc: [1, "m", "decl"], junts: [0.5, "b", "decl"], bildu: [1, "m", "decl"], pnv: [0.5, "b", "decl"], bng: [1, "m", "decl"]
  },
  "EXT-12": {
    psoe: [1, "m", "psoe:gob", "Plan industrial y tecnológico de defensa (2025)"], pp: [1, "m", "decl"], vox: [1, "m", "decl"],
    sumar: [-1, "a", "decl"], podemos: [-1, "a", "decl"], erc: [-0.5, "b", "decl"], junts: [0.5, "b", "decl"],
    bildu: [-1, "m", "decl"], pnv: [1, "m", "decl"], bng: [-1, "m", "decl"]
  },

  /* ============================ INS ============================ */
  "INS-01": {
    psoe: [1, "a", "v_amnistia"], pp: [-1, "a", "v_amnistia"], vox: [-1, "a", "v_amnistia"], sumar: [1, "a", "v_amnistia"],
    podemos: [1, "a", "v_amnistia"], salf: [-1, "m", "salf:decl"], erc: [1, "a", "v_amnistia"], junts: [1, "a", "v_amnistia"],
    bildu: [1, "a", "v_amnistia"], pnv: [1, "a", "v_amnistia"], bng: [1, "a", "v_amnistia"]
  },
  "INS-02": {
    psoe: [-0.5, "b", "decl"], pp: [1, "m", "decl"], vox: [1, "a", "prog23"], sumar: [0.5, "b", "decl"],
    podemos: [0.5, "b", "decl"], salf: [1, "a", "salf:prog"], erc: [-1, "m", "decl", "Afectada por condenas de malversación del procés"],
    junts: [-1, "m", "decl"]
  },
  "INS-03": {
    psoe: [-1, "a", "h_cgpj24"], pp: [1, "a", "h_cgpj24"], vox: [1, "a", "prog23"], sumar: [-1, "a", "decl"],
    podemos: [-1, "a", "decl"], salf: [1, "b", "salf:decl"], erc: [-1, "m", "decl"], junts: [0, "b", "decl"],
    bildu: [-1, "m", "decl"], pnv: [-0.5, "m", "decl"], bng: [-1, "b", "decl"]
  },
  "INS-04": {
    psoe: [-0.5, "m", "psoe:gob"], pp: [1, "a", "decl"], vox: [1, "a", "decl"], salf: [1, "b", "salf:decl"], pnv: [0.5, "b", "decl"]
  },
  "INS-05": {
    psoe: [-1, "a", "decl"], pp: [1, "a", "decl"], vox: [1, "a", "decl"], sumar: [-0.5, "b", "decl"],
    salf: [1, "a", "salf:decl"], erc: [-0.5, "b", "decl"], bildu: [-0.5, "b", "decl"]
  },
  "INS-06": {
    psoe: [1, "a", "h_dana", "Exigió la dimisión de Mazón"], pp: [-0.5, "m", "h_dana", "Mantuvo a Mazón hasta su dimisión en noviembre de 2025"],
    vox: [0.5, "m", "h_dana"], sumar: [1, "a", "h_dana"], podemos: [1, "a", "h_dana"], erc: [1, "b", "decl"],
    bildu: [1, "b", "decl"], bng: [1, "b", "decl"]
  },
  "INS-07": {
    psoe: [0, "b", "decl"], pp: [0.5, "b", "decl"], vox: [1, "m", "prog23"], sumar: [0.5, "b", "decl"],
    podemos: [0.5, "b", "decl"], salf: [1, "a", "salf:prog"]
  },
  "INS-08": {
    psoe: [1, "m", "h_vox_fin", "Denunció la financiación de Vox ante la Fiscalía"], vox: [-1, "m", "h_vox_fin", "Defiende la legalidad de sus préstamos"],
    sumar: [1, "m", "decl"], podemos: [1, "m", "decl"], erc: [0.5, "b", "decl"], bildu: [1, "b", "decl"]
  },
  "INS-09": {
    pp: [-1, "m", "decl", "Ha reclamado que Sumar abandone el Gobierno si discrepa"], vox: [-1, "m", "decl"],
    sumar: [1, "m", "decl"], podemos: [0.5, "b", "decl"]
  },
  "INS-10": {
    psoe: [1, "m", "decl"], pp: [-1, "a", "decl"], vox: [-1, "a", "decl"], sumar: [1, "m", "decl"],
    podemos: [1, "a", "decl"], salf: [1, "m", "salf:decl", "Alvise denuncia persecución judicial y mediática"],
    erc: [1, "a", "decl"], junts: [1, "a", "decl", "El término figura en el acuerdo de investidura PSOE-Junts"],
    bildu: [1, "m", "decl"], pnv: [0, "b", "decl"], bng: [1, "b", "decl"]
  },
  "INS-11": {
    psoe: [0.5, "m", "decl", "Criticó las listas de 2023 sin promover cambios legales"], pp: [1, "a", "decl"], vox: [1, "a", "decl"],
    sumar: [-0.5, "b", "decl"], podemos: [-0.5, "b", "decl"], salf: [1, "b", "salf:decl"], erc: [-1, "b", "decl"],
    bildu: [-1, "a", "decl"], pnv: [0, "b", "decl"], bng: [-0.5, "b", "decl"]
  },
  "INS-12": {
    psoe: [0.5, "m", "psoe:gob", "Plan de Acción por la Democracia (2024)"], pp: [-1, "m", "decl"], vox: [-1, "a", "decl"],
    sumar: [0.5, "b", "decl"], podemos: [0.5, "b", "decl"], salf: [-1, "a", "salf:decl"], erc: [0, "b", "decl"]
  },
  "INS-13": {
    psoe: [1, "m", "decl", "El presidente propuso acabar con el anonimato en redes (2025)"], pp: [-0.5, "b", "decl"],
    vox: [-1, "m", "decl"], podemos: [-0.5, "b", "decl"], salf: [-1, "a", "salf:decl"]
  },
  "INS-14": {
    psoe: [1, "a", "h_acus_popular"], pp: [-1, "a", "decl"], vox: [-1, "a", "decl"], sumar: [0.5, "b", "decl"],
    salf: [-1, "b", "salf:decl"], junts: [0.5, "b", "decl"]
  }
};
