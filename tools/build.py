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

out = ROOT / "dist" / "compas-politico.html"
out.parent.mkdir(exist_ok=True)
out.write_text(html, encoding="utf-8")
print(f"OK {out.relative_to(ROOT)} ({len(html)//1024} KB)")
