# Doctor PAN Rehab Clinic - Medical News AI

แอปพลิเคชันนี้ได้ปรับแต่งให้ใช้งานบน **Google AI Studio** อย่างไรก็ตาม สามารถ deploy บน cloud platform ได้

## 🚀 Deployment Options

### 1. **Google AI Studio** (Native - แนะนำ)
โปรเจคนี้ทำให้เพื่อรันบน Google AI Studio โดยใช้ Gemini API

**Setup:**
```bash
GEMINI_API_KEY=your_key_here
npm install
npm run dev
```

Server: `http://localhost:3000`

---

### 2. **Google Cloud Run** (Production) ⭐ แนะนำ

สำหรับเซิร์ฟเวอร์ที่ต้องการ Node.js runtime (**GitHub Pages ใช้ไม่ได้**)

**ขั้นตอนการตั้งค่า:**

1. สร้าง Google Cloud Project
2. Enable APIs: Cloud Run, Artifact Registry
3. สร้าง Service Account ด้วยสิทธิ์:
   - Cloud Run Developer
   - Artifact Registry Writer

4. **เพิ่ม GitHub Secrets:**
   - Repository Settings → Secrets and variables → Actions
   - เพิ่ม 3 secret:
     - `GCP_PROJECT_ID` = Google Cloud Project ID
     - `GCP_SA_KEY` = Service Account JSON key (full content)
     - `GEMINI_API_KEY` = Gemini API key

5. **Push ไปยัง `main` branch:**
   ```bash
   git add .
   git commit -m "Ready for Cloud Run deployment"
   git push origin main
   ```

6. **Workflow จะ auto-deploy** ไปยัง Cloud Run
7. ได้ URL: `https://medical-news-clinic-xxx.asia-southeast1.run.app`

**Manual Deploy (ไม่ใช้ GitHub Actions):**
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud run deploy medical-news-clinic \
  --source . \
  --region asia-southeast1 \
  --set-env-vars GEMINI_API_KEY=your_key_here \
  --allow-unauthenticated
```

**Workflow:** `.github/workflows/deploy-cloud-run.yml` ✅

---

### 3. **Vercel** (Alternative)
```bash
npm install -g vercel
vercel env add GEMINI_API_KEY
vercel deploy
```

---

### 4. **Local Development**

```bash
npm install
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
npm run dev
```

---

## 📋 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ | Google Gemini API Key (https://aistudio.google.com) |
| `APP_URL` | ⚠️ | Base URL (auto-set by platform) |
| `NODE_ENV` | ⚠️ | `production` or `development` |

---

## 🔧 Build Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build frontend + backend
- `npm start` - Run production server
- `npm run lint` - TypeScript check
- `npm run clean` - Clean artifacts

---

## 📦 Tech Stack

- Frontend: React 19 + TypeScript + Vite + Tailwind
- Backend: Express.js + Node.js
- AI: Google Gemini 3.6 Flash
- Deployment: Docker + Google Cloud Run
- Package Manager: npm

---

## ❌ Why GitHub Pages Doesn't Work

GitHub Pages รองรับเฉพาะ **static HTML/CSS/JS** เท่านั้น

โปรเจคนี้ต้องการ **Node.js backend server** ซึ่ง GitHub Pages ไม่รองรับ

```
❌ https://pannawish-boop.github.io/Medical-news-from-Dr-Pan/ 
   (Static hosting - ใช้ไม่ได้)

✅ https://medical-news-clinic-xxx.asia-southeast1.run.app 
   (Cloud Run - ใช้ได้)
```

---

## 🐛 Troubleshooting

### Build error: "dist not found"
```bash
npm install
npm run clean
npm run build
```

### "GEMINI_API_KEY not configured"
- **Local:** Create `.env` with valid key
- **GitHub:** Add to repository secrets
- **Cloud Run:** Check deployment env vars

### Cloud Run deploy timeout
```bash
# Check build logs
gcloud builds log --stream
```

---

Generated: 2026-08-09
Repository: pannawish-boop/Medical-news-from-Dr-Pan
