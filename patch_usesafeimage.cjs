const fs = require('fs');

const code = `import { useState, useEffect } from 'react';

export function useSafeImage(url: string | null | undefined): string | null | undefined {
  const [safeUrl, setSafeUrl] = useState<string | null | undefined>(url);

  useEffect(() => {
    if (!url) {
      setSafeUrl(url);
      return;
    }

    if (url.startsWith('data:') || url.startsWith('blob:')) {
      setSafeUrl(url);
      return;
    }

    let isMounted = true;

    const loadImage = async (imgUrl: string) => {
      try {
        const response = await fetch(imgUrl, { mode: 'cors' });
        if (!response.ok) throw new Error('Network response was not ok');
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        
        const img = new window.Image();
        img.onload = () => {
          if (!isMounted) return;
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = "high";
              ctx.drawImage(img, 0, 0);
              // Use JPEG with 0.95 quality to prevent massive base64 strings and memory crashes
              setSafeUrl(canvas.toDataURL('image/jpeg', 0.95));
            } else {
              setSafeUrl(objectUrl);
            }
          } catch (e) {
            setSafeUrl(objectUrl);
          }
        };
        img.src = objectUrl;
      } catch (error) {
        console.error('Error fetching image natively, trying proxy...', error);
        if (isMounted) {
            try {
               const proxyUrl = \`https://api.allorigins.win/raw?url=\${encodeURIComponent(imgUrl)}\`;
               const response = await fetch(proxyUrl, { mode: 'cors' });
               const blob = await response.blob();
               const objectUrl = URL.createObjectURL(blob);
               
               const img = new window.Image();
               img.onload = () => {
                 if (!isMounted) return;
                 try {
                   const canvas = document.createElement('canvas');
                   canvas.width = img.naturalWidth;
                   canvas.height = img.naturalHeight;
                   const ctx = canvas.getContext('2d');
                   if (ctx) {
                     ctx.imageSmoothingEnabled = true;
                     ctx.imageSmoothingQuality = "high";
                     ctx.drawImage(img, 0, 0);
                     setSafeUrl(canvas.toDataURL('image/jpeg', 0.95));
                   } else {
                     setSafeUrl(objectUrl);
                   }
                 } catch(e) {
                   setSafeUrl(objectUrl);
                 }
               };
               img.src = objectUrl;
            } catch (proxyError) {
               console.error('Proxy also failed', proxyError);
               setSafeUrl(url); // final fallback
            }
        }
      }
    };

    const cleanUrl = url.split('?')[0];
    loadImage(\`\${cleanUrl}?t=\${Date.now()}\`);

    return () => {
      isMounted = false;
    };
  }, [url]);

  return safeUrl;
}
`;

fs.writeFileSync('src/hooks/useSafeImage.ts', code);
