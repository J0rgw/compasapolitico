// Valida todas las baterías de datos y muestra comprobaciones de cordura del modelo.
// Uso: node tools/validate.js            (valida todas; informe detallado de la activa)
//      node tools/validate.js 2026       (informe detallado de la batería 2026)
// Sale con código 1 si hay errores (lo usa la acción de GitHub para no publicar datos rotos).
const fs = require("fs"); const path = require("path"); const vm = require("vm");
const root = path.join(__dirname, "..");

const ctx = { window: {}, console }; ctx.globalThis = ctx; vm.createContext(ctx);
const run = f => vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx, { filename: f });
run("data/config.js"); run("data/registry.js"); run("data/datasets/index.js");
const W = ctx.window;
Object.assign(ctx, { COMPAS_DEFINE: W.COMPAS_DEFINE });
const DATASETS = W.COMPAS_DATASETS;
let errors = 0; const err = m => { errors++; console.log("ERROR:", m); };

for (const [id, def] of Object.entries(DATASETS)) {
  for (const f of def.files) {
    const rel = `data/datasets/${id}/${f}`;
    if (!fs.existsSync(path.join(root, rel))) { err(`falta ${rel}`); continue; }
    try { run(rel); } catch (e) { err(`${rel}: ${e.message}`); }
  }
}

const CONF = { a: 1, m: .75, b: .5 };
function check(id) {
  let C;
  try { C = W.COMPAS_RESOLVE(id); } catch (e) { err(`[${id}] ${e.message}`); return null; }
  const qids = new Set(C.questions.map(q => q.id)); const pids = new Set(C.parties.map(p => p.id)); const dims = new Set(C.dimensions.map(d => d.id));
  if (qids.size !== C.questions.length) err(`[${id}] ids de pregunta duplicados`);
  for (const q of C.questions) {
    if (!dims.has(q.dim)) err(`[${id}] ${q.id} dimensión desconocida ${q.dim}`);
    if (![1, -1, 0].includes(q.dir)) err(`[${id}] ${q.id} dir`);
    if (!(q.w > 0)) err(`[${id}] ${q.id} peso`);
    if (!q.text) err(`[${id}] ${q.id} sin texto`);
  }
  for (const [qid, row] of Object.entries(C.positions)) for (const [pid, cell] of Object.entries(row)) {
    const [v, c, s] = cell;
    if (![-1, -.5, 0, .5, 1].includes(v)) err(`[${id}] ${qid}/${pid} valor ${v}`);
    if (!CONF[c]) err(`[${id}] ${qid}/${pid} confianza ${c}`);
    const src = s && (s.includes(":") ? C.sources[s] : (C.sources[pid + ":" + s] || C.sources[s]));
    if (!src) err(`[${id}] ${qid}/${pid} fuente no resuelve: ${s}`);
  }
  return C;
}

const resolved = {};
for (const id of Object.keys(DATASETS)) resolved[id] = check(id);

const focus = process.argv[2] || W.COMPAS_CONFIG.dataset;
const C = resolved[focus];
if (!DATASETS[W.COMPAS_CONFIG.dataset]) err(`data/config.js apunta a una batería inexistente: ${W.COMPAS_CONFIG.dataset}`);

if (C) {
  const pos = (pid, qid) => { const c = C.positions[qid] && C.positions[qid][pid]; return c ? { v: c[0], k: CONF[c[1]], ds: c._ds } : null; };
  console.log(`Batería activa en config.js: ${W.COMPAS_CONFIG.dataset} · informe de: ${focus} (${C.chain.join(" → ")})`);
  console.log("Preguntas:", C.questions.length, "| rápido:", C.questions.filter(q => q.core).length);
  for (const d of C.dimensions) console.log("  ", d.id, C.questions.filter(q => q.dim === d.id).length, "preguntas,", C.questions.filter(q => q.dim === d.id && q.core).length, "core");

  console.log("\nCobertura por partido (celdas con dato / preguntas) y procedencia:");
  for (const p of C.parties) {
    const cells = C.questions.map(q => pos(p.id, q.id)).filter(Boolean);
    const byDs = {}; cells.forEach(c => byDs[c.ds] = (byDs[c.ds] || 0) + 1);
    console.log("  ", p.short.padEnd(10), `${cells.length}/${C.questions.length}`.padEnd(7), Object.entries(byDs).map(([k, v]) => `${k}: ${v}`).join(", "));
  }

  console.log("\nPosición de partidos por eje:");
  console.log("   " + "".padEnd(10) + C.dimensions.map(d => d.id.padStart(6)).join(""));
  for (const p of C.parties) {
    const row = C.dimensions.map(d => { let n = 0, den = 0; for (const q of C.questions) { if (q.dim !== d.id || !q.dir) continue; const x = pos(p.id, q.id); if (!x) continue; n += q.w * x.k * q.dir * x.v; den += q.w * x.k; } return den ? (n / den).toFixed(2).padStart(6) : "   n/a"; });
    console.log("   " + p.short.padEnd(10) + row.join(""));
  }

  const aff = (ans, pid) => { const per = {}; for (const q of C.questions) { const a = ans[q.id]; if (typeof a !== "number") continue; const p = pos(pid, q.id); if (!p) continue; const wt = q.w * p.k; (per[q.dim] ||= { n: 0, d: 0 }); per[q.dim].n += wt * (a - p.v) ** 2; per[q.dim].d += wt; } const ds = Object.values(per); if (!ds.length) return null; const D = ds.reduce((s, x) => s + x.n / x.d, 0) / ds.length; return 100 * (1 - Math.sqrt(D) / 2); };
  console.log("\nAfinidad si respondes exactamente como el partido de la fila:");
  console.log("   " + "".padEnd(10) + C.parties.map(p => p.short.slice(0, 5).padStart(6)).join(""));
  for (const u of C.parties) {
    const ans = {}; for (const q of C.questions) { const x = pos(u.id, q.id); if (x) ans[q.id] = x.v; }
    console.log("   " + u.short.padEnd(10) + C.parties.map(p => { const a = aff(ans, p.id); return a == null ? "   n/a" : a.toFixed(0).padStart(6); }).join(""));
  }
}

console.log(errors ? `\n${errors} errores` : `\nOK: ${Object.keys(DATASETS).length} baterías sin errores de integridad`);
process.exit(errors ? 1 : 0);
