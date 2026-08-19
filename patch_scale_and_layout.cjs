const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update the preview Scale logic for max-h-[35vh]
const oldUseEffect = `  useEffect(() => {
    const updateScale = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.getBoundingClientRect().width;
        // The container has p-4 (16px padding on each side), so subtract 32px for the actual content area
        const contentWidth = containerWidth - 32;
        let scale = contentWidth / 1080;
        if (scale <= 0) scale = 0.1;
        setPreviewScale(scale);
      }
    };
    
    updateScale(); // Initial call
    
    const observer = new ResizeObserver(() => {
      updateScale();
    });
    
    if (previewContainerRef.current) {
      observer.observe(previewContainerRef.current);
    }
    
    window.addEventListener('resize', updateScale);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [images.length]); // Re-run if images change, just in case layout shifts`;

const newUseEffect = `  useEffect(() => {
    const updateScale = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.getBoundingClientRect().width;
        // The container has p-4 (16px padding on each side), so subtract 32px for the actual content area
        const contentWidth = containerWidth - 32;
        let scaleByWidth = contentWidth / 1080;
        
        // Mobile vertical height constraint (max 35% of vh to leave space for form)
        const isMobile = window.innerWidth < 1024; // lg breakpoint is 1024px
        let scale = scaleByWidth;
        
        if (isMobile) {
           const maxMobileHeight = window.innerHeight * 0.35;
           const targetHeight = aspectRatio === 'story' ? 1920 : 1080;
           const scaleByHeight = maxMobileHeight / targetHeight;
           scale = Math.min(scaleByWidth, scaleByHeight);
        }
        
        if (scale <= 0) scale = 0.1;
        setPreviewScale(scale);
      }
    };
    
    updateScale(); // Initial call
    
    const observer = new ResizeObserver(() => {
      updateScale();
    });
    
    if (previewContainerRef.current) {
      observer.observe(previewContainerRef.current);
    }
    
    window.addEventListener('resize', updateScale);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [images.length, aspectRatio]); // Re-run if images or aspectRatio change`;

code = code.replace(oldUseEffect, newUseEffect);

// 2. Update the Layout of the Creation View (Sticky on Mobile)
// Current markup:
// <div className="order-1 lg:order-2 lg:sticky lg:top-6 lg:self-start w-full max-w-full space-y-6 min-w-0">
// We need it to be sticky top-0 z-50 bg-gray-50 dark:bg-zinc-950 border-b pb-4 md:static md:border-none md:pb-0 on mobile

const oldPreviewWrapper = `<div className="order-1 lg:order-2 lg:sticky lg:top-6 lg:self-start w-full max-w-full space-y-6 min-w-0">`;
// Wait, user asked for md:static. Our breakpoint for grid is lg (1024px) in App.tsx. I'll use lg:static instead of md:static, because the layout switches to grid at lg.
// So: sticky top-0 z-50 bg-gray-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 pb-4 lg:static lg:border-none lg:pb-0 lg:bg-transparent lg:z-auto
const newPreviewWrapper = `<div className="order-1 lg:order-2 sticky top-0 z-50 bg-gray-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 pb-4 lg:sticky lg:top-6 lg:border-none lg:pb-0 lg:bg-transparent lg:z-auto lg:self-start w-full max-w-full space-y-6 min-w-0">`;

code = code.replace(oldPreviewWrapper, newPreviewWrapper);

fs.writeFileSync('src/App.tsx', code);
