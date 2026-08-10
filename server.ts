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

      const { model = 'gemini-2.5-flash', prompt, systemInstruction, temperature = 0.7, image } = req.body;

      if (!prompt && !image) {
        return res.status(400).json({ error: 'Prompt or image is required.' });
      }

      const ai = new GoogleGenAI({ apiKey });

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
        model: model,
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
