import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import {GoogleGenAI} from '@google/genai';

function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-api-middleware',
    configureServer(server) {
      server.middlewares.use('/api/generate', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const { model = 'gemini-3.6-flash', prompt, systemInstruction, temperature = 0.7, image } = data;

            if (!prompt && !image) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Prompt or image is required' }));
              return;
            }

            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  text: `[Note: Local Mode] Configure GEMINI_API_KEY in Secrets for live Gemini model generation.\n\nOutput for prompt: "${prompt}"`,
                  fallback: true,
                })
              );
              return;
            }

            const ai = new GoogleGenAI({
              apiKey,
              httpOptions: {
                headers: {
                  'User-Agent': 'aistudio-build',
                },
              },
            });

            let contentsPayload: any;

            if (image && image.base64) {
              const cleanBase64 = image.base64.replace(/^data:image\/\w+;base64,/, '');
              contentsPayload = {
                parts: [
                  {
                    inlineData: {
                      mimeType: image.mimeType || 'image/png',
                      data: cleanBase64,
                    },
                  },
                  {
                    text: prompt || 'Analyze this image in detail.',
                  },
                ],
              };
            } else {
              contentsPayload = prompt;
            }

            const configObj: any = {
              temperature: Number(temperature),
            };

            if (systemInstruction) {
              configObj.systemInstruction = systemInstruction;
            }

            const response = await ai.models.generateContent({
              model,
              contents: contentsPayload,
              config: configObj,
            });

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ text: response.text || '' }));
          } catch (err: any) {
            console.error('Gemini API Error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
