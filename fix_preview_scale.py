import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Fix scale update so it doesn't shrink the preview to 0 if the container is hidden when mounted,
# and also force an update when switching tabs.
# In the `updateScale` function, we want to allow it to read from window if container width is 0.

old_scale_logic = """    const updateScale = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.getBoundingClientRect().width;
        // The container has p-4 (16px padding on each side), so subtract 32px for the actual content area
        const contentWidth = containerWidth - 32;
        let scaleByWidth = contentWidth / 1080;
        
        // Mobile vertical height constraint (max 35% of vh to leave space for form)
        const isMobile = window.innerWidth < 1024; // lg breakpoint is 1024px
        let scale = scaleByWidth;
        
        if (isMobile) {
           const maxMobileHeight = window.innerHeight * 0.40;
           const targetHeight = aspectRatio === 'story' ? 1920 : 1440;
           const scaleByHeight = maxMobileHeight / targetHeight;
           scale = Math.min(scaleByWidth, scaleByHeight);
        } else {
           const maxDesktopHeight = window.innerHeight - 240;
           const targetHeight = aspectRatio === 'story' ? 1920 : 1440;
           const scaleByHeight = maxDesktopHeight / targetHeight;
           scale = Math.min(scaleByWidth, scaleByHeight);
        }
        
        if (scale <= 0) scale = 0.1;
        setPreviewScale(scale);
      }
    };"""

new_scale_logic = """    const updateScale = () => {
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
    };"""

content = content.replace(old_scale_logic, new_scale_logic)

# Re-run scale calculation when tab changes
old_effect = """  useEffect(() => {
    const updateScale = () => {"""

new_effect = """  useEffect(() => {
    // Force a small delay to let DOM paint when switching tabs before measuring
    setTimeout(() => updateScale(), 50);
  }, [mobileViewTab, activeTab]);

  useEffect(() => {
    const updateScale = () => {"""

content = content.replace(old_effect, new_effect)

with open('src/App.tsx', 'w') as f:
    f.write(content)

