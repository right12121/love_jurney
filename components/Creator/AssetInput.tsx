import React, { useState } from 'react';
import { extractTextFromPdf } from '../../services/pdf';

interface AssetInputProps {
  text: string;
  setText: (s: string) => void;
  images: string[];
  setImages: (imgs: string[]) => void;
}

// Helper to resize images to avoid huge payloads
const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_SIZE = 1024; // Limit to 1024px

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        // Compress to JPEG 0.8 quality
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const AssetInput: React.FC<AssetInputProps> = ({ text, setText, images, setImages }) => {
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsProcessingImages(true);
      const files = Array.from(e.target.files);
      
      try {
        const promises = files.map(file => resizeImage(file));
        const base64Images = await Promise.all(promises);
        setImages([...images, ...base64Images]);
      } catch (err) {
        console.error("Image processing failed", err);
        alert("Some images failed to load.");
      } finally {
        setIsProcessingImages(false);
      }
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        alert('Please upload a valid PDF file.');
        return;
      }

      setIsProcessingPdf(true);
      try {
        const extractedText = await extractTextFromPdf(file);
        // Append extracted text to existing text
        const newText = text ? `${text}\n\n[PDF Content]:\n${extractedText}` : extractedText;
        setText(newText);
      } catch (error) {
        alert('Failed to read PDF. Please try again.');
      } finally {
        setIsProcessingPdf(false);
        // Reset input
        e.target.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-slate-700">Your Story</label>
          <label className={`text-xs px-2 py-1 rounded cursor-pointer transition-colors ${isProcessingPdf ? 'bg-slate-200 text-slate-500' : 'bg-pink-50 text-pink-600 hover:bg-pink-100'}`}>
            {isProcessingPdf ? 'Extracting Text...' : '📄 Import text from PDF'}
            <input 
              type="file" 
              accept="application/pdf" 
              className="hidden" 
              onChange={handlePdfUpload} 
              disabled={isProcessingPdf}
            />
          </label>
        </div>
        <textarea
          className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:outline-none min-h-[100px] resize-none"
          placeholder="What happened today? Write here or import from PDF..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-slate-700">Photos (Up to 9)</label>
          {isProcessingImages && <span className="text-xs text-pink-500 animate-pulse">Compressing images...</span>}
        </div>
        <div className="grid grid-cols-4 gap-2 mb-2">
          {images.map((img, idx) => (
            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200">
              <img src={img} alt="preview" className="w-full h-full object-cover" />
              <button
                onClick={() => setImages(images.filter((_, i) => i !== idx))}
                className="absolute top-0 right-0 bg-black/50 text-white p-1 text-xs hover:bg-red-500"
              >
                ✕
              </button>
            </div>
          ))}
          <label className={`flex flex-col items-center justify-center aspect-square border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-pink-300 hover:bg-pink-50 transition-colors ${isProcessingImages ? 'opacity-50 pointer-events-none' : ''}`}>
            <span className="text-2xl text-slate-400">+</span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isProcessingImages} />
          </label>
        </div>
      </div>
    </div>
  );
};
