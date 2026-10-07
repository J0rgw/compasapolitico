#!/usr/bin/env node
// Cambia la batería activa, valida los datos y (opcionalmente) hace commit y push.
//
//   node tools/set-dataset.js 2026            cambia data/config.js y valida
//   node tools/set-dataset.js 2026 --push     además hace commit y push (GitHub Pages se actualiza solo)
//   node tools/set-dataset.js                 muestra la batería activa y las disponibles
//
// Funciona igual en Windows, macOS y Linux (solo requiere Node y git).
const fs = require("fs"); const path = require("path"); const { execFileSync } = require("child_process");
const root = path.join(__dirname, "..");
const cfgPath = path.join(root, "data", "config.js");
const idxPath = path.join(root, "data", "datasets", "index.js");

const available = [...fs.readFileSync(idxPath, "utf8").matchAll(/"([^"]+)"\s*:\s*\{\s*label/g)].map(m => m[1]);
const cfg = fs.readFileSync(cfgPath, "utf8");
const current = (cfg.match(/dataset:\s*"([^"]+)"/) || [])[1];

const target = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : null;
const push = process.argv.includes("--push");

if (!target) {
  console.log(`Batería activa: ${current}\nDisponibles: ${available.join(", ")}`);
  process.exit(0);
}
if (!available.includes(target)) {
  console.error(`La batería «${target}» no existe. Disponibles: ${available.join(", ")}`);
  process.exit(1);
}

if (target !== current) {
  fs.writeFileSync(cfgPath, cfg.replace(/dataset:\s*"[^"]+"/, `dataset: "${target}"`));
  console.log(`data/config.js: ${current} → ${target}`);
} else {
  console.log(`La batería activa ya es ${target}.`);
}

const run = (cmd, args) => execFileSync(cmd, args, { cwd: root, stdio: "inherit" });
try {
  run(process.execPath, [path.join("tools", "validate.js"), target]);
} catch (e) {
  if (target !== current) fs.writeFileSync(cfgPath, cfg);
  console.error("\nValidación fallida: se ha restaurado data/config.js. Corrige los datos y vuelve a intentarlo.");
  process.exit(1);
}

if (push) {
  run("git", ["add", "-A"]);
  try {
    run("git", ["commit", "-m", `Batería de datos activa: ${target}`]);
  } catch (e) {
    console.log("Nada nuevo que commitear.");
  }
  run("git", ["push"]);
  console.log("\nPush hecho. GitHub Actions publicará la web en unos minutos (pestaña «Actions» del repositorio).");
} else {
  console.log("\nListo. Para publicar: git commit + git push, o vuelve a ejecutar con --push.");
}
