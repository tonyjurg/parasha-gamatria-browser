"""Generate a sitemap for the single-page browser without network access."""

import argparse
from pathlib import Path
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET

NAMESPACE = "http://www.sitemaps.org/schemas/sitemap/0.9"


def generate(base_url, output, site_dir=Path("site"), extra_pages=()):
    parts = urlsplit(base_url)
    if (parts.scheme not in ("https", "http") or not parts.hostname
            or parts.username or parts.password or parts.query or parts.fragment
            or any(c.isspace() for c in base_url)):
        raise ValueError("Base URL must be an absolute HTTP(S) site URL without credentials, query or fragment")
    base_url = base_url.rstrip("/") + "/"
    ET.register_namespace("", NAMESPACE)
    root = ET.Element(f"{{{NAMESPACE}}}urlset")
    from urllib.parse import quote
    pages = sorted(Path(site_dir).rglob("*.html"))
    if not pages:
        raise ValueError("Site directory contains no HTML pages")
    relative_pages = {page.relative_to(site_dir).as_posix() for page in pages}
    for relative in extra_pages:
        if relative.startswith("/") or ".." in relative.split("/") or any(c in relative for c in "?#:"):
            raise ValueError("Extra pages must be relative paths without query or fragment")
        relative_pages.add(relative)
    for relative in sorted(relative_pages):
        if relative == "404.html":
            continue
        if relative == "index.html":
            relative = ""
        elif relative.endswith("/index.html"):
            relative = relative[:-10]
        entry = ET.SubElement(root, f"{{{NAMESPACE}}}url")
        ET.SubElement(entry, f"{{{NAMESPACE}}}loc").text = base_url + quote(relative, safe="/")
    ET.indent(root, space="  ")
    output = Path(output)
    output.parent.mkdir(parents=True, exist_ok=True)
    ET.ElementTree(root).write(output, encoding="utf-8", xml_declaration=True)
    print(f"Created {output}: {len(root)} URL(s) under {base_url}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-url", required=True)
    parser.add_argument("--output", type=Path, default=Path("site/sitemap.xml"))
    parser.add_argument("--site-dir", type=Path, default=Path("site"))
    parser.add_argument("--extra-page", action="append", default=[])
    args = parser.parse_args()
    try:
        generate(args.base_url, args.output, args.site_dir, args.extra_page)
    except ValueError as error:
        parser.error(str(error))
