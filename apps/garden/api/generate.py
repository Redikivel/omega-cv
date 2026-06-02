"""
Omega Garden — api/generate.py
Vercel Python Serverless Function

Route:  GET /api/generate?q=<query>
Env:    PERENUAL_API_KEY  (set in Vercel project settings)

Was diese Datei macht:
  1. Nimmt den Suchbegriff aus ?q=
  2. Ruft die Perenual API auf (/api/species-list)
  3. Filtert Pflanzen ohne Bewässerungsdaten raus
  4. Mappt Perenual-Felder auf das interne Omega-Garden-Format
  5. Gibt sauberes JSON zurück ans Frontend
"""

import json
import os
import urllib.request
import urllib.parse
import urllib.error
from http.server import BaseHTTPRequestHandler


# ── Perenual watering → internes Format ──────────────────
WATERING_MAP = {
    "frequent": "high",
    "average":  "medium",
    "minimum":  "low",
    "none":     None,   # ausschließen
}

# ── Perenual sunlight → internes Format ──────────────────
def map_light(sunlight_list: list) -> str | None:
    if not sunlight_list:
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
def map_plant(item: dict) -> dict | None:
    """
    Gibt None zurück wenn keine verwertbaren Bewässerungsdaten vorhanden.
    """
    raw_watering = (item.get("watering") or "").strip().lower()
    watering_need = WATERING_MAP.get(raw_watering)

    # Pflanze ausschließen wenn kein Bewässerungswert oder explizit "none"
    if not watering_need:
        return None

    # Bild-URL (medium bevorzugt, sonst thumbnail, sonst nichts)
    image_obj = item.get("default_image") or {}
    image_url = (
        image_obj.get("medium_url")
        or image_obj.get("thumbnail")
        or None
    )

    # Wissenschaftlicher Name: erstes Element der Liste
    sci_names = item.get("scientific_name") or []
    scientific_name = sci_names[0] if sci_names else None

    # Optionale Felder — nur setzen wenn vorhanden
    light_need  = map_light(item.get("sunlight") or [])
    cycle       = item.get("cycle")       or None
    growth_rate = item.get("growth_rate") or None
    care_level  = item.get("care_level")  or None

    return {
        "id":             item.get("id"),
        "commonName":     item.get("common_name") or scientific_name or "Unknown",
        "scientificName": scientific_name,
        "imageUrl":       image_url,
        "wateringNeed":   watering_need,   # "low" | "medium" | "high"
        # Optionale Felder — Frontend blendet sie aus wenn None
        "lightNeed":      light_need,
        "cycle":          cycle,
        "growthRate":     growth_rate,
        "careLevel":      care_level,
    }


# ── Perenual API aufrufen ────────────────────────────────
def fetch_perenual(query: str) -> list:
    api_key = os.environ.get("PERENUAL_API_KEY", "")
    if not api_key:
        raise ValueError("PERENUAL_API_KEY nicht gesetzt")

    params = urllib.parse.urlencode({
        "q":   query,
        "key": api_key,
        "page": 1,
    })
    url = f"https://perenual.com/api/species-list?{params}"

    req = urllib.request.Request(
        url,
        headers={"User-Agent": "OmegaGarden/1.0"},
    )

    with urllib.request.urlopen(req, timeout=8) as resp:
        raw = json.loads(resp.read().decode("utf-8"))

    return raw.get("data") or []


# ── CORS-Header ──────────────────────────────────────────
CORS_HEADERS = {
    "Access-Control-Allow-Origin":  "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type":                 "application/json",
}


# ── Vercel Handler ───────────────────────────────────────
class handler(BaseHTTPRequestHandler):

    def do_OPTIONS(self):
        """Preflight-Anfragen beantworten."""
        self.send_response(204)
        for k, v in CORS_HEADERS.items():
            self.send_header(k, v)
        self.end_headers()

    def do_GET(self):
        # Query-Parameter parsen
        parsed = urllib.parse.urlparse(self.path)
        params = urllib.parse.parse_qs(parsed.query)
        query  = (params.get("q") or [""])[0].strip()

        # Zu kurze Anfragen direkt ablehnen
        if len(query) < 2:
            self._send_json({"plants": [], "error": "Query too short"}, status=400)
            return

        try:
            raw_plants = fetch_perenual(query)

            # Mappen + filtern (None-Einträge raus)
            plants = [p for p in (map_plant(item) for item in raw_plants) if p]

            self._send_json({"plants": plants})

        except ValueError as e:
            # Fehlender API-Key
            self._send_json({"plants": [], "error": str(e)}, status=500)

        except urllib.error.HTTPError as e:
            self._send_json(
                {"plants": [], "error": f"Perenual API error: {e.code}"},
                status=502,
            )

        except Exception as e:
            self._send_json({"plants": [], "error": "Internal error"}, status=500)
            print(f"[generate.py] Unhandled error: {e}")

    # ── Helper ──────────────────────────────────────────
    def _send_json(self, data: dict, status: int = 200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        for k, v in CORS_HEADERS.items():
            self.send_header(k, v)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        # Vercel loggt selbst — Standard-Output unterdrücken
        pass