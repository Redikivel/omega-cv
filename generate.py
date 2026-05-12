from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.request
import urllib.error


class handler(BaseHTTPRequestHandler):
    def _send_json(self, status_code, payload):
        response = json.dumps(payload).encode("utf-8")

        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(response)

    def do_POST(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            raw_body = self.rfile.read(content_length).decode("utf-8")
            body = json.loads(raw_body)

            input_text = body.get("inputText", "").strip()
            language = body.get("language", "en")

            if not input_text:
                self._send_json(400, {
                    "error": "Input text is required."
                })
                return

            api_key = os.environ.get("GEMINI_API_KEY")

            if not api_key:
                self._send_json(500, {
                    "error": "Missing Gemini API key on server."
                })
                return

            prompt = f"""
You are Omega CV, a helpful AI assistant for a student portfolio project.

Your task:
Transform messy, casual or funny user notes into a polished CV-ready ability statement.

Style:
- Professional, but not boring
- Clear and useful for a CV or LinkedIn profile
- Slightly witty only if appropriate
- Do not invent hard facts like degrees, job titles, companies or certifications
- Focus on transferable skills
- Keep it concise
- Output language should match this language code: {language}

Return only the final improved CV-ready statement.

User notes:
{input_text}
"""

            model = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")

            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"

            request_body = {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": prompt
                            }
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.7,
                    "maxOutputTokens": 220
                }
            }

            request_data = json.dumps(request_body).encode("utf-8")

            request = urllib.request.Request(
                url,
                data=request_data,
                headers={
                    "Content-Type": "application/json"
                },
                method="POST"
            )

            with urllib.request.urlopen(request, timeout=30) as response:
                response_text = response.read().decode("utf-8")
                gemini_data = json.loads(response_text)

            result = (
                gemini_data
                .get("candidates", [{}])[0]
                .get("content", {})
                .get("parts", [{}])[0]
                .get("text", "")
                .strip()
            )

            if not result:
                self._send_json(500, {
                    "error": "Gemini returned an empty response."
                })
                return

            self._send_json(200, {
                "result": result
            })

        except urllib.error.HTTPError as error:
            error_body = error.read().decode("utf-8")

            self._send_json(error.code, {
                "error": "Gemini API request failed.",
                "details": error_body
            })

        except Exception as error:
            self._send_json(500, {
                "error": "Something went wrong.",
                "details": str(error)
            })