#!/usr/bin/env python3
"""Genera versiones de un solo archivo con CSS, datos y JS embebidos.

  dist/compas-politico.html   página completa autocontenida
  dist/artifact.html          misma página sin doctype/html/head/body (para Artifact de claude.ai)
  dist/site/                  copia lista para GitHub Pages (index.html + datos sueltos)

Usa la batería indicada en data/config.js (o la pasada como argumento: python3 tools/build.py 2026).
Uso: python3 tools/build.py [batería]
"""
import pathlib, re, shutil, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"


def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8")


def config_dataset():
    m = re.search(r'dataset:\s*"([^"]+)"', read("data/config.js"))
    return m.group(1) if m else "2023"


def dataset_files():
    """Todos los archivos de todas las baterías, en el orden declarado en data/datasets/index.js."""
    idx = read("data/datasets/index.js")
    files = []
    for ds, body in re.findall(r'"([^"]+)"\s*:\s*\{[^}]*files:\s*\[([^\]]*)\]', idx):
        for f in re.findall(r'"([^"]+)"', body):
            files.append(f"data/datasets/{ds}/{f}")
    return files


def script_tag(rel, code=None):
    code = (code if code is not None else read(rel)).replace("</script", "<\\/script")
    return f"<script>/* {rel} */\n{code}\n</script>"


def main():
    dataset = sys.argv[1] if len(sys.argv) > 1 else config_dataset()
    html = read("index.html")
    html = html.replace('<link rel="stylesheet" href="styles.css">', "<style>\n" + read("styles.css") + "\n</style>")

    def inline(match):
        rel = match.group(1)
        if rel == "data/config.js":
            code = re.sub(r'dataset:\s*"[^"]+"', f'dataset: "{dataset}"', read(rel))
            return script_tag(rel, code)
        if rel == "data/datasets/index.js":
            # Tras el índice se embeben todas las baterías: el cargador ya no necesita pedir archivos
            return script_tag(rel) + "\n" + "\n".join(script_tag(f) for f in dataset_files())
        return script_tag(rel)

    html = re.sub(r'<script src="([^"]+)"></script>', inline, html)

    DIST.mkdir(exist_ok=True)
    (DIST / "compas-politico.html").write_text(html, encoding="utf-8")

    art = re.sub(r"<!doctype html>\s*<html[^>]*>\s*<head>|</head>\s*<body>|</body>\s*</html>\s*$", "", html, flags=re.I)
    art = re.sub(r'<meta charset="utf-8">\s*<meta name="viewport"[^>]*>\s*', "", art)
    (DIST / "artifact.html").write_text(art.strip() + "\n", encoding="utf-8")

    # Sitio para GitHub Pages: la página autocontenida como index.html
    site = DIST / "site"
    if site.exists():
        shutil.rmtree(site)
    site.mkdir()
    (site / "index.html").write_text(html, encoding="utf-8")
    (site / ".nojekyll").write_text("", encoding="utf-8")

    print(f"OK batería {dataset}: dist/compas-politico.html ({len(html)//1024} KB), dist/artifact.html, dist/site/")


if __name__ == "__main__":
    main()
