import { MemoryItem } from '../types';

const DB_NAME = 'LoveJourneyDB';
const STORE_NAME = 'memories';
const DB_VERSION = 1;

// Helper to open DB
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const storageService = {
  getAll: async (): Promise<MemoryItem[]> => {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        
        request.onsuccess = () => {
          const results = request.result || [];
          // Sort by date descending
          const sorted = results.sort((a: MemoryItem, b: MemoryItem) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          resolve(sorted);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error("Database Error:", error);
      return [];
    }
  },

  add: async (item: MemoryItem): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(item); // put = insert or update
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  delete: async (id: string): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
};
