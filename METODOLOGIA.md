# Metodología del Compás Político de España

Versión 0.1 · 7 de octubre de 2026 · Elecciones generales convocadas para el 29 de noviembre de 2026.

Este documento recoge las decisiones de diseño tomadas **antes** de escribir el código (puntos 1–7 del encargo) y sirve de referencia para revisar el modelo.

---

## 1. Las seis dimensiones

Cada dimensión es un eje continuo en el intervalo **[−1, +1]**. Los polos se nombran de forma descriptiva, no valorativa: ningún polo es «bueno» ni «malo», y el signo (−/+) es una convención técnica, no un juicio.

| Id | Dimensión | Polo − | Polo + | Qué mide |
|----|-----------|--------|--------|----------|
| `ECO` | Economía, Estado y transición ecológica | Intervención y redistribución | Mercado y menos impuestos | Papel del Estado en la economía: impuestos, gasto, regulación de precios (vivienda, alquiler), mercado laboral, gestión pública vs. privada de servicios, regulación ambiental y energética. |
| `SOC` | Valores sociales y culturales | Progresista / cambio | Conservador / tradición | Aborto, eutanasia, políticas LGTBI, igualdad, religión en el espacio público, memoria histórica, monarquía, libertades expresivas, tauromaquia, drogas. |
| `TER` | Modelo territorial | Plurinacional / descentralización | Unitario / centralización | Reparto de competencias, financiación autonómica, conciertos forales, lenguas cooficiales, autodeterminación, mando en emergencias. |
| `MIG` | Inmigración y seguridad | Apertura y garantías | Control y orden | Regularización, expulsiones, «prioridad nacional», fronteras de Ceuta y Melilla, menores no acompañados, Código Penal, Ley de Seguridad Ciudadana, okupación. |
| `EXT` | Política exterior y defensa | Autonomía, derecho internacional y no alineamiento | Alianzas atlánticas, defensa e integración occidental | OTAN, gasto militar, Ucrania, Israel/Palestina, Sáhara Occidental, bases de EE. UU., integración europea, cooperación al desarrollo. |
| `INS` | Instituciones y control del poder | Primacía de la mayoría parlamentaria | Contrapesos judiciales y responsabilidad estricta | Amnistía e indultos, elección del CGPJ y del fiscal general, responsabilidad política vs. penal, acusación popular, «lawfare», financiación de partidos, regulación de Internet. |

### Por qué estas seis (y no otras)

- Se parte de las seis propuestas en el encargo porque **corresponden a líneas de conflicto reales y documentadas en el Congreso** durante la XV Legislatura (2023-2026). Se evaluaron alternativas:
  - **Separar ecología de economía** (7 ejes): descartado para mantener el hexágono; en España la posición en transición ecológica y nucleares correlaciona fuertemente con la posición económico-regulatoria. Se documenta como limitación.
  - **Unir inmigración con valores sociales**: descartado. PP y Vox discrepan sobre «prioridad nacional» por origen, y Junts o Aliança Catalana combinan posiciones de control migratorio con soberanismo territorial; mezclar ejes ocultaría esas diferencias.
  - **Eje «establishment vs. antisistema»**: descartado como eje propio porque es más un estilo que un contenido programático; sus manifestaciones concretas (corrupción, financiación, CGPJ) se recogen en `INS`.
- La **monarquía** se ubica en `SOC` (continuidad institucional/tradición) con peso reducido, porque en España su correlación con el eje territorial es fuerte pero no total (p. ej. SALF se declara republicano y centralista).
- La **integración europea** se ubica en `EXT`. Esto hace que un partido pro‑OTAN pero euroescéptico obtenga una puntuación intermedia en `EXT`: es correcto, porque el eje resume y la afinidad se calcula pregunta a pregunta (ver §4).

> **Clave del modelo:** el hexágono es una **proyección resumida**. La afinidad **no** se calcula sobre el hexágono, sino sobre el vector completo de respuestas (≈90 dimensiones). Así, dos partidos situados en extremos opuestos del eje izquierda‑derecha pueden coincidir en preguntas concretas (p. ej. Podemos y SALF sobre la ayuda militar a Ucrania o sobre las bases de Rota y Morón) y esa coincidencia se refleja en la afinidad sin ninguna fórmula ad hoc.

