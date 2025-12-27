import * as pdfjsLib from 'pdfjs-dist';

// We do NOT set the workerSrc at the top level anymore.
// This prevents the app from crashing on load if there is a version mismatch 
// between the installed pdfjs-dist and the CDN worker.

export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    // Dynamically configure the worker only when needed.
    // Ideally, the version number in the URL should match your package.json version.
    // If you encounter version errors, ensure the CDN version matches `pdfjsLib.version`.
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
       // Fallback to a generally compatible version or use the library's version if possible
       const version = pdfjsLib.version || '4.0.379';
       pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    // Iterate through all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + '\n\n';
    }

    return fullText.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    // Return a friendly error string instead of crashing
    return "Error reading PDF. Please try copying the text manually.";
  }
}