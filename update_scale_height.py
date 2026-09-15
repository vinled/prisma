import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_scale_logic = """      const isMobile = window.innerWidth < 1024;
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
      }"""

new_scale_logic = """      let scale = scaleByWidth;
      let containerHeight = previewContainerRef.current.getBoundingClientRect().height;
      if (containerHeight === 0) {
        containerHeight = window.innerHeight * 0.5; // fallback
      }
      
      const targetHeight = aspectRatio === 'story' ? 1920 : 1440;
      // padding top and bottom (32px)
      const scaleByHeight = (containerHeight - 32) / targetHeight;
      scale = Math.min(scaleByWidth, scaleByHeight);"""

content = content.replace(old_scale_logic, new_scale_logic)

with open('src/App.tsx', 'w') as f:
    f.write(content)

