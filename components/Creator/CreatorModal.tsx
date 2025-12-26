import React, { useState } from 'react';
import { AssetInput } from './AssetInput';
import { generateSmartCanvas } from '../../services/gemini';
import { MemoryItem } from '../../types';
import { getDayIndex } from '../../services/date';
import { storageService } from '../../services/storage';

interface CreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const CreatorModal: React.FC<CreatorModalProps> = ({ isOpen, onClose, onSave }) => {
  const [step, setStep] = useState<'auth' | 'edit' | 'generating'>('auth');
  const [password, setPassword] = useState('');
  
  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');

  if (!isOpen) return null;

  const handleAuth = () => {
    // Simple client-side gate (Not secure for real secrets, but fine for a gift app)
    // Let's say the secret is "1314"
    if (password === '1314') {
      setStep('edit');
    } else {
      alert('Wrong secret code!');
    }
  };

  const handleGenerateAndSave = async () => {
    if (!text && images.length === 0) return alert("Please add some content!");
    
    setStep('generating');
    try {
      console.log("Starting AI Generation...");
      const generatedHtml = await generateSmartCanvas(text, images, prompt);
      
      console.log("AI Generation successful. Saving to DB...");
      const newItem: MemoryItem = {
        id: Date.now().toString(),
        date: date,
        dayIndex: getDayIndex(date),
        rawAssets: { text, images },
        generatedHtml,
        createdAt: Date.now()
      };

      await storageService.add(newItem);
      console.log("Save successful.");

      onSave();
      onClose();
      // Reset
      setStep('auth'); 
      setText(''); setImages([]); setPrompt(''); setPassword('');
      
    } catch (e: any) {
      console.error("Creation failed:", e);
      let msg = "Something went wrong.";
      if (e.message?.includes('QuotaExceeded')) {
        msg = "Storage is full! But since we switched to IndexedDB, this is rare. Check your device storage.";
      } else if (e.message?.includes('Failed to generate')) {
        msg = "AI is thinking too hard and timed out. Try fewer photos.";
      } else {
        msg = `Error: ${e.message || e}`;
      }
      alert(msg);
      setStep('edit');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {step === 'auth' && (
          <div className="p-8 text-center space-y-4">
            <h3 className="text-xl font-bold text-slate-800">Creator Access</h3>
            <p className="text-slate-500 text-sm">Enter the secret anniversary number.</p>
            <input 
              type="password" 
              className="w-full text-center text-2xl tracking-widest p-2 border-b-2 border-pink-200 focus:outline-none focus:border-pink-500"
              maxLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              onClick={handleAuth}
              className="w-full bg-pink-500 text-white py-3 rounded-xl font-medium mt-4"
            >
              Unlock
            </button>
          </div>
        )}

        {step === 'edit' && (
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Add Memory</h3>
              <input 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)}
                className="text-sm bg-slate-100 px-2 py-1 rounded"
              />
            </div>

            <AssetInput text={text} setText={setText} images={images} setImages={setImages} />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">AI Designer Instruction (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g., Make it look like a vintage newspaper..."
                className="w-full p-2 text-sm border border-slate-200 rounded-lg"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
              />
            </div>

            <button 
              onClick={handleGenerateAndSave}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-medium shadow-lg shadow-pink-200 hover:shadow-xl transition-all"
            >
              ✨ Generate Magic Canvas
            </button>
          </div>
        )}

        {step === 'generating' && (
          <div className="p-12 text-center">
            <div className="inline-block w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mb-4"></div>
            <h3 className="text-lg font-bold text-slate-800">Weaving Memories...</h3>
            <p className="text-slate-500 text-sm mt-2">AI is designing your custom page.</p>
            <p className="text-slate-400 text-xs mt-4">This might take ~10 seconds.</p>
          </div>
        )}

      </div>
    </div>
  );
};