---

## 2. Banco de preguntas

- ~87 afirmaciones (12–19 por dimensión). Un subconjunto marcado como `core` (≈7 por dimensión) forma el **test rápido**.
- Cada pregunta es una **afirmación** ante la que se expresa acuerdo, no una pregunta Sí/No.
- Cada pregunta tiene:
  - `dim`: dimensión.
  - `dir`: `+1` si estar de acuerdo desplaza hacia el polo + de la dimensión, `−1` si hacia el polo −, `0` si la pregunta **solo cuenta para la afinidad** y no para el hexágono (casos en que la cuestión no encaja limpiamente en ningún polo, como la disciplina de voto en un Gobierno de coalición).
  - `w`: peso discriminatorio (ver §3).
  - `verify` (opcional): qué dato factual debe comprobarse antes de publicar.
- Para equilibrar la dirección, aproximadamente la mitad de las afirmaciones de cada eje están redactadas hacia el polo − y la otra mitad hacia el polo + (reduce el sesgo de aquiescencia: la tendencia a decir «de acuerdo» por defecto).

### Reglas de redacción neutral

1. Se formulan **principios generales** aplicables a cualquier partido, no acusaciones a un partido concreto. Ejemplo: en lugar de mencionar un caso, «Un presidente del Gobierno debería dimitir si su pareja o un familiar directo es juzgado por corrupción, aunque él no esté investigado».
2. Simetría: cada controversia que afecta a un partido tiene su espejo cuando existe (responsabilidad de un presidente del Gobierno por familiares ↔ responsabilidad de un presidente autonómico por la gestión de una catástrofe).
3. Se distingue **investigación / procesamiento / juicio / condena (firme o no) / responsabilidad política**. Las preguntas usan el estadio procesal exacto («juzgado», «procesado», «condenado»).
4. Nada de verbos cargados («malgastar», «invasión», «golpe», «persecución») salvo citados entre comillas y atribuidos («lawfare», «prioridad nacional»).
5. Las afirmaciones factuales se acompañan, cuando hace falta, de un `context` breve y neutral, y se listan en `README.md › Hechos a verificar`.

### Sobre afirmaciones no acreditadas

Algunas controversias que circulan en el debate público **no están acreditadas** y no se presentan como hechos. Ejemplo: la afirmación de que Vox está financiado por el Estado de Israel. A fecha de esta versión, lo documentado públicamente es: (a) préstamos a Vox de un banco húngaro con participación estatal (reconocidos por el partido, que sostiene su legalidad) y diligencias abiertas por la Fiscalía Anticorrupción en 2025 tras una denuncia del PSOE; (b) donaciones en 2014 de simpatizantes del CNRI (oposición iraní en el exilio), reconocidas por el partido; (c) acusaciones políticas de un exdirigente sobre la influencia de Israel en la línea del partido, sin prueba de financiación. La pregunta correspondiente se formula como principio general sobre financiación extranjera de partidos.

---

## 3. Sistema de puntuación

### Respuestas del usuario

| Respuesta | Valor `a` |
|-----------|-----------|
| Totalmente en desacuerdo | −1 |
| En desacuerdo | −0,5 |
| Neutral / indeciso | 0 |
| De acuerdo | +0,5 |
| Totalmente de acuerdo | +1 |
| No tengo suficiente información | **excluida** (no cuenta como 0) |
| Saltar | excluida |

### Posiciones de los partidos

Cada partido tiene, para cada pregunta, una posición `p` en la **misma escala de acuerdo** (−1 … +1) o `null` (sin evidencia suficiente → la pregunta se excluye del cálculo para ese partido).

Cada posición lleva un **nivel de confianza** `c`:

| Confianza | Significado | Factor |
|-----------|-------------|--------|
| `a` alta | Programa, votación nominal o acción de gobierno inequívoca | 1,00 |
| `m` media | Declaraciones oficiales claras, votación con matices, o posición de la coalición predecesora | 0,75 |
| `b` baja | Inferencia razonable desde documentos del partido; pendiente de verificar | 0,50 |

