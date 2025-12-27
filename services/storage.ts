import { MemoryItem } from '../types';
import * as firebaseApp from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDRhFmbJcLV_1RvKEiRW2dd-vJ_m3iOJHE",
  authDomain: "love-jurney.firebaseapp.com",
  projectId: "love-jurney",
  storageBucket: "love-jurney.firebasestorage.app",
  messagingSenderId: "834192849016",
  appId: "1:834192849016:web:a27bdbcb1580392259158d",
  measurementId: "G-MQYB82EYJJ"
};

// Initialize Firebase
let db: any;
let storage: any;
let isConfigured = false;

try {
  // Use namespace import to avoid "no exported member" error
  const app = firebaseApp.initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
  isConfigured = true;
} catch (e) {
  console.error("Firebase init failed:", e);
}

const COLLECTION_NAME = "memories";

// Helper: Convert Base64 to Blob for upload
const base64ToBlob = async (base64: string): Promise<Blob> => {
  const res = await fetch(base64);
  return await res.blob();
};

export const storageService = {
  getAll: async (): Promise<MemoryItem[]> => {
    if (!isConfigured) {
      console.warn("Firebase not configured properly.");
      return [];
    }

    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const items: MemoryItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data() as MemoryItem);
      });
      return items;
    } catch (error) {
      console.error("Error getting documents: ", error);
      throw error;
    }
  },

  add: async (item: MemoryItem): Promise<void> => {
    if (!isConfigured) throw new Error("Firebase not configured!");

    try {
      // 1. Upload Images to Firebase Storage
      // The item.rawAssets.images currently contains Base64 strings.
      // We want to upload them and get Cloud URLs.
      const cloudImageUrls: string[] = [];
      
      for (let i = 0; i < item.rawAssets.images.length; i++) {
        const base64 = item.rawAssets.images[i];
        const blob = await base64ToBlob(base64);
        const fileName = `${item.id}_${i}_${Date.now()}.jpg`;
        const storageRef = ref(storage, `images/${fileName}`);
        
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        cloudImageUrls.push(downloadURL);
      }

      // 2. Replace Base64 in HTML with Cloud URLs
      // The generated HTML has the Base64 strings embedded. We need to swap them out
      // to reduce the document size and allow others to load images faster.
      let optimizedHtml = item.generatedHtml;
      
      // We iterate through the original Base64 list and replace occurrences in HTML with the new Cloud URL
      item.rawAssets.images.forEach((base64, index) => {
        // Simple string replacement. 
        // Note: This relies on the fact that `generateSmartCanvas` embedded the exact base64 string.
        // If the HTML is huge, this might be slow, but for <10 images it's fine.
        // We use split/join to replace all occurrences.
        optimizedHtml = optimizedHtml.split(base64).join(cloudImageUrls[index]);
      });

      // 3. Construct the Final Object
      const cloudItem: MemoryItem = {
        ...item,
        rawAssets: {
          ...item.rawAssets,
          images: cloudImageUrls // Save Cloud URLs instead of Base64
        },
        generatedHtml: optimizedHtml
      };

      // 4. Save to Firestore
      await setDoc(doc(db, COLLECTION_NAME, item.id), cloudItem);

    } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    if (!isConfigured) return;
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting document: ", error);
      throw error;
    }
  }
};