import tempfile
import unittest
from pathlib import Path
import xml.etree.ElementTree as ET

from scripts.generate_sitemap import NAMESPACE, generate


class SitemapTests(unittest.TestCase):
    def test_root_subdirectory_and_xml_escaping(self):
        for base in ("https://example.com", "https://example.com/browser/",
                     "https://example.com/a&b"):
            with self.subTest(base=base), tempfile.TemporaryDirectory(dir=Path.cwd()) as folder:
                output = Path(folder) / "nested/sitemap.xml"
                generate(base, output)
                root = ET.parse(output).getroot()
                self.assertEqual(root.tag, f"{{{NAMESPACE}}}urlset")
                locations = root.findall(f"{{{NAMESPACE}}}url/{{{NAMESPACE}}}loc")
                self.assertEqual([loc.text for loc in locations], [base.rstrip("/") + "/"])
                first = output.read_bytes()
                generate(base, output)
                self.assertEqual(first, output.read_bytes())

    def test_invalid_urls_do_not_write_output(self):
        for base in ("", "example.com", "file:///tmp", "https:///missing",
                     "https://example.com/#portion", "https://example.com/?p=1",
                     "https://user:pass@example.com", "https://example.com/a b"):
            with self.subTest(base=base), tempfile.TemporaryDirectory(dir=Path.cwd()) as folder:
                output = Path(folder) / "sitemap.xml"
                with self.assertRaises(ValueError):
                    generate(base, output)
                self.assertFalse(output.exists())

    def test_guide_and_nested_pages_are_included(self):
        with tempfile.TemporaryDirectory(dir=Path.cwd()) as folder:
            site = Path(folder) / "site"
            (site / "guide").mkdir(parents=True)
            for name in ("index.html", "guide/index.html", "guide/example page.html", "404.html"):
                (site / name).write_text("<!doctype html>", encoding="utf-8")
            output = Path(folder) / "sitemap.xml"
            generate("https://example.com/browser", output, site, ["info.html"])
            locations = ET.parse(output).findall(f"{{{NAMESPACE}}}url/{{{NAMESPACE}}}loc")
            self.assertEqual(sorted(loc.text for loc in locations), [
                "https://example.com/browser/",
                "https://example.com/browser/guide/",
                "https://example.com/browser/guide/example%20page.html",
                "https://example.com/browser/info.html",
            ])
