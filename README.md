# Compás Político de España

Test web de **afinidad programática** con los partidos españoles, en seis dimensiones (hexágono), para las elecciones generales del **29 de noviembre de 2026**.

> Este test aproxima la similitud entre tus respuestas y las posiciones registradas de cada partido. **No es una recomendación electoral**, ni una encuesta, ni una predicción.

## Uso

- **Sin instalar nada**: abre `index.html` en el navegador (funciona con `file://`, sin servidor ni dependencias).
- **Versión de un solo archivo**: `dist/compas-politico.html` (generada con `python3 tools/build.py`), útil para compartir o publicar.
- **GitHub Pages**: sube el repositorio, ve a *Settings › Pages* y elige la rama `main` / carpeta raíz.

Flujo: inicio → explicación → test rápido (36 preguntas) o completo (88) → progreso → hexágono → posición por dimensión → ranking de afinidad → qué te acerca y te aleja de cada partido → explicación → **Reiniciar test** (borra todas las respuestas y resultados; nada se guarda en el navegador).

## Estructura

```
index.html          Interfaz (cuatro pantallas: inicio, preguntas, resultados, datos y fuentes)
styles.css          Estilos (móvil primero, modo oscuro automático)
script.js           Lógica y cálculo. NO contiene datos políticos
data/questions.js   Dimensiones y preguntas (texto, eje, dirección, peso, contexto, verificación)
data/parties.js     Partidos y registro de fuentes
data/positions.js   Matriz pregunta × partido: [valor, confianza, fuente, nota]
METODOLOGIA.md      Diseño del modelo, fórmulas, sesgos y mitigaciones
tools/validate.js   Comprueba integridad de datos y muestra perfiles de partidos (node tools/validate.js)
tools/build.py      Genera dist/compas-politico.html autocontenido
```

Los datos se cargan con `<script>` clásicos (sin ES Modules) para que funcione abriendo el archivo directamente.

## Modelo en una frase

Seis ejes en [−1, +1] (Economía, Valores, Territorio, Inmigración y seguridad, Exterior y defensa, Instituciones). La **afinidad** es `100 × (1 − √D / 2)`, donde `D` es la distancia cuadrática media ponderada entre tus respuestas y las del partido **pregunta a pregunta**, con el mismo peso para cada dimensión. Cada porcentaje es independiente (no suman 100 %). «No tengo suficiente información» se excluye, no cuenta como neutral. Posiciones `null` (sin evidencia) se excluyen para ese partido. Detalle completo en [METODOLOGIA.md](METODOLOGIA.md).

## Partidos incluidos

Estatales: PSOE, PP, Vox, Sumar/Frente Amplio, Podemos, SALF.
Territoriales: ERC, Junts, EH Bildu, PNV, BNG, Aliança Catalana.

## Revisar el modelo

Todo se edita en `data/` sin tocar `script.js`:

- **Pregunta por pregunta**: `data/questions.js`.
- **Partido por partido**: `data/positions.js` (cada celda: `[valor, confianza, fuente, nota]`).
- **Fuente por fuente**: `data/parties.js › COMPAS.sources`.
- **Vista de revisión**: botón «Datos y fuentes» en la propia app: matriz completa filtrable por partido y dimensión, con estadísticas de celdas sin datos, de confianza baja y con fuente pendiente de enlazar.
- Tras editar: `node tools/validate.js`.

## Limitaciones

- **Aproxima afinidad programática; no es una recomendación de voto.** No mide liderazgo, credibilidad, gestión, candidatos ni voto útil, factores legítimos para decidir.
- **Programas del 29N aún no publicados.** Las posiciones proceden de programas de 2023, votaciones de la XV Legislatura (2023-2026) y declaraciones. Deben actualizarse cuando se publiquen los programas.
- **Codificación inicial realizada con ayuda de IA.** Las celdas de confianza baja y las fuentes marcadas como «pendiente de enlazar» requieren revisión humana una a una antes de una difusión amplia.
- **Coaliciones en formación**: la candidatura a la izquierda del PSOE (Sumar/Frente Amplio) y su relación con Podemos no estaban cerradas a 7/10/2026.
- **Partidos nuevos o pequeños** (SALF, Aliança Catalana) tienen muchas posiciones sin datos. Se muestran aparte si cubren menos de la mitad de tus respuestas, y no se sitúan en ejes donde tienen menos del 30 % de preguntas con datos.
- **Selección y redacción de preguntas**: cualquier test refleja decisiones del diseñador sobre qué temas incluir y cómo formularlos. Ver sesgos en METODOLOGIA.md §6-7.
- **El hexágono es una simplificación**: la afinidad se calcula sobre todas las preguntas, por lo que puede no coincidir con la cercanía visual en el hexágono.
- **Partidos territoriales**: solo se presentan en algunas circunscripciones.
- **Usuario neutral**: quien responda «neutral» a todo obtendrá ~50-60 % con todos; ligeramente más con partidos que tienen más posiciones intermedias.

## Hechos a verificar antes de publicar

Situación a 7 de octubre de 2026 según prensa; comprobar antes de difundir:

| Asunto | Qué verificar | Preguntas |
|---|---|---|
| Convocatoria | Elecciones generales el 29/11/2026; plazos de coaliciones (16/10) y candidaturas (26/10) | — |
| Izquierda del PSOE | Nombre y composición de la coalición (Frente Amplio / Un Paso al Frente), acuerdo o no con Podemos, candidato | todas (Sumar, Podemos) |
| Decretos de vivienda | Contenido exacto y votación de su derogación (oct. 2026) | ECO-07 |
| Nucleares | Estado de la prórroga de Almaraz | ECO-17 |
| Regularización | Real decreto de 2026: solicitudes, resoluciones y recursos | MIG-01 |
| Prioridad nacional | Acuerdos PP-Vox en Extremadura, Aragón y Castilla y León | MIG-02, MIG-03 |
| Embargo a Israel | Vigencia y aplicación tras el alto el fuego en Gaza | EXT-04 |
| Bases de Rota y Morón | Situación tras la negativa de marzo de 2026 | EXT-10 |
| DANA | Causa judicial de Catarroja (instrucción prorrogada hasta abril de 2027); comisión del Congreso | TER-09, INS-06 |
| Causas que afectan al entorno del PSOE y del Gobierno | Estado procesal exacto (investigación, procesamiento, juicio, sentencia firme o no) de cada causa | INS-04, INS-05 |
| Financiación de Vox | Diligencias de Anticorrupción y Tribunal de Cuentas | INS-08 |
| SALF | Causas judiciales abiertas de su líder; programa para el 29N | todas (SALF) |

**Nota sobre afirmaciones no acreditadas.** La afirmación de que Vox está financiado por el Estado de Israel no está acreditada por fuentes públicas a esta fecha; lo documentado son préstamos de un banco húngaro con participación estatal (investigados por Anticorrupción) y donaciones de 2014 de simpatizantes de la oposición iraní en el exilio (reconocidas por el partido). Por eso la pregunta INS-08 se formula como principio general sobre financiación extranjera. El mismo criterio se aplica a las controversias de todos los partidos.

## Licencia

Código y datos abiertos para revisión. Las posiciones de los partidos son interpretaciones documentadas, no declaraciones de los partidos.
