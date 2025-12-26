import React, { useState, useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { Timeline } from './components/Timeline/Timeline';
import { CreatorModal } from './components/Creator/CreatorModal';
import { storageService } from './services/storage';
import { MemoryItem } from './types';

function App() {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadMemories = async () => {
    try {
      const data = await storageService.getAll();
      setMemories(data);
    } catch (e) {
      console.error("Failed to load memories", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMemories();
  }, []);

  const handleSaveMemory = async () => {
    // Reload all memories after a save
    await loadMemories();
  };

  return (
    <div className="min-h-screen pb-24">
      <Header />
      
      <main>
        {isLoading ? (
          <div className="text-center py-20 text-slate-400">Loading memories...</div>
        ) : (
          <Timeline memories={memories} />
        )}
      </main>

      {/* Floating Action Button (FAB) */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-pink-500 text-white rounded-full shadow-2xl flex items-center justify-center text-3xl hover:scale-110 transition-transform z-40"
        aria-label="Add Memory"
      >
        +
      </button>

      <CreatorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveMemory}
      />
    </div>
  );
}

export default App;
