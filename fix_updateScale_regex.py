import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# We want to replace the two useEffects related to updateScale with useCallback + two useEffects.

pattern = re.compile(r'  useEffect\(\(\) => \{\s*// Force a small delay.*?\s*setTimeout\(\(\) => updateScale\(\), 50\);\s*\}, \[mobileViewTab, activeTab\]\);\s*useEffect\(\(\) => \{\s*const updateScale = \(\) => \{.*?\};\s*\}, \[images\.length, aspectRatio\]\); // Re-run if images or aspectRatio change', re.DOTALL)

# Wait, let's just find the start and end of this block.
start_str = "  useEffect(() => {\n    // Force a small delay to let DOM paint when switching tabs before measuring\n    setTimeout(() => updateScale(), 50);\n  }, [mobileViewTab, activeTab]);\n\n  useEffect(() => {\n    const updateScale = () => {"
end_str = "  }, [images.length, aspectRatio]); // Re-run if images or aspectRatio change"

if start_str in content and end_str in content:
    start_idx = content.find(start_str)
    end_idx = content.find(end_str, start_idx) + len(end_str)
    
    old_block = content[start_idx:end_idx]
    
    new_block = """  const updateScale = useCallback(() => {
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
      
      if (scale <= 0 || isNaN(scale)) scale = 0.3;
      
      setPreviewScale(scale);
    }
  }, [aspectRatio]);

  useEffect(() => {
    const timeoutId = setTimeout(() => updateScale(), 50);
    return () => clearTimeout(timeoutId);
  }, [mobileViewTab, activeTab, updateScale]);

  useEffect(() => {
    updateScale();
    
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

    content = content[:start_idx] + new_block + content[end_idx:]
    
    with open('src/App.tsx', 'w') as f:
        f.write(content)
    print("Replaced!")
else:
    print("Could not find start or end string.")

