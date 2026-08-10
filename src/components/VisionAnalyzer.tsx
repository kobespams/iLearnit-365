import React, { useState } from 'react';
import { generateContent } from '../services/api';
import { Image as ImageIcon, Upload, Eye, FileText, Layout, Copy, Check, RefreshCw, Sparkles } from 'lucide-react';

interface SampleImage {
  id: string;
  title: string;
  description: string;
  dataUrl: string;
}

// Inline SVG sample images generated as data URLs for instant offline demo
const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'dashboard-ui',
    title: 'UI Dashboard Mockup',
    description: 'Analytics card layout with charts and metrics',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" fill="%230f172a"/><rect x="20" y="20" width="360" height="40" rx="8" fill="%231e293b"/><circle cx="45" cy="40" r="12" fill="%236366f1"/><rect x="70" y="32" width="120" height="16" rx="4" fill="%23475569"/><rect x="20" y="80" width="170" height="140" rx="10" fill="%231e293b"/><text x="35" y="105" fill="%2394a3b8" font-family="sans-serif" font-size="12">Total Revenue</text><text x="35" y="130" fill="%23f8fafc" font-family="sans-serif" font-size="20" font-weight="bold">$48,290</text><path d="M35 190 Q 75 150, 115 170 T 175 140" fill="none" stroke="%236366f1" stroke-width="3"/><rect x="210" y="80" width="170" height="140" rx="10" fill="%231e293b"/><text x="225" y="105" fill="%2394a3b8" font-family="sans-serif" font-size="12">Active Users</text><text x="225" y="130" fill="%23f8fafc" font-family="sans-serif" font-size="20" font-weight="bold">12,450</text><rect x="225" y="160" width="140" height="10" rx="5" fill="%23334155"/><rect x="225" y="160" width="95" height="10" rx="5" fill="%2310b981"/></svg>',
  },
  {
    id: 'receipt-ocr',
    title: 'Store Receipt Document',
    description: 'Itemized invoice receipt with totals and tax',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" fill="%23f8fafc"/><rect x="50" y="10" width="300" height="230" rx="6" fill="%23ffffff" stroke="%23e2e8f0" stroke-width="2"/><text x="130" y="40" fill="%230f172a" font-family="monospace" font-size="16" font-weight="bold">TECH MART INC</text><text x="110" y="58" fill="%2364748b" font-family="monospace" font-size="10">123 Innovation Way, CA</text><line x1="70" y1="70" x2="330" y2="70" stroke="%23cbd5e1" stroke-dasharray="4"/><text x="70" y="95" fill="%23334155" font-family="monospace" font-size="12">1x USB-C Cable Hub</text><text x="280" y="95" fill="%23334155" font-family="monospace" font-size="12">$29.99</text><text x="70" y="120" fill="%23334155" font-family="monospace" font-size="12">1x Wireless Mouse</text><text x="280" y="120" fill="%23334155" font-family="monospace" font-size="12">$45.00</text><line x1="70" y1="150" x2="330" y2="150" stroke="%23cbd5e1"/><text x="70" y="175" fill="%230f172a" font-family="monospace" font-size="14" font-weight="bold">TOTAL</text><text x="280" y="175" fill="%230f172a" font-family="monospace" font-size="14" font-weight="bold">$74.99</text></svg>',
  },
];

interface VisionAnalyzerProps {
  selectedModel: string;
}

export const VisionAnalyzer: React.FC<VisionAnalyzerProps> = ({ selectedModel }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(SAMPLE_IMAGES[0].dataUrl);
  const [prompt, setPrompt] = useState('Analyze this image in detail and describe key components.');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage || loading) return;

    setLoading(true);
    setAnalysis('');

    const mimeMatch = selectedImage.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';

    const result = await generateContent({
      model: selectedModel,
      prompt,
      image: {
        base64: selectedImage,
        mimeType,
      },
    });

    setAnalysis(result.text);
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-indigo-400" /> Multimodal Vision & Image Analyzer
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Upload any screenshot, diagram, or invoice to extract text, inspect UI elements, or review design accessibility.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Selector & Task Prompts */}
        <div className="lg:col-span-6 space-y-5">
          {/* Image Upload Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-400" /> Input Image Source
            </h3>

            {/* Selected Image Preview */}
            {selectedImage ? (
              <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-2 overflow-hidden flex items-center justify-center min-h-[200px]">
                <img
                  src={selectedImage}
                  alt="Source for analysis"
                  className="max-h-56 object-contain rounded-lg"
                />
                <label className="absolute top-3 right-3 bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer transition-colors shadow">
                  Change Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-950/50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all">
                <Upload className="w-8 h-8 text-slate-500 mb-2" />
                <p className="text-xs text-slate-300 font-medium">Click or drag an image here</p>
                <p className="text-[10px] text-slate-500 mt-1">Supports PNG, JPG, WEBP, SVG</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}

            {/* Presets */}
            <div>
              <p className="text-xs text-slate-400 font-medium mb-2">Or test with a sample image:</p>
              <div className="grid grid-cols-2 gap-3">
                {SAMPLE_IMAGES.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.dataUrl)}
                    className={`text-left p-2.5 rounded-xl border text-xs transition-all flex items-center gap-3 ${
                      selectedImage === img.dataUrl
                        ? 'bg-indigo-950/60 border-indigo-500 text-indigo-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shrink-0 border border-slate-800">
                      <ImageIcon className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-200 truncate">{img.title}</p>
                      <p className="text-[10px] text-slate-500 truncate">{img.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preset Vision Prompts */}
            <div>
              <p className="text-xs text-slate-400 font-medium mb-2">Analysis Task Presets:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPrompt('Extract all readable text from this image as formatted Markdown (OCR).')}
                  className="flex items-center gap-2 p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-300 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" /> Extract Text (OCR)
                </button>
                <button
                  onClick={() => setPrompt('Analyze the layout and UI components. List accessibility and color contrast suggestions.')}
                  className="flex items-center gap-2 p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-300 transition-colors"
                >
                  <Layout className="w-3.5 h-3.5 text-indigo-400" /> UI / UX Review
                </button>
                <button
                  onClick={() => setPrompt('Convert this design mockup into responsive React & Tailwind CSS component code.')}
                  className="flex items-center gap-2 p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-300 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Convert to Tailwind
                </button>
                <button
                  onClick={() => setPrompt('Summarize key insights, totals, or data trends shown in this image.')}
                  className="flex items-center gap-2 p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-300 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-400" /> Executive Summary
                </button>
              </div>
            </div>

            {/* Prompt Text Input */}
            <div>
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask a specific question about the image..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || !selectedImage}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold py-3 rounded-xl transition-all cursor-pointer shadow-md"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Image...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Run Vision Analysis
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg h-full flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" /> Multimodal Analysis Insights
              </h3>

              {analysis && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-950/50 border border-indigo-800/50 px-2.5 py-1 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 overflow-y-auto min-h-[320px] max-h-[600px] leading-relaxed whitespace-pre-wrap scrollbar-thin">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12 space-y-3">
                  <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
                  <p className="text-xs">Processing image with {selectedModel}...</p>
                </div>
              ) : analysis ? (
                analysis
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center py-12 space-y-2">
                  <ImageIcon className="w-8 h-8 text-slate-700" />
                  <p className="text-xs">Upload an image and run analysis to view detailed visual insights.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
