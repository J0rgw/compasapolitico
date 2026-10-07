/*
 * Registro de baterías de datos y combinación por herencia.
 * ------------------------------------------------------------------
 * Cada archivo de una batería llama a:
 *
 *   COMPAS_DEFINE("<batería>", "<parte>", { ... })
 *
 * Partes admitidas:
 *   "dataset"    meta, extends, inheritPositions, removeQuestions, editQuestions, removeParties
 *   "questions"  { dimensions?: [...], questions: [...] }     (añade o reemplaza por id)
 *   "parties"    { parties?: [...], sources?: {...} }          (añade o reemplaza por id/clave)
 *   "positions"  { "<pregunta>": { "<partido>": [v, conf, fuente, nota] | null } }
 *
 * Herencia: una batería con `extends: "2023"` parte de 2023 y aplica encima
 * sus cambios. Una celda de posición puesta a null en la batería hija BORRA
 * la heredada (partido sin datos para esa pregunta).
 * Cada celda resultante guarda de qué batería procede (_ds) para poder avisar
 * al usuario de qué datos siguen basados en programas antiguos.
 *
 * No hay datos políticos en este archivo.
 */
(function (root) {
  "use strict";
  var store = root.COMPAS_STORE = root.COMPAS_STORE || {};

  root.COMPAS_DEFINE = function (id, part, value) {
    (store[id] = store[id] || {})[part] = value;
  };

  function clone(x) { return JSON.parse(JSON.stringify(x)); }

  function chainOf(id) {
    var chain = [], seen = {};
    while (id) {
      if (seen[id]) throw new Error("Herencia circular en la batería " + id);
      seen[id] = true;
      var ds = store[id] && store[id].dataset;
      if (!ds) throw new Error("No existe la batería de datos «" + id + "»");
      chain.unshift(id);
      id = ds.extends || null;
    }
    return chain;
  }

  /* Devuelve el objeto COMPAS combinado para la batería indicada. */
  root.COMPAS_RESOLVE = function (id) {
    var chain = chainOf(id);
    var out = { meta: {}, dimensions: [], questions: [], parties: [], sources: {}, positions: {}, datasets: {}, chain: chain, active: id };

    chain.forEach(function (dsId) {
      var parts = store[dsId];
      var ds = parts.dataset || {};
      out.datasets[dsId] = clone(ds.meta || {});
      out.datasets[dsId].id = dsId;

      // Meta: la de la batería activa prevalece
      Object.assign(out.meta, clone(ds.meta || {}));

      // Si la batería no hereda posiciones, se parte de cero
      if (ds.extends && ds.inheritPositions === false) out.positions = {};

      // Preguntas eliminadas o editadas
      (ds.removeQuestions || []).forEach(function (qid) {
        out.questions = out.questions.filter(function (q) { return q.id !== qid; });
        delete out.positions[qid];
      });
      Object.keys(ds.editQuestions || {}).forEach(function (qid) {
        var q = out.questions.find(function (x) { return x.id === qid; });
        if (q) Object.assign(q, clone(ds.editQuestions[qid]));
      });

      // Dimensiones y preguntas nuevas (o reemplazadas por id)
      var qp = parts.questions || {};
      (qp.dimensions || []).forEach(function (d) {
        var i = out.dimensions.findIndex(function (x) { return x.id === d.id; });
        if (i >= 0) out.dimensions[i] = clone(d); else out.dimensions.push(clone(d));
      });
      (qp.questions || []).forEach(function (q) {
        var i = out.questions.findIndex(function (x) { return x.id === q.id; });
        if (i >= 0) out.questions[i] = clone(q); else out.questions.push(clone(q));
      });

      // Partidos y fuentes
      var pp = parts.parties || {};
      (ds.removeParties || []).forEach(function (pid) {
        out.parties = out.parties.filter(function (p) { return p.id !== pid; });
      });
      (pp.parties || []).forEach(function (p) {
        var i = out.parties.findIndex(function (x) { return x.id === p.id; });
        if (i >= 0) out.parties[i] = Object.assign(out.parties[i], clone(p)); else out.parties.push(clone(p));
      });
      Object.keys(pp.sources || {}).forEach(function (k) {
        out.sources[k] = Object.assign(clone(pp.sources[k]), { _ds: dsId });
      });

      // Posiciones (celda a celda)
      var pos = parts.positions || {};
      Object.keys(pos).forEach(function (qid) {
        var row = out.positions[qid] = out.positions[qid] || {};
        Object.keys(pos[qid]).forEach(function (pid) {
          var cell = pos[qid][pid];
          if (cell === null || (Array.isArray(cell) && cell[0] === null)) { delete row[pid]; return; }
          var c = clone(cell);
          c._ds = dsId;
          row[pid] = c;
        });
      });
    });

    // Elimina posiciones de partidos o preguntas que ya no existen
    var qids = {}, pids = {};
    out.questions.forEach(function (q) { qids[q.id] = 1; });
    out.parties.forEach(function (p) { pids[p.id] = 1; });
    Object.keys(out.positions).forEach(function (qid) {
      if (!qids[qid]) { delete out.positions[qid]; return; }
      Object.keys(out.positions[qid]).forEach(function (pid) { if (!pids[pid]) delete out.positions[qid][pid]; });
    });
    return out;
  };
})(typeof window !== "undefined" ? window : globalThis);
