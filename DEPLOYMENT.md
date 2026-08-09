# Doctor PAN Rehab Clinic - Medical News AI

แอปพลิเคชันนี้ได้ปรับแต่งให้ใช้งานบน **Google AI Studio** อย่างไรก็ตาม สามารถ deploy บน GitHub หรือ cloud platform อื่นได้

## 🚀 Deployment Options

### 1. **Google AI Studio** (Recommended - Native Integration)
โปรเจคนี้ทำาให้เพื่อรันบน Google AI Studio โดยใช้ Gemini API โดยตรง

**Setup:**
```bash
GEMINI_API_KEY=your_key_here
npm install
npm run dev
```

Server จะรันบน `http://localhost:3000`

---

### 2. **GitHub Actions + Cloud Run** (Deploy to Production)

สามารถใช้ GitHub Actions เพื่อ build และ deploy ไปยัง Google Cloud Run

**Requirements:**
- Google Cloud Project
- Service Account with Cloud Run permissions
- Set up GitHub Secrets:
  - `GEMINI_API_KEY`
  - `GCP_PROJECT_ID`
  - `GCP_SERVICE_ACCOUNT_KEY` (JSON format)

**Workflow file:** `.github/workflows/build.yml` ✅ แล้ว

---

### 3. **Local Development**

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 📋 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini API Key (from https://aistudio.google.com) |
| `APP_URL` | ⚠️ Optional | Base URL for API endpoints (set by hosting platform) |
| `NODE_ENV` | ⚠️ Optional | `production` or `development` (default: development) |

---

## 🔧 Build Scripts

- `npm run dev` - Start dev server with hot reload
- `npm run build` - Build frontend (Vite) + backend (Node.js)
- `npm start` - Run production server
- `npm run lint` - Type check with TypeScript
- `npm run clean` - Clean build artifacts

---

## 📦 Tech Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS
- **Backend:** Express.js + Node.js
- **AI Model:** Google Gemini 3.6 Flash (Medical content generation)
- **Package Manager:** npm

---

## ⚠️ Important Notes

1. **API Key Security:** Never commit `.env` files containing real API keys
2. **Node Version:** Requires Node.js 18+ (tested with Node 20)
3. **AI Studio:** This app is optimized for AI Studio environment
4. **CORS:** If deploying separately, configure CORS appropriately

---

## 🐛 Troubleshooting

### Build fails on Windows
✅ Fixed in `package.json` - now uses cross-platform clean script

### "GEMINI_API_KEY is not configured"
- Ensure `.env` file exists with valid API key
- On GitHub: Add `GEMINI_API_KEY` to repository secrets

### Module not found errors
```bash
npm install
npm run clean
npm run build
```

---

Generated: 2026-08-09
Repository: pannawish-boop/Medical-news-from-Dr-Pan
