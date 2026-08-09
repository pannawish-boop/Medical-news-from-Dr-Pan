import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily or safely with User-Agent header
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", clinic: "Doctor PAN Rehab Clinic" });
});

// API: Automated Batch Medical Article Generation via Gemini 3.6 Flash
app.post("/api/generate-batch", async (req, res) => {
  try {
    const { category, targetCount = 5 } = req.body;
    const ai = getGeminiClient();

    const targetCategoryLabel = category && category !== 'all' 
      ? `สำหรับหมวดหมู่เฉพาะ: ${category}` 
      : `สำหรับทั้ง 5 หมวดหมู่ (asd, adhd, ld, tics, tms) หมวดละ ${targetCount} บทความ`;

    const systemPrompt = `คุณคือระบบวิเคราะห์และสรุปวารสารการแพทย์ระดับสูงสำหรับ "ด็อกเตอร์ปันรีแฮบสหคลินิก" (Doctor PAN Rehab Clinic) 
หน้าที่ของคุณคือการสร้างบทความทางการแพทย์และพัฒนาการเด็ก/ระบบประสาทฟื้นฟู 
เป้าหมายผู้ฟัง: คนไข้ ผู้ปกครอง และประชาชนทั่วไป (อ่านง่าย ไม่ซับซ้อน ได้ผลจริงทางปฏิบัติ)
ความยาวบทความแต่ละบทความ: เต็มหน้ากระดาษ A4 (ประมาณ 600-900 คำในภาษาไทย)
โครงสร้างบทความแต่ละบทความ:
1. ชื่อบทความ (ดึงดูด น่าเชื่อถือ)
2. หมวดหมู่ (ต้องเป็นหนึ่งใน: asd, adhd, ld, tics, tms)
3. สรุปสั้น (2 ประโยค)
4. เนื้อหาบทความหลัก (เต็มหน้า A4 แบ่งเป็น 5-6 หัวข้อย่อย ## เช่น บทนำและภูมิหลังทางคลินิก, พยาธิสรีรวิทยาและระบบประสาทวิทยา, เกณฑ์การประเมินและจัดลำดับขั้น, แนวทางปฏิบัติตนสำหรับครอบครัว, งานวิจัยอ้างอิง, สรุปและแผนติดตามผล)
5. หัวข้อปฏิบัติได้ทันที (actionableTakeaways: ข้อแนะนำ 4-5 ข้อสั้นๆ ให้ผู้ปกครองนำไปทำตาม)
6. แหล่งข้อมูลอ้างอิงทางการแพทย์ (citations: ชื่อบทความวารสารการแพทย์, ชื่อวารสาร/เว็บการแพทย์ที่เชื่อถือได้, URL หรือ DOI, ปีที่ตีพิมพ์)`;

    const userPrompt = `กรุณาสร้างบทความการแพทย์ใหม่ที่เป็นฉบับร่างล่าสุด ${targetCategoryLabel} 
โดยดึงความรู้จากงานวิจัยและวารสารการแพทย์ล่าสุด เช่น Journal of Autism, Pediatrics, AACAP, Brain Stimulation, Movement Disorders 
ความยาวต้องเป็นฉบับสมบูรณ์เต็มหน้ากระดาษ A4 
ผลลัพธ์ต้องส่งกลับเป็นโครงสร้าง JSON ดังนี้:
[
  {
    "title": "ชื่อบทความภาษาไทย",
    "category": "asd | adhd | ld | tics | tms",
    "summary": "บทสรุปสั้น 2 ประโยค",
    "content": "เนื้อหาบทความฉบับสมบูรณ์เต็มหน้า A4 แบ่งเป็นหัวข้อ ## 1. ..., ## 2. ..., ## 3. ... ให้อ่านง่าย...",
    "actionableTakeaways": ["ข้อปฏิบัติ 1", "ข้อปฏิบัติ 2", "ข้อปฏิบัติ 3", "ข้อปฏิบัติ 4"],
    "citations": [
      {
        "title": "Title of medical paper",
        "sourceName": "Journal / Website Name",
        "url": "https://doi.org/10.1002/example",
        "publicationYear": 2024
      }
    ]
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              category: { type: Type.STRING },
              summary: { type: Type.STRING },
              content: { type: Type.STRING },
              actionableTakeaways: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              citations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    sourceName: { type: Type.STRING },
                    url: { type: Type.STRING },
                    publicationYear: { type: Type.INTEGER }
                  },
                  required: ["title", "sourceName", "url"]
                }
              }
            },
            required: ["title", "category", "summary", "content", "actionableTakeaways", "citations"]
          }
        }
      }
    });

    const generatedText = response.text;
    if (!generatedText) {
      return res.status(500).json({ error: "ไม่ได้รับข้อมูลจาก AI" });
    }

    const articlesData = JSON.parse(generatedText);
    
    // Add runtime metadata for clinic workflow
    const nowISO = new Date().toISOString();
    const formattedArticles = articlesData.map((art: any, index: number) => ({
      ...art,
      id: `gen-${Date.now()}-${index}`,
      status: 'draft_pending',
      createdAt: nowISO,
      updatedAt: nowISO,
      batchWeek: `2026-W31`,
      author: 'ระบบ AI Medical Digest (สร้างอัตโนมัติประจำสัปดาห์)',
      readTime: '6-8 นาที (เต็มหน้า A4)',
      viewsCount: 0
    }));

    res.json({
      success: true,
      count: formattedArticles.length,
      articles: formattedArticles,
      generatedAt: nowISO
    });
  } catch (err: any) {
    console.error("Error generating articles:", err);
    res.status(500).json({
      error: "เกิดข้อผิดพลาดในการสร้างบทความอัตโนมัติ",
      details: err.message || String(err)
    });
  }
});

// API: Enhance or Edit Article with Gemini
app.post("/api/enhance-article", async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `คุณคือบรรณาธิการแพทย์ของ ด็อกเตอร์ปันรีแฮบสหคลินิก 
โปรดปรับปรุงและเรียบเรียงบทความภาษาไทยนี้ให้อ่านง่ายยิ่งขึ้น กระชับ ความยาวประมาณครึ่งหน้า A4 นำไปปฏิบัติได้จริงสำหรับผู้ปกครอง:
หมวดหมู่: ${category}
ชื่อบทความเดิม: ${title}
เนื้อหาเดิม: ${content}

ตอบกลับเป็น JSON { "enhancedTitle": "...", "enhancedContent": "...", "enhancedSummary": "...", "actionableTakeaways": ["...", "..."] }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            enhancedTitle: { type: Type.STRING },
            enhancedContent: { type: Type.STRING },
            enhancedSummary: { type: Type.STRING },
            actionableTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["enhancedTitle", "enhancedContent", "enhancedSummary", "actionableTakeaways"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json({ success: true, result });
  } catch (err: any) {
    console.error("Error enhancing article:", err);
    res.status(500).json({ error: "ไม่สามารถปรับปรุงบทความได้", details: err.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Doctor PAN Rehab Clinic Server running at http://localhost:${PORT}`);
  });
}

startServer();
