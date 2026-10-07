#!/usr/bin/env python3
"""Genera dist/compas-politico.html: un único archivo con CSS, datos y JS embebidos.
Uso: python3 tools/build.py
"""
import pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
html = (ROOT / "index.html").read_text(encoding="utf-8")

css = (ROOT / "styles.css").read_text(encoding="utf-8")
html = html.replace('<link rel="stylesheet" href="styles.css">', "<style>\n" + css + "\n</style>")

def inline(match):
    src = match.group(1)
    code = (ROOT / src).read_text(encoding="utf-8").replace("</script", "<\\/script")
    return "<script>/* " + src + " */\n" + code + "\n</script>"

html = re.sub(r'<script src="([^"]+)"></script>', inline, html)

# Variante para publicar como Artifact de claude.ai: sin doctype/html/head/body (el host los añade)
art = re.sub(r"<!doctype html>\s*<html[^>]*>\s*<head>|</head>\s*<body>|</body>\s*</html>\s*$", "", html, flags=re.I)
art = re.sub(r'<meta charset="utf-8">\s*<meta name="viewport"[^>]*>\s*', "", art)
(ROOT / "dist").mkdir(exist_ok=True)
(ROOT / "dist" / "artifact.html").write_text(art.strip() + "\n", encoding="utf-8")

out = ROOT / "dist" / "compas-politico.html"
out.parent.mkdir(exist_ok=True)
out.write_text(html, encoding="utf-8")
print(f"OK {out.relative_to(ROOT)} ({len(html)//1024} KB)")
