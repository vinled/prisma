import { useState, useEffect } from 'react';

export function useSafeImage(url: string | null | undefined, preserveAlpha: boolean = false): string | null | undefined {
  const [safeUrl, setSafeUrl] = useState<string | null | undefined>(url);

  useEffect(() => {
    if (!url) {
      setSafeUrl(url);
      return;
    }

    let isMounted = true;
    const img = new window.Image();
    
    if (url.startsWith('http')) {
      img.crossOrigin = 'anonymous';
    }

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
          setSafeUrl(preserveAlpha ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.95));
        } else {
          setSafeUrl(url);
        }
      } catch (e) {
        setSafeUrl(url);
      }
    };

    img.onerror = () => {
      if (isMounted) setSafeUrl(url);
    };

    if (url.startsWith('http')) {
      const cleanUrl = url.split('?')[0];
      img.src = `${cleanUrl}?t=${Date.now()}`;
    } else {
      img.src = url;
    }

    return () => {
      isMounted = false;
    };
  }, [url, preserveAlpha]);

  return safeUrl;
}
