with open('src/App.tsx', 'r') as f:
    content = f.read()

old_block = """        if (isMobile) {
           const maxMobileHeight = window.innerHeight * 0.40;
           const targetHeight = aspectRatio === 'story' ? 1920 : 1440;
           const scaleByHeight = maxMobileHeight / targetHeight;
           scale = Math.min(scaleByWidth, scaleByHeight);
        }"""

new_block = """        if (isMobile) {
           const maxMobileHeight = window.innerHeight * 0.40;
           const targetHeight = aspectRatio === 'story' ? 1920 : 1440;
           const scaleByHeight = maxMobileHeight / targetHeight;
           scale = Math.min(scaleByWidth, scaleByHeight);
        } else {
           const maxDesktopHeight = window.innerHeight - 180;
           const targetHeight = aspectRatio === 'story' ? 1920 : 1440;
           const scaleByHeight = maxDesktopHeight / targetHeight;
           scale = Math.min(scaleByWidth, scaleByHeight);
        }"""

content = content.replace(old_block, new_block)
with open('src/App.tsx', 'w') as f:
    f.write(content)