### Pesos discriminatorios `w`

| `w` | Uso |
|-----|-----|
| 1,0 | Por defecto |
| 1,5 | Preguntas que separan claramente a partidos en la XV Legislatura y en las que existe votación nominal (p. ej. amnistía, reducción de jornada, embargo a Israel) |
| 0,5 | Preguntas con poco poder discriminatorio (casi todos los partidos coinciden) o datos escasos |

No se ha ponderado ninguna pregunta para favorecer o perjudicar a un partido; los pesos se asignaron **antes** de calcular los resultados de los partidos y están en `data/questions.js`.

---

## 4. Cálculo matemático

### Posición en cada dimensión (hexágono)

Para el usuario (y de forma idéntica para cada partido) en la dimensión *d*:

```
s_d = Σ_{q ∈ Q_d} w_q · k_q · dir_q · x_q  /  Σ_{q ∈ Q_d} w_q · k_q
```

- `x_q` = respuesta del usuario (`a_q`) o posición del partido (`p_q`).
- `k_q` = 1 para el usuario; factor de confianza para el partido.
- `Q_d` = preguntas de la dimensión con valor no nulo y `dir ≠ 0`.
- `s_d ∈ [−1, +1]`. Si no hay respuestas, la dimensión queda «sin datos».

La posición de cada partido en el hexágono se calcula con **todas** sus posiciones registradas (no solo con las preguntas que haya respondido el usuario), para que el perfil del partido sea estable.

### Afinidad (similitud)

La afinidad se calcula sobre el **espacio completo de preguntas**, no sobre el hexágono:

1. Conjunto de solapamiento `O` = preguntas respondidas por el usuario (no «no sé») **y** con posición no nula del partido.
2. Para cada dimensión *d* con solapamiento, distancia cuadrática media ponderada:

```
D_d = Σ_{q ∈ O_d} w_q · c_pq · (a_q − p_q)²  /  Σ_{q ∈ O_d} w_q · c_pq
```

3. Se promedian las dimensiones con solapamiento con **peso igual** (para que un eje con más preguntas no domine):

```
D = (1 / |dims con datos|) · Σ_d D_d
```

4. Distancia normalizada: `δ = √D / 2` (como `|a − p| ≤ 2`, `δ ∈ [0, 1]`).
5. **Afinidad = 100 · (1 − δ)**.

Propiedades:

- Es una **distancia euclídea ponderada** (RMS) en el espacio de preguntas: penaliza más un desacuerdo fuerte que varios desacuerdos leves.
- Cada partido se calcula **de forma independiente**: los porcentajes **no** suman 100 % y pueden ser todos altos o todos bajos.
- Coincidencia total en todas las preguntas → 100 %. Oposición total (−1 frente a +1 en todas) → 0 %. Usuario neutral (0) frente a cualquier posición extrema → 50 %.
- **Cobertura** = |O| / preguntas respondidas. Si la cobertura es < 50 % el partido se muestra aparte, como «datos insuficientes», porque su porcentaje sería poco fiable.

### Cuestiones que acercan y alejan

Para cada partido y cada pregunta de `O`: diferencia `|a − p|`.

- **Acercan**: menor diferencia; en empate, mayor `w · c · (|a| + |p|)` (coincidir en una posición firme es más informativo que coincidir en neutralidad). Se excluyen coincidencias en las que ambos valores son neutros.
- **Alejan**: mayor diferencia; en empate, mayor `w · c`.

---

## 5. Cómo se obtiene la posición de cada partido

Orden de preferencia de las fuentes (encargo):

1. Programa electoral (generales 23J‑2023, a la espera de los programas del 29N).
2. Documentos oficiales del partido.
3. Votaciones parlamentarias nominales (XV Legislatura).
4. Declaraciones oficiales inequívocas.
5. Otras fuentes fiables.

Reglas:

