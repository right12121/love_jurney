export interface MemoryItem {
  id: string;
  date: string; // ISO String
  dayIndex: number; // The N-th day together
  
  // Raw assets for editing or regeneration
  rawAssets: {
    text: string;
    images: string[]; // Base64 data URLs
  };
  
  // The magic part
  generatedHtml: string;
  
  createdAt: number;
}

export interface DayStats {
  daysTogether: number;
  years: number;
  months: number;
  days: number;
}
