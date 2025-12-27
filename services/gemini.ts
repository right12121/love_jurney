import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a world-class Frontend Designer and Creative Coder. 
Your task is to take user-provided text and images, and generate a SINGLE, self-contained HTML snippet that beautifully displays them.

CONSTRAINTS & REQUIREMENTS:
1. **Output Format**: Return ONLY valid HTML code. Do NOT include \`<html>\`, \`<head>\`, or \`<body>\` tags. Do NOT wrap in markdown code blocks (no \`\`\`html).
2. **Container**: The root element must be a \`div\` with \`class="h-full w-full overflow-hidden relative bg-white"\`. 
3. **Styling**: Use inline CSS or standard Tailwind CSS classes (assume Tailwind is available). 
4. **Dimensions**: The container is fixed size (approx 350px width, 500px height). Design for a mobile-card aesthetic.
5. **Content Handling**:
   - If images are provided, arrange them creatively (grid, masonry, carousel, polaroid style, or hero background).
   - If text is provided, typography should be elegant. Use appropriate font weights and colors.
   - If specific "Prompt" is given (e.g., "Make it retro"), adapt the style accordingly.
6. **Images**: 
   - You will receive images as input. 
   - **CRITICAL**: To display an image, you MUST use the placeholder \`__IMAGE_X__\` as the source, where X is the 0-based index of the image.
   - Example: \`<img src="__IMAGE_0__" class="..." />\` for the first image, \`url('__IMAGE_1__')\` for the second.
   - **DO NOT** attempt to output base64 data strings directly in the code. Use ONLY the placeholders.
7. **Animation**: You may add subtle CSS animations (fade-in, float).

GOAL: Create a "micro-site" that feels like a precious memory card.
`;

export async function generateSmartCanvas(
  text: string, 
  images: string[], 
  userPrompt?: string
): Promise<string> {
  try {
    const parts: any[] = [];

    // Add text prompt with explicit inventory of images
    let promptText = `Content to display: "${text}".\n`;
    if (images.length > 0) {
      promptText += `I have attached ${images.length} images. Remember to use src="__IMAGE_0__", src="__IMAGE_1__", etc. strictly.\n`;
    }
    if (userPrompt) {
      promptText += ` \nStyle/Design Request: "${userPrompt}".`;
    }
    parts.push({ text: promptText });

    // Add images
    images.forEach((base64Data) => {
      // Remove data URL prefix if present for the API, but usually client handles this.
      // The API expects raw base64 data for inlineData.
      const base64Clean = base64Data.split(',')[1] || base64Data;
      const mimeType = base64Data.substring(base64Data.indexOf(':') + 1, base64Data.indexOf(';')) || 'image/jpeg';
      
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Clean
        }
      });
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Creativity
      },
      contents: {
        role: 'user',
        parts: parts
      }
    });

    let html = response.text || '';
    
    // Cleanup if model accidentally adds markdown
    html = html.replace(/```html/g, '').replace(/```/g, '');

    // Replace placeholders with actual Base64 Data URLs
    const unhandledImages: string[] = [];
    images.forEach((imgData, index) => {
      const placeholder = `__IMAGE_${index}__`;
      if (html.includes(placeholder)) {
         html = html.split(placeholder).join(imgData);
      } else {
         unhandledImages.push(imgData);
      }
    });

    // Fallback: If AI forgot to include some images, append them at the bottom so they are not lost.
    if (unhandledImages.length > 0) {
      const fallbackGrid = unhandledImages.map(img => 
        `<div style="flex: 1; min-width: 80px; height: 80px; background-image: url('${img}'); background-size: cover; background-position: center; border-radius: 8px;"></div>`
      ).join('');
      
      // Append a fallback container at the end of the AI generated HTML
      html += `
        <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 10px; background: rgba(255,255,255,0.9); border-top: 1px solid #eee; z-index: 50;">
          <p style="font-size: 10px; color: #999; margin-bottom: 5px;">Extra Photos:</p>
          <div style="display: flex; gap: 5px; overflow-x: auto;">${fallbackGrid}</div>
        </div>
      `;
    }
    
    return html;

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Failed to generate memory canvas.");
  }
}