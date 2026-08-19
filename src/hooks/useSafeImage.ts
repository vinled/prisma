import { useState, useEffect } from 'react';

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

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          setSafeUrl(canvas.toDataURL('image/png'));
        } else {
          setSafeUrl(img.src);
        }
      } catch (e) {
        setSafeUrl(img.src);
      }
    };
    img.onerror = (e) => {
      console.error('Error loading image with CORS:', e);
      setSafeUrl(url);
    };

    const cleanUrl = url.split('?')[0];
    img.src = `${cleanUrl}?t=${Date.now()}`;
  }, [url]);

  return safeUrl;
}
