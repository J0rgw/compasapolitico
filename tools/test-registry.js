// Prueba la herencia entre baterías con datos sintéticos. Uso: node tools/test-registry.js
const fs = require("fs"); const path = require("path"); const vm = require("vm"); const assert = require("assert");
const ctx = { window: {} }; ctx.globalThis = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "data/registry.js"), "utf8"), ctx);
const { COMPAS_DEFINE: D, COMPAS_RESOLVE: R } = ctx.window;

D("A", "dataset", { extends: null, meta: { programs: "A", oldPrograms: true, version: "1" } });
D("A", "questions", { dimensions: [{ id: "X" }], questions: [{ id: "Q1", dim: "X", text: "uno" }, { id: "Q2", dim: "X", text: "dos" }, { id: "Q3", dim: "X", text: "tres" }] });
D("A", "parties", { parties: [{ id: "p", short: "P" }, { id: "q", short: "Q" }], sources: { "p:prog": { title: "A" } } });
D("A", "positions", { Q1: { p: [1, "a", "prog"], q: [-1, "a", "prog"] }, Q2: { p: [0, "m", "prog"] }, Q3: { p: [1, "a", "prog"] } });

D("B", "dataset", { extends: "A", inheritPositions: true, removeQuestions: ["Q3"], editQuestions: { Q2: { text: "dos bis" } }, removeParties: [], meta: { oldPrograms: false, version: "2" } });
D("B", "questions", { questions: [{ id: "Q4", dim: "X", text: "cuatro" }] });
D("B", "parties", { parties: [{ id: "r", short: "R" }, { id: "q", short: "Q26" }], sources: { "p:prog26": { title: "B" } } });
D("B", "positions", { Q1: { p: [0.5, "a", "prog26"], q: null }, Q4: { r: [1, "b", "prog26"] } });

const B = R("B");
assert.strictEqual(JSON.stringify(B.chain), JSON.stringify(["A", "B"]));
assert.strictEqual(JSON.stringify(B.questions.map(q => q.id)), JSON.stringify(["Q1", "Q2", "Q4"]), "Q3 eliminada, Q4 añadida");
assert.strictEqual(B.questions[1].text, "dos bis", "editQuestions aplica");
assert.strictEqual(B.parties.find(p => p.id === "q").short, "Q26", "partido modificado");
assert.ok(B.parties.find(p => p.id === "r"), "partido añadido");
assert.strictEqual(B.positions.Q1.p[0], 0.5); assert.strictEqual(B.positions.Q1.p._ds, "B", "celda sustituida marcada como B");
assert.ok(!B.positions.Q1.q, "null borra la celda heredada");
assert.strictEqual(B.positions.Q2.p._ds, "A", "celda heredada marcada como A");
assert.ok(!B.positions.Q3, "posiciones de pregunta eliminada fuera");
assert.strictEqual(B.meta.version, "2"); assert.strictEqual(B.datasets.A.oldPrograms, true);
assert.strictEqual(R("A").questions.length, 3, "la batería base no se modifica");

D("C", "dataset", { extends: "A", inheritPositions: false, meta: {} });
assert.strictEqual(JSON.stringify(Object.keys(R("C").positions)), JSON.stringify([]), "inheritPositions:false parte de cero");

console.log("OK: herencia entre baterías");
