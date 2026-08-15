import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Server-side Gemini API route
  app.post('/api/generate', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY environment variable is not configured. Please set it in AI Studio Secrets.'
        });
      }

      const { model = 'gemini-3.7-flash', prompt, systemInstruction, temperature = 0.7, image } = req.body;

      if (!prompt && !image) {
        return res.status(400).json({ error: 'Prompt or image is required.' });
      }

      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      let contents: any = [];
      if (image && image.base64) {
        contents.push({
          inlineData: {
            data: image.base64,
            mimeType: image.mimeType || 'image/jpeg',
          },
        });
      }

      if (prompt) {
        contents.push(prompt);
      }

      const config: any = {
        temperature: Number(temperature),
      };

      if (systemInstruction) {
        config.systemInstruction = systemInstruction;
      }

      const response = await ai.models.generateContent({
        model: model === 'gemini-2.5-flash' || model === 'gemini-1.5-flash' ? 'gemini-3.7-flash' : model,
        contents: contents,
        config: config,
      });

      res.json({ text: response.text || '' });
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      res.status(500).json({
        error: err.message || 'Failed to generate content from Gemini API',
      });
    }
  });

  // Dedicated AI CBT Quiz Generator Route
  app.post('/api/generate-cbt-quiz', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY environment variable is not configured. Please set it in AI Studio Secrets.'
        });
      }

      const { subject, level, topic, lessonOutline = '', keyConcepts = [] } = req.body;

      if (!subject || !level) {
        return res.status(400).json({ error: 'Subject and level are required.' });
      }

      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `You are a Senior Curriculum Specialist and CBT Exam Item Author for Junior Secondary Education (JSS1 - JSS3 and Secondary levels).
Generate exactly 10 high-quality, syllabus-aligned multiple choice questions for a standard Computer-Based Test (CBT) on:
- Subject: ${subject}
- Grade Level: ${level}
- Topic: ${topic || 'Comprehensive Term Review'}
- Lesson Outline Notes: ${typeof lessonOutline === 'string' ? lessonOutline : JSON.stringify(lessonOutline)}
- Key Concepts / Formulas: ${Array.isArray(keyConcepts) ? keyConcepts.join('; ') : keyConcepts}

Strict Requirements:
1. Exactly 10 questions.
2. Each question MUST have exactly 4 plausible options (A, B, C, D) without duplicates or "all of the above".
3. Provide the 0-based index (0, 1, 2, or 3) of the correct answer.
4. Include a detailed, educational explanation breaking down why the correct option is right and the misconceptions in the distractors.
5. Assign difficulty: "Easy" (3 questions), "Medium" (5 questions), "Hard" or "Mastery" (2 questions).
6. Assign taxonomy: "Recall", "Comprehension", "Application", "Analysis", or "Evaluation".
7. Include the specific syllabus reference (e.g. "${level} ${subject}: ${topic || 'Core Curriculum'}").

Return ONLY valid JSON matching this schema:
{
  "examTitle": "${level} ${subject} - ${topic || 'AI Auto-Generated CBT Quiz'}",
  "examCode": "CBT-AI-${level}-${Date.now().toString().slice(-4)}",
  "instructions": [
    "Read each question carefully before choosing an answer.",
    "Show precision on theory, principles, formulas, and definitions.",
    "Flag uncertain questions to review before final submission."
  ],
  "questions": [
    {
      "id": "q1",
      "topic": "${topic || subject}",
      "difficulty": "Easy",
      "taxonomy": "Recall",
      "marks": 1,
      "questionText": "Question string here...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Clear explanation of the answer...",
      "syllabusReference": "${level} ${subject} Scheme",
      "hint": "Brief hint to guide the candidate..."
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        }
      });

      const responseText = response.text || '{}';
      let parsedData;
      try {
        parsedData = JSON.parse(responseText);
      } catch (parseErr) {
        // In case there is any markdown fence around JSON
        const cleaned = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(cleaned);
      }

      res.json(parsedData);
    } catch (err: any) {
      console.error('Quiz Generation Error:', err);
      res.status(500).json({
        error: err.message || 'Failed to auto-generate CBT quiz with Gemini API',
      });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: 3000 },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
