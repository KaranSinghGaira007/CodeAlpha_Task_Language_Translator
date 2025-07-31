# 🌐 Alpha Translator

**Alpha Translator** is a simple, fast, and privacy-friendly web-based translation tool built with **Flask**, **JavaScript**, and **Google Cloud Translate API**. It includes features like **text-to-speech**, **copy**, **clear**, and **character usage limits per IP** for fair usage control.

---

## 🚀 Features

- 🌍 Supports over 20 major languages
- 🔄 Auto language detection
- 🧠 Google Translate API integration
- 🔊 Text-to-Speech in the target language
- 📝 Copy, Clear, and Character Counter
- ⚠️ Rate limiting and usage tracking (by IP)
- 🌐 Responsive frontend using HTML, CSS, and JS

---

## 📂 Project Structure

```
ALPHA-TRANSLATE/
│
├── static/
│   ├── css/
│   │   └── style.css
│   ├── images/
│   │   ├── logo.png
│   │   ├── rightarrow.svg
│   │   └── symbol-1.svg
│   └── js/
│       └── script.js
│
├── templates/
│   └── index.html
│
├── app.py                # Flask backend
├── usage.json            # Character usage tracking
├── keyfile.json          # Google Cloud credentials
├── .env                  # Environment variables (e.g., Redis URL)
├── .gitignore
├── requirements.txt
└── README.md
```

---

## 🛠️ Installation

1. **Clone the Repository**

```bash
git clone https://github.com/yourusername/alpha-translator.git
cd alpha-translator
```

2. **Install Dependencies**

```bash
pip install -r requirements.txt
```

3. **Setup Environment Variables**

Create a `.env` file and add:

```env
GOOGLE_APPLICATION_CREDENTIALS=keyfile.json
REDIS_URL=redis://localhost:6379
```

> Make sure `keyfile.json` is your Google Cloud service account credentials.

4. **Run the Flask Server**

```bash
python app.py
```

---

## ✅ Requirements

- Python 3.7+
- Google Cloud account (Translate API enabled)
- Redis (for rate limiting)

Install Redis locally:

```bash
sudo apt install redis
sudo service redis start
```

---

## 📦 Dependencies

- Flask
- Flask-CORS
- Flask-Limiter
- python-dotenv
- google-cloud-translate

---

## 🧠 Rate Limiting & Usage

- 🔁 5 requests per minute
- 📆 20 requests per day
- ✂️ 500 characters/month per IP (stored in `usage.json`)

---

## 📸 UI Preview

![UI Screenshot](static/images/logo.png)

---

## 🔐 Notes

- Never commit your `keyfile.json` or `.env` to GitHub.
- Deploy with a WSGI server like Gunicorn for production.
- You can extend this tool with user accounts and saved history.

---

## 📜 License

MIT License © 2025 [Your Name or GitHub Username]
