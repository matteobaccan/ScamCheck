#!/usr/bin/env node
// ScamCheck - https://github.com/matteobaccan/ScamCheck
// Author: Matteo Baccan - MIT License
//
// ScamCheck helper (optional): fills report-template.html with the analysis data and writes the report HTML.
//
// Usage: node gen-report.js <data.json> <out.html> ["<generation date time>"] [template.html]
//   data.json  analysis content, all visible strings already in the report language (see example-data.json)
//   out.html   output file; put home.png (home page screenshot) in the same folder
//   generation date/time defaults to now (YYYY-MM-DD HH:MM); template defaults to ../report-template.html
//
// Then convert with headless Chrome (see SKILL.md, "PDF report"). If this script fails, edit a copy of
// report-template.html by hand following the same structure.

const fs = require("fs"), path = require("path");
const [dataFile, out, genArg, tplArg] = process.argv.slice(2);
if (!dataFile || !out) { console.error("usage: node gen-report.js <data.json> <out.html> [\"date time\"] [template.html]"); process.exit(2); }

const tpl = tplArg || path.join(__dirname, "..", "report-template.html");
const d = JSON.parse(fs.readFileSync(dataFile, "utf8"));
const t = fs.readFileSync(tpl, "utf8");
const pad = n => String(n).padStart(2, "0"), now = new Date();
const gen = genArg || `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

for (const k of ["lang", "domain", "url", "analysisDate", "index", "verdict", "summary", "calc", "redflags", "checks", "positives", "todo", "limits", "sources", "t"])
  if (d[k] === undefined) { console.error(`data.json: missing "${k}"`); process.exit(3); }

const esc = s => String(s).replace(/"/g, "&quot;");
const cssStr = s => String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
const BS = "\\";
const index = Math.max(0, Math.min(100, Math.round(d.index)));
const band = index <= 10 ? "#2f9e44" : index <= 29 ? "#c99a00" : index <= 79 ? "#d9480f" : "#e03131";
const a = Math.PI * (1 - index / 100);
const nx = (120 + 78 * Math.cos(a)).toFixed(1), ny = (118 - 78 * Math.sin(a)).toFixed(1);

const head = t.slice(0, t.indexOf("<body>"))
  .replace(/<html lang="[^"]*">/, `<html lang="${esc(d.lang)}">`)
  .replace(/<title>[^<]*<\/title>/, `<title>ScamCheck: ${d.domain}</title>`)
  .replace(/@bottom-left \{ content: "[^;]*";/, `@bottom-left { content: "${cssStr(d.t.disclaimer)}${BS}A ScamCheck · ${cssStr(d.t.generated)} ${gen} · github.com/matteobaccan/ScamCheck";`)
  .replace(/content: "Page " counter\(page\) " of " counter\(pages\)/, `content: "${cssStr(d.t.page)} " counter(page) " ${cssStr(d.t.of)} " counter(pages)`)
  .replace(/\.gval \{([^}]*)color: #[0-9a-f]{6}/, `.gval {$1color: ${band}`)
  .replace(/\.glbl \{([^}]*)color: #[0-9a-f]{6}/, `.glbl {$1color: ${band}`)
  .replace(/header \{([^}]*)border-bottom: 3px solid #[0-9a-f]{6}/, `header {$1border-bottom: 3px solid ${band}`);
const svg = t.slice(t.indexOf("<svg"), t.indexOf("</svg>") + 6)
  .replace(/aria-label="[^"]*"/, `aria-label="${esc(d.t.indexLabel)} ${index}/100"`)
  .replace(/x2="[\d.]+" y2="[\d.]+"/, `x2="${nx}" y2="${ny}"`);

const ST = { ok: ["ok", "✅"], warn: ["warn", "⚠️"], bad: ["bad", "❌"], na: ["na", "➖"], plus: ["ok", "➕"], crit: ["bad", "⛔"] };
const ul = xs => "<ul>\n" + xs.map(x => `  <li>${x}</li>`).join("\n") + "\n</ul>";
const rows = d.checks.map(([c, s, n]) => {
  const st = ST[s] || ST.na;
  return `    <tr><td>${c}</td><td class="s ${st[0]}">${st[1]}</td><td>${n}</td></tr>`;
}).join("\n");

const body = `<body>
<header>
  <div class="head-text">
    <div class="kicker">ScamCheck · report</div>
    <h1>${d.domain}</h1>
    <div class="meta">${d.t.url}: ${d.url}<br>${d.t.date}: ${d.analysisDate}<br>${d.t.method}</div>
  </div>
  <figure class="thumb">
    <img src="home.png" alt="${esc(d.t.shotAlt || d.domain)}">
    <figcaption>${d.t.shotCaption || ""}</figcaption>
  </figure>
</header>

<div class="verdict">
  <div class="gauge">
    ${svg}
    <div class="gval">${index}<span>/100</span></div>
    <div class="glbl">${d.verdict}</div>
    <div class="glegend"><i style="background:#2f9e44"></i>${d.t.bands[0]} <i style="background:#f2c200"></i>${d.t.bands[1]} <i style="background:#f76707"></i>${d.t.bands[2]} <i style="background:#e03131"></i>${d.t.bands[3]}</div>
  </div>
  <div class="summary">
    <strong>${d.t.oneLine}:</strong> ${d.summary}
    <div class="pts">${d.calc}</div>
  </div>
</div>

<h2>${d.t.redflags}</h2>
${ul(d.redflags)}

<h2 class="newpage">${d.t.details}</h2>
<table>
  <thead><tr><th style="width:30%">${d.t.check}</th><th style="width:9%">${d.t.result}</th><th>${d.t.note}</th></tr></thead>
  <tbody>
${rows}
  </tbody>
</table>
<div class="legend">${d.t.legend}</div>

<h2 class="newpage">${d.t.positives}</h2>
${ul(d.positives)}
${d.third && d.third.length ? `\n<h2>${d.t.third}</h2>\n${ul(d.third)}\n` : ""}
<h2>${d.t.todo}</h2>
${ul(d.todo)}

<h2>${d.t.limits}</h2>
${ul(d.limits)}
<div class="note">${d.t.closing}</div>

<footer>${d.t.sources}: ${d.sources}</footer>
</body>
</html>
`;
fs.writeFileSync(out, head + body);
console.log(`written ${out} (index ${index}, needle ${nx},${ny})`);
