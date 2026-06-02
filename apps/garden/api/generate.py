"""
Omega Garden — api/generate.py
Vercel Python Serverless Function

Route:  GET /api/generate?q=<query>
Env:    PERENUAL_API_KEY  (set in Vercel project settings)
"""

import json
import os
import urllib.request
import urllib.parse
import urllib.error
from typing import Optional, List, Dict, Any
from http.server import BaseHTTPRequestHandler


# ── Perenual watering → internes Format ──────────────────
WATERING_MAP = {
    "frequent": "high",
    "average":  "medium",
    "minimum":  "low",
    "none":     None,
}

# ── Sunlight mappen ───────────────────────────────────────
def map_light(sunlight_list: List[str]) -> Optional[str]:
    if not sunlight_list or not isinstance(sunlight_list, list):
        return None
    first = sunlight_list[0].lower()
    if "full sun" in first:
        return "full sun"
    if "part" in first or "partial" in first:
        return "part shade"
    if "low" in first or "shade" in first:
        return "low light"
    return None


# ── Einen Perenual-Eintrag mappen ─────────────────────────
def map_plant(item: Dict[str, Any]) -> Optional[dict]:
    raw_watering = (item.get("watering") or "").strip().lower()
    watering_need = WATERING_MAP.get(raw_watering)

    if not watering_need:
        return None

    # FIX: Perenual gibt auf Free-Plan manchmal einen String
    # statt ein Objekt zurück → immer als Dict behandeln
    image_obj = item.get("default_image")
    image_url = None
    if isinstance(image_obj, dict):
        image_url = (
            image_obj.get("medium_url")
            or image_obj.get("small_url")
            or image_obj.get("thumbnail")
            or None
        )
        # Perenual gibt auf Free-Plan manchmal "Upgrade Plan" als URL
        if image_url and "upgrade" in str(image_url).lower():
            image_url = None

    sci_names = item.get("scientific_name") or []
    scientific_name = sci_names[0] if isinstance(sci_names, list) and sci_names else None

    return {
        "id":             item.get("id"),
        "commonName":     item.get("common_name") or scientific_name or "Unknown",
        "scientificName": scientific_name,
        "imageUrl":       image_url,
        "wateringNeed":   watering_need,
        "lightNeed":      map_light(item.get("sunlight") or []),
        "cycle":          item.get("cycle")       or None,
        "growthRate":     item.get("growth_rate") or None,
        "careLevel":      item.get("care_level")  or None,
    }


# ── Perenual API aufrufen ─────────────────────────────────
def fetch_perenual(query: str) -> list:
    api_key = os.environ.get("PERENUAL_API_KEY", "")
    if not api_key:
        raise ValueError("PERENUAL_API_KEY nicht gesetzt")

    params = urllib.parse.urlencode({
        "q":    query,
        "key":  api_key,
        "page": 1,
    })
    url = f"https://perenual.com/api/species-list?{params}"

    req = urllib.request.Request(
        url,
        headers={"User-Agent": "OmegaGarden/1.0"},
    )

    with urllib.request.urlopen(req, timeout=10) as resp:
        raw = json.loads(resp.read().decode("utf-8"))

    return raw.get("data") or []


# ── CORS-Header ───────────────────────────────────────────
CORS_HEADERS = {
    "Access-Control-Allow-Origin":  "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type":                 "application/json",
}


# ── Vercel Handler ────────────────────────────────────────
class handler(BaseHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(204)
        for k, v in CORS_HEADERS.items():
            self.send_header(k, v)
        self.end_headers()

    def do_GET(self):
        # FIX: self.path kann "/api/generate?q=foo" oder "?q=foo" sein
        # urlparse mit vollständigem Pfad ist zuverlässiger
        path = self.path if self.path.startswith("/") else "/" + self.path
        parsed = urllib.parse.urlparse(path)
        params = urllib.parse.parse_qs(parsed.query)
        query  = (params.get("q") or [""])[0].strip()

        if len(query) < 2:
            self._send_json({"plants": [], "error": "Query too short"}, status=400)
            return

        try:
            raw_plants = fetch_perenual(query)
            plants = [p for p in (map_plant(item) for item in raw_plants) if p]
            self._send_json({"plants": plants})

        except ValueError as e:
            self._send_json({"plants": [], "error": str(e)}, status=500)

        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", errors="replace")
            print(f"[generate.py] Perenual HTTP {e.code}: {body}")
            self._send_json(
                {"plants": [], "error": f"Perenual API error: {e.code}"},
                status=502,
            )

        except urllib.error.URLError as e:
            print(f"[generate.py] URLError: {e.reason}")
            self._send_json({"plants": [], "error": "Cannot reach Perenual API"}, status=502)

        except Exception as e:
            print(f"[generate.py] Unhandled error: {type(e).__name__}: {e}")
            self._send_json({"plants": [], "error": "Internal error"}, status=500)

    def _send_json(self, data: dict, status: int = 200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        for k, v in CORS_HEADERS.items():
            self.send_header(k, v)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        pass