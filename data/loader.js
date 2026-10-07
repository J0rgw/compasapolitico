/*
 * Cargador de baterías de datos.
 * Lee data/config.js (o ?datos=<id> en la URL), carga los archivos de la
 * batería y de las que hereda, los combina (data/registry.js) y arranca la app.
 * Funciona abriendo index.html directamente (file://): usa <script> clásicos.
 * Si los datos ya están incluidos en la página (versión de un solo archivo),
 * no carga nada y arranca directamente.
 */
(function () {
  "use strict";
  var DATASETS = window.COMPAS_DATASETS || {};
  var STORE = window.COMPAS_STORE || (window.COMPAS_STORE = {});

  function requested() {
    var fromUrl = null;
    try { fromUrl = new URLSearchParams(window.location.search).get("datos"); } catch (e) { /* sin URL */ }
    if (fromUrl && DATASETS[fromUrl]) return fromUrl;
    var cfg = (window.COMPAS_CONFIG && window.COMPAS_CONFIG.dataset) || "2023";
    return DATASETS[cfg] ? cfg : "2023";
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = function () { reject(new Error("No se pudo cargar " + src)); };
      document.head.appendChild(s);
    });
  }

  function partName(file) { return file.replace(/\.js$/, ""); }

  // Carga una batería (si falta) y, a continuación, la batería de la que hereda.
  function loadDataset(id, seen) {
    seen = seen || {};
    if (seen[id]) return Promise.reject(new Error("Herencia circular en " + id));
    seen[id] = true;
    var def = DATASETS[id];
    if (!def) return Promise.reject(new Error("Batería desconocida: " + id));
    var missing = def.files.filter(function (f) { return !(STORE[id] && STORE[id][partName(f)]); });
    var chain = Promise.resolve();
    missing.forEach(function (f) { chain = chain.then(function () { return loadScript("data/datasets/" + id + "/" + f); }); });
    return chain.then(function () {
      var parent = STORE[id] && STORE[id].dataset && STORE[id].dataset.extends;
      return parent ? loadDataset(parent, seen) : null;
    });
  }

  function fail(err) {
    var app = document.getElementById("app");
    if (app) app.innerHTML = '<section class="screen is-active"><h1>No se pudieron cargar los datos</h1><p class="lead small">' +
      String(err && err.message || err) + '. Revisa data/config.js y data/datasets/.</p></section>';
    if (window.console) console.error(err);
  }

  var id = requested();
  loadDataset(id).then(function () {
    window.COMPAS = window.COMPAS_RESOLVE(id);
    window.COMPAS.available = DATASETS;
    if (typeof window.COMPAS_BOOT === "function") window.COMPAS_BOOT();
  }).catch(fail);
})();
