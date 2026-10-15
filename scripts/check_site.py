"""Controlli strutturali e SEO del sito statico, senza dipendenze esterne."""
import json
import re
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent
DOMAIN = "https://cyberlions-ita.eu"


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.links = []
        self.headings = []
        self.metas = {}
        self.canonical = None
        self.lang = None
        self.json_blocks = []
        self.in_json = False
        self.json_text = ""
        self.title = ""
        self.in_title = False
        self.images = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag == "html":
            self.lang = attrs.get("lang")
        if re.fullmatch(r"h[1-6]", tag):
            self.headings.append(int(tag[1]))
        if tag == "title":
            self.in_title = True
        if tag == "meta":
            self.metas[attrs.get("name", attrs.get("property"))] = attrs.get("content")
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = attrs.get("href")
        if tag == "img":
            self.images.append(attrs)
        if tag in ("a", "link") and attrs.get("href"):
            self.links.append(attrs["href"])
        if tag in ("img", "script") and attrs.get("src"):
            self.links.append(attrs["src"])
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.in_json = True
            self.json_text = ""

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        if tag == "script" and self.in_json:
            self.json_blocks.append(json.loads(self.json_text))
            self.in_json = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.in_json:
            self.json_text += data


def check():
    count = 0
    for name in ("index.html", "404.html"):
        source = (ROOT / name).read_text()
        page = PageParser()
        page.feed(source)
        assert source.lower().startswith("<!doctype html>"), name
        assert page.lang == "it", f"Lingua mancante: {name}"
        assert page.title.strip(), f"Titolo mancante: {name}"
        assert page.headings.count(1) == 1, f"Serve un solo h1: {name}"
        assert len(page.ids) == len(set(page.ids)), f"ID duplicati: {name}"
        for image in page.images:
            assert "alt" in image, f"Alt mancante: {image}"
            assert "width" in image and "height" in image, f"Dimensioni mancanti: {image}"
        for link in page.links:
            parts = urlsplit(link)
            if parts.scheme or parts.netloc:
                assert parts.scheme in ("https", "mailto", "ts3server"), link
                continue
            target = unquote(parts.path)
            if target:
                local = ROOT / target.lstrip("/")
                assert local.exists(), f"File non trovato: {link} ({name})"
            if parts.fragment and (not target or target == name):
                assert unquote(parts.fragment) in page.ids, f"Ancora non trovata: {link}"
            count += 1
        if name == "index.html":
            assert page.canonical == DOMAIN + "/", "Canonical errato"
            for key in ("description", "viewport", "og:title", "og:description", "og:url", "og:image", "twitter:card"):
                assert page.metas.get(key), f"Metadato mancante: {key}"
            assert page.metas["og:url"] == page.canonical
            assert page.json_blocks, "Dati strutturati mancanti"
            graph = page.json_blocks[0]["@graph"]
            assert {item["@type"] for item in graph} == {"Organization", "WebSite"}
            assert all(item["url"] == page.canonical for item in graph)
            assert "jquery" not in source.lower(), "Dipendenza jQuery caricata"
            assert "document.write" not in source, "Rendering dipendente da JS"
            assert all(anchor in page.ids for anchor in ("intro", "server", "forum", "status", "faq", "contatti"))
        else:
            assert page.metas.get("robots") == "noindex"
    xml = ET.parse(ROOT / "sitemap.xml")
    locations = xml.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc")
    assert [item.text for item in locations] == [DOMAIN + "/"]
    assert f"Sitemap: {DOMAIN}/sitemap.xml" in (ROOT / "robots.txt").read_text()
    assert (ROOT / "CNAME").read_text().strip() == urlsplit(DOMAIN).hostname
    print(f"OK: 2 pagine, {count} riferimenti locali, metadati, dati strutturati, ancore precedenti e sitemap.")


if __name__ == "__main__":
    check()
