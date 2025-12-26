import React, { useRef, useEffect } from 'react';

interface SmartCanvasProps {
  htmlContent: string;
}

export const SmartCanvas: React.FC<SmartCanvasProps> = ({ htmlContent }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        // Inject Tailwind CDN into the iframe so the generated HTML looks good
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                body { margin: 0; padding: 0; overflow: hidden; }
                /* Hide scrollbars inside canvas */
                ::-webkit-scrollbar { display: none; }
              </style>
            </head>
            <body>${htmlContent}</body>
          </html>
        `);
        doc.close();
      }
    }
  }, [htmlContent]);

  return (
    <div className="w-full max-w-[400px] h-[500px] bg-white rounded-2xl shadow-lg overflow-hidden relative mx-auto border border-slate-100">
      <iframe
        ref={iframeRef}
        title="Smart Memory Canvas"
        className="w-full h-full border-none pointer-events-auto"
        sandbox="allow-scripts allow-same-origin" // Allowed for rendering interactivity
      />
      {/* Overlay for glass reflection effect (optional aesthetic) */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/10 to-transparent opacity-50 rounded-2xl"></div>
    </div>
  );
};
