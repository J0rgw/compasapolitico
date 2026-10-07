/*
 * Compás Político de España — lógica de la aplicación.
 * No contiene datos políticos: todo se lee de window.COMPAS
 * (data/questions.js, data/parties.js, data/positions.js).
 * Metodología completa: METODOLOGIA.md
 */
(function () {
  "use strict";

  const C = window.COMPAS || {};
  const DIMS = C.dimensions || [];
  const QUESTIONS = C.questions || [];
  const PARTIES = C.parties || [];
  const POSITIONS = C.positions || {};
  const SOURCES = C.sources || {};

  /* ---------- Parámetros del modelo (documentados en METODOLOGIA.md) ---------- */
  const CONF_FACTOR = { a: 1, m: 0.75, b: 0.5 };
  const CONF_LABEL = { a: "alta", m: "media", b: "baja" };
  const MIN_COVERAGE = 0.5;       // por debajo: partido mostrado aparte
  const MIN_ANSWERS_EARLY = 15;   // respuestas necesarias para «Ver resultados ya»
  const SCALE = [
    { v: -1, label: "Totalmente en desacuerdo" },
    { v: -0.5, label: "En desacuerdo" },
    { v: 0, label: "Neutral / indeciso" },
    { v: 0.5, label: "De acuerdo" },
    { v: 1, label: "Totalmente de acuerdo" }
  ];
  const DK = "dk";

  const dimById = Object.fromEntries(DIMS.map(d => [d.id, d]));
  const partyById = Object.fromEntries(PARTIES.map(p => [p.id, p]));

  /* ---------- Estado ---------- */
  function freshState() {
    return { mode: null, list: [], idx: 0, answers: Object.create(null), radarSel: [], openParty: null, prev: "start" };
  }
  let state = freshState();

  /* ---------- Utilidades ---------- */
  const $ = sel => document.querySelector(sel);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmtNum = (x, d = 2) => (x >= 0 ? "+" : "−") + Math.abs(x).toFixed(d).replace(".", ",");
  function labelFor(v) {
    let best = SCALE[0];
    for (const s of SCALE) if (Math.abs(s.v - v) < Math.abs(best.v - v)) best = s;
    return best.label;
  }

  function resolveSource(pid, key) {
    if (!key) return null;
    if (key.indexOf(":") >= 0) return SOURCES[key] || null;
    return SOURCES[pid + ":" + key] || SOURCES[key] || null;
  }

  function partyPos(pid, qid) {
    const row = POSITIONS[qid];
    if (!row || !row[pid]) return null;
    const [v, c, s, note] = row[pid];
    if (v === null || v === undefined || Number.isNaN(v)) return null;
    const conf = CONF_FACTOR[c] ? c : "b";
    return { v, c: conf, k: CONF_FACTOR[conf], src: resolveSource(pid, s), srcKey: s, note };
  }

  /* Orden de preguntas: intercalado por dimensiones (evita bloques temáticos). */
  function buildList(mode) {
    const pool = QUESTIONS.filter(q => mode === "full" || q.core);
    const byDim = DIMS.map(d => pool.filter(q => q.dim === d.id));
    const out = [];
    let added = true;
    for (let i = 0; added; i++) {
      added = false;
      for (const arr of byDim) if (arr[i]) { out.push(arr[i]); added = true; }
    }
    return out;
  }

  /* ---------- Cálculo ---------- */

  // Posición en cada dimensión. getVal(q) -> {v, k} | null
  function axisScores(getVal) {
    const res = {};
    for (const d of DIMS) {
      let num = 0, den = 0, n = 0;
      for (const q of QUESTIONS) {
        if (q.dim !== d.id || !q.dir) continue;
        const x = getVal(q);
        if (!x) continue;
        const w = (q.w || 1) * x.k;
        num += w * q.dir * x.v;
        den += w;
        n++;
      }
      res[d.id] = den > 0 ? { s: num / den, n } : { s: null, n: 0 };
    }
    return res;
  }

  function userAxis() {
    return axisScores(q => {
      const a = state.answers[q.id];
      return typeof a === "number" ? { v: a, k: 1 } : null;
    });
  }

  // Un partido solo se sitúa en un eje si tiene posición en suficientes preguntas de ese eje.
  const MIN_AXIS_SHARE = 0.3, MIN_AXIS_N = 3;
  const partyAxisCache = {};
  function partyAxis(pid) {
    if (!partyAxisCache[pid]) {
      const res = axisScores(q => partyPos(pid, q.id));
      for (const d of DIMS) {
        const total = QUESTIONS.filter(q => q.dim === d.id && q.dir).length;
        if (res[d.id].n < Math.max(MIN_AXIS_N, Math.ceil(MIN_AXIS_SHARE * total))) res[d.id] = { s: null, n: res[d.id].n, insufficient: true };
      }
      partyAxisCache[pid] = res;
    }
    return partyAxisCache[pid];
  }

  function answeredCount() {
    return Object.values(state.answers).filter(a => typeof a === "number").length;
  }

  function affinity(pid) {
    const perDim = {};
    const items = [];
    for (const q of QUESTIONS) {
      const a = state.answers[q.id];
      if (typeof a !== "number") continue;
      const p = partyPos(pid, q.id);
      if (!p) continue;
      const wt = (q.w || 1) * p.k;
      const acc = perDim[q.dim] || (perDim[q.dim] = { num: 0, den: 0 });
      acc.num += wt * (a - p.v) * (a - p.v);
      acc.den += wt;
      items.push({ q, a, p, diff: Math.abs(a - p.v), wt });
    }
    const answered = answeredCount();
    const dims = Object.values(perDim);
    if (!dims.length) return { pid, score: null, overlap: 0, answered, coverage: 0, closer: [], farther: [] };
    const D = dims.reduce((s, x) => s + x.num / x.den, 0) / dims.length;
    const score = 100 * (1 - Math.sqrt(D) / 2);

    const strength = i => i.wt * (Math.abs(i.a) + Math.abs(i.p.v));
    const closer = items
      .filter(i => i.diff <= 0.5 && Math.max(Math.abs(i.a), Math.abs(i.p.v)) >= 0.5)
      .sort((x, y) => x.diff - y.diff || strength(y) - strength(x))
      .slice(0, 5);
    const farther = items
      .filter(i => i.diff >= 1)
      .sort((x, y) => y.diff - x.diff || y.wt - x.wt)
      .slice(0, 5);

    return { pid, score, overlap: items.length, answered, coverage: answered ? items.length / answered : 0, dims: dims.length, closer, farther };
  }

  /* ---------- Navegación entre pantallas ---------- */
  function show(name) {
    document.querySelectorAll(".screen").forEach(s => s.classList.toggle("is-active", s.id === "screen-" + name));
    window.scrollTo({ top: 0, behavior: "auto" });
  }
  function currentScreen() {
    const el = document.querySelector(".screen.is-active");
    return el ? el.id.replace("screen-", "") : "start";
  }

  /* ---------- Inicio ---------- */
  function renderStart() {
    const meta = C.meta || {};
    $("#election-label").textContent = meta.election || "";
    const quick = QUESTIONS.filter(q => q.core).length;
    $("#quick-count").textContent = quick + " preguntas · unos 6 minutos";
    $("#full-count").textContent = QUESTIONS.length + " preguntas · unos 15 minutos";
    $("#data-status").textContent = (meta.status || "") + (meta.updated ? " Última actualización de datos: " + meta.updated + "." : "");
    $("#footer-version").textContent = meta.version ? "Versión " + meta.version + "." : "";
  }

  function startQuiz(mode) {
    state = freshState();
    state.mode = mode;
    state.list = buildList(mode);
    state.idx = 0;
    renderQuestion();
    show("quiz");
  }

  /* ---------- Preguntas ---------- */
  function renderQuestion() {
    const q = state.list[state.idx];
    if (!q) return;
    const total = state.list.length;
    const d = dimById[q.dim];
    $("#q-counter").textContent = "Pregunta " + (state.idx + 1) + " de " + total;
    const pct = Math.round((state.idx / total) * 100);
    $("#progress-bar").style.width = pct + "%";
    $(".progress").setAttribute("aria-valuenow", String(pct));
    $("#q-dim").textContent = d ? d.name + " · " + q.topic : q.topic;
    $("#q-text").textContent = q.text;

    const ctx = $("#q-context");
    if (q.context) { ctx.hidden = false; ctx.open = false; $("#q-context-text").textContent = q.context; }
    else { ctx.hidden = true; }

    const current = state.answers[q.id];
    $("#scale").innerHTML = SCALE.map((s, i) =>
      '<button type="button" class="scale-btn" data-answer="' + s.v + '" aria-pressed="' + (current === s.v) + '">' +
      '<span class="dot" aria-hidden="true"></span><span>' + esc(s.label) + '</span><span class="key" aria-hidden="true">' + (i + 1) + "</span></button>"
    ).join("");
    const dk = document.querySelector('.q-secondary [data-answer="dk"]');
    dk.setAttribute("aria-pressed", String(current === DK));

    $("#btn-prev").disabled = state.idx === 0;
    $("#finish-early").hidden = answeredCount() < MIN_ANSWERS_EARLY;
  }

  function answer(val) {
    const q = state.list[state.idx];
    if (!q) return;
    state.answers[q.id] = val === DK ? DK : Number(val);
    next();
  }
  function next() {
    if (state.idx < state.list.length - 1) { state.idx++; renderQuestion(); }
    else finish();
  }
  function prev() {
    if (state.idx > 0) { state.idx--; renderQuestion(); }
  }
  function skip() {
    const q = state.list[state.idx];
    if (q && state.answers[q.id] === undefined) { /* saltada: sin respuesta */ }
    next();
  }

  /* ---------- Resultados ---------- */
  function finish() {
    renderResults();
    show("results");
  }

  function renderResults() {
    const n = answeredCount();
    const dk = Object.values(state.answers).filter(a => a === DK).length;
    const ua = userAxis();

    const results = PARTIES.map(p => affinity(p.id));
    const ranked = results.filter(r => r.score !== null && r.coverage >= MIN_COVERAGE).sort((a, b) => b.score - a.score);
    const low = results.filter(r => r.score === null || r.coverage < MIN_COVERAGE);

    $("#results-summary").textContent = n === 0
      ? "No has respondido ninguna pregunta con una opinión, así que no es posible calcular tu posición."
      : "Has opinado en " + n + " de " + state.list.length + " preguntas" + (dk ? " (" + dk + " marcadas como «no tengo suficiente información», excluidas del cálculo)" : "") + ".";

    if (!state.radarSel.length) state.radarSel = ranked.slice(0, 2).map(r => r.pid);

    renderRadar(ua);
    renderChips();
    renderStrips(ua);
    renderRanking(ranked, low);
    renderDimExplain();
  }

  /* Radar SVG */
  function renderRadar(ua) {
    const svg = $("#radar");
    const cx = 200, cy = 200, R = 120, r0 = 0.1;
    const N = DIMS.length;
    const ang = i => (-90 + (360 / N) * i) * Math.PI / 180;
    const rad = v => R * (r0 + (1 - r0) * (v + 1) / 2);
    const pt = (i, v) => [cx + rad(v) * Math.cos(ang(i)), cy + rad(v) * Math.sin(ang(i))];
    const poly = vals => vals.map((v, i) => pt(i, v).map(n => n.toFixed(1)).join(",")).join(" ");

    let h = svg.querySelector("title").outerHTML + svg.querySelector("desc").outerHTML;
    [-1, -0.5, 0, 0.5, 1].forEach(v => {
      h += '<polygon class="grid' + (v === 0 ? " mid" : "") + '" points="' + poly(DIMS.map(() => v)) + '"/>';
    });
    DIMS.forEach((d, i) => {
      const [x, y] = pt(i, 1);
      const [ix, iy] = pt(i, -1);
      h += '<line class="spoke" x1="' + ix.toFixed(1) + '" y1="' + iy.toFixed(1) + '" x2="' + x.toFixed(1) + '" y2="' + y.toFixed(1) + '"/>';
      const lx = cx + (R + 14) * Math.cos(ang(i));
      const ly = cy + (R + 14) * Math.sin(ang(i));
      const anchor = Math.abs(Math.cos(ang(i))) < 0.2 ? "middle" : (Math.cos(ang(i)) > 0 ? "start" : "end");
      const dy = Math.sin(ang(i)) < -0.5 ? -16 : (Math.sin(ang(i)) > 0.5 ? 6 : -5);
      h += '<text class="axis-label" text-anchor="' + anchor + '" x="' + lx.toFixed(1) + '" y="' + (ly + dy).toFixed(1) + '">' + esc(d.abbr || d.name) + "</text>";
      h += '<text class="axis-pole" text-anchor="' + anchor + '" x="' + lx.toFixed(1) + '" y="' + (ly + dy + 15).toFixed(1) + '">→ ' + esc(d.posAbbr || d.pos) + "</text>";
    });

    state.radarSel.forEach(pid => {
      const p = partyById[pid];
      const pa = partyAxis(pid);
      const vals = DIMS.map(d => pa[d.id].s);
      if (vals.every(v => v != null)) {
        h += '<polygon class="party-poly" points="' + poly(vals) + '" style="fill:' + p.color + ";stroke:" + p.color + '"/>';
      } else {
        // Ejes sin datos suficientes: solo se unen vértices consecutivos con datos
        vals.forEach((v, i) => {
          if (v == null) return;
          const j = (i + 1) % N, w = vals[j];
          const [x, y] = pt(i, v);
          h += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="3.5" fill="' + p.color + '"/>';
          if (w != null) { const [x2, y2] = pt(j, w); h += '<line x1="' + x.toFixed(1) + '" y1="' + y.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="' + p.color + '" stroke-width="2" stroke-dasharray="6 4"/>'; }
        });
      }
    });

    const uvals = DIMS.map(d => ua[d.id].s == null ? 0 : ua[d.id].s);
    if (DIMS.some(d => ua[d.id].s != null)) {
      h += '<polygon class="user-poly" points="' + poly(uvals) + '"/>';
      uvals.forEach((v, i) => { const [x, y] = pt(i, v); h += '<circle class="user-pt" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="4"/>'; });
    }
    svg.innerHTML = h;
  }

  function renderChips() {
    const box = $("#radar-chips");
    let h = '<span class="chip you" aria-hidden="true"><span class="sw" style="background:currentColor"></span>Tú</span>';
    PARTIES.forEach(p => {
      const on = state.radarSel.indexOf(p.id) >= 0;
      h += '<button type="button" class="chip" data-radar="' + p.id + '" aria-pressed="' + on + '"><span class="sw" style="background:' + p.color + '"></span>' + esc(p.short) + "</button>";
    });
    box.innerHTML = h;
  }

  function toggleRadar(pid) {
    const i = state.radarSel.indexOf(pid);
    if (i >= 0) state.radarSel.splice(i, 1);
    else { state.radarSel.push(pid); if (state.radarSel.length > 4) state.radarSel.shift(); }
    renderRadar(userAxis());
    renderChips();
  }

  /* Tiras por dimensión */
  function renderStrips(ua) {
    const hideTerr = $("#hide-territorial").checked;
    let h = "";
    DIMS.forEach(d => {
      const u = ua[d.id];
      const pts = PARTIES
        .filter(p => !(hideTerr && p.scope === "territorial"))
        .map(p => ({ p, s: partyAxis(p.id)[d.id].s }))
        .filter(x => x.s != null)
        .sort((a, b) => a.s - b.s);
      // Etiquetas escalonadas para evitar solapes
      const rows = [];
      pts.forEach(x => {
        const pos = (x.s + 1) / 2;
        let r = 0;
        while (rows[r] != null && pos - rows[r] < 0.18) r++;
        rows[r] = pos;
        x.row = r;
      });
      const nRows = Math.max(1, rows.length);
      h += '<div class="strip"><div class="strip-head"><span class="strip-name">' + esc(d.name) + "</span>" +
        '<span class="strip-val">' + (u.s == null ? "sin respuestas" : "Tú: " + fmtNum(u.s)) + "</span></div>" +
        '<div class="track" style="height:' + (34 + nRows * 13) + 'px"><span class="mid"></span>';
      pts.forEach(x => {
        const left = ((x.s + 1) / 2 * 100).toFixed(2);
        h += '<span class="pdot" style="left:' + left + "%;background:" + x.p.color + '" title="' + esc(x.p.short + ": " + fmtNum(x.s)) + '"></span>';
        const pos = (x.s + 1) / 2;
        const shift = pos < 0.07 ? "0" : pos > 0.93 ? "-100%" : "-50%";
        h += '<span class="plabel" style="left:' + left + "%;top:" + (32 + x.row * 13) + "px;transform:translateX(" + shift + ')">' + esc(x.p.short) + "</span>";
      });
      if (u.s != null) h += '<span class="you" style="left:' + ((u.s + 1) / 2 * 100).toFixed(2) + '%" title="Tú: ' + fmtNum(u.s) + '"></span>';
      h += "</div>";
      h += '<div class="strip-poles"><span>← ' + esc(d.neg) + "</span><span>" + esc(d.pos) + " →</span></div>";
      const missing = PARTIES.filter(p => !(hideTerr && p.scope === "territorial") && partyAxis(p.id)[d.id].s == null).map(p => p.short);
      if (missing.length) h += '<div class="strip-poles"><span>Sin datos suficientes en este eje: ' + esc(missing.join(", ")) + "</span></div>";
      h += "</div>";
    });
    $("#dim-strips").innerHTML = h;
  }

  /* Ranking de afinidad */
  function whyItem(i) {
    const src = i.p.src;
    const srcHtml = src ? (src.url ? '<a href="' + esc(src.url) + '" target="_blank" rel="noopener">' + esc(src.title) + "</a>" : esc(src.title)) : "sin fuente";
    return "<li><span class=\"wq\">" + esc(i.q.text) + '</span><span class="wa">Tú: ' + esc(labelFor(i.a)) +
      " · Partido: " + esc(labelFor(i.p.v)) + " (confianza " + CONF_LABEL[i.p.c] + ")" +
      (i.p.note ? " · " + esc(i.p.note) : "") + "<br>Fuente: " + srcHtml + "</span></li>";
  }

  function rankDetail(r) {
    const p = partyById[r.pid];
    let h = '<p class="rank-cov">Comparado en ' + r.overlap + " de tus " + r.answered + " respuestas (" + Math.round(r.coverage * 100) + " %).</p>";
    if (p.note) h += '<p class="rank-note">' + esc(p.note) + "</p>";
    h += '<p class="why-title good">Te acercan</p>';
    h += r.closer.length ? '<ul class="why">' + r.closer.map(whyItem).join("") + "</ul>" : '<p class="why-empty">No hay coincidencias claras en posiciones definidas.</p>';
    h += '<p class="why-title bad">Te alejan</p>';
    h += r.farther.length ? '<ul class="why">' + r.farther.map(whyItem).join("") + "</ul>" : '<p class="why-empty">No hay discrepancias fuertes.</p>';
    return h;
  }

  function renderRanking(ranked, low) {
    const hideTerr = $("#hide-territorial").checked;
    const vis = ranked.filter(r => !(hideTerr && partyById[r.pid].scope === "territorial"));
    $("#ranking").innerHTML = vis.map((r, i) => {
      const p = partyById[r.pid];
      const open = state.openParty === r.pid;
      return '<li class="rank-item' + (open ? " open" : "") + '" data-party="' + p.id + '">' +
        '<button type="button" class="rank-btn" data-rank="' + p.id + '" aria-expanded="' + open + '">' +
        '<span class="rank-pos">' + (i + 1) + "</span>" +
        '<span class="rank-main"><span class="rank-name"><span class="sw" style="background:' + p.color + '"></span>' + esc(p.short) +
        (p.scope === "territorial" ? ' <span class="rank-tag">territorial</span>' : "") + "</span>" +
        '<span class="rank-bar"><span style="width:' + r.score.toFixed(1) + "%;background:" + p.color + '"></span></span></span>' +
        '<span class="rank-pct">' + Math.round(r.score) + "<small> %</small></span></button>" +
        '<div class="rank-detail">' + rankDetail(r) + "</div></li>";
    }).join("") || '<li class="why-empty">Responde más preguntas para calcular la afinidad.</li>';

    const lowVis = low.filter(r => !(hideTerr && partyById[r.pid].scope === "territorial"));
    $("#low-coverage").innerHTML = lowVis.length
      ? '<div class="low-cov"><h3>Datos insuficientes</h3><p>Estos partidos tienen posición documentada en menos de la mitad de las preguntas que has respondido, por lo que su porcentaje no sería fiable:</p><ul class="why">' +
        lowVis.map(r => {
          const p = partyById[r.pid];
          return "<li><b>" + esc(p.short) + "</b> · comparado en " + r.overlap + " de " + r.answered + " respuestas" +
            (r.score != null ? " · afinidad orientativa: " + Math.round(r.score) + " %" : "") + "</li>";
        }).join("") + "</ul></div>"
      : "";
  }

  function renderDimExplain() {
    $("#dim-explain").innerHTML = DIMS.map(d =>
      "<div><dt>" + esc(d.name) + "</dt><dd>" + esc(d.desc) + '<span class="poles">Polos: ' + esc(d.neg) + " ↔ " + esc(d.pos) + "</span></dd></div>"
    ).join("");
  }

  /* ---------- Reinicio ---------- */
  function reset() {
    state = freshState();
    $("#ranking").innerHTML = "";
    $("#low-coverage").innerHTML = "";
    $("#dim-strips").innerHTML = "";
    $("#radar-chips").innerHTML = "";
    const svg = $("#radar");
    svg.innerHTML = svg.querySelector("title").outerHTML + svg.querySelector("desc").outerHTML;
    $("#results-summary").textContent = "";
    $("#hide-territorial").checked = false;
    $("#progress-bar").style.width = "0%";
    show("start");
  }

  /* ---------- Revisión de datos ---------- */
  function renderReview() {
    const partySel = $("#review-party");
    const dimSel = $("#review-dim");
    if (!partySel.options.length) {
      partySel.innerHTML = '<option value="">Todos</option>' + PARTIES.map(p => '<option value="' + p.id + '">' + esc(p.short) + "</option>").join("");
      dimSel.innerHTML = '<option value="">Todas</option>' + DIMS.map(d => '<option value="' + d.id + '">' + esc(d.name) + "</option>").join("");
    }
    const fp = partySel.value, fd = dimSel.value;
    const parties = fp ? PARTIES.filter(p => p.id === fp) : PARTIES;
    const qs = QUESTIONS.filter(q => !fd || q.dim === fd);

    // Estadísticas
    let cells = 0, nulls = 0, lowc = 0, pending = 0;
    qs.forEach(q => parties.forEach(p => {
      cells++;
      const pos = partyPos(p.id, q.id);
      if (!pos) { nulls++; return; }
      if (pos.c === "b") lowc++;
      if (!pos.src || pos.src.pending || !pos.src.url) pending++;
    }));
    $("#review-stats").textContent = qs.length + " preguntas · " + parties.length + " partidos · " + cells + " celdas: " +
      (cells - nulls) + " con posición, " + nulls + " sin datos, " + lowc + " de confianza baja, " + pending + " con fuente pendiente de enlazar.";

    $("#review-body").innerHTML = qs.map(q => {
      const d = dimById[q.dim];
      const head = esc(q.id) + " · " + esc(d ? d.name : q.dim) + " · dir " + (q.dir > 0 ? "+1" : q.dir < 0 ? "−1" : "0") + " · peso " + String(q.w).replace(".", ",") + (q.core ? " · rápido" : "");
      const cellsHtml = parties.map(p => {
        const pos = partyPos(p.id, q.id);
        if (!pos) return '<div class="rc null" style="border-left-color:' + p.color + '"><b>' + esc(p.short) + '</b><span class="rv">sin datos</span></div>';
        const src = pos.src;
        const srcHtml = src ? (src.url ? '<a href="' + esc(src.url) + '" target="_blank" rel="noopener">' + esc(src.title) + "</a>" : esc(src.title)) + (src.pending ? " (pendiente de enlazar)" : "") : "sin fuente: " + esc(pos.srcKey || "");
        return '<div class="rc conf-' + pos.c + '" style="border-left-color:' + p.color + '"><b>' + esc(p.short) + '</b><span class="rv">' +
          fmtNum(pos.v, 1) + " · " + esc(labelFor(pos.v)) + " · conf. " + CONF_LABEL[pos.c] + "</span>" +
          (pos.note ? '<span class="rs">' + esc(pos.note) + "</span>" : "") + '<span class="rs">' + srcHtml + "</span></div>";
      }).join("");
      return '<div class="rq"><div class="rq-head">' + head + '</div><p class="rq-text">' + esc(q.text) + "</p>" +
        (q.verify ? '<p class="rq-head">Verificar antes de publicar: ' + esc(q.verify) + "</p>" : "") +
        '<div class="rq-cells">' + cellsHtml + "</div></div>";
    }).join("");
  }

  function openReview() {
    const cur = currentScreen();
    if (cur !== "review") state.prev = cur;
    renderReview();
    show("review");
  }

  /* ---------- Eventos ---------- */
  document.addEventListener("click", e => {
    const t = e.target.closest("[data-action],[data-answer],[data-radar],[data-rank]");
    if (!t) return;
    if (t.hasAttribute("data-answer")) return answer(t.getAttribute("data-answer"));
    if (t.hasAttribute("data-radar")) return toggleRadar(t.getAttribute("data-radar"));
    if (t.hasAttribute("data-rank")) {
      const pid = t.getAttribute("data-rank");
      state.openParty = state.openParty === pid ? null : pid;
      const li = t.closest(".rank-item");
      document.querySelectorAll(".rank-item.open").forEach(x => { if (x !== li) { x.classList.remove("open"); x.querySelector(".rank-btn").setAttribute("aria-expanded", "false"); } });
      li.classList.toggle("open", state.openParty === pid);
      t.setAttribute("aria-expanded", String(state.openParty === pid));
      return;
    }
    switch (t.getAttribute("data-action")) {
      case "start": return startQuiz(t.getAttribute("data-mode"));
      case "prev": return prev();
      case "skip": return skip();
      case "finish": return finish();
      case "reset": return reset();
      case "review": return openReview();
      case "back-from-review": return show(state.prev || "start");
      case "home":
        if (currentScreen() === "quiz" && answeredCount() > 0 && !window.confirm("¿Salir del test? Se perderán tus respuestas.")) return;
        return reset();
    }
  });

  $("#hide-territorial").addEventListener("change", () => {
    const results = PARTIES.map(p => affinity(p.id));
    renderRanking(results.filter(r => r.score !== null && r.coverage >= MIN_COVERAGE).sort((a, b) => b.score - a.score),
      results.filter(r => r.score === null || r.coverage < MIN_COVERAGE));
    renderStrips(userAxis());
  });
  $("#review-party").addEventListener("change", renderReview);
  $("#review-dim").addEventListener("change", renderReview);

  document.addEventListener("keydown", e => {
    if (currentScreen() !== "quiz" || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key >= "1" && e.key <= "5") { e.preventDefault(); answer(SCALE[Number(e.key) - 1].v); }
    else if (e.key === "0") { e.preventDefault(); answer(DK); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); skip(); }
  });

  /* Exponer funciones de cálculo para pruebas y revisión (sin efectos en la UI) */
  window.COMPAS_ENGINE = { affinity, axisScores, partyAxis, partyPos, buildList, _setAnswers: a => { state.answers = a; } };

  renderStart();
})();
