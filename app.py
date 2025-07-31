import os
import json
from datetime import datetime
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from google.cloud import translate_v2 as translate

load_dotenv()

app = Flask(__name__)
CORS(app)

# Setup Limiter with Redis for persistent rate limiting
limiter = Limiter(
    get_remote_address,
    app=app,
    storage_uri=os.getenv("REDIS_URL"),
    default_limits=["20 per day", "10 per hour"]
)

# Set Google Cloud credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
client = translate.Client()

# Serve the frontend
@app.route("/")
def serve_index():
    return render_template("index.html")


# Persistent character usage storage per IP per month
USAGE_FILE = "usage.json"
CHAR_LIMIT = 500

def load_usage():
    if not os.path.exists(USAGE_FILE):
        return {}
    with open(USAGE_FILE, "r") as f:
        return json.load(f)

def save_usage(data):
    with open(USAGE_FILE, "w") as f:
        json.dump(data, f, indent=2)

def check_usage(ip, char_count):
    usage = load_usage()
    now = datetime.now()
    month = now.strftime("%Y-%m")

    if ip not in usage or usage[ip].get("month") != month:
        usage[ip] = {"month": month, "chars": 0}

    remaining = CHAR_LIMIT - usage[ip]["chars"]
    if char_count > remaining:
        return False, remaining

    usage[ip]["chars"] += char_count
    save_usage(usage)
    return True, remaining - char_count


# Translation endpoint with limits
@app.route("/translate", methods=["POST"])
@limiter.limit("5 per minute")
def translate_text():
    data = request.get_json()
    text = data.get("text", "")
    source = data.get("from", "")
    target = data.get("to", "")
    ip = request.remote_addr

    allowed, remaining = check_usage(ip, len(text))
    if not allowed:
        return jsonify({"error": "Character limit exceeded. You have 0 remaining for this month."}), 403

    try:
        if source == "auto":
            result = client.translate(text, target_language=target)
        else:
            result = client.translate(text, source_language=source, target_language=target)

        return jsonify({
            "translatedText": result["translatedText"],
            "detectedSourceLanguage": result.get("detectedSourceLanguage", ""),
            "remainingChars": remaining
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True)