- Cada celda pregunta×partido referencia una fuente del registro `COMPAS.sources` (`data/parties.js`).
- Las votaciones se traducen así: a favor de la medida que la afirmación defiende → +1; en contra → −1; abstención → 0 (con confianza media).
- Si el partido defiende una versión matizada (p. ej. acepta el objetivo pero no el instrumento) → ±0,5.
- Si no existe evidencia → `null`. **No se rellena por analogía ideológica.**
- Las coaliciones en formación (izquierda a la izquierda del PSOE) se codifican con la posición de la coalición predecesora (Sumar 2023) y su actuación parlamentaria, con confianza media o baja.

> **Estado de esta versión**: la codificación inicial la ha realizado un asistente de IA a partir de las fuentes indicadas y de su conocimiento de la legislatura; las celdas con confianza `b` y las marcadas como «pendiente de enlazar» deben revisarse una a una. La vista `revision.html` muestra la matriz completa con fuentes para esa revisión.

---

## 6. Sesgos metodológicos detectados

| # | Sesgo | Dónde aparece |
|---|-------|---------------|
| 1 | **Selección de preguntas** | Qué temas se incluyen determina qué partidos «parecen» cercanos. Un test con muchas preguntas de vivienda favorece la nitidez de partidos con propuestas de vivienda claras. |
| 2 | **Redacción y encuadre** | Palabras y ejemplos concretos orientan la respuesta. |
| 3 | **Aquiescencia** | Tendencia a responder «de acuerdo». |
| 4 | **Asimetría de información** | Partidos grandes tienen más votaciones y declaraciones → más celdas con datos → afinidades más estables; partidos nuevos (SALF, Aliança Catalana) tienen muchos `null`. |
| 5 | **Codificador** | La persona (o IA) que traduce programas a números introduce su interpretación. |
| 6 | **Programa vs. conducta** | Los partidos a veces votan contra su programa (por pactos o tácticas). |
| 7 | **Dimensión dominante** | Si un eje tiene más preguntas, domina la afinidad. |
| 8 | **Neutralidad como posición** | Tratar «no sé» como centro sesgaría hacia partidos moderados. |
| 9 | **Temporalidad** | Posiciones de 2023 pueden haber cambiado; los programas del 29N aún no están publicados. |
| 10 | **Proyección hexagonal** | Resumir en un eje oculta contradicciones internas de un partido. |
| 11 | **Partidos territoriales** | Solo se presentan en algunas circunscripciones; compararlos con todos los usuarios es útil pero no implica que puedas votarlos. |

## 7. Mitigaciones aplicadas

| Sesgo | Mitigación |
|-------|-----------|
| 1 | Temas tomados del encargo + ampliación con los conflictos de la legislatura; se incluye al menos una controversia principal **por cada partido** con presencia relevante. |
| 2 | Reglas de redacción neutral (§2); principios generales en lugar de casos; simetría entre controversias. |
| 3 | Mitad de las afirmaciones redactadas hacia cada polo. |
| 4 | `null` en vez de inventar; cobertura mostrada; partidos con cobertura < 50 % separados. |
| 5 | Fuente y confianza por celda; vista de revisión; ponderación por confianza. |
| 6 | Prioridad a la votación cuando contradice al programa, señalado en la nota de la celda. |
| 7 | Promedio de distancias con peso igual por dimensión. |
| 8 | «No tengo suficiente información» excluida del cálculo. |
| 9 | `meta.updated`, lista de hechos a verificar, aviso visible en la app. |
| 10 | Afinidad calculada en el espacio completo de preguntas, no en el hexágono. |
| 11 | Etiqueta «territorial» y filtro para ocultarlos. |

---

## Cómo revisar el modelo sin tocar la lógica

- **Preguntas**: `data/questions.js` (texto, dimensión, dirección, peso, `core`, contexto, verificación).
- **Partidos y fuentes**: `data/parties.js` (metadatos, colores y registro de fuentes).
- **Posiciones**: `data/positions.js` (matriz pregunta × partido: `[valor, confianza, fuente, nota]`).
- **Vista de revisión**: abre `revision.html` para ver la matriz completa con fuentes, filtrar por partido y detectar celdas sin fuente o de baja confianza.

`script.js` no contiene ningún dato político: solo lee esos tres archivos.
