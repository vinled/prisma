import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_code = """  useEffect(() => {
    // Force a small delay to let DOM paint when switching tabs before measuring
    setTimeout(() => updateScale(), 50);
  }, [mobileViewTab, activeTab]);

  useEffect(() => {
    const updateScale = () => {
      if (previewContainerRef.current) {
        let containerWidth = previewContainerRef.current.getBoundingClientRect().width;
        
        // If container width is 0 (e.g. display: none on mobile tab switch), fallback to window width
        if (containerWidth === 0) {
           containerWidth = window.innerWidth - 32;
        }

        const contentWidth = containerWidth - 32;
        let scaleByWidth = contentWidth / 1080;
        
        const isMobile = window.innerWidth < 1024;
        let scale = scaleByWidth;
        
        if (isMobile) {
           // On mobile, allow the image to take up to 60% of viewport height since we removed the form from this tab
           const maxMobileHeight = window.innerHeight * 0.60;
           const targetHeight = aspectRatio === 'story' ? 1920 : 1440;
           const scaleByHeight = maxMobileHeight / targetHeight;
           scale = Math.min(scaleByWidth, scaleByHeight);
        } else {
           const maxDesktopHeight = window.innerHeight - 240;
           const targetHeight = aspectRatio === 'story' ? 1920 : 1440;
           const scaleByHeight = maxDesktopHeight / targetHeight;
           scale = Math.min(scaleByWidth, scaleByHeight);
        }
        
        // Prevent scale from dropping to 0 or negative
        if (scale <= 0 || isNaN(scale)) scale = 0.3;
        
        setPreviewScale(scale);
      }
    };

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
  }, [images.length, aspectRatio]); // Re-run if images or aspectRatio change"""

new_code = """  const updateScale = useCallback(() => {
    if (previewContainerRef.current) {
      let containerWidth = previewContainerRef.current.getBoundingClientRect().width;
      
      // If container width is 0 (e.g. display: none on mobile tab switch), fallback to window width
      if (containerWidth === 0) {
         containerWidth = window.innerWidth - 32;
      }

      const contentWidth = containerWidth - 32;
      let scaleByWidth = contentWidth / 1080;
      
      const isMobile = window.innerWidth < 1024;
      let scale = scaleByWidth;
      
      if (isMobile) {
         // On mobile, allow the image to take up to 60% of viewport height since we removed the form from this tab
         const maxMobileHeight = window.innerHeight * 0.60;
         const targetHeight = aspectRatio === 'story' ? 1920 : 1440;
         const scaleByHeight = maxMobileHeight / targetHeight;
         scale = Math.min(scaleByWidth, scaleByHeight);
      } else {
         const maxDesktopHeight = window.innerHeight - 240;
         const targetHeight = aspectRatio === 'story' ? 1920 : 1440;
         const scaleByHeight = maxDesktopHeight / targetHeight;
         scale = Math.min(scaleByWidth, scaleByHeight);
      }
      
      // Prevent scale from dropping to 0 or negative
      if (scale <= 0 || isNaN(scale)) scale = 0.3;
      
      setPreviewScale(scale);
    }
  }, [aspectRatio]);

  useEffect(() => {
    // Force a small delay to let DOM paint when switching tabs before measuring
    const timeoutId = setTimeout(() => updateScale(), 50);
    return () => clearTimeout(timeoutId);
  }, [mobileViewTab, activeTab, updateScale]);

  useEffect(() => {
    updateScale(); // initial scale
    
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
  }, [images.length, updateScale]); // Re-run if images change"""

content = content.replace(old_code, new_code)

with open('src/App.tsx', 'w') as f:
    f.write(content)

