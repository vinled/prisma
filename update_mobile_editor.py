import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace the wrapper and active panel opening tags
old_wrapper = """  const renderMobileEditor = () => {
    return (
      <div className="flex flex-col w-full bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 block lg:hidden shrink-0 mt-auto shadow-[0_-10px_20px_rgba(0,0,0,0.05)] relative z-20">
        
        {/* Active Panel */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden bg-gray-50 dark:bg-zinc-950 ${activeMobileTool ? 'border-b border-gray-200 dark:border-zinc-800 max-h-[40vh]' : 'max-h-0'}`}>
          <div className="p-5 overflow-y-auto max-h-[40vh]">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 dark:border-zinc-800">"""

new_wrapper = """  const renderMobileEditor = () => {
    return (
      <div className="flex flex-col w-full block lg:hidden shrink-0 mt-auto relative z-[60]">
        
        {/* Active Panel (Floating overlay) */}
        <div className={`absolute bottom-[100%] left-0 w-full transition-all duration-300 ease-in-out overflow-hidden shadow-[0_-15px_30px_rgba(0,0,0,0.1)] rounded-t-3xl ${
          activeMobileTool ? 'max-h-[45vh] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        } ${isDraggingSlider ? 'bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl' : 'bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t border-gray-200 dark:border-zinc-800'}`}>
          <div className="p-4 overflow-y-auto max-h-[45vh]">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200/50 dark:border-zinc-800/50">"""

content = content.replace(old_wrapper, new_wrapper)

# Add event listeners to sliders
def add_slider_events(match):
    return match.group(0) + ' onTouchStart={() => setIsDraggingSlider(true)} onTouchEnd={() => setIsDraggingSlider(false)} onMouseDown={() => setIsDraggingSlider(true)} onMouseUp={() => setIsDraggingSlider(false)} '

content = re.sub(r'<input\s+type="range"[^>]*className="w-full h-1\.5[^>]*', add_slider_events, content)

# Now find the toolbar start to add the background and border since we removed it from the outer wrapper
old_toolbar = """        {/* Mobile Toolbar */}
        <div className="flex justify-around items-center p-3 pb-4 sm:pb-6 relative z-30">"""

new_toolbar = """        {/* Mobile Toolbar */}
        <div className="flex justify-around items-center p-3 pb-4 sm:pb-6 relative z-30 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800">"""

content = content.replace(old_toolbar, new_toolbar)

with open('src/App.tsx', 'w') as f:
    f.write(content)

