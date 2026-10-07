// Valida datos y muestra comprobaciones de cordura del modelo. Uso: node tools/validate.js
const fs = require('fs'); const path = require('path'); const vm = require('vm');
const root = path.join(__dirname, '..');
const ctx = { window: {} }; ctx.COMPAS = undefined; vm.createContext(ctx);
for (const f of ['data/questions.js','data/parties.js','data/positions.js']) vm.runInContext(fs.readFileSync(path.join(root,f),'utf8').replace(/window\.COMPAS = window\.COMPAS \|\| \{\};/,'window.COMPAS = window.COMPAS || {}; var COMPAS = window.COMPAS;'), ctx);
const C = ctx.window.COMPAS; let errors = 0; const err = m => { errors++; console.log('ERROR:', m); };
const qids = new Set(C.questions.map(q=>q.id)); const pids = new Set(C.parties.map(p=>p.id)); const dims = new Set(C.dimensions.map(d=>d.id));
if (qids.size !== C.questions.length) err('ids de pregunta duplicados');
for (const q of C.questions) { if (!dims.has(q.dim)) err(q.id+' dim'); if (![1,-1,0].includes(q.dir)) err(q.id+' dir'); if (!(q.w>0)) err(q.id+' w'); if (!C.positions[q.id]) err(q.id+' sin fila de posiciones'); }
const CONF={a:1,m:.75,b:.5};
for (const [qid,row] of Object.entries(C.positions)) { if (!qids.has(qid)) err('posición para pregunta inexistente '+qid);
  for (const [pid,cell] of Object.entries(row)) { if (!pids.has(pid)) err(qid+' partido inexistente '+pid);
    const [v,c,s]=cell; if (![-1,-.5,0,.5,1].includes(v)) err(qid+'/'+pid+' valor '+v); if (!CONF[c]) err(qid+'/'+pid+' conf '+c);
    const src = s && (s.includes(':') ? C.sources[s] : (C.sources[pid+':'+s]||C.sources[s])); if (!src) err(qid+'/'+pid+' fuente no resuelve: '+s); } }
console.log('Preguntas:', C.questions.length, '| rápido:', C.questions.filter(q=>q.core).length);
for (const d of C.dimensions) console.log('  ', d.id, C.questions.filter(q=>q.dim===d.id).length, 'preguntas,', C.questions.filter(q=>q.dim===d.id&&q.core).length, 'core');
// cobertura por partido
console.log('\nCobertura (celdas con dato / preguntas):');
for (const p of C.parties) { const n = C.questions.filter(q=>C.positions[q.id]&&C.positions[q.id][p.id]).length; console.log('  ', p.short.padEnd(8), n+'/'+C.questions.length); }
// ejes de partidos
function pos(pid,qid){const c=C.positions[qid]&&C.positions[qid][pid]; return c?{v:c[0],k:CONF[c[1]]}:null;}
console.log('\nPosición de partidos por eje:');
console.log('   '+''.padEnd(8)+C.dimensions.map(d=>d.id.padStart(6)).join(''));
for (const p of C.parties) { const row = C.dimensions.map(d=>{let n=0,den=0; for(const q of C.questions){ if(q.dim!==d.id||!q.dir) continue; const x=pos(p.id,q.id); if(!x) continue; n+=q.w*x.k*q.dir*x.v; den+=q.w*x.k;} return den? (n/den).toFixed(2).padStart(6):'   n/a';}); console.log('   '+p.short.padEnd(8)+row.join('')); }
// afinidad partido-como-usuario
function aff(ans,pid){const per={};for(const q of C.questions){const a=ans[q.id]; if(typeof a!=='number')continue; const p=pos(pid,q.id); if(!p)continue; const wt=q.w*p.k; (per[q.dim]||(per[q.dim]={n:0,d:0})); per[q.dim].n+=wt*(a-p.v)**2; per[q.dim].d+=wt;} const ds=Object.values(per); if(!ds.length) return null; const D=ds.reduce((s,x)=>s+x.n/x.d,0)/ds.length; return 100*(1-Math.sqrt(D)/2);}
console.log('\nAfinidad si respondes exactamente como el partido de la fila (respuestas = posiciones del partido):');
console.log('   '+''.padEnd(8)+C.parties.map(p=>p.short.slice(0,5).padStart(6)).join(''));
for (const u of C.parties) { const ans={}; for(const q of C.questions){const x=pos(u.id,q.id); if(x) ans[q.id]=x.v;} console.log('   '+u.short.padEnd(8)+C.parties.map(p=>{const a=aff(ans,p.id); return a==null?'   n/a':a.toFixed(0).padStart(6);}).join('')); }
// usuario neutral y aleatorio
const neutral={}; C.questions.forEach(q=>neutral[q.id]=0); console.log('\nUsuario totalmente neutral:', C.parties.map(p=>p.short+' '+aff(neutral,p.id).toFixed(0)).join(', '));
console.log(errors? `\n${errors} errores` : '\nOK: sin errores de integridad');
process.exit(errors?1:0);
