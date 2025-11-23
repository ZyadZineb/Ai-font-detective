import React, { useState } from 'react';
import { Header } from './components/Header';
import { Button } from './components/Button';
import { FileUploader } from './components/FileUploader';
import { FontResult } from './components/FontResult';
import { SAMPLE_PROMPTS } from './constants';
import { identifyFont } from './services/geminiService';
import { IdentificationResult, UploadedFile } from './types';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleIdentify = async (customPrompt?: string) => {
    const promptToUse = customPrompt || prompt;
    
    if (!promptToUse.trim() && !uploadedFile) {
        setError("Please upload an image or describe a font.");
        return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const data = await identifyFont(
          promptToUse,
          uploadedFile?.base64,
          uploadedFile?.mimeType
      );
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to identify font. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <Header />

        {/* Main Input Area */}
        <div className="max-w-2xl mx-auto space-y-8 mb-12">
          
          {/* Image Upload */}
          <div className="space-y-2">
             <div className="flex items-center justify-between px-1">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reference Image (Optional)</label>
                 {uploadedFile && <span className="text-xs text-indigo-400 font-medium">Image Loaded</span>}
             </div>
             <FileUploader 
                onFileSelected={setUploadedFile} 
                currentFile={uploadedFile}
             />
          </div>

          {/* Text Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description or Question</label>
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative flex gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800">
                <input 
                    type="text" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={uploadedFile ? "Optional: Add specific questions about this image..." : "Describe the font (e.g., 'Netflix logo font')"}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 px-4 font-medium"
                    onKeyDown={(e) => e.key === 'Enter' && handleIdentify()}
                />
                <Button onClick={() => handleIdentify()} isLoading={isAnalyzing}>
                    Identify
                </Button>
                </div>
            </div>
          </div>

          {/* Sample Prompts */}
          {!uploadedFile && (
              <div className="flex flex-wrap justify-center gap-2">
                <span className="text-slate-500 text-sm py-2">Ask about:</span>
                {SAMPLE_PROMPTS.map(p => (
                <button 
                    key={p}
                    onClick={() => {
                    setPrompt(p);
                    handleIdentify(p);
                    }}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500/50 transition-all text-left max-w-[150px] truncate"
                    title={p}
                >
                    {p}
                </button>
                ))}
             </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-center animate-fade-in">
            {error}
          </div>
        )}

        {/* Results Area */}
        {result && !isAnalyzing && (
          <div className="max-w-3xl mx-auto">
              <FontResult result={result} />
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="max-w-2xl mx-auto text-center py-12 space-y-6">
            <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">🔍</div>
            </div>
            <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">Analyzing Typography</h3>
                <p className="text-slate-400">Examining glyphs, serifs, and scouring the web for sources...</p>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default App;
